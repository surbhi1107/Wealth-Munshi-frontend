import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as cookie from "cookie";
import { toast, ToastContainer } from "react-toastify";

export default function Expenses(props) {
  const router = useRouter();
  let user = props.user;
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  let ignore = false;

  const getData = async () => {
    try {
      setLoading(true);
      let response = await fetch(`/api/user-expense/get-user-expense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let res1 = await response.json();
      if (res1?.data) {
        setLoading(false);
        let data = res1?.data?.filter((v) => v?.selected);
        setExpenses(data ?? []);
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
          <h1 className="text-xl md:text-[26px] font-semibold text-[#45486A]">
            Expense Sheets
          </h1>
          <div className="w-full md:!mt-3">
            <ul className="text-[#A1A1AA] space-y-3 list-outside text-justify">
              <li>
                An expense sheet represents your living expenses for a
                particular period of your life. Retirement living expenses will
                have been brought through from the goals section. Items marked
                "not set" need to be completed.
              </li>
              <li>Click on an expense sheet to edit it.</li>
              <li>
                Do not include committed savings or debt repayments as living
                expenses - these are entered in your own sections.
              </li>
            </ul>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center col-span-2 rounded-lg py-2">
            <Loading />
          </div>
        ) : (
          <>
            <div className="w-full px-[30px] py-[30px] bg-white rounded-md space-y-6">
              <div className="w-full overflow-x-scroll md:overflow-x-hidden max-w-7xl 2xl:max-w-none">
                <table className="table-auto overflow-scroll md:overflow-auto w-full text-left">
                  <thead className="rounded-lg text-base text-white font-semibold w-full">
                    <tr className="bg-white">
                      <th className="py-2 px-3 text-[#57BA52] text-sm font-bold">
                        Expense Sheet Name
                      </th>
                      <th className="py-2 px-3 text-[#57BA52] text-sm font-bold">
                        Description
                      </th>
                      <th className="py-2 px-3 text-[#57BA52] text-sm font-bold">
                        Action
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
                    ) : expenses?.length === 0 ? (
                      <tr height="56px">
                        <td colSpan={7}>
                          <div className="w-full h-[40px] mt-5 flex justify-center items-center text-[#54577A] text-sm font-medium">
                            No Data Found
                          </div>
                        </td>
                      </tr>
                    ) : (
                      expenses?.map((v, index) => (
                        <tr
                          height="56px"
                          className={`bg-white text-[#54577A] text-sm font-medium`}
                          key={index}
                        >
                          <td
                            className={`py-1 px-3 capitalize whitespace-nowrap`}
                          >
                            {v?.living_expense_type === "current"
                              ? "Current Living Expenses"
                              : v?.living_expense_type === "retire"
                              ? "Retirement Living Expenses"
                              : "Retirement Living Expenses - Sole Survivor"}
                          </td>
                          <td className={`py-1 px-3 capitalize`}>
                            {v?.amount > 0
                              ? `Rs. ${v?.amount} p.${v?.timeline?.charAt(
                                  0
                                )}. ${moment(v?.start_date).get(
                                  "year"
                                )} to ${moment(v?.end_date).get("year")}`
                              : `Not set ${moment(v?.start_date).get(
                                  "year"
                                )} to ${moment(v?.end_date).get("year")}`}
                          </td>
                          <td
                            className={`py-5 px-3 flex items-center justify-center space-x-3`}
                          >
                            <button
                              className="border rounded-[5px] border-[#E6E6EB] p-1 text-[#54577A]"
                              onClick={() => {
                                router.push({
                                  pathname: "/cash-flow/expenses/update/",
                                  query: { expenseId: v.living_expense_type },
                                });
                              }}
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M16.5217 7.09731C15.2449 8.37415 12.248 11.3704 11.5171 12.0989C11.3606 12.2552 11.1743 12.3786 10.9693 12.4617C10.3832 12.7049 8.95318 13.2659 8.53277 13.2941C8.40885 13.3024 8.28457 13.2842 8.16829 13.2405C8.05201 13.1968 7.94641 13.1288 7.85858 13.041C7.77075 12.9532 7.70273 12.8476 7.65907 12.7313C7.61542 12.615 7.59715 12.4907 7.60548 12.3668C7.6337 11.9464 8.19465 10.5176 8.43368 9.93385C8.51716 9.72665 8.64148 9.53867 8.79943 9.38132L13.8023 4.37788C14.0447 4.13591 14.3732 4 14.7157 4C15.0583 4 15.3868 4.13591 15.6292 4.37788L16.5217 5.27035C16.7637 5.51277 16.8996 5.8413 16.8996 6.18383C16.8996 6.52636 16.7637 6.85489 16.5217 7.09731ZM8.50815 12.3914C8.91895 12.3398 10.1195 11.8389 10.624 11.6293C10.7199 11.5916 10.807 11.5346 10.8798 11.4617L10.8804 11.4611C12.5496 9.79526 14.2176 8.12825 15.8845 6.4601C15.9208 6.42384 15.9496 6.38077 15.9693 6.33337C15.9889 6.28596 15.999 6.23515 15.999 6.18383C15.999 6.13251 15.9889 6.08169 15.9693 6.03429C15.9496 5.98688 15.9208 5.94382 15.8845 5.90756L14.992 5.0151C14.9558 4.97878 14.9127 4.94997 14.8653 4.93031C14.8179 4.91065 14.7671 4.90053 14.7157 4.90053C14.6644 4.90053 14.6136 4.91065 14.5662 4.93031C14.5188 4.94997 14.4757 4.97878 14.4395 5.0151L9.43605 10.0185C9.36401 10.0902 9.30739 10.1758 9.26969 10.2702L9.26848 10.2726C9.06128 10.7783 8.5598 11.98 8.50815 12.3914Z"
                                  fill="#54577A"
                                  stroke="#54577A"
                                  strokeWidth="0.3"
                                />
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M15.3315 7.64973C15.3734 7.69157 15.4065 7.74124 15.4292 7.79591C15.4518 7.85057 15.4635 7.90917 15.4635 7.96834C15.4635 8.02751 15.4518 8.0861 15.4292 8.14077C15.4065 8.19543 15.3734 8.2451 15.3315 8.28694C15.2897 8.32878 15.24 8.36197 15.1853 8.38462C15.1307 8.40726 15.0721 8.41892 15.0129 8.41892C14.9537 8.41892 14.8951 8.40726 14.8405 8.38462C14.7858 8.36197 14.7361 8.32878 14.6943 8.28694L12.6121 6.20473C12.5276 6.12023 12.4801 6.00563 12.4801 5.88613C12.4801 5.76663 12.5276 5.65202 12.6121 5.56752C12.6966 5.48302 12.8112 5.43555 12.9307 5.43555C13.0502 5.43555 13.1648 5.48302 13.2493 5.56752L15.3315 7.64973ZM11.6554 11.3259C11.6972 11.3677 11.7303 11.4173 11.7529 11.4719C11.7756 11.5265 11.7872 11.5851 11.7872 11.6442C11.7872 11.7033 11.7756 11.7618 11.7529 11.8165C11.7303 11.8711 11.6972 11.9207 11.6554 11.9625C11.6136 12.0043 11.5639 12.0375 11.5093 12.0601C11.4547 12.0827 11.3962 12.0943 11.3371 12.0943C11.2779 12.0943 11.2194 12.0827 11.1648 12.0601C11.1102 12.0375 11.0605 12.0043 11.0187 11.9625L8.93654 9.88028C8.89473 9.83848 8.86158 9.78886 8.83895 9.73424C8.81633 9.67963 8.80469 9.62109 8.80469 9.56198C8.80469 9.50286 8.81633 9.44432 8.83895 9.38971C8.86158 9.33509 8.89473 9.28547 8.93654 9.24367C8.97834 9.20187 9.02796 9.16871 9.08258 9.14609C9.13719 9.12347 9.19573 9.11182 9.25484 9.11182C9.31396 9.11182 9.37249 9.12347 9.42711 9.14609C9.48172 9.16871 9.53135 9.20187 9.57315 9.24367L11.6554 11.3259Z"
                                  fill="#54577A"
                                  stroke="#54577A"
                                  strokeWidth="0.3"
                                />
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M8.35421 5.18945C8.47367 5.18945 8.58824 5.23691 8.67271 5.32138C8.75718 5.40586 8.80464 5.52043 8.80464 5.63989C8.80464 5.75935 8.75718 5.87392 8.67271 5.95839C8.58824 6.04287 8.47367 6.09032 8.35421 6.09032H6.25218C5.89379 6.09032 5.55008 6.23269 5.29666 6.48611C5.04324 6.73953 4.90087 7.08324 4.90087 7.44163V14.6486C4.90087 15.007 5.04324 15.3507 5.29666 15.6041C5.55008 15.8575 5.89379 15.9999 6.25218 15.9999H14.0597C14.4181 15.9999 14.7618 15.8575 15.0152 15.6041C15.2687 15.3507 15.411 15.007 15.411 14.6486V12.5466C15.411 12.4271 15.4585 12.3125 15.543 12.2281C15.6274 12.1436 15.742 12.0961 15.8615 12.0961C15.9809 12.0961 16.0955 12.1436 16.18 12.2281C16.2644 12.3125 16.3119 12.4271 16.3119 12.5466V14.6486C16.3116 15.2458 16.0742 15.8185 15.6519 16.2408C15.2296 16.6631 14.6569 16.9004 14.0597 16.9008H6.25218C5.65496 16.9004 5.08229 16.6631 4.66 16.2408C4.2377 15.8185 4.00032 15.2458 4 14.6486V7.44163C4 6.84431 4.23728 6.27146 4.65965 5.8491C5.08201 5.42674 5.65486 5.18945 6.25218 5.18945H8.35421Z"
                                  fill="#54577A"
                                  stroke="#54577A"
                                  strokeWidth="0.3"
                                />
                              </svg>
                            </button>
                            {v?.living_expense_type === "current" ||
                            v?.living_expense_type === "retire" ? (
                              <></>
                            ) : (
                              <>
                                <button
                                  className="border rounded-[5px] border-[#E6E6EB] p-1 text-[#54577A]"
                                  onClick={() => {
                                    // deletecontact(v?._id);
                                    console.log("delllll");
                                  }}
                                >
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M5.62533 6.45801L6.32628 14.5191C6.40118 15.3803 7.12218 16.0413 7.98668 16.0413H12.014C12.8785 16.0413 13.5995 15.3803 13.6743 14.5191L14.3753 6.45801M8.12533 6.24967V5.62467C8.12533 4.7042 8.87149 3.95801 9.79199 3.95801H10.2087C11.1292 3.95801 11.8753 4.7042 11.8753 5.62467V6.24967M4.16699 6.45801H15.8337"
                                      stroke="#54577A"
                                      strokeWidth="1.25"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
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
