import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  VersionedTransaction,
} from "@solana/web3.js";
import axios from "axios";
import { Buffer } from "buffer";
import { useToast } from "../../hooks/use-toast";
import { useState } from "react";
import { LoadingDots } from "./loading/Skeleton";

export const SwapButton = ({
  price,
  quote,
  isDisabled,
}: {
  price: number;
  quote: any;
  isDisabled: boolean;
}) => {
  const { toast } = useToast();
  const connection = new Connection(import.meta.env.VITE_RPC);

  const wallet = useWallet();
  const { publicKey } = wallet;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function getSolBalance(publicKey: PublicKey) {
    try {
      const balance = await connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      toast({
        title: "Error fetching SOL balance",
        description: error instanceof Error ? error.message : "",
        variant: "destructive",
      });
      return -1;
    }
  }

  async function signAndSendTransaction() {
    if (!wallet.connected || !wallet.signTransaction || !publicKey) {
      toast({
        title:
          "Wallet is not connected or does not support signing transactions.",
        variant: "destructive",
      });
      return;
    }

    if (!price || quote === "") {
      toast({
        title: "Invalid input Price.",
        variant: "destructive",
      });
      return;
    }

    const userSolBalance = await getSolBalance(publicKey);

    if (userSolBalance === -1) {
      return; // Error toast already displayed
    }

    if (userSolBalance < price) {
      toast({
        title: "Insufficient SOL balance to swap.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.post("https://quote-api.jup.ag/v6/swap", {
        quote,
        userPublicKey: publicKey.toString(),
        wrapAndUnwrapSol: true,
      });
      const { swapTransaction } = response.data;

      const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      const signedTransaction = await wallet.signTransaction(transaction);

      const rawTransaction = signedTransaction.serialize();
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });

      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction(
        {
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: txid,
        },
        "confirmed",
      );
      toast({
        title: "Swap successful!",
        description: `Transaction: https://solscan.io/tx/${txid}`,
      });
    } catch (error) {
      toast({
        title: "Error signing or sending the transaction.",
        description: error instanceof Error ? error.message : "",
        variant: "destructive",
      });
    }
  }

  return (
    <>
      {publicKey ? (
        <>
          <button
            disabled={isDisabled || isLoading}
            onClick={async () => {
              setIsLoading(true);
              await signAndSendTransaction();
              setIsLoading(false);
            }}
            className={`animate-slide-down transform rounded-xl border border-black ${isLoading ? "bg-gray-900" : "bg-white"} px-28 py-1.5 text-xl font-medium text-black shadow-md transition duration-200 hover:-translate-y-1 hover:border-white hover:bg-zinc-950 hover:text-white disabled:cursor-not-allowed disabled:border-none disabled:bg-gray-900 disabled:hover:-translate-y-0 sm:text-2xl`}
          >
            <div className="bg-gradient-to-r from-purple-600 to-sky-500 bg-clip-text text-transparent">
              {isLoading ? (
                <div className="p-3 px-1.5">
                  <LoadingDots />
                </div>
              ) : (
                "Swap"
              )}
            </div>
          </button>
        </>
      ) : (
        <div className="animate-slide-down rounded-3xl p-1 hover:bg-gradient-to-r hover:from-blue-500 hover:to-orange-500">
          <WalletMultiButton
            style={{
              border: "2px solid white",
              color: "white",
              backgroundColor: "black",
              padding: "10px 20px",
              borderRadius: "22px",
            }}
          />
        </div>
      )}
    </>
  );
};
