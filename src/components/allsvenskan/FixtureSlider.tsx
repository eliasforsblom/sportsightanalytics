
import * as React from "react";
import { Slider } from "@/components/ui/slider";

interface FixtureSliderProps {
  value: number;
  onChange: (value: number) => void;
  max: number;
}

export function FixtureSlider({ value, onChange, max }: FixtureSliderProps) {
  const handleValueChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Matchweek 1</span>
        <span className="text-sm font-medium">Matchweek {max}</span>
      </div>
      
      <Slider
        defaultValue={[value]}
        max={max}
        min={1}
        step={1}
        onValueChange={handleValueChange}
      />
      
      <div className="text-center">
        <span className="text-sm font-medium">Current: Matchweek {value}</span>
      </div>
    </div>
  );
}
