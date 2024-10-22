import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const Socials = () => {
  return (
    <>
      <a
        href="https://github.com/nischal-shetty2"
        target="_blank"
        rel="noopener noreferrer"
        className="transition-colors hover:text-zinc-400"
      >
        <FaGithub size={24} />
      </a>
      <a
        href="https://x.com/NischalShetty02"
        target="_blank"
        rel="noopener noreferrer"
        className="transition-colors hover:text-zinc-400"
      >
        <FaXTwitter size={24} />
      </a>
      <a
        href="https://www.linkedin.com/in/nischal-shetty-2ba446272/"
        target="_blank"
        rel="noopener noreferrer"
        className="transition-colors hover:text-zinc-400"
      >
        <FaLinkedin size={24} />
      </a>
    </>
  );
};
