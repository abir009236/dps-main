"use client";
import CountUp from "react-countup";

const Counting = ({ start, end, sign, title }) => {
  return (
    <div className="border-2 border-gray-200 rounded-lg p-3 sm:p-4 bg-white shadow-md">
      <CountUp start={start} end={end} delay={0} duration={3}>
        {({ countUpRef }) => (
          <div className="text-sm sm:text-base flex flex-col items-center justify-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
              <span ref={countUpRef}>10</span>
              <span>{sign}</span>
            </div>
            <h2 className="text-xs sm:text-sm text-gray-600 text-center leading-tight">
              {title}
            </h2>
          </div>
        )}
      </CountUp>
    </div>
  );
};

export default Counting;
