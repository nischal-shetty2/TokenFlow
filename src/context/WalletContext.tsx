import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { FC, ReactNode, useMemo } from "react";
import "@solana/wallet-adapter-react-ui/styles.css";

export const Context: FC<{ children: ReactNode }> = ({ children }) => {
  const network = import.meta.env.VITE_RPC;

  const endpoint = useMemo(() => network, [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
