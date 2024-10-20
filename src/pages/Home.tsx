import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import RouteDetails from "../components/RouteDetails";
import TokenSearchModal from "../components/TokenSearchModal";
import { IoIosArrowDown } from "react-icons/io";
import { IoSwapHorizontal } from "react-icons/io5";
import Spinner from "../components/ui/loading/Spinner";
import {
  LoadingDots,
  SkeletonBox,
  SkeletonCard,
} from "../components/ui/loading/Skeleton";
import { BackgroundGradient } from "../components/ui/BackgroundGradient";
import SlippageOptions from "../components/SlippageOptions";

const Home = () => {
  const solAddress: string = "So11111111111111111111111111111111111111112";
  const usdcAddress: string = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

  const [inputToken, setInputToken] = useState(solAddress);
  const [inputTokenSymbol, setInputTokenSymbol] = useState("SOL");
  const [imgInput, setImgInput] = useState<string | undefined>("/SolLogo.png");
  const [inputDecimals, setInputDecimals] = useState<number>(9);
  const [outputToken, setOutputToken] = useState(usdcAddress);
  const [outputTokenSymbol, setOutputTokenSymbol] = useState("USDC");
  const [imgOutput, setImgOutput] = useState<string | undefined>(
    "/UsdcLogo.png",
  );
  const [outputDecimals, setOutputDecimals] = useState<number>(9);

  const [amount, setAmount] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [routePlan, setRoutePlan] = useState([]);
  const [slippage, setSlippage] = useState<number>(0.5);

  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [isOutputModalOpen, setIsOutputModalOpen] = useState(false);
  const [debouncedAmount, setDebouncedAmount] = useState<number | null>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (inputToken) {
      getSwapTokenImg(inputToken, true);
      if (debouncedAmount) {
        checkPrice();
      }
    }
  }, [inputToken]);

  useEffect(() => {
    if (outputToken) {
      getSwapTokenImg(outputToken, false);
      if (debouncedAmount) {
        checkPrice();
      }
    }
  }, [outputToken]);

  useEffect(() => {
    if (slippage > 0 && inputToken && outputToken) {
      if (debouncedAmount) {
        checkPrice();
      }
    }
  }, [slippage]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedAmount(amount);
    }, 900); // Delay in milliseconds

    return () => clearTimeout(timeoutId);
  }, [amount]);

  // Use debouncedAmount for your search logic
  useEffect(() => {
    if (debouncedAmount && !isLoading) {
      checkPrice();
    }
  }, [debouncedAmount]);

  const checkPrice = async () => {
    setIsLoading(true);
    try {
      if (!inputDecimals || !outputDecimals) {
        throw new Error("Invalid decimal metadata");
      }
      if (!debouncedAmount || debouncedAmount <= 0) {
        throw new Error("Invalid Price");
      }
      const lamports = debouncedAmount * 10 ** inputDecimals;
      if (lamports <= 0) {
        alert("Amount should be greater than 0");
        throw new Error("Invalid Price");
      }
      if (!slippage || slippage < 0.1) {
        throw new Error("Invalid Slippage");
      }
      const response = await axios.get(
        `https://quote-api.jup.ag/v6/quote?inputMint=${inputToken}&outputMint=${outputToken}&amount=${lamports}&swapMode=ExactIn&slippageBps=${
          slippage * 100
        }`,
      );
      const { routePlan, outAmount } = response.data;
      const priceInOutputToken = outAmount / 10 ** outputDecimals;
      setPrice(priceInOutputToken);
      setRoutePlan(routePlan);
    } catch (error) {
      console.error("Error fetching price:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSwapTokenImg = async (token: string, isInput: boolean) => {
    try {
      const response = await axios.get(
        `https://api.solana.fm/v1/tokens/${token}`,
      );

      const imageUrl = response.data.tokenList.image;
      const decimals = response.data.decimals;
      const symbol = response.data.tokenList.symbol;
      if (isInput) {
        setImgInput(imageUrl);
        setInputDecimals(decimals);
        setInputTokenSymbol(symbol);
      } else {
        setImgOutput(imageUrl);
        setOutputDecimals(decimals);
        setOutputTokenSymbol(symbol);
      }
    } catch (e) {
      console.error("Error fetching token image:", e);
      if (isInput) {
        setImgInput(" ");
        setInputDecimals(9);
      } else {
        setImgOutput(" ");
        setOutputDecimals(9);
      }
    }
  };

  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (!slippage) {
      setSlippage(0.5);
    }
    if (value === "" || (!isNaN(Number(value)) && Number(value) > 0)) {
      setAmount(value ? Number(value) : null);
    } else {
      alert("Please enter a valid amount greater than 0.");
    }
  };

  // Function to swap the input and output tokens
  const handleTokenSwap = () => {
    if (isLoading) return;
    const tempToken = inputToken;
    const tempSymbol = inputTokenSymbol;
    const tempImg = imgInput;
    const tempDecimal = inputDecimals;

    setInputToken(outputToken);
    setInputTokenSymbol(outputTokenSymbol);
    setImgInput(imgOutput);
    setInputDecimals(outputDecimals);

    setOutputToken(tempToken);
    setOutputTokenSymbol(tempSymbol);
    setImgOutput(tempImg);
    setOutputDecimals(tempDecimal);
  };

  return (
    <div className="flex justify-center">
      <div className="mt-6 space-y-10 lg:mt-20">
        <div className="flex flex-col items-center justify-center space-y-6 lg:flex-row lg:space-y-0">
          <div className="block rounded-3xl border text-[10px] lg:hidden">
            <SlippageOptions slippage={slippage} setSlippage={setSlippage} />
          </div>
          <div className="flex items-center space-x-5 lg:flex-col lg:space-x-0">
            {imgInput ? (
              <>
                <BackgroundGradient>
                  <img
                    onClick={() => setIsInputModalOpen(true)}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = "no-img.png";
                    }}
                    src={imgInput}
                    alt="Input Token"
                    className="w-28 rounded-full bg-white p-1 lg:w-40"
                  />
                </BackgroundGradient>
              </>
            ) : (
              <p>No image available for Input Token</p>
            )}
            <button
              onClick={() => setIsInputModalOpen(true)}
              className="mt-3 min-w-24 rounded-md border bg-black py-2 transition hover:bg-white hover:text-black lg:min-w-40"
            >
              <div className="mx-5 flex items-center justify-between">
                <div className="font-medium">{inputTokenSymbol}</div>
                <IoIosArrowDown />
              </div>
            </button>
            <div className="relative hidden items-center justify-between pt-10 lg:flex">
              <input
                type="number"
                value={amount ?? ""}
                onChange={(e) => handleAmountChange(e)}
                placeholder="Enter Amount"
                className="focus:ring-1.5 rounded-lg border bg-black py-2 pl-6 text-lg transition hover:border-indigo-400"
              />
              <div className="absolute right-4">
                <Spinner isLoading={isLoading}>
                  <img
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = "no-img.png";
                    }}
                    src={imgInput}
                    className="h-8 w-8 rounded-full bg-white p-[1px]"
                    alt="input token"
                  />
                </Spinner>
              </div>
            </div>
          </div>

          {/* switch button */}
          <div className="mx-20 grid grid-rows-10 lg:gap-4">
            <div className="row-span-10 flex items-center justify-center">
              <div className="lg:space-y-10">
                <div className="hidden rounded-3xl border text-xs lg:block">
                  <SlippageOptions
                    slippage={slippage}
                    setSlippage={setSlippage}
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={handleTokenSwap}
                    className={`${
                      isLoading
                        ? "bg-gray-500"
                        : "bg-blue-600 hover:bg-blue-700"
                    } rounded-full p-3 text-xl font-bold text-white transition`}
                  >
                    <IoSwapHorizontal />
                  </button>
                </div>
              </div>
            </div>
            <div className="row-span-10 mt-12 hidden h-full w-full flex-col items-center justify-center lg:flex">
              <div className="flex justify-center">
                {isLoading ? (
                  <LoadingDots />
                ) : (
                  <div className="bg-gradient-to-r from-purple-500 to-sky-400 bg-clip-text text-5xl text-transparent">
                    ➔
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Output Token */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center space-x-5 lg:flex-col lg:space-x-0">
              {imgOutput ? (
                <>
                  <BackgroundGradient>
                    <img
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = "no-img.png";
                      }}
                      onClick={() => setIsOutputModalOpen(true)}
                      src={imgOutput}
                      alt="Output Token"
                      className="w-28 rounded-full bg-white p-1 lg:w-40"
                    />
                  </BackgroundGradient>
                </>
              ) : (
                <p>No image available for Output Token</p>
              )}
              <button
                onClick={() => setIsOutputModalOpen(true)}
                className="mt-3 min-w-24 rounded-md border bg-black py-2 transition hover:bg-white hover:text-black lg:min-w-40"
              >
                <div className="mx-5 flex items-center justify-between">
                  <div className="font-medium">{outputTokenSymbol}</div>
                  <IoIosArrowDown />
                </div>
              </button>
            </div>

            <div className="relative flex items-center justify-between pt-7 lg:hidden">
              <input
                type="number"
                value={amount ?? ""}
                onChange={(e) => handleAmountChange(e)}
                placeholder="Enter Amount"
                className="focus:ring-1.5 rounded-lg border bg-black py-2 pl-6 text-lg transition hover:border-indigo-400 hover:text-white"
              />
              <div className="absolute right-4">
                <Spinner isLoading={isLoading}>
                  <img
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = "no-img.png";
                    }}
                    src={imgInput}
                    className="h-8 w-8 rounded-full bg-white p-[1px]"
                    alt="input token"
                  />
                </Spinner>
              </div>
            </div>

            <div className="relative flex items-center justify-between pt-10">
              <input
                type="number"
                value={price?.toFixed(outputDecimals) ?? ""}
                disabled={true}
                placeholder="You Recieve"
                className="rounded-lg border bg-black py-2 pl-6 text-lg text-white transition hover:border-indigo-400 hover:bg-zinc-950 hover:text-white"
              />
              <div className="absolute right-4">
                <Spinner isLoading={isLoading}>
                  <img
                    src={imgOutput}
                    className="h-8 w-8 rounded-full bg-white p-[1px]"
                    alt="output token"
                  />
                </Spinner>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10">
          {routePlan.length > 0 &&
            (isLoading ? (
              <>
                <div className="pb-10">
                  <SkeletonBox />
                </div>
                <span className="h-0.5 w-full bg-white"></span>
                <div className="mt-5">
                  <p className="mb-3 text-center text-2xl font-medium lg:text-3xl">
                    Route Details
                  </p>
                  <SkeletonCard />
                </div>
              </>
            ) : (
              <RouteDetails routePlan={routePlan} />
            ))}
        </div>
      </div>

      <TokenSearchModal
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        onSelectToken={(mint) => {
          if (mint === outputToken) {
            handleTokenSwap();
          } else {
            setInputToken(mint);
          }
        }}
        isInput={true}
      />

      <TokenSearchModal
        isOpen={isOutputModalOpen}
        onClose={() => {
          setIsOutputModalOpen(false);
        }}
        onSelectToken={(mint) => {
          if (mint === inputToken) {
            handleTokenSwap();
          } else {
            setOutputToken(mint);
          }
        }}
        isInput={false}
      />
    </div>
  );
};

export default Home;
