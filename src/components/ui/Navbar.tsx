import { useWallet } from "@solana/wallet-adapter-react";
import { WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import React from "react";
import { Logo } from "../Logo";
import { Socials } from "../Socials";

const Navbar: React.FC = () => {
  const wallet = useWallet();
  const { publicKey } = wallet;
  return (
    <nav className="animate-slide-down rounded-b-2xl border-b bg-black bg-opacity-90 p-4 text-white">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <Logo />
        </div>
        <div className="flex space-x-5">
          <div className="hidden items-center space-x-4 lg:flex">
            <Socials />
          </div>

          <div>
            {publicKey && (
              <div className="transition duration-200 hover:-translate-y-0.5">
                <WalletDisconnectButton
                  style={{
                    border: "1px solid white",
                    backgroundColor: "black",
                    color: "white",
                    padding: "0px 6px",
                    borderRadius: "12px",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
