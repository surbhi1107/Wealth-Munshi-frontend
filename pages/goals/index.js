import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import PopUp from "@/components/Popup";
import Cookies from "js-cookie";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

let riskData = [
  {
    risk_profile: "Defensive",
    rate_of_return: 4.0,
    profile: "Balanced",
    retire_age: 65,
  },
  {
    risk_profile: "Conservative",
    rate_of_return: 6.0,
    profile: "Growth",
    retire_age: 78,
  },
];

export default function RiskProfile() {
  const router = useRouter();
  const [memberData, setMemberData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openPopUp, setOpenPopUp] = useState(false);

  return (
    <Layout>
      <div className={`w-full space-y-6`}>
        {/* Goal Details */}
        <div className="w-full px-[30px] py-[30px] bg-white rounded-md space-y-6">
          <div className="w-full mb-4">
            <h1 className="text-xl md:text-[26px] font-semibold text-[#45486A]">
              Your Goals
            </h1>
          </div>
          <div className="w-full md:!mt-3">
            <ul className="text-[#A1A1AA] space-y-3 list-outside text-justify">
              <li>
                Setting your financial goals puts you in charge of your money
                and your life. Your goals can be short or long term, small or
                large
              </li>
              <li>
                Once entered, goals are reduced to costs. They may be a one off
                amount (e.g. for a specific celebration), run over a number of
                years (e.g. supporting a child through higher education), or may
                occur at regular intervals (e.g. upgrading the family car every
                four years).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
