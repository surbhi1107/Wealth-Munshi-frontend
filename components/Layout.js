import Cookies from "js-cookie";
import SideNavbar from "./SideNavbar";
import Input from "./Input";
import { useState } from "react";
import { useRouter } from "next/router";

export default ({ children }) => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  return (
    <div className={`flex h-screen`}>
      <SideNavbar />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="w-full flex border-b border-b-[#54577A2E] relative">
          <div className="w-full flex items-center justify-between h-[87px] pt-1 pb-3 px-3">
            <div className="w-[300px]">
              <Input
                value={search}
                placeholder="Search eg; (Goal,Resources)"
                onchange={(v) => setSearch(v)}
                isSearch
              />
            </div>
            <div className="flex items-center space-x-5">
              <button
                className="border rounded-full border-[#E6E6EB] p-2 text-[#54577A]"
                onClick={() => {
                  Cookies.remove("access-token");
                  router.push("/login");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                  />
                </svg>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-[41.33px] h-[41.33px] flex justify-center items-center border rounded-full border-[#E6E6EB] text-white bg-[#57BA52]">
                  SV
                </div>
                <p className="text-[#54577A]">Surbhi Vasoya</p>
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
      {/* <div className="w-full">
        <div className="w-full flex items-center justify-between h-[88px] border-b border-b-[#54577A2E] pt-1 pb-3 px-3">
          <div className="w-[300px]">
            <Input
              value={search}
              placeholder="Search eg; (Goal,Resources)"
              onchange={(v) => setSearch(v)}
            />
          </div>
          <div className="flex items-center space-x-5">
            <button
              className="border rounded-full border-[#E6E6EB] p-2 text-[#54577A]"
              onClick={() => {
                Cookies.remove("access-token");
                router.push("/login");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                />
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-[41.33px] h-[41.33px] flex justify-center items-center border rounded-full border-[#E6E6EB] text-white bg-[#57BA52]">
                SV
              </div>
              <p className="text-[#54577A]">Surbhi Vasoya</p>
            </div>
          </div>
        </div>
        {children}
      </div> */}
    </div>
  );
};
