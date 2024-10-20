import { useState, useEffect } from "react";
import axios from "axios";
import { MdImageSearch, MdKeyboardArrowRight } from "react-icons/md";
import { TransactionBreakdown } from "./TransactionBD";

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
  const [tokenImages, setTokenImages] = useState<Record<string, string>>({});
  const [tokenDecimals, setTokenDecimals] = useState<Record<string, number>>(
    {}
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
        `https://api.solana.fm/v1/tokens/${mint}`
      );
      return {
        image: response.data.tokenList.image,
        decimals: response.data.decimals,
      };
    } catch (error) {
      console.error("Error fetching token data", error);
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
          (token) => token.mint === route.swapInfo.inputMint
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
          (token) => token.mint === route.swapInfo.outputMint
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
          <div className="flex flex-col items-center min-w-[60px] lg:min-w-[80px]">
            <img
              src={tokenImages[firstInputMint]}
              alt="Start Token"
              className="w-8 h-8 lg:w-12 lg:h-12 p-0.5 bg-white rounded-full"
            />
            <span className="text-xs lg:text-sm text-center mt-1 break-words w-full">
              {firstInputSymbol}
            </span>
          </div>
        ) : (
          <div className=" animate-pulse px-5 py-3">
            <MdImageSearch size={40} />
            <div className="h-1 mt-1 bg-gray-300 rounded-full w-12"></div>
          </div>
        )}

        <MdKeyboardArrowRight className="text-xl lg:text-2xl flex-shrink-0" />

        {/* Intermediate Tokens */}
        {intermediateTokensWithSymbols.map((token, index) => (
          <div key={token.mint} className="flex items-center gap-2 lg:gap-4">
            {tokenImages[token.mint] ? (
              <div className="flex flex-col items-center min-w-[60px] lg:min-w-[80px]">
                <img
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = "no-img.png";
                  }}
                  src={tokenImages[token.mint]}
                  alt={`Token ${index + 1}`}
                  className="w-8 h-8 lg:w-12 lg:h-12 p-0.5 bg-white  rounded-full"
                />
                <span className="text-xs lg:text-sm text-center mt-1 break-words w-full">
                  {token.symbol}
                </span>
              </div>
            ) : (
              <div className=" animate-pulse px-5 py-3">
                <MdImageSearch size={40} />
                <div className="h-1 mt-1 bg-gray-300 rounded-full w-12"></div>
              </div>
            )}
            <MdKeyboardArrowRight className="text-xl lg:text-2xl flex-shrink-0" />
          </div>
        ))}

        {/* Output Token */}
        {tokenImages[lastOutputMint] ? (
          <div className="flex flex-col items-center min-w-[60px] lg:min-w-[80px]">
            <img
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = "no-img.png";
              }}
              src={tokenImages[lastOutputMint]}
              alt="End Token"
              className="w-8 h-8 lg:w-12 lg:h-12 p-0.5 bg-white  rounded-full"
            />
            <span className="text-xs lg:text-sm text-center mt-1 break-words w-full">
              {lastOutputSymbol}
            </span>
          </div>
        ) : (
          <div className=" animate-pulse px-5 py-3">
            <MdImageSearch size={40} />
            <div className="h-1 mt-1 bg-gray-300 rounded-full  w-12"></div>
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
        <div key={index} className="mt-1 py-2 px-3 w-full rounded-lg">
          <div className="text-center">
            {index === 0 && (
              <p className="text-sm lg:text-md pb-2 border-b">
                {percent}% of Total route
              </p>
            )}
          </div>
          <div className="flex flex-wrap lg:flex-nowrap items-center lg:justify-normal justify-center gap-2 lg:gap-4 mt-1">
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
                    className="w-9 h-9 rounded-full p-0.5 bg-white "
                  />
                  <MdKeyboardArrowRight className="text-xl lg:text-2xl flex-shrink-0" />
                  <img
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = "no-img.png";
                    }}
                    src={outputImage}
                    alt="Output Token"
                    className="w-9 h-9 rounded-full p-0.5 bg-white "
                  />
                </div>

                <div className="flex flex-col w-full lg:w-auto text-center">
                  <p className=" text-sm">{label}:</p>
                  <p className=" text-base break-all">
                    {(Number(inAmount) / 10 ** inputDecimals).toFixed(6)} →{" "}
                    {(Number(outAmount) / 10 ** outputDecimals).toFixed(6)}
                  </p>
                  <p className=" text-sm text-gray-500">{percent}% of route</p>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 lg:gap-4 animate-pulse">
                <MdImageSearch size={40} />
                <MdKeyboardArrowRight className="text-xl lg:text-2xl flex-shrink-0" />
                <MdImageSearch size={40} />
                <p className=" text-sm text-center">Loading token data...</p>
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
      <div key={index} className={" px-3 py-3 border mt-3 rounded-lg  "}>
        {renderGroupedSwapPath(group)}
      </div>
    ));
  };

  return (
    <div className="space-y-4 my-4 text-xl mx-4 lg:mx-10 ">
      {/* Token Path Map Visualization */}
      <div className="flex justify-center w-full  animate-slide-down">
        <div className="border p-2 lg:p-4 mb-10 rounded-lg shadow-sm w-fit overflow-x-auto">
          {renderTokenPathMap()}
        </div>
      </div>

      {/* Route Details */}
      <div className="flex justify-center  animate-slide-down-slow">
        <div className="mb-5 rounded-lg shadow-sm w-fit lg:w-auto">
          <p className="font-medium text-2xl lg:text-3xl text-center">
            Route Details
          </p>
          {groupRoutesByProgression()}
        </div>
      </div>

      {/* Transaction Details */}
      <div className=" p-3 lg:p-5 overflow-x-auto">
        <p className="font-semibold text-2xl lg:text-3xl text-center">
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
