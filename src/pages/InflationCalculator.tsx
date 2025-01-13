import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const InflationCalculator = () => {
  const [amount, setAmount] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);

  const { data: seasonData } = useQuery({
    queryKey: ['season-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('season_data')
        .select('*')
        .order('season', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const currentYear = 2025;
  const years = Array.from(
    { length: currentYear - 2001 + 1 }, 
    (_, i) => currentYear - i
  );

  const calculateInflatedValue = (originalAmount: number, originalYear: string) => {
    if (!seasonData) return null;

    const originalYearData = seasonData.find(d => d.season === originalYear);
    const currentYearData = seasonData.find(d => d.season === '2025');

    if (!originalYearData || !currentYearData) return null;

    const inflationFactor = currentYearData.cpi / originalYearData.cpi;
    return originalAmount * inflationFactor;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const inflatedValue = calculateInflatedValue(parseFloat(amount), year);
    setResult(inflatedValue);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-4">
          Football Inflation Calculator
        </h1>
        
        <div className="mb-8 prose">
          <p>
            This calculator helps you understand how historical football transfer fees compare to today's market.
            By accounting for football market inflation, it converts past transfer amounts into their equivalent
            value in today's (2025) market. This gives you a better perspective on how significant certain
            transfers were relative to their time period.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Transfer Amount (€)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Transfer Year</Label>
              <Select value={year} onValueChange={setYear} required>
                <SelectTrigger id="year">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {years.map((y) => (
                    <SelectItem key={y} value={y.toString()} className="hover:bg-gray-100">
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Calculate
            </Button>
          </form>

          {result !== null && (
            <div className="mt-6 p-4 bg-accent rounded-md">
              <p className="text-sm text-gray-600">Inflation Adjusted Value:</p>
              <p className="text-xl font-bold">
                {new Intl.NumberFormat('de-DE', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(result)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InflationCalculator;