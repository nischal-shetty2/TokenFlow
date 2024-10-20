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
    <div className="w-full flex-wrap justify-center gap-6 p-2 pt-0 md:flex md:p-6">
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
            className="mt-5 w-full rounded-lg border p-4 shadow-sm md:w-[50vh] lg:w-[60vh]"
          >
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-4">
                {inputImage && outputImage && (
                  <>
                    <img
                      src={inputImage}
                      alt="Input Token"
                      className="h-8 w-8 rounded-full md:h-10 md:w-10"
                    />
                    <MdKeyboardArrowRight />
                    <img
                      src={outputImage}
                      alt="Output Token"
                      className="h-8 w-8 rounded-full md:h-10 md:w-10"
                    />
                  </>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <div className="font-semibold">{label}</div>
            </div>

            <div className="mt-4 text-center text-sm lg:text-lg">
              <p>
                <strong>Platform:</strong> {label}
              </p>
              <p className="break-all">
                <strong>Input Amount:</strong>{" "}
                {(Number(inAmount) / 10 ** Number(inputDecimals)).toFixed(6)}{" "}
                {routePlan[0].swapInfo.label}
              </p>
              <p className="break-all">
                <strong>Output Amount:</strong>{" "}
                {(Number(outAmount) / 10 ** Number(outputDecimals)).toFixed(6)}{" "}
                {routePlan[routePlan.length - 1].swapInfo.label}
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
