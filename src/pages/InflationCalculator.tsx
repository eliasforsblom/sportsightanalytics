import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Seo } from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const BASE_YEAR = "2025";

const useSeasonData = () =>
  useQuery({
    queryKey: ["season-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("season_data")
        .select("*")
        .order("season", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

const InflationCalculator = () => {
  const [amount, setAmount] = useState("");
  const [year, setYear] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: seasonData, error: seasonDataError } = useSeasonData();

  useEffect(() => {
    if (!seasonDataError) return;
    console.error("Season data error:", seasonDataError);
    toast({
      title: "Error loading data",
      description: "There was a problem loading the calculator data. Please try again later.",
      variant: "destructive",
    });
  }, [seasonDataError, toast]);

  const years = useMemo(() => {
    const currentYear = Number(BASE_YEAR);
    return Array.from({ length: currentYear - 2001 + 1 }, (_, i) => currentYear - i);
  }, []);

  const calculateInflatedValue = (originalAmount: number, originalYear: string) => {
    if (!Array.isArray(seasonData)) return null;

    const originalYearData = seasonData.find((d) => d.season === originalYear);
    const currentYearData = seasonData.find((d) => d.season === BASE_YEAR);

    if (!originalYearData?.cpi || !currentYearData?.cpi) return null;

    return originalAmount * (currentYearData.cpi / originalYearData.cpi);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!amount || !year) {
      toast({
        title: "Missing information",
        description: "Please enter both an amount and select a year.",
        variant: "destructive",
      });
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (Number.isNaN(parsedAmount)) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid number for the amount.",
        variant: "destructive",
      });
      return;
    }

    const inflatedValue = calculateInflatedValue(parsedAmount, year);
    if (inflatedValue === null) {
      toast({
        title: "Calculation error",
        description: "Unable to calculate the inflation adjusted value. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setResult(inflatedValue);
  };

  const multiplier =
    result !== null && parseFloat(amount) > 0 ? result / parseFloat(amount) : null;

  return (
    <>
      <Seo
        title="Football Inflation Calculator — SportSight Analytics"
        description="Convert historic football transfer fees into today's market value using football-specific market inflation."
        canonicalPath="/inflation-calculator"
      />

      <div className="container py-14 md:py-20">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow mb-4">Tool</p>
          <h1 className="text-4xl font-bold leading-[1.08] md:text-5xl">
            Football Inflation Calculator
          </h1>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            Historic transfer fees don't compare cleanly across eras. This calculator applies
            football market inflation to convert a past fee into its equivalent value in today's
            ({BASE_YEAR}) market.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
          <div className="surface-card p-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="amount">Transfer amount (€)</Label>
                <Input
                  id="amount"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  placeholder="e.g. 35000000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Transfer year</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger id="year" className="h-12 text-base">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {years.map((y) => (
                      <SelectItem key={y} value={y.toString()}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" size="lg" className="w-full rounded-full">
                Calculate
              </Button>
            </form>
          </div>

          <div className="surface-card flex flex-col justify-center p-8">
            {result !== null ? (
              <div className="animate-fade-up">
                <p className="eyebrow mb-4">Value in {BASE_YEAR}</p>
                <p className="text-4xl font-bold text-gradient md:text-6xl">
                  {new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "EUR",
                    maximumFractionDigits: 0,
                  }).format(result)}
                </p>
                {multiplier && (
                  <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
                    <TrendingUp className="h-4 w-4" />
                    {multiplier.toFixed(2)}× the original {year} fee
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <TrendingUp className="mx-auto mb-4 h-8 w-8 text-primary/60" />
                <p className="text-sm">
                  Enter a fee and a year to see what that transfer would cost in today's market.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default InflationCalculator;
