import { BackgroundBeams } from "./components/ui/BackgroundBeams";
import Navbar from "./components/ui/Navbar";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <div className="relative min-h-screen w-full">
        <div className="absolute inset-0">
          <BackgroundBeams />
        </div>
        <div className="archivo-f relative z-10 text-white">
          <Navbar />
          <Home />
        </div>
      </div>
    </>
  );
}

export default App;
