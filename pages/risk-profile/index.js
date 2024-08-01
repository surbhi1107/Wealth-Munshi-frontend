import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import PopUp from "@/components/Popup";
import Cookies from "js-cookie";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as cookie from "cookie";

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
  const [loading, setLoading] = useState(false);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [questionnaire, setQuestionnaire] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  let ignore = false;

  const getData = async () => {
    setLoading(true);
    let response = await fetch(`/api/risk-profile/get-questionaries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let res1 = await response.json();
    if (res1?.success) {
      setLoading(false);
      setQuestionnaire(res1?.data);
    } else {
      setLoading(false);
      setQuestionnaire([]);
    }
  };

  useEffect(() => {
    if (!ignore) {
      getData();
    }
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <Layout>
      <div className={`w-full space-y-6`}>
        {/* Risk Details */}
        <div className="w-full px-[30px] py-[30px] bg-white rounded-md space-y-6">
          <div className="w-full mb-4">
            <h1 className="text-xl md:text-[26px] font-semibold text-[#45486A]">
              Your Risk Profile
            </h1>
          </div>
          <div className="w-full md:!mt-3">
            <ul className="text-[#A1A1AA] space-y-3 list-outside text-justify">
              <li>
                We all have very different attitudes towards risk when it comes
                to money. Some of us like to take more risk with the chance of a
                higher return on our investments whereas for others security of
                their investments is more important even if it means a lower
                expected rate of return. Your attitude towards risk will help
                determine what mix of investments are suitable for you.
              </li>
              <li>
                You have initially been given a{" "}
                <span className="text-[#45486A] font-semibold">Defensive</span>{" "}
                profile. We will be using a rate of return of{" "}
                <span className="text-[#45486A] font-semibold">4.0% p.a.</span>{" "}
                (net of fees and taxes) for your projections. There are 5
                different profiles. Each risk profile is associated with a
                particular rate of return. However, an increasing rate of return
                means a greater risk of volatility.
              </li>
              <li>
                To more accurately assess your risk profile, you can complete
                the following online questionnaire. Please select a
                questionnaire below to get started.
              </li>
            </ul>
          </div>
          <div className="w-full overflow-x-scroll md:overflow-auto max-w-7xl 2xl:max-w-none">
            <table className="table-auto overflow-scroll md:overflow-auto w-full text-left">
              <thead className="rounded-lg text-base text-white font-semibold w-full">
                <tr className="bg-white">
                  <th className="py-2 px-3 text-[#57BA52] text-sm font-bold whitespace-nowrap">
                    Risk Profile
                  </th>
                  <th className="py-2 px-3 text-[#57BA52] text-sm font-bold whitespace-nowrap">
                    Rate of Return{" "}
                  </th>
                  <th className="py-2 px-3 text-[#57BA52] text-sm font-bold whitespace-nowrap">
                    Risk Profile
                  </th>
                  <th className="py-2 px-3 text-[#57BA52] text-sm font-bold whitespace-nowrap">
                    Retirement age
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr height="56px">
                    <td colSpan={7}>
                      <div className="w-full h-[40px] mt-5 flex justify-center items-center">
                        <Loading />
                      </div>
                    </td>
                  </tr>
                ) : riskData?.length === 0 ? (
                  <tr height="56px">
                    <td colSpan={7}>
                      <div className="w-full h-[40px] mt-5 flex justify-center items-center text-[#54577A] text-sm font-medium">
                        No Data Found
                      </div>
                    </td>
                  </tr>
                ) : (
                  riskData?.map((v, index) => (
                    <tr
                      height="50px"
                      className={`bg-white text-[#54577A] text-sm font-medium`}
                      key={index}
                    >
                      <td className={`py-1 px-3 whitespace-nowrap`}>
                        {v.risk_profile}
                      </td>
                      <td className={`py-1 px-3 whitespace-nowrap`}>
                        {v.rate_of_return}
                      </td>
                      <td className={`py-1 px-3 whitespace-nowrap`}>
                        {v?.profile}
                      </td>
                      <td className={`py-1 px-3 whitespace-nowrap`}>
                        {v?.retire_age}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Risk Questionnaires details */}
        <div className="w-full px-[30px] py-[30px] bg-white rounded-md space-y-6">
          <div className="w-full">
            <h1 className="text-xl md:text-[26px] font-semibold text-[#45486A]">
              Risk Questionnaires
            </h1>
          </div>
          <div className="w-full overflow-x-scroll md:overflow-auto max-w-7xl 2xl:max-w-none">
            <table className="table-auto overflow-scroll md:overflow-auto w-full text-left">
              <thead className="rounded-lg text-base text-white font-semibold w-full">
                <tr className="bg-white">
                  <th className="py-2 px-3 text-[#57BA52] text-sm font-bold whitespace-nowrap">
                    #
                  </th>
                  <th className="py-2 px-3 text-[#57BA52] text-sm font-bold whitespace-nowrap">
                    Questionnaire
                  </th>
                  <th className="py-2 px-3 text-[#57BA52] text-sm font-bold whitespace-nowrap">
                    For
                  </th>
                  <th className="py-2 px-3 text-[#57BA52] text-sm font-bold whitespace-nowrap">
                    Score
                  </th>
                  <th className="py-2 px-3 text-[#57BA52] text-sm font-bold whitespace-nowrap">
                    Result
                  </th>
                  <th className="py-2 px-3 text-[#57BA52] text-sm font-bold whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="w-full h-[40px] mt-5 flex justify-center items-center">
                        <Loading />
                      </div>
                    </td>
                  </tr>
                ) : questionnaire?.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="w-full h-[40px] mt-5 flex justify-center items-center text-[#54577A] text-sm font-medium">
                        No Data Found
                      </div>
                    </td>
                  </tr>
                ) : (
                  questionnaire?.map((v, index) => (
                    <tr
                      className={`bg-white text-[#54577A] text-sm font-medium`}
                      key={index}
                    >
                      <td className={`py-1 px-3 whitespace-nowrap`}>
                        {index + 1}
                      </td>
                      <td className={`py-1 px-3 whitespace-nowrap`}>
                        {v?.questionaries?.name}
                      </td>
                      <td className={`py-1 px-3 whitespace-nowrap`}>
                        {v?.questionaries?.for}
                      </td>
                      <td className={`py-1 px-3 whitespace-nowrap`}>
                        {v?.questionaries?.score === -1 ||
                        v?.questionaries?.score === null
                          ? "-"
                          : v?.questionaries?.score}
                      </td>
                      <td className={`py-5 px-3 whitespace-nowrap`}>
                        {v?.questionaries?.score === -1 ||
                        v?.questionaries?.score === null
                          ? "-"
                          : v?.questionaries?.score}
                      </td>
                      <td className={`py-5 px-3`}>
                        <div className="flex items-center justify-start space-x-3">
                          {v?.questionaries?.is_ans_given ? (
                            <button
                              className="border rounded-[5px] border-[#57BA52] px-2 py-1 text-[#57BA52]"
                              onClick={() => {
                                console.log("make pdf");
                              }}
                            >
                              Report
                            </button>
                          ) : (
                            <button
                              className="border rounded-[5px] border-[#57BA52] px-2 py-1 text-[#57BA52]"
                              onClick={() => {
                                setSelectedId(v?._id);
                                setOpenPopUp(true);
                              }}
                            >
                              Answer
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-full flex justify-end items-center">
          <button
            onClick={() => {
              router.push("/goals");
            }}
            className="w-auto rounded-lg px-3 py-2 text-white font-medium capitalize bg-[#57BA52] hover:opacity-90"
          >
            OK, Let&apos;s Add Some Goals
          </button>
        </div>
        <PopUp
          isOpen={openPopUp}
          closePopUp={() => setOpenPopUp(false)}
          title="MorningStar Questionnaire"
          isClose
        >
          <div className="w-full space-y-3">
            <p className="text-base text-[#A1A1AA]">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard dummy
              text ever since the 1500s, when an unknown printer took a galley
              of type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged.
            </p>
            <p className="text-base text-[#A1A1AA]">
              It was popularised in the 1960s with the release of Letraset
              sheets containing Lorem Ipsum passages, and more recently with
              desktop publishing software like Aldus PageMaker including
              versions of Lorem Ipsum.
            </p>
            <button
              onClick={() => {
                router.push({
                  pathname: "/risk-profile/questions",
                  query: { partnerId: selectedId },
                });
              }}
              className="w-full rounded-lg px-3 py-2 text-white font-medium capitalize bg-[#57BA52] hover:opacity-90"
            >
              Start
            </button>
          </div>
        </PopUp>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async (ctx) => {
  let newcookies = ctx.req.headers.cookie;
  newcookies = cookie.parse(newcookies);
  let user = JSON.parse(newcookies?.user ?? "");
  if (user?.dob === undefined || user?.dob?.length === 0) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: { user } };
};
