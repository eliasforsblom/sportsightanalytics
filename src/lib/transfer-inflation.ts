export const DATA = {
  base_season: "00/01",
  latest_season: "25/26",
  probs: [0.25, 0.5, 0.75, 0.9, 0.95],
  index: {
    "00/01": 100, "01/02": 111.26, "02/03": 95.14, "03/04": 77.72,
    "04/05": 71.57, "05/06": 69.83, "06/07": 79.44, "07/08": 99.31,
    "08/09": 101.56, "09/10": 97.77, "10/11": 83.27, "11/12": 80.44,
    "12/13": 84.73, "13/14": 98.16, "14/15": 109.09, "15/16": 135.99,
    "16/17": 149.36, "17/18": 180.64, "18/19": 197.29, "19/20": 224.8,
    "20/21": 180.05, "21/22": 172.63, "22/23": 214.22, "23/24": 223.49,
    "24/25": 233.3, "25/26": 285.62,
  } as Record<string, number>,
  n_transfers: {
    "00/01": 409, "01/02": 402, "02/03": 244, "03/04": 264, "04/05": 344,
    "05/06": 397, "06/07": 492, "07/08": 650, "08/09": 572, "09/10": 471,
    "10/11": 464, "11/12": 568, "12/13": 530, "13/14": 525, "14/15": 507,
    "15/16": 588, "16/17": 581, "17/18": 614, "18/19": 600, "19/20": 614,
    "20/21": 421, "21/22": 454, "22/23": 595, "23/24": 618, "24/25": 605,
    "25/26": 543,
  } as Record<string, number>,
  quantiles_meur: {
    "00/01": [0.765, 2.7, 6.4, 13.3, 18],
    "01/02": [0.9, 3, 7, 13, 17.572],
    "02/03": [0.919, 2.5, 5.5, 10.85, 14.925],
    "03/04": [0.7, 2, 4.5, 9.675, 17.125],
    "04/05": [0.65, 1.5, 4.1, 9.175, 12.85],
    "05/06": [0.6, 1.6, 3.8, 8, 10.5],
    "06/07": [0.75, 2, 4, 7.725, 12],
    "07/08": [0.985, 2.425, 5, 9, 13],
    "08/09": [0.95, 2.5, 5, 10, 14.405],
    "09/10": [0.9, 2.5, 4.75, 10.5, 18.35],
    "10/11": [0.8, 2, 4.312, 8.5, 15.5],
    "11/12": [0.75, 1.95, 4.5, 9, 13.325],
    "12/13": [0.8, 2, 4, 10, 14],
    "13/14": [0.8, 2.2, 5, 12.3, 20],
    "14/15": [1, 2.25, 5.7, 13.24, 20],
    "15/16": [1.2, 3.05, 7.775, 14.37, 20.65],
    "16/17": [1.2, 3.4, 8.8, 18.2, 29.75],
    "17/18": [1.525, 4, 11, 21, 34],
    "18/19": [1.788, 4.4, 10.5, 21.21, 30.525],
    "19/20": [2, 5.15, 14, 25, 35],
    "20/21": [1.5, 4, 12, 23.1, 32.5],
    "21/22": [1.5, 3.985, 11, 20.5, 30],
    "22/23": [2, 5, 12, 24.66, 38.981],
    "23/24": [2, 5, 13, 26.93, 40.3],
    "24/25": [2, 5.4, 14.2, 28.3, 37],
    "25/26": [2.5, 7, 17, 31, 44.162],
  } as Record<string, number[]>,
};

export const SEASONS_NEWEST_FIRST = Object.keys(DATA.index).sort().reverse();

function linearInterp(x: number, xs: number[], ys: number[]): number {
  if (x <= xs[0]) return ys[0];
  const n = xs.length;
  if (x >= xs[n - 1]) return ys[n - 1];
  for (let i = 0; i < n - 1; i++) {
    if (x <= xs[i + 1]) {
      const t = (x - xs[i]) / (xs[i + 1] - xs[i]);
      return ys[i] + t * (ys[i + 1] - ys[i]);
    }
  }
  return ys[n - 1];
}

export type ConversionBand = "inside" | "above" | "below";

export interface Conversion {
  amount: number;
  season: string;
  result: number;
  band: ConversionBand;
  percentile: number | null;
  confidence: "normal" | "low";
  contextLines: string[];
}

export function convertFee(amount: number, season: string): Conversion | null {
  if (!Number.isFinite(amount) || amount <= 0) return null;
  const T = DATA.latest_season;
  const qS = DATA.quantiles_meur[season];
  const qT = DATA.quantiles_meur[T];
  if (!qS || !qT) return null;
  const P = DATA.probs;

  let result: number;
  let band: ConversionBand;
  let percentile: number | null = null;

  if (amount > qS[4]) {
    band = "above";
    result = amount * (qT[4] / qS[4]);
  } else if (amount < qS[0]) {
    band = "below";
    result = amount * (qT[0] / qS[0]);
  } else {
    band = "inside";
    const p = linearInterp(Math.log(amount), qS.map(Math.log), P);
    result = Math.exp(linearInterp(p, P, qT.map(Math.log)));
    percentile = p;
  }

  const confidence = band === "inside" ? "normal" : "low";
  const contextLines: string[] = [];

  // Market conditions over S-2 .. S+2
  const seasons = Object.keys(DATA.index).sort();
  const idx = seasons.indexOf(season);
  const window = seasons.slice(Math.max(0, idx - 2), Math.min(seasons.length, idx + 3));
  if (window.length >= 4) {
    const geo = Math.exp(
      window.reduce((s, k) => s + Math.log(DATA.index[k]), 0) / window.length
    );
    const ratio = DATA.index[season] / geo;
    if (ratio > 1.15) {
      contextLines.push(
        `${season} was near a market peak, so this figure is on the conservative side.`
      );
    } else if (ratio < 0.85) {
      contextLines.push(
        `${season} was a depressed market, so this figure is on the high side.`
      );
    }
  }

  if (confidence === "low") {
    contextLines.push(
      "This fee sits outside the well-measured middle of that season's market. Treat it as a rough figure — conversions this far up the range carry roughly ±30%."
    );
  }

  const n = DATA.n_transfers[season];
  if (n < 300) {
    contextLines.push(
      `Based on ${n} recorded fees, so less certain than other seasons.`
    );
  }

  return { amount, season, result, band, percentile, confidence, contextLines };
}

export function percentileLabel(c: Conversion): string {
  if (c.band === "above") return "Top 5% of that season's market";
  if (c.band === "below") return "Bottom 25% of that season's market";
  const pct = Math.round((c.percentile ?? 0) * 100);
  if (pct <= 0) return "Equivalent to the <1% percentile of that season's market";
  if (pct >= 100) return "Equivalent to the >99% percentile of that season's market";
  return `Equivalent to the ${ordinal(pct)} percentile of that season's market`;
}

export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
