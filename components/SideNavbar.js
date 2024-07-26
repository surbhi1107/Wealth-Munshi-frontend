import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

let Menus = [
  { title: "Details", href: "/" },
  { title: "Risk Profile", href: "/risk-profile" },
  { title: "Goals", href: "/goals" },
  { title: "Cashflow", href: "/cash-flow" },
  { title: "Summary", href: "/summary" },
];

const SideNavbar = () => {
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
      credentials: "include",
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
      <div className="hidden md:flex flex-col w-64 border-r border-r-[#54577A2E]">
        <a
          href="/"
          className="w-full flex justify-center items-center h-[88px] border-b border-b-[#54577A2E] pt-1 pb-3 px-3"
        >
          <img className="w-auto h-14" src="/Images/logo.png" alt="" />
        </a>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 py-4 space-y-1 pr-3">
            {Menus.map((v, i) => (
              <a
                href={v.href}
                key={i}
                className="w-full flex items-center justify-start space-x-3 text-[#45486A] group"
              >
                <span
                  className={`w-[5px] h-11 rounded-tr-[5px] rounded-br-[5px] transition-colors duration-300 transform ${
                    pathname === v.href
                      ? "bg-[#57BA52]"
                      : "group-hover:bg-[#57BA52]"
                  }`}
                ></span>
                <div
                  className={`w-full px-[9px] py-3 flex items-center rounded-[5px] transition-colors duration-300 transform ${
                    pathname === v.href
                      ? "bg-[#57BA52] text-white"
                      : "group-hover:bg-[#57BA52] group-hover:text-white"
                  }`}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17 10H19C21 10 22 9 22 7V5C22 3 21 2 19 2H17C15 2 14 3 14 5V7C14 9 15 10 17 10Z"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 22H7C9 22 10 21 10 19V17C10 15 9 14 7 14H5C3 14 2 15 2 17V19C2 21 3 22 5 22Z"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10Z"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18 22C20.2091 22 22 20.2091 22 18C22 15.7909 20.2091 14 18 14C15.7909 14 14 15.7909 14 18C14 20.2091 15.7909 22 18 22Z"
                      stroke="white"
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
