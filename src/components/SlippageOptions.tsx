import { useToast } from "@/hooks/use-toast";
import { useState, ChangeEvent, useEffect } from "react";

interface SlippageOptionsProps {
  setSlippage: (value: number) => void;
  slippage?: number; // Optionally pass current slippage value
}

const SlippageOptions: React.FC<SlippageOptionsProps> = ({
  setSlippage,
  slippage,
}) => {
  const { toast } = useToast();

  const [selected, setSelected] = useState<number | "custom">(slippage || 0.5);
  const [inputSelected, setInputSelected] = useState<boolean>(false);
  const [customSlippage, setCustomSlippage] = useState<string>("");
  const [invalidInput, setInvalidInput] = useState<boolean>(false);
  const [debouncedSlippage, setDebouncedSlippage] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (Number.isNaN(slippage)) {
      setSlippage(0.5);
      setSelected(0.5);
      setInputSelected(false);
      setCustomSlippage("");
    }
  }, [slippage]);

  useEffect(() => {
    if (slippage === 0.5 && inputSelected) {
      setSelected(slippage);
      setInputSelected(false);
      setInvalidInput(false);
      setCustomSlippage("");
    }
  }, [slippage]);

  // Debounce Effect
  useEffect(() => {
    if (debouncedSlippage !== null) {
      setSlippage(debouncedSlippage);
    }
  }, [debouncedSlippage, setSlippage]);

  const handlePresetSelect = (value: number) => {
    setInvalidInput(false);
    setSelected(value);
    setSlippage(value);
    if (invalidInput) setCustomSlippage("");
    setInputSelected(false);
  };

  const handleCustomInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputSelected(true);
    const value = e.target.value;
    if (value.includes(".") && value.split(".")[1].length > 2) return;
    else if (!value.includes(".") && value.length > 3) return;
    setCustomSlippage(value);

    const numValue = parseFloat(value);

    if (numValue === 0) {
      setInvalidInput(true);
      setCustomSlippage(value);
      setDebouncedSlippage(0);
    } else if (numValue < 0.1 && numValue !== 0) {
      setInvalidInput(true);
      toast({
        title: "Enter a greater value",
        variant: "destructive",
      });
      setDebouncedSlippage(0.1);
      setCustomSlippage("0.1");
    } else {
      setInvalidInput(false);
      debounceSlippageUpdate(numValue);
      setSelected("custom");
    }
  };

  const debounceSlippageUpdate = (value: number) => {
    clearTimeout((window as any).debounceTimeout);
    (window as any).debounceTimeout = setTimeout(() => {
      setDebouncedSlippage(value);
    }, 900); // Adjust the delay as needed (300ms in this case)
  };

  return (
    <div className="rounded-3xl bg-black p-1">
      <div className="flex justify-between space-x-0.5">
        <button
          className={`rounded-2xl rounded-r-none p-1 font-medium text-white transition lg:p-2 ${
            selected === 0.3 && !inputSelected ? "bg-blue-600" : "bg-zinc-900"
          } hover:bg-blue-500`}
          onClick={() => handlePresetSelect(0.3)}
        >
          {0.3}%
        </button>
        <button
          key={0.5}
          className={`p-2 font-medium text-white transition ${
            selected === 0.5 && !inputSelected ? "bg-blue-600" : "bg-zinc-900"
          } hover:bg-blue-500`}
          onClick={() => handlePresetSelect(0.5)}
        >
          {0.5}%
        </button>
        <button
          className={`p-2 px-4 font-medium text-white transition ${
            selected === 1 && !inputSelected ? "bg-blue-600" : "bg-zinc-900"
          } hover:bg-blue-500`}
          onClick={() => handlePresetSelect(1)}
        >
          {1}%
        </button>

        {/* Custom Input */}
        <div
          className={`flex items-center rounded-3xl rounded-l-none text-black ${
            inputSelected
              ? invalidInput
                ? "bg-red-500"
                : "bg-blue-600"
              : invalidInput
                ? "bg-red-500"
                : "bg-zinc-900"
          } text-white`}
        >
          <input
            type="number"
            value={customSlippage}
            onChange={handleCustomInputChange}
            placeholder="custom"
            className="font-semibol w-12 bg-transparent px-1 py-1 outline-none"
          />
          <span className="px-2">%</span>
        </div>
      </div>
    </div>
  );
};

export default SlippageOptions;
