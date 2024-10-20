import { MdImageSearch, MdKeyboardArrowRight } from "react-icons/md";

export const LoadingDots = () => {
  return (
    <div className="flex items-center justify-center space-x-2 bg-transparent">
      <span className="sr-only">Loading...</span>
      <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-100 [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-100 [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-100"></div>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="mb-20 flex justify-center">
      <div
        role="status"
        className="w-full max-w-md animate-pulse space-y-4 divide-y divide-gray-200 rounded-lg border border-gray-200 p-8 shadow md:p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300"></div>
            <div className="h-2 w-32 rounded-full bg-gray-200"></div>
          </div>
          <div className="h-2.5 w-12 rounded-full bg-gray-300"></div>
        </div>
        <div className="flex items-center justify-between pt-4">
          <div>
            <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300"></div>
            <div className="h-2 w-32 rounded-full bg-gray-200"></div>
          </div>
          <div className="h-2.5 w-12 rounded-full bg-gray-300"></div>
        </div>
        <div className="flex items-center justify-between pt-4">
          <div>
            <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300"></div>
            <div className="h-2 w-32 rounded-full bg-gray-200"></div>
          </div>
          <div className="h-2.5 w-12 rounded-full bg-gray-300"></div>
        </div>
        <div className="flex items-center justify-between pt-4">
          <div>
            <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300"></div>
            <div className="h-2 w-32 rounded-full bg-gray-200"></div>
          </div>
          <div className="h-2.5 w-12 rounded-full bg-gray-300"></div>
        </div>
        <div className="flex items-center justify-between pt-4">
          <div>
            <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300"></div>
            <div className="h-2 w-32 rounded-full bg-gray-200"></div>
          </div>
          <div className="h-2.5 w-12 rounded-full bg-gray-300"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export const SkeletonBox = () => {
  return (
    <div className="mb-5 flex justify-center">
      <div
        role="status"
        className="mt-4 w-full max-w-md animate-pulse divide-y divide-gray-200 rounded-lg border border-gray-200 px-4 py-3 shadow md:p-6 lg:w-52"
      >
        <div className="flex items-center justify-between">
          <MdImageSearch size={40} />
          <div>
            <MdKeyboardArrowRight className="flex-shrink-0 text-xl lg:text-2xl" />
          </div>
          <MdImageSearch size={40} />
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};
