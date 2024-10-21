import { useState, useEffect } from "react";
import axios from "axios";
import { MdImageSearch, MdKeyboardArrowRight } from "react-icons/md";
import { TransactionBreakdown } from "./TransactionBD";
import { useToast } from "@/hooks/use-toast";

interface SwapInfo {
  ammKey: string;
  label: string;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  feeAmount: string;
  feeMint: string;
}

export interface RoutePlan {
  swapInfo: SwapInfo;
  percent: number;
}

interface RouteDetailsProps {
  routePlan: RoutePlan[];
}

const RouteDetails: React.FC<RouteDetailsProps> = ({ routePlan }) => {
  const { toast } = useToast();

  const [tokenImages, setTokenImages] = useState<Record<string, string>>({});
  const [tokenDecimals, setTokenDecimals] = useState<Record<string, number>>(
    {},
  );

  useEffect(() => {
    const fetchImagesAndDecimals = async () => {
      const newTokenImages: Record<string, string> = {};
      const newTokenDecimals: Record<string, number> = {};

      for (const route of routePlan) {
        const { inputMint, outputMint } = route.swapInfo;

        if (!tokenImages[inputMint] || !tokenDecimals[inputMint]) {
          const inputData = await fetchTokenData(inputMint);
          newTokenImages[inputMint] = inputData.image;
          newTokenDecimals[inputMint] = inputData.decimals;
        }

        if (!tokenImages[outputMint] || !tokenDecimals[outputMint]) {
          const outputData = await fetchTokenData(outputMint);
          newTokenImages[outputMint] = outputData.image;
          newTokenDecimals[outputMint] = outputData.decimals;
        }
      }

      setTokenImages((prev) => ({ ...prev, ...newTokenImages }));
      setTokenDecimals((prev) => ({ ...prev, ...newTokenDecimals }));
    };

    fetchImagesAndDecimals();
  }, [routePlan]);

  // Helper to fetch token images and decimals
  const fetchTokenData = async (mint: string) => {
    try {
      const response = await axios.get(
        `https://api.solana.fm/v1/tokens/${mint}`,
      );
      return {
        image: response.data.tokenList.image,
        decimals: response.data.decimals,
      };
    } catch (error) {
      toast({
        title: "Error fetching token data",
        description: error instanceof Error ? error.message : "",
        variant: "destructive",
      });
      return { image: "", decimals: 0 };
    }
  };

  const renderTokenPathMap = () => {
    // Get first input token and final output token
    const firstInputMint = routePlan[0].swapInfo.inputMint;
    const firstInputSymbol = routePlan[0].swapInfo.label;
    const lastOutputMint = routePlan[routePlan.length - 1].swapInfo.outputMint;
    const lastOutputSymbol = routePlan[routePlan.length - 1].swapInfo.label;

    // Create array of intermediate tokens with their symbols
    const intermediateTokensWithSymbols: Array<{
      mint: string;
      symbol: string;
    }> = [];

    routePlan.forEach((route) => {
      if (route.swapInfo.inputMint !== firstInputMint) {
        const existingToken = intermediateTokensWithSymbols.find(
          (token) => token.mint === route.swapInfo.inputMint,
        );
        if (!existingToken) {
          intermediateTokensWithSymbols.push({
            mint: route.swapInfo.inputMint,
            symbol: route.swapInfo.label,
          });
        }
      }
      if (route.swapInfo.outputMint !== lastOutputMint) {
        const existingToken = intermediateTokensWithSymbols.find(
          (token) => token.mint === route.swapInfo.outputMint,
        );
        if (!existingToken) {
          intermediateTokensWithSymbols.push({
            mint: route.swapInfo.outputMint,
            symbol: route.swapInfo.label,
          });
        }
      }
    });

    return (
      <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-4">
        {tokenImages[firstInputMint] ? (
          <div className="flex min-w-[60px] flex-col items-center lg:min-w-[80px]">
            <img
              src={tokenImages[firstInputMint]}
              alt="Start Token"
              className="h-8 w-8 rounded-full bg-white p-0.5 lg:h-12 lg:w-12"
            />
            <span className="mt-1 w-full break-words text-center text-xs lg:text-sm">
              {firstInputSymbol}
            </span>
          </div>
        ) : (
          <div className="animate-pulse px-5 py-3">
            <MdImageSearch size={40} />
            <div className="mt-1 h-1 w-12 rounded-full bg-gray-300"></div>
          </div>
        )}

        <MdKeyboardArrowRight className="flex-shrink-0 text-xl lg:text-2xl" />

        {/* Intermediate Tokens */}
        {intermediateTokensWithSymbols.map((token, index) => (
          <div key={token.mint} className="flex items-center gap-2 lg:gap-4">
            {tokenImages[token.mint] ? (
              <div className="flex min-w-[60px] flex-col items-center lg:min-w-[80px]">
                <img
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = "no-img.png";
                  }}
                  src={tokenImages[token.mint]}
                  alt={`Token ${index + 1}`}
                  className="h-8 w-8 rounded-full bg-white p-0.5 lg:h-12 lg:w-12"
                />
                <span className="mt-1 w-full break-words text-center text-xs lg:text-sm">
                  {token.symbol}
                </span>
              </div>
            ) : (
              <div className="animate-pulse px-5 py-3">
                <MdImageSearch size={40} />
                <div className="mt-1 h-1 w-12 rounded-full bg-gray-300"></div>
              </div>
            )}
            <MdKeyboardArrowRight className="flex-shrink-0 text-xl lg:text-2xl" />
          </div>
        ))}

        {/* Output Token */}
        {tokenImages[lastOutputMint] ? (
          <div className="flex min-w-[60px] flex-col items-center lg:min-w-[80px]">
            <img
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = "no-img.png";
              }}
              src={tokenImages[lastOutputMint]}
              alt="End Token"
              className="h-8 w-8 rounded-full bg-white p-0.5 lg:h-12 lg:w-12"
            />
            <span className="mt-1 w-full break-words text-center text-xs lg:text-sm">
              {lastOutputSymbol}
            </span>
          </div>
        ) : (
          <div className="animate-pulse px-5 py-3">
            <MdImageSearch size={40} />
            <div className="mt-1 h-1 w-12 rounded-full bg-gray-300"></div>
          </div>
        )}
      </div>
    );
  };
  // Render each swap in a line together
  const renderGroupedSwapPath = (routes: RoutePlan[]) => {
    return routes.map((route, index) => {
      const { swapInfo, percent } = route;
      const { label, inputMint, outputMint, inAmount, outAmount } = swapInfo;
      const inputImage = tokenImages[inputMint];
      const outputImage = tokenImages[outputMint];
      const inputDecimals = tokenDecimals[inputMint] || 9;
      const outputDecimals = tokenDecimals[outputMint] || 9;

      return (
        <div key={index} className="mt-1 w-full rounded-lg px-3 py-2">
          <div className="text-center">
            {index === 0 && (
              <p className="lg:text-md border-b pb-2 text-sm">
                {percent}% of Total route
              </p>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2 lg:flex-nowrap lg:justify-normal lg:gap-4">
            {inputImage && outputImage ? (
              <>
                <div className="flex items-center gap-2 lg:gap-4">
                  <img
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = "no-img.png";
                    }}
                    src={inputImage}
                    alt="Input Token"
                    className="h-9 w-9 rounded-full bg-white p-0.5"
                  />
                  <MdKeyboardArrowRight className="flex-shrink-0 text-xl lg:text-2xl" />
                  <img
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = "no-img.png";
                    }}
                    src={outputImage}
                    alt="Output Token"
                    className="h-9 w-9 rounded-full bg-white p-0.5"
                  />
                </div>

                <div className="flex w-full flex-col text-left lg:w-auto">
                  <p className="text-sm">{label}:</p>
                  <p className="break-all text-base">
                    {(Number(inAmount) / 10 ** inputDecimals).toFixed(6)} →{" "}
                    {(Number(outAmount) / 10 ** outputDecimals).toFixed(6)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {percent}% of this route
                  </p>
                </div>
              </>
            ) : (
              <div className="flex animate-pulse items-center gap-2 lg:gap-4">
                <MdImageSearch size={40} />
                <MdKeyboardArrowRight className="flex-shrink-0 text-xl lg:text-2xl" />
                <MdImageSearch size={40} />
                <p className="text-center text-sm">Loading token data...</p>
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  const groupRoutesByProgression = () => {
    const groupedRoutes: RoutePlan[][] = [];
    let currentGroup: RoutePlan[] = [];

    routePlan.forEach((route, index) => {
      const nextRoute = routePlan[index + 1];

      currentGroup.push(route);

      // If the next route starts a new percentage, group and start new
      if (
        !nextRoute ||
        route.swapInfo.outputMint !== nextRoute.swapInfo.inputMint
      ) {
        groupedRoutes.push(currentGroup);
        currentGroup = [];
      }
    });

    return groupedRoutes.map((group, index) => (
      <div key={index} className={"mt-3 rounded-lg border px-3 py-3"}>
        {renderGroupedSwapPath(group)}
      </div>
    ));
  };

  return (
    <div className="mx-4 my-4 space-y-4 text-xl lg:mx-10">
      <div className="animate-slide-down flex w-full justify-center">
        <div className="mb-10 w-fit overflow-x-auto rounded-lg border p-2 shadow-sm lg:p-4">
          {renderTokenPathMap()}
        </div>
      </div>

      <div className="animate-slide-down-slow flex justify-center">
        <div className="mb-5 w-fit rounded-lg shadow-sm lg:w-auto">
          <p className="text-center text-2xl font-medium lg:text-3xl">
            Route Details
          </p>
          {groupRoutesByProgression()}
        </div>
      </div>

      {/* Transaction Details */}
      <div className="animate-slide-down overflow-x-auto p-3 lg:p-5">
        <p className="text-center text-2xl font-semibold lg:text-3xl">
          Transaction Breakdown
        </p>
        <TransactionBreakdown
          routePlan={routePlan}
          tokenImages={tokenImages}
          tokenDecimals={tokenDecimals}
        />
      </div>
    </div>
  );
};

export default RouteDetails;
