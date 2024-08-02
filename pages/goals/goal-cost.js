import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as cookie from "cookie";

export default function GoalsCost() {
  const router = useRouter();
  const [goalData, setGoalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState([]);
  let ignore = false;

  const getData = async () => {
    setLoading(true);
    let response = await fetch(`/api/goals/get-user-goals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let res1 = await response.json();
    if (res1?.data) {
      setGoalData(res1?.data);
      getgoalresources();
    } else {
      setLoading(false);
      setGoalData([]);
    }
  };

  const getgoalresources = async () => {
    try {
      setLoading(true);
      let response = await fetch(`/api/resources/get-goal-resources`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let res1 = await response.json();
      if (res1?.success) {
        setLoading(false);
        setResources(res1?.data ?? []);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError(
        error.response ? error.response.data.error : "An error occurred"
      );
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
        {/* Goal Details */}
        <>
          <div className="w-full px-[30px] py-[30px] bg-white rounded-md space-y-6">
            <div className="w-full mb-4">
              <h1 className="text-xl md:text-[26px] font-semibold text-[#45486A]">
                Goals Summary
              </h1>
            </div>
            <div className="w-full md:!mt-3">
              <ul className="text-[#A1A1AA] space-y-3 list-outside text-justify">
                <li>
                  The goal summary sets out the cost of your goals. The Total
                  Amount Required is the amount that will need to be spent to
                  provide the goal. Don't be put off by the large numbers -
                  remember that these include allowance for inflation. Of more
                  interest are the amounts that would have to be invested now to
                  achieve the goal at its time or the amount needed to be
                  invested each year to meet the goal.
                </li>
                <li>
                  The Total Cost of Goals graph shows the amount and timing of
                  the cost of your goals.
                </li>
              </ul>
            </div>
          </div>
          {goalData?.length > 0 ? (
            <div className="w-full px-[30px] py-[30px] bg-white rounded-md space-y-6">
              <div className="w-full md:flex justify-between space-y-4 md:space-y-0">
                <h1 className="text-xl md:text-[26px] font-semibold text-[#45486A]">
                  Goals
                </h1>
              </div>
              <div className="w-full overflow-x-scroll md:overflow-x-hidden max-w-7xl 2xl:max-w-none">
                <table className="table-auto overflow-scroll md:overflow-auto w-full text-left">
                  <thead className="rounded-lg text-base text-white font-semibold w-full">
                    <tr className="bg-white">
                      <th className="py-2 px-3 text-[#57BA52] text-sm font-bold">
                        Priority
                      </th>
                      <th className="py-2 px-3 text-[#57BA52] text-sm font-bold">
                        Goal Name
                      </th>
                      <th className="py-2 px-3 text-[#57BA52] text-sm font-bold">
                        Goal Description
                      </th>
                      <th className="py-2 px-3 text-[#57BA52] text-sm font-bold">
                        Amount Required
                      </th>
                      <th className="py-2 px-3 text-[#57BA52] text-sm font-bold">
                        Available Resources
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
                    ) : goalData?.length === 0 ? (
                      <tr height="56px">
                        <td colSpan={7}>
                          <div className="w-full h-[40px] mt-5 flex justify-center items-center text-[#54577A] text-sm font-medium">
                            No Data Found
                          </div>
                        </td>
                      </tr>
                    ) : (
                      goalData?.map((v, index) => (
                        <tr
                          height="56px"
                          className={`bg-white text-[#54577A] text-sm font-medium`}
                          key={index}
                        >
                          <td className={`py-1 px-3`}>{index + 1}</td>
                          <td
                            className={`py-1 px-3 capitalize whitespace-nowrap`}
                          >
                            {v?.type?.length ? v?.type?.replace("_", " ") : "-"}
                          </td>
                          <td className={`py-1 px-3 capitalize`}>
                            {`Rs.${v?.amount} ${
                              v.start_timeline?.desc
                            } at ${(v?.inflation).toFixed(2)}%`}
                          </td>
                          <td className={`py-1 px-3`}>{v.amount}</td>
                          <td className={`py-1 px-3`}>
                            {resources?.length > 0 ? "" : ""}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <></>
          )}
        </>
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
