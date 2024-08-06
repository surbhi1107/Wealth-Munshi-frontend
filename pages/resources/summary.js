import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import PopUp from "@/components/Popup";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as cookie from "cookie";
import Input from "@/components/Input";
import Dropdown from "@/components/Dropdown";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import jsonData from "../../data.json";

export default function Home(props) {
  const router = useRouter();
  let months = jsonData.months ?? [];
  let user = props.user;
  const [resources, setResources] = useState([]);
  const [goals, setGoals] = useState([]);
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState({
    assets: 0,
    investments: 0,
    liabilities: 0,
  });
  const [error, setError] = useState("");
  let ignore = false;

  const getData = async () => {
    setLoading(true);
    let response = await fetch(`/api/summary/get-summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let res1 = await response.json();
    if (res1?.success) {
      setResources(res1?.data?.assets);
      setDebts(res1?.data?.liabilities);
      setTotal({
        assets: res1?.data?.assets
          ?.filter((v) => v.isAssest)
          .reduce((a, b) => a + b.amount, 0),
        investments: res1?.data?.assets
          ?.filter((v) => !v.isAssest)
          .reduce((a, b) => a + b.amount, 0),
        liabilities: res1?.data?.liabilities.reduce((a, b) => a + b.amount, 0),
      });
      getgoalresources();
    } else {
      setLoading(false);
      setResources({});
    }
  };

  const getgoalresources = async () => {
    try {
      setLoading(true);
      let response = await fetch(`/api/goals/get-user-goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let res1 = await response.json();
      if (res1?.data) {
        setLoading(false);
        setGoals(res1?.data ?? []);
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
      <ToastContainer />
      <div className={`w-full space-y-6`}>
        <div className="w-full px-[30px] py-[30px] bg-white rounded-md space-y-6">
          <div className="w-full space-y-4">
            <h1 className="text-xl md:text-[26px] font-semibold text-[#45486A]">
              Financial Resources Resultsld
            </h1>
            <h4 className="font-medium text-[#45486A]">Part A: Net Worth</h4>
            <p className="text-[#A1A1AA]">
              The Net Worth Statement provides your personal balance sheet.
            </p>
            <h4 className="font-medium text-[#45486A]">Part A: Net Worth</h4>
            <p className="text-[#A1A1AA]">
              The table lists your goals and the extent to which your existing
              resources meet them.
            </p>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center col-span-2 rounded-lg py-2">
            <Loading />
          </div>
        ) : (
          <>
            <div className="w-full px-[30px] py-[30px] bg-white rounded-md space-y-6">
              <div className="w-full space-y-4">
                <h1 className="text-xl md:text-[26px] font-semibold text-[#45486A]">
                  Net Worth Statement
                </h1>
                <div className="w-full overflow-x-scroll md:overflow-auto max-w-7xl 2xl:max-w-none">
                  <table className="table-auto overflow-scroll md:overflow-auto w-full text-left">
                    <thead className="rounded-lg text-base text-white font-semibold w-full">
                      <tr className="bg-white">
                        <th className="py-2 px-3 text-[#57BA52] text-sm font-bold whitespace-nowrap !border-r-0">
                          Investments
                        </th>
                        <th className="py-2 px-3 text-[#57BA52] text-sm font-bold whitespace-nowrap !border-l-0">
                          Current Valuation
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {resources?.map((v, i) => (
                        <>
                          {!v?.isAssest ? (
                            <tr
                              height="56px"
                              className={`bg-white text-[#54577A] text-sm font-medium`}
                            >
                              <td
                                className={`py-1 px-3 whitespace-nowrap capitalize !border-r-0`}
                              >
                                {`${v?.type?.replace?.(/_/g, " ")} (${
                                  v?.member?.fname
                                } ${v?.type?.replace?.(/_/g, " ")})`}
                              </td>
                              <td className={`py-1 px-3 whitespace-nowrap`}>
                                Rs. {v?.amount}
                              </td>
                            </tr>
                          ) : (
                            <></>
                          )}
                        </>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr
                        height="56px"
                        className={`bg-white text-[#54577A] text-sm font-medium`}
                      >
                        <td
                          className={`py-1 px-3 whitespace-nowrap capitalize !border-r-0`}
                        >
                          <p className="flex justify-end">Total Investments:</p>
                        </td>
                        <td
                          className={`py-1 px-3 whitespace-nowrap capitalize !border-r-0`}
                        >
                          <p>Rs. {total.investments}</p>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="w-full overflow-x-scroll md:overflow-auto max-w-7xl 2xl:max-w-none">
                  <table className="table-auto overflow-scroll md:overflow-auto w-full text-left">
                    <thead className="rounded-lg text-base text-white font-semibold w-full">
                      <tr className="bg-white">
                        <th className="py-2 px-3 text-[#57BA52] text-sm font-bold whitespace-nowrap !border-r-0">
                          Other Assets
                        </th>
                        <th className="py-2 px-3 text-[#57BA52] text-sm font-bold whitespace-nowrap !border-l-0">
                          Current Valuation
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {resources?.map((v, i) => (
                        <>
                          {v?.isAssest ? (
                            <tr
                              height="56px"
                              className={`bg-white text-[#54577A] text-sm font-medium`}
                            >
                              <td
                                className={`py-1 px-3 whitespace-nowrap capitalize !border-r-0`}
                              >
                                {`${v?.type?.replace?.(/_/g, " ")} (${
                                  v?.member?.fname
                                } ${v?.type?.replace?.(/_/g, " ")})`}
                              </td>
                              <td className={`py-1 px-3 whitespace-nowrap`}>
                                Rs. {v?.amount}
                              </td>
                            </tr>
                          ) : (
                            <></>
                          )}
                        </>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr
                        height="56px"
                        className={`bg-white text-[#54577A] text-sm font-medium`}
                      >
                        <td
                          className={`py-1 px-3 whitespace-nowrap capitalize !border-r-0`}
                        >
                          <p className="flex justify-end">
                            Total Other Assets:
                          </p>
                        </td>
                        <td
                          className={`py-1 px-3 whitespace-nowrap capitalize !border-r-0`}
                        >
                          <p>Rs. {total.assets}</p>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="w-full overflow-x-scroll md:overflow-auto max-w-7xl 2xl:max-w-none">
                  <table className="table-auto overflow-scroll md:overflow-auto w-full text-left">
                    <thead className="rounded-lg text-base text-white font-semibold w-full">
                      <tr className="bg-white">
                        <th className="py-2 px-3 text-[#57BA52] text-sm font-bold whitespace-nowrap !border-r-0">
                          Liabilities
                        </th>
                        <th className="py-2 px-3 text-[#57BA52] text-sm font-bold whitespace-nowrap !border-l-0">
                          Current Valuation
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {debts?.map((v, i) => (
                        <>
                          <tr
                            height="56px"
                            className={`bg-white text-[#54577A] text-sm font-medium`}
                          >
                            <td
                              className={`py-1 px-3 whitespace-nowrap capitalize !border-r-0`}
                            >
                              {`${v?.type?.replace?.(/_/g, " ")} (${
                                v?.member?.fname
                              } ${v?.type?.replace?.(/_/g, " ")})`}
                            </td>
                            <td className={`py-1 px-3 whitespace-nowrap`}>
                              Rs. {v?.amount}
                            </td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr
                        height="56px"
                        className={`bg-white text-[#54577A] text-sm font-medium`}
                      >
                        <td
                          className={`py-1 px-3 whitespace-nowrap capitalize !border-r-0`}
                        >
                          <p className="flex justify-end">Total Liabilities:</p>
                        </td>
                        <td
                          className={`py-1 px-3 whitespace-nowrap capitalize !border-r-0`}
                        >
                          <p>Rs. {total.liabilities}</p>
                        </td>
                      </tr>
                      <tr
                        height="56px"
                        className={`bg-white text-[#54577A] text-sm font-medium`}
                      >
                        <td
                          className={`py-1 px-3 whitespace-nowrap capitalize !border-r-0`}
                        >
                          <p className="flex justify-end">Total Assets:</p>
                        </td>
                        <td
                          className={`py-1 px-3 whitespace-nowrap capitalize !border-r-0`}
                        >
                          <p>Rs. {total.assets + total.investments}</p>
                        </td>
                      </tr>
                      <tr
                        height="56px"
                        className={`bg-white text-[#54577A] text-sm font-medium`}
                      >
                        <td
                          className={`py-1 px-3 whitespace-nowrap capitalize !border-r-0`}
                        >
                          <p className="flex justify-end">Net Worth:</p>
                        </td>
                        <td
                          className={`py-1 px-3 whitespace-nowrap capitalize !border-r-0`}
                        >
                          <p>
                            Rs.{" "}
                            {total.assets +
                              total.investments -
                              total.liabilities}
                          </p>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
            {goals?.length > 0 ? (
              <div className="w-full px-[30px] py-[30px] bg-white rounded-md space-y-6">
                <div className="w-full md:flex justify-between space-y-4 md:space-y-0">
                  <h1 className="text-xl md:text-[26px] font-semibold text-[#45486A]">
                    Total Cost of Goals
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
                          Amount Required During Goal Period
                        </th>
                        <th className="py-2 px-3 text-[#57BA52] text-sm font-bold">
                          Projected Amount available
                        </th>
                        <th className="py-2 px-3 text-[#57BA52] text-sm font-bold">
                          % Goal Funded
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
                      ) : goals?.length === 0 ? (
                        <tr height="56px">
                          <td colSpan={7}>
                            <div className="w-full h-[40px] mt-5 flex justify-center items-center text-[#54577A] text-sm font-medium">
                              No Data Found
                            </div>
                          </td>
                        </tr>
                      ) : (
                        goals?.map((v, index) => (
                          <tr
                            height="56px"
                            className={`bg-white text-[#54577A] text-sm font-medium`}
                            key={index}
                          >
                            <td className={`py-1 px-3`}>{index + 1}</td>
                            <td
                              className={`py-1 px-3 capitalize whitespace-nowrap`}
                            >
                              {v?.type?.length
                                ? v?.type?.replace(/_/g, " ")
                                : "-"}
                            </td>
                            <td className={`py-1 px-3 capitalize`}>
                              {`Rs. ${v?.amount}`}
                            </td>
                            <td className={`py-1 px-3`}>0</td>
                            <td className={`py-1 px-3`}>0</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    <tfoot>
                      <tr
                        height="56px"
                        className={`bg-white text-[#54577A] text-sm font-medium`}
                      >
                        <td className={`py-1 px-3`}></td>
                        <td
                          className={`py-1 px-3 capitalize whitespace-nowrap`}
                        >
                          Total
                        </td>
                        <td className={`py-1 px-3 capitalize`}>
                          {`Rs. ${goals.reduce((a, b) => a + b.amount, 0)}`}
                        </td>
                        <td className={`py-1 px-3`}>0</td>
                        <td className={`py-1 px-3`}>0</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            ) : (
              <></>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export const getServerSideProps = async (ctx) => {
  let newcookies = ctx.req.headers.cookie;
  newcookies = cookie.parse(newcookies);
  let user = JSON.parse(newcookies?.user ?? "");
  let token = newcookies["access-token"];
  if (user?.dob === undefined || user?.dob?.length === 0) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: { user, token } };
};
