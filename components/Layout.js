import Cookies from "js-cookie";
import SideNavbar from "./SideNavbar";
import Input from "./Input";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const Layout = ({ children }) => {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [show, setShow] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const router = useRouter();

  const getPartner = async () => {
    try {
      let response = await fetch(`/api/partner/get-user-partner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let res1 = await response.json();
      if (res1?.success) {
        let name = `${res1?.partner?.fname} ${res1?.partner?.lname}`;
        setPartnerName(name);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const storedUser = Cookies.get("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user?.client_type === 1) getPartner();
  }, [user]);

  return (
    <div className={`block md:flex h-screen bg-[#F5FAF5]`}>
      {/* side navbar */}
      <SideNavbar show={show} setShow={setShow} />
      <div
        className={`${
          show ? "hidden" : "flex"
        } flex-col flex-1 overflow-y-auto mt-3 md:mt-0`}
      >
        {/* header */}
        <div className="w-full flex bg-white border-b border-b-[#54577A2E]">
          <div className="w-full flex items-center justify-between h-[87px] pt-1 pb-3 px-3">
            <div className="w-[300px]">
              <Input
                value={search}
                placeholder="Search eg: (Goal,Resources)"
                onchange={(e) => setSearch(e.target?.value)}
                isSearch
              />
            </div>
            <div className="flex items-center space-x-5">
              <button
                className="border rounded-full border-[#E6E6EB] p-2 text-[#54577A]"
                onClick={() => {
                  Cookies.remove("access-token");
                  Cookies.remove("user");
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
              {![null, undefined, ""].includes(user?.lname) && (
                <div className="w-[41.33px] h-[41.33px] flex justify-center items-center uppercase border rounded-full border-[#E6E6EB] text-white bg-[#57BA52]">
                  {`${user?.fname?.charAt?.(0)}${user?.lname?.charAt?.(0)}`}
                </div>
              )}
              {user?.client_type === 2 ? (
                <div>
                  {![null, undefined, ""].includes(user?.fname) && (
                    <span className="text-[#54577A]">{`Trustees of ${user?.fname} ${user?.lname}`}</span>
                  )}
                </div>
              ) : (
                <div>
                  {![null, undefined, ""].includes(user?.fname) && (
                    <span className="text-[#54577A]">{`${user?.fname} ${user?.lname}`}</span>
                  )}
                  {user?.client_type === 1 && partnerName?.length > 0 ? (
                    <span className="text-[#54577A]">{` & ${partnerName}`}</span>
                  ) : (
                    <></>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-5">{children}</div>
        {/* footer */}
        <div className="w-full md:flex md:items-center md:justify-between space-y-2 md:space-y-0 border-t border-t-[#54577A2E] bg-[#F5FAF5] text-[#8A8A8A] text-sm md:text-base pt-6 px-5 pb-11">
          <p>© 2024 Welathmunshi. All Rights Reserved</p>
          <div className="flex items-center space-x-3">
            <Link
              href="https://omnimaxsoftware.com/terms-of-use/"
              target="_blank"
            >
              Terms Of Service{" "}
            </Link>
            <span>|</span>
            <Link
              href="https://omnimaxsoftware.com/privacy-policy/"
              target="_blank"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
