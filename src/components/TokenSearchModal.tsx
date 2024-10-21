import { useState, useEffect } from "react";
import { tokenList } from "../lib/tokenList";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface TokenSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectToken: (mint: string) => void;
  isInput: boolean;
}

const TokenSearchModal: React.FC<TokenSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectToken,
  isInput,
}) => {
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [popularTokens, setPopularTokens] = useState<any[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<any[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    const tokensData = Object.values(tokenList);
    setPopularTokens(tokensData);
    setFilteredTokens(tokensData);
  }, [isOpen]);

  const handleSearch = async (term: string) => {
    let filtered = popularTokens.filter((token) =>
      token.tokenList.symbol.toLowerCase().includes(term.toLowerCase()),
    );

    setSearchTerm(term);
    setFilteredTokens(filtered);

    if (filtered.length === 0) {
      const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{43,44}$/;

      if (base58Regex.test(term)) {
        try {
          const response = await axios.get(
            `https://api.solana.fm/v1/tokens/${term}`,
          );

          if (response.data) {
            onSelectToken(term);
            setSearchTerm("");
            onClose();
          }
        } catch (error) {
          toast({
            title: "Invalid Token symbol/Address",
            variant: "destructive",
          });
        }
      }
    }
  };

  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 transition-opacity ${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-md rounded-lg bg-zinc-950 p-6 shadow-lg">
        <button onClick={onClose} className="absolute right-3 top-3 font-thin">
          <IoClose size={30} />
        </button>
        <h3 className="mb-4 text-xl">
          {isInput ? "Select Input Token" : "Select Output Token"}
        </h3>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search token by name or mint"
          className="mb-4 w-full rounded-md border px-4 py-2 text-black"
        />

        <div className="space-y-2">
          {filteredTokens.length > 0 ? (
            filteredTokens.map((token: any) => (
              <div
                key={token.mint}
                className="flex cursor-pointer items-center justify-between rounded p-2 hover:bg-gray-100 hover:text-black"
                onClick={() => {
                  onSelectToken(token.mint);
                  onClose();
                }}
              >
                <div className="flex items-center space-x-2">
                  <img
                    src={token.tokenList.image}
                    alt={token.tokenList.symbol}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="text-xl">{token.tokenList.symbol}</span>
                </div>
                <span className="text-md text-gray-500">
                  {token.mint.slice(0, 5) + "..." + token.mint.slice(-3)}
                </span>
              </div>
            ))
          ) : (
            <p>No Matching Tokens/Addresses</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenSearchModal;
