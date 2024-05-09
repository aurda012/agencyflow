import { Skeleton } from "@/components/ui/skeleton";

const LoadingLaunchPad = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full h-full max-w-[800px]">
        <Skeleton className="w-full h-[390px]" />
      </div>
    </div>
  );
};
export default LoadingLaunchPad;
