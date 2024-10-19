import React from "react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Navbar: React.FC = () => {
  return (
    <nav className="  rounded-b-2xl bg-opacity-90 bg-black border-b text-white p-7">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Section - Social Icons */}
        <div className="flex space-x-4">
          <a
            href="https://github.com/nischal-shetty2"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition-colors">
            <FaGithub size={24} />
          </a>
          <a
            href="https://x.com/NischalShetty02"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition-colors">
            <FaTwitter size={24} />
          </a>
          <a
            href="https://linkedin.com/in/your-linkedin"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition-colors">
            <FaLinkedin size={24} />
          </a>
        </div>

        {/* Right Section - Button */}
        <div>
          <a
            href="https://jup.ag/swap"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors">
            Jupiter Swap
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
