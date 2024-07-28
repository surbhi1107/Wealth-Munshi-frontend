import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

let Menus = [
  { title: "Details", href: "/" },
  { title: "Risk Profile", href: "/risk-profile" },
  { title: "Goals", href: "/goals" },
  { title: "Cashflow", href: "/cash-flow" },
  { title: "Summary", href: "/summary" },
];

const SideNavbar = ({ show, setShow }) => {
  let pathname = usePathname();
  const isPublicPath =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname?.includes("password");
  let token = Cookies.get("access-token");
  let user = Cookies.get("user");
  if (user !== undefined) user = JSON.parse(user);

  const getuser = async () => {
    let response = await fetch(`/api/auth/get-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    let res1 = await response.json();
    if (res1?.success) Cookies.set("user", JSON.stringify(res1?.user));
  };

  useEffect(() => {
    if (!isPublicPath && token && !user) getuser();
  }, []);

  return (
    <>
      <div
        className={`md:flex flex-col md:flex-row w-full md:w-64 bg-white  ${
          show ? "min-h-screen" : ""
        } md:min-h-screen`}
      >
        <div className="flex flex-col w-full md:w-64 text-gray-700 border-r border-r-[#54577A2E] flex-shrink-0">
          <div className="border-b border-b-[#54577A2E] px-8 pt-3 pb-[15px] flex flex-row items-center justify-between md:justify-center">
            <a
              href="/"
              className="text-lg font-semibold tracking-widest text-gray-900 uppercase rounded-lg focus:outline-none focus:shadow-outline"
            >
              <img
                className="w-auto h-10 md:h-[60px]"
                src="/Images/logo.png"
                alt=""
              />
            </a>
            <button
              className="rounded-lg md:hidden focus:outline-none focus:shadow-outline"
              onClick={() => setShow(!show)}
            >
              {show ? (
                <svg
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  className="w-6 h-6"
                >
                  <path
                    x-show="open"
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              ) : (
                <svg
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  className="w-6 h-6"
                >
                  <path
                    x-show="!open"
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </button>
          </div>
          <nav
            className={`${
              show ? "block" : "hidden"
            } md:block py-4 pr-3 md:overflow-y-auto space-y-1`}
          >
            {Menus.map((v, i) => (
              <a
                href={v.href}
                key={i}
                className="w-full flex items-center justify-start space-x-3 text-[#45486A] group"
              >
                <span
                  className={`hidden md:block w-[5px] h-11 rounded-tr-[5px] rounded-br-[5px] transition-colors duration-300 transform ${
                    pathname === v.href
                      ? "bg-[#57BA52]"
                      : "group-hover:bg-[#57BA52]"
                  }`}
                ></span>
                <div
                  className={`w-full px-[9px] py-1 md:py-3 flex items-center rounded-[5px] gap-1 md:gap-0 transition-colors duration-300 transform ${
                    pathname === v.href
                      ? "bg-white md:bg-[#57BA52] text-[#57BA52] md:text-white"
                      : "md:group-hover:bg-[#57BA52] group-hover:text-[#57BA52] md:group-hover:text-white"
                  }`}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`group-hover:stroke-[#57BA52] md:group-hover:stroke-white ${
                      pathname === v.href
                        ? "stroke-[#57BA52]"
                        : "stroke-[#45486A]"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17 10H19C21 10 22 9 22 7V5C22 3 21 2 19 2H17C15 2 14 3 14 5V7C14 9 15 10 17 10Z"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 22H7C9 22 10 21 10 19V17C10 15 9 14 7 14H5C3 14 2 15 2 17V19C2 21 3 22 5 22Z"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10Z"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18 22C20.2091 22 22 20.2091 22 18C22 15.7909 20.2091 14 18 14C15.7909 14 14 15.7909 14 18C14 20.2091 15.7909 22 18 22Z"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="mx-2 text-sm font-medium">{v.title}</span>
                </div>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default SideNavbar;
