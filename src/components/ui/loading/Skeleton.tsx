import { MdImageSearch, MdKeyboardArrowRight } from "react-icons/md";

export const LoadingDots = () => {
  return (
    <div className="flex space-x-2 justify-center items-center bg-transparent py-2">
      <span className="sr-only">Loading...</span>
      <div className="h-4 w-4 bg-zinc-100 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-4 w-4 bg-zinc-100 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-4 w-4 bg-zinc-100 rounded-full animate-bounce"></div>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className=" flex justify-center mb-20">
      <div
        role="status"
        className="p-8 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded-lg w-full max-w-md shadow animate-pulse md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-2.5 bg-gray-300 rounded-full  w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-gray-200 rounded-full"></div>
          </div>
          <div className="h-2.5 bg-gray-300 rounded-full  w-12"></div>
        </div>
        <div className="flex items-center justify-between pt-4">
          <div>
            <div className="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-gray-200 rounded-full "></div>
          </div>
          <div className="h-2.5 bg-gray-300 rounded-full  w-12"></div>
        </div>
        <div className="flex items-center justify-between pt-4">
          <div>
            <div className="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-gray-200 rounded-full "></div>
          </div>
          <div className="h-2.5 bg-gray-300 rounded-full  w-12"></div>
        </div>
        <div className="flex items-center justify-between pt-4">
          <div>
            <div className="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-gray-200 rounded-full "></div>
          </div>
          <div className="h-2.5 bg-gray-300 rounded-full  w-12"></div>
        </div>
        <div className="flex items-center justify-between pt-4">
          <div>
            <div className="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5"></div>
            <div className="w-32 h-2 bg-gray-200 rounded-full "></div>
          </div>
          <div className="h-2.5 bg-gray-300 rounded-full  w-12"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export const SkeletonBox = () => {
  return (
    <div className=" flex justify-center mb-5">
      <div
        role="status"
        className=" border border-gray-200 p-5 divide-y divide-gray-200 rounded-lg lg:w-1/2 w-full max-w-md shadow animate-pulse md:p-6">
        <div className="flex items-center justify-between">
          <MdImageSearch size={40} />
          <div>
            <MdKeyboardArrowRight className="text-xl lg:text-2xl flex-shrink-0" />
          </div>
          <MdImageSearch size={40} />
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};
