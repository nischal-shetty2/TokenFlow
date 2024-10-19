import { useState, useEffect } from "react";
import { tokenList } from "../utils/tokenList";
import { IoClose } from "react-icons/io5";
import axios from "axios";

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
      token.tokenList.symbol.toLowerCase().includes(term.toLowerCase())
    );

    setSearchTerm(term);
    setFilteredTokens(filtered);

    if (filtered.length === 0) {
      const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{43,44}$/;

      if (base58Regex.test(term)) {
        try {
          const response = await axios.get(
            `https://api.solana.fm/v1/tokens/${term}`
          );

          if (response.data) {
            onSelectToken(term);
            setSearchTerm("");
            onClose();
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
          } else {
            console.error("Network error:", error);
          }
        }
      }
    }
  };

  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    // If the target is the overlay itself, close the modal
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-75 flex z-50 justify-center items-center transition-opacity ${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
      onClick={handleOverlayClick} // Add click handler for the overlay
    >
      <div className="bg-zinc-950 rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 font-thin ">
          <IoClose size={30} />
        </button>
        <h3 className="text-xl mb-4">
          {isInput ? "Select Input Token" : "Select Output Token"}
        </h3>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search token by name or mint"
          className="border text-black rounded-md px-4 py-2 w-full mb-4"
        />

        <div className="space-y-2">
          {filteredTokens.length > 0 ? (
            filteredTokens.map((token: any) => (
              <div
                key={token.mint}
                className="flex items-center justify-between cursor-pointer hover:bg-gray-100 hover:text-black p-2 rounded"
                onClick={() => {
                  onSelectToken(token.mint);
                  onClose();
                }}>
                <div className="flex items-center space-x-2">
                  <img
                    src={token.tokenList.image}
                    alt={token.tokenList.symbol}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-xl">{token.tokenList.symbol}</span>
                </div>
                <span className="text-gray-500 text-md">
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
