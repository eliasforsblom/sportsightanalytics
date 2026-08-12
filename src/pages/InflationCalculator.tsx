import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Seo } from "@/components/Seo";
import {
  DATA,
  SEASONS_NEWEST_FIRST,
  convertFee,
  percentileLabel,
} from "@/lib/transfer-inflation";

const InflationCalculator = () => {
  const [amount, setAmount] = useState("");
  const [season, setSeason] = useState("10/11");
  const [methodOpen, setMethodOpen] = useState(false);

  const conversion = useMemo(
    () => convertFee(parseFloat(amount), season),
    [amount, season]
  );

  return (
    <>
      <Seo
        title="Football Inflation Calculator — SportSight Analytics"
        description="Convert historic football transfer fees into today's market value using percentile-based market position rather than a single inflation rate."
        canonicalPath="/inflation-calculator"
      />

      <div className="container py-14 md:py-20">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow mb-4">Tool</p>
          <h1 className="text-4xl leading-[1.08] md:text-5xl">
            Football Inflation Calculator
          </h1>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            Historic transfer fees don't compare cleanly across eras. This calculator finds
            where a fee sat in its own season's market and matches it to the equivalent
            position in {DATA.latest_season}.
          </p>
        </div>

        <div className="max-w-2xl">
          <div className="surface-card p-7 md:p-9">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amount">Transfer fee</Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    inputMode="decimal"
                    step="any"
                    min="0"
                    placeholder="e.g. 8.7"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-12 pr-14 text-base"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    €M
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="season">Season</Label>
                <Select value={season} onValueChange={setSeason}>
                  <SelectTrigger id="season" className="h-12 text-base">
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {SEASONS_NEWEST_FIRST.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {conversion && (
              <div className="mt-8 animate-fade-up border-t border-border pt-8">
                <p className="text-4xl font-bold text-gradient md:text-5xl">
                  €{conversion.result.toFixed(1)} M
                  <span className="text-2xl md:text-3xl"> in {DATA.latest_season} money</span>
                </p>
                <p className="mt-4 text-sm text-foreground/80">
                  {percentileLabel(conversion)}
                </p>
                {conversion.contextLines.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {conversion.contextLines.map((line) => (
                      <p key={line} className="text-sm leading-relaxed text-muted-foreground">
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <Collapsible open={methodOpen} onOpenChange={setMethodOpen} className="mt-6">
            <CollapsibleTrigger className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <ChevronDown
                className={`h-4 w-4 transition-transform ${methodOpen ? "rotate-180" : ""}`}
              />
              Methodology
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Fees are compared by market position rather than by a single inflation rate. A
                transfer is located within the distribution of all fees paid in its own season
                across the top divisions of England, Spain, Germany, Italy, France and the
                Netherlands, then matched to the equivalent position in 2025/26. Loans, free
                transfers and undisclosed fees are excluded.
              </p>
              <p>
                This matters because the transfer market has not inflated evenly. Between
                2000/01 and 2025/26 the middle of the market rose about 2.6 times while the
                lower end rose about 3.3 times, so no single multiplier is accurate across the
                whole range.
              </p>
              <p>
                Conversions near the middle of the market are the most reliable, carrying
                roughly ±15%. Very large fees are converted using how the top of the market
                moved and carry roughly ±30%, because only a few dozen transfers of that size
                happen in any season. Figures are best read as indicative rather than precise.
              </p>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </>
  );
};

export default InflationCalculator;
