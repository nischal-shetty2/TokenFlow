import React from "react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Navbar: React.FC = () => {
  return (
    <nav className="rounded-b-2xl border-b bg-black bg-opacity-90 p-7 text-white">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left Section - Social Icons */}
        <div className="flex space-x-4">
          <a
            href="https://github.com/nischal-shetty2"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gray-400"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://x.com/NischalShetty02"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gray-400"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="https://linkedin.com/in/your-linkedin"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gray-400"
          >
            <FaLinkedin size={24} />
          </a>
        </div>

        {/* Right Section - Button */}
        <div>
          <a
            href="https://jup.ag/swap"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
          >
            Jupiter Swap
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
