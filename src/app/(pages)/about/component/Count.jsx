import React from "react";
import Counting from "./Counting";

export default function Count() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <Counting start={0} end={50} sign={"+"} title={"Satisfied Customers"} />
      <Counting start={0} end={19} sign={"+"} title={"Custom Payment"} />
      <Counting start={0} end={0} sign={" "} title={"Team Members"} />
      <Counting start={0} end={1} sign={" "} title={"Years In Business"} />
    </div>
  );
}
