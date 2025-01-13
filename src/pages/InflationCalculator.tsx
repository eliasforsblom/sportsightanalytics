import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const InflationCalculator = () => {
  const [amount, setAmount] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1955 + 1 }, (_, i) => currentYear - i);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder calculation - will be updated with actual inflation model
    setResult(parseFloat(amount));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">
          Allsvenskan Inflation Calculator
        </h1>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Transfer Amount (SEK)</Label>
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
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y.toString()}>
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
                {new Intl.NumberFormat('sv-SE', {
                  style: 'currency',
                  currency: 'SEK',
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