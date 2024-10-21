import { BackgroundBeams } from "./components/ui/BackgroundBeams";
import Navbar from "./components/ui/Navbar";
import { Context } from "./context/WalletContext";
import Home from "./pages/Home";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <>
      <Context>
        <div className="relative min-h-screen w-full">
          <div className="absolute inset-0">
            <BackgroundBeams />
          </div>
          <div className="archivo-f relative z-10 text-white">
            <Navbar />
            <Home />
          </div>
        </div>
        <Toaster />
      </Context>
    </>
  );
}

export default App;
