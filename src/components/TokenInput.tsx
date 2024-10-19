interface TokenInputProps {
  label: string;
  token: string;
  setToken: (token: string) => void;
  excludedToken: string; // Exclude the token from the dropdown
}

const TokenInput = ({
  label,
  token,
  setToken,
  excludedToken,
}: TokenInputProps) => {
  const tokens = [
    { mint: "So11111111111111111111111111111111111111112", name: "Solana" },
    { mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", name: "USDC" },
  ];

  return (
    <div className="m-4 ">
      <label className="block text-lg font-medium ">{label}</label>
      <select
        className="border px-4 py-2"
        value={token}
        onChange={(e) => setToken(e.target.value)}>
        {tokens
          .filter((t) => t.mint !== excludedToken)
          .map((t) => (
            <option key={t.mint} value={t.mint}>
              {t.name}
            </option>
          ))}
      </select>
    </div>
  );
};

export default TokenInput;
