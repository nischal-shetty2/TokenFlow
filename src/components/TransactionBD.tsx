import { MdKeyboardArrowRight } from "react-icons/md";
import { RoutePlan } from "./RouteDetails";

interface TransactionDetailsProps {
  routePlan: RoutePlan[];
  tokenImages: Record<string, string>;
  tokenDecimals: Record<string, number>;
}
export const TransactionBreakdown = ({
  routePlan,
  tokenImages,
  tokenDecimals,
}: TransactionDetailsProps) => {
  return (
    <div className=" w-full md:flex flex-wrap justify-center gap-6 p-2 lg:p-10 pt-0">
      {routePlan.map((route, index) => {
        const { swapInfo } = route;
        const { label, inputMint, outputMint, inAmount, outAmount, feeAmount } =
          swapInfo;

        const inputImage = tokenImages[inputMint] || "";
        const outputImage = tokenImages[outputMint] || "";
        const inputDecimals = tokenDecimals[inputMint] || 0;
        const outputDecimals = tokenDecimals[outputMint] || 0;

        return (
          <div
            key={index}
            className="border p-4 rounded-lg shadow-sm mt-5 w-full md:w-[30vh] lg:w-[60vh]">
            <div className="flex justify-center items-center">
              <div className="flex items-center space-x-4">
                {inputImage && outputImage && (
                  <>
                    <img
                      src={inputImage}
                      alt="Input Token"
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                    />
                    <MdKeyboardArrowRight />
                    <img
                      src={outputImage}
                      alt="Output Token"
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                    />
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <div className="font-semibold">{label}</div>
            </div>

            <div className="mt-4 text-lg text-center">
              <p>
                <strong>Platform:</strong> {label}
              </p>
              <p className="break-all">
                <strong>Input Amount:</strong>{" "}
                {(Number(inAmount) / 10 ** Number(inputDecimals)).toFixed(6)}{" "}
                SOL
              </p>
              <p className="break-all">
                <strong>Output Amount:</strong>{" "}
                {(Number(outAmount) / 10 ** Number(outputDecimals)).toFixed(6)}{" "}
                SOL
              </p>
              <p>
                <strong>Fees:</strong> {Number(feeAmount)} lamports
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
