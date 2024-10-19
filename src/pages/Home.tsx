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
    "/UsdcLogo.png"
  );
  const [outputDecimals, setOutputDecimals] = useState<number>(9);

  const [amount, setAmount] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [routePlan, setRoutePlan] = useState([]);
  const [tokenImages, setTokenImages] = useState<Record<string, string>>({});

  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [isOutputModalOpen, setIsOutputModalOpen] = useState(false);
  const [debouncedAmount, setDebouncedAmount] = useState<number | null>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (inputToken && !isLoading) {
      getSwapTokenImg(inputToken, true);
      if (debouncedAmount) {
        checkPrice();
      }
    }
  }, [inputToken]);

  useEffect(() => {
    if (outputToken && !isLoading) {
      getSwapTokenImg(outputToken, false);
      if (debouncedAmount) {
        checkPrice();
      }
    }
  }, [outputToken]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedAmount(amount);
    }, 900); // Delay in milliseconds

    return () => clearTimeout(timeoutId);
  }, [amount]);

  // Use debouncedAmount for your search logic
  useEffect(() => {
    if (debouncedAmount && !isLoading) {
      if (debouncedAmount > 0) {
        checkPrice();
      } else if (debouncedAmount === 0) {
        alert("Amount should be greater than 0");
      }
    }
  }, [debouncedAmount]);

  const checkPrice = async () => {
    setIsLoading(true);
    try {
      if (!inputDecimals || !outputDecimals) {
        throw "invalid decimal metadata";
      }
      if (!debouncedAmount) return;
      const lamports = debouncedAmount * 10 ** inputDecimals;
      if (lamports <= 0) {
        alert("Amount should be greater than 0");
        return;
      }
      const response = await axios.get(
        `https://quote-api.jup.ag/v6/quote?inputMint=${inputToken}&outputMint=${outputToken}&amount=${lamports}`
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
        `https://api.solana.fm/v1/tokens/${token}`
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
        setImgInput(undefined);
        setInputDecimals(0);
      } else {
        setImgOutput(undefined);
        setOutputDecimals(0);
      }
    }
  };

  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
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
    <div className="flex justify-center ">
      <div className="space-y-10 mt-20">
        <div className="flex flex-col lg:flex-row justify-center lg:space-x-20 space-y-6 lg:space-y-0 items-center">
          <div className="flex lg:flex-col items-center lg:space-x-0 space-x-5">
            {imgInput ? (
              <>
                <img
                  src={imgInput}
                  alt="Input Token"
                  className="rounded-full lg:w-40 w-28 p-1 bg-white"
                />
              </>
            ) : (
              <p>No image available for Input Token</p>
            )}
            <button
              onClick={() => setIsInputModalOpen(true)}
              className="border rounded-md lg:min-w-40 min-w-24 py-2 mt-3 hover:text-white hover:bg-zinc-900 transition">
              <div className="flex justify-between items-center mx-5">
                <div className="font-medium">{inputTokenSymbol}</div>
                <IoIosArrowDown />
              </div>
            </button>
          </div>

          {/* switch button */}
          <div className="flex justify-center items-center ">
            <button
              onClick={handleTokenSwap}
              className={`${
                isLoading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
              } text-white font-bold p-3 rounded-full transition`}>
              <IoSwapHorizontal />
            </button>
          </div>

          {/* Output Token */}
          <div className="flex lg:flex-col items-center lg:space-x-0 space-x-5">
            {imgOutput ? (
              <>
                <img
                  src={imgOutput}
                  alt="Output Token"
                  className="rounded-full lg:w-40 w-28 p-1 bg-white"
                />
              </>
            ) : (
              <p>No image available for Output Token</p>
            )}
            <button
              onClick={() => setIsOutputModalOpen(true)}
              className="border rounded-md lg:min-w-40 min-w-24 py-2 mt-3 hover:text-white hover:bg-zinc-900 transition">
              <div className="flex justify-between items-center mx-5">
                <div className="font-medium">{outputTokenSymbol}</div>
                <IoIosArrowDown />
              </div>
            </button>
          </div>
        </div>

        <div className="  flex justify-center items-center ">
          <div className="relative flex items-center">
            <input
              type="number"
              value={amount ?? ""}
              onChange={(e) => handleAmountChange(e)}
              placeholder="Enter Amount"
              className="border pl-4 pr-6 py-2 text-white text-xl rounded-md bg-transparent focus:ring-1.5 focus:ring-indigo-500 hover:border-indigo-400 transition"
            />
            <div className=" absolute right-4 ">
              <Spinner isLoading={isLoading}>
                <img
                  src={imgInput}
                  className="rounded-full w-8 h-8 p-0.5 bg-white"
                  alt="input token"
                />
              </Spinner>
            </div>
          </div>
        </div>
        {price !== null && (
          <div className="font-semibold text-2xl text-center space-x-3">
            <div className=" flex justify-center space-x-2">
              {isLoading ? (
                <div>
                  <LoadingDots />
                </div>
              ) : (
                <p>{Number(price.toFixed(6)).toLocaleString()} </p>
              )}
              <p>{outputTokenSymbol}</p>
            </div>
            Estimated Output
          </div>
        )}
        <div>
          {routePlan.length > 0 &&
            (isLoading ? (
              <>
                <div className="  pb-10">
                  <SkeletonBox />
                </div>
                <span className=" h-0.5 w-full bg-white "></span>
                <div className=" mt-5">
                  <p className="font-medium text-2xl lg:text-3xl mb-3 text-center">
                    Route Details
                  </p>
                  <SkeletonCard />
                </div>
              </>
            ) : (
              <RouteDetails
                routePlan={routePlan}
                tokenImages={tokenImages}
                setTokenImages={setTokenImages}
              />
            ))}
        </div>
      </div>

      <TokenSearchModal
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        onSelectToken={(mint) => {
          if (mint === outputToken) {
            handleTokenSwap();
            return;
          }
          setInputToken(mint);
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
            return;
          }
          setOutputToken(mint);
        }}
        isInput={false}
      />
    </div>
  );
};

export default Home;
