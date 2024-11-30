import React, { useEffect, useState } from 'react';

const RulerRange = ({ settings }: { settings: any }) => {
  const [value, setValue] = useState(2);
  const [highlightedMarks, setHighlightedMarks] = useState<Set<number>>(new Set());

  // Gerar marcações da régua
  const marks = Array.from({ length: 51 }, (_, i) => i * 2);

  useEffect(() => {
    const activeMarks = new Set<number>();
    marks.forEach((mark) => {
      const thumbPosition = (value / 100) * 100; // Posição do ponteiro como porcentagem
      const markPosition = mark;
      if (markPosition <= thumbPosition + 2 && markPosition >= thumbPosition - 2) {
        activeMarks.add(mark);
      }
    });
    setHighlightedMarks(activeMarks);
  }, [value]);

  return (
    <div className="mb-4 absolute -top-14">
      {/* Números */}
      <div className="flex justify-between text-sm text-[#3b3b3b] -mb-4">
        <span className={`-ml-[.15rem] text-transparent`}>1</span>
        <span className={`ml-[2.8rem] text-transparent`}>20</span>
        <span className={`ml-[2.8rem] text-transparent`}>40</span>
        <span className={`ml-[2.8rem] text-transparent`}>60</span>
        <span className={`ml-[2.8rem] text-transparent`}>80</span>
        <span className={`ml-[2.8rem] text-transparent`}>100</span>
      </div>

      {/* Marcações da régua */}
      <div className="relative h-8 flex">
        {marks.map((mark) => (
          <div
            key={mark}
            className={`absolute bottom-0 w-[2px] rounded-full
              ${highlightedMarks.has(mark) ? 'h-[4px]' : 'h-[2px]'} 
              transition-all duration-50 ease-in-out
              ${mark % 20 === 0 ? 'bg-white' : mark % 10 === 0 ? 'bg-[#3b3b3b]' : 'bg-[#3b3b3b]'} text-transparent`}
            style={{ left: `${mark}%` }}
          />
        ))}
      </div>

      {/* Input Range */}
      <div className="relative">
        <input
          type="range"
          min="1"
          max="100"
          defaultValue={settings.current.stroke}
          onChange={(e) => { setValue(parseInt(e.target.value)), (settings.current.stroke = parseInt(e.target.value, 10)) }}
          className="w-full h-[1px] bg-transparent rounded-lg appearance-none cursor-pointer -top-[18px] relative
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-2
            [&::-webkit-slider-thumb]:h-2
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[#3f3f3fb3]
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-[#3f3f3fb3]
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:shadow-md
            [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>
    </div>
  );
};

export default RulerRange;