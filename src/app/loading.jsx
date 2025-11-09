export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="relative w-[70px] h-[70px] ">
        <div className="absolute w-[70px] h-[70px] rounded-full border-[2px] border-[#00BEFA] animate-pulse-ring" />
        <div className="absolute w-[70px] h-[70px] rounded-full border-[8px] border-transparent border-t-[#00BEFA] animate-spin" />
      </div>
      <div className="mt-5 text-[#00BEFA] text-2xl uppercase text-center font-bold">
        Loading...
      </div>
    </div>
  );
};



