import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="w-full px-12 md:px-24 lg:px-[130px] pt-5 md:pt-8 pb-2 bg-white">
      <div className="w-full flex  justify-end bg-white mb-5">
        <div className="grid grid-flow-col items-center gap-2 text-[#0B0084]">
          <p className="capitalize">surbhi vasoya</p>
          <div className="h-5 border border-[#0B0084]"></div>
          <div>
            <button className="bg-[#fff] font-semibold">Logout</button>
          </div>
        </div>
      </div>
      <div className={`flex items-center justify-between w-full`}>
        <div className="">
          <h2 className="text-navyBlue font-medium text-[30px] md:text-[35px]">
            Wealth Munshi
          </h2>
        </div>
        <div>
          <p className="capitalize">Client Name : Fenil savani</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
