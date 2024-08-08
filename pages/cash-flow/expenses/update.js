import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as cookie from "cookie";
import { toast, ToastContainer } from "react-toastify";
import RadioInput from "@/components/RadioInput";
import * as Yup from "yup";
import { useFormik } from "formik";
import jsonData from "../../../data.json";
import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";

export default function UpdateExpenses(props) {
  const router = useRouter();
  let expenseId = props.expenseId;
  let user = props.user;
  let timelineLists = jsonData?.timeline ?? [];
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedexpense, setSelectedexpense] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  let ignore = false;

  const {
    values,
    errors,
    touched,
    handleChange,
    setFieldValue,
    setValues,
    handleSubmit,
  } = useFormik({
    initialValues: {
      amount: "",
      inflation: "",
      timeline: {
        label: "",
        value: 0,
      },
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .positive("Enter positive amount")
        .required("Amount is required"),
      inflation: Yup.string().required("Inflation is required"),
      timeline: Yup.object({
        label: Yup.string(),
        value: Yup.string(),
      }),
    }),
    onSubmit: async (values) => {
      try {
        // setUpdateLoading(true);
        let data = {
          partnerId: partnerId,
          details: {
            fname: values.fname,
            mname: values.mname,
            lname: values.lname,
            dob: values.dob,
            age_retire: values.age_retire?.value,
            life_expectancy: values.life_expectancy?.value,
            gender: values.gender.value,
          },
        };
        // const res = await fetch(`/api/partner/update`, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ ...data }),
        // });
        // let res1 = await res.json();
        // if (res1.success) {
        //   router.push("/");
        //   setUpdateLoading(false);
        // } else {
        //   setUpdateLoading(false);
        //   errorToast(res1.error);
        // }
      } catch (error) {
        console.error(error);
        setUpdateLoading(false);
        errorToast(
          error.response ? error.response.data.error : "An error occurred"
        );
      }
    },
  });

  const errorToast = (msg) => {
    toast.error(msg, {
      position: "top-right",
    });
  };

  const getData = async () => {
    try {
      setLoading(true);
      let response = await fetch(`/api/user-expense/get-user-expense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          living_type: expenseId,
        }),
      });
      let res1 = await response.json();
      if (res1?.data) {
        setLoading(false);
        let data = res1?.data?.map((v) => {
          return {
            ...v,
            name:
              v?.type === "estimated"
                ? "Set amount via estimated total"
                : "Set amount via expense breakdown",
            value: v?.type,
          };
        });
        let findselectedexpense = data?.find((v) => v?.selected);
        setSelectedexpense(findselectedexpense);
        setExpenses(data ?? []);
        let findtime = timelineLists?.find(
          (v) => v.value === findselectedexpense?.timeline
        );
        setValues({
          amount: findselectedexpense?.amount,
          inflation: findselectedexpense?.inflation,
          timeline: {
            label: findtime?.label,
            value: findtime?.value,
          },
        });
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
                Expenses can be entered as an estimated total on either an
                annual, monthly, fortnightly or weekly basis.
              </li>
              <li>
                Alternatively, select "Set amount via expense breakdown" to go
                into more detail. This option allows you to enter and calculate
                your annual budget.
              </li>
              <li>
                By default, all expenses are assumed to start now and continue
                until the first person retires. To over ride this for a
                particular expense, click "More...". This will complete control
                over the timing of this expense.
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
              <RadioInput
                data={expenses}
                value={selectedexpense?.value}
                onchange={(v) => {
                  let findtime = timelineLists?.find(
                    (v) => v.value === v?.timeline
                  );
                  setSelectedexpense(v);
                  setValues({
                    amount: v?.amount,
                    inflation: v?.inflation,
                    timeline: {
                      label: findtime?.label,
                      value: findtime?.value,
                    },
                  });
                }}
              />
              <div className="">
                <h1 className="text-xl md:text-[26px] font-semibold text-[#45486A]">
                  Living Expenses
                </h1>
                <div className="w-full mt-6 flex items-center space-x-3">
                  <div className="flex justify-center items-center w-9 h-9 bg-[#57BA52] rounded-full">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 36 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.9453 5.83594C16.9453 5.25347 17.4175 4.78125 18 4.78125C18.5825 4.78125 19.0547 5.25347 19.0547 5.83594V6.46875H24.3281V4.21875C24.3281 1.89253 22.4356 0 20.1094 0H15.8906C13.5644 0 11.6719 1.89253 11.6719 4.21875V6.46875H16.9453V5.83594ZM18 18.3516C21.4893 18.3516 24.3281 15.5128 24.3281 12.0234V8.57812H11.6719V12.0234C11.6719 15.5128 14.5107 18.3516 18 18.3516ZM28.125 8.57812H24.3281V6.46875H28.125C28.7075 6.46875 29.1797 6.94097 29.1797 7.52344C29.1797 8.10591 28.7075 8.57812 28.125 8.57812ZM18 20.4609C16.5217 20.4609 15.1314 20.0784 13.9219 19.4077V20.4737L13.0563 20.6819C14.3539 22.2956 16.1113 23.2031 18 23.2031C19.8887 23.2031 21.6461 22.2956 22.9437 20.6819L22.0781 20.4737V19.4077C20.8686 20.0784 19.4783 20.4609 18 20.4609Z"
                        fill="white"
                      />
                      <path
                        d="M18 31.5C18.9708 31.5 19.7578 31.0908 19.7578 30.5859C19.7578 30.0811 18.9708 29.6719 18 29.6719C17.0292 29.6719 16.2422 30.0811 16.2422 30.5859C16.2422 31.0908 17.0292 31.5 18 31.5Z"
                        fill="white"
                      />
                      <path
                        d="M28.4671 22.0109L25.1627 21.2158C23.4603 23.7871 20.804 25.3126 18 25.3126C15.196 25.3126 12.5397 23.7871 10.8373 21.2159L7.53286 22.011C5.78855 22.4307 4.57031 23.9768 4.57031 25.7709V34.9454C4.57031 35.5279 5.04253 36.0001 5.625 36.0001H8.92969V32.2032C8.92969 31.6207 9.40191 31.1485 9.98438 31.1485C10.5668 31.1485 11.0391 31.6207 11.0391 32.2032V36.0001H24.9609V32.2032C24.9609 31.6207 25.4332 31.1485 26.0156 31.1485C26.5981 31.1485 27.0703 31.6207 27.0703 32.2032V36.0001H30.375C30.9575 36.0001 31.4297 35.5279 31.4297 34.9454V25.7709C31.4297 23.9768 30.2115 22.4307 28.4671 22.0109ZM18 33.6095C15.8315 33.6095 14.1328 32.2814 14.1328 30.586C14.1328 28.8906 15.8315 27.5626 18 27.5626C20.1685 27.5626 21.8672 28.8906 21.8672 30.586C21.8672 32.2814 20.1685 33.6095 18 33.6095Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <p className="text-[15px] capitalize font-semibold text-[#45486A]">
                    {expenseId === "current"
                      ? `Current Living Expenses`
                      : expenseId === "current"
                      ? `Retirement Living Expenses`
                      : `Retirement Living Expenses - Sole Survivor`}
                  </p>
                </div>
                <form
                  className="!mt-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <div className="md:grid md:grid-cols-2 gap-x-8 gap-y-3">
                    <div className="flex space-x-8 col-span-2">
                      <Input
                        label={"Amount"}
                        value={values.amount}
                        id="amount"
                        keytype="number"
                        min={1}
                        mainClass="w-max"
                        onchange={handleChange}
                        error={touched.amount && errors.amount ? true : false}
                        errorText={errors.amount}
                        require
                        requireClass="text-[#54577A]"
                      />
                      <Dropdown
                        label={"timeline"}
                        labelClass="invisible"
                        options={timelineLists}
                        value={values?.timeline}
                        onchange={(e) => {
                          let val = e.target.value;
                          let dummyfind = timelineLists?.find(
                            (v) => v.value === val
                          );
                          setFieldValue("timeline", {
                            ...dummyfind,
                          });
                        }}
                        mainClass="w-max"
                        error={
                          touched.timeline?.value && errors.timeline?.value
                            ? true
                            : false
                        }
                        errorText={errors.timeline?.value}
                        require
                        requireClass="text-[#54577A]"
                      />
                    </div>
                    <Input
                      label={"Inflation %"}
                      value={values.inflation}
                      id="inflation"
                      onchange={handleChange}
                      error={
                        touched.inflation && errors.inflation ? true : false
                      }
                      errorText={errors.inflation}
                      require
                      requireClass="text-[#54577A]"
                    />
                  </div>
                  <div className="mt-10">
                    <div className="grid grid-cols-2 gap-5">
                      {updateLoading ? (
                        <div className="flex justify-center items-center col-span-2 rounded-lg py-2">
                          <Loading />
                        </div>
                      ) : (
                        <>
                          <button
                            type="submit"
                            className="w-full border border-[#999999] hover:border-[#57BA52] rounded-lg py-2 bg-transparent px-5 font-medium capitalize text-[#999999] hover:text-[#57BA52]"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              router.push({
                                pathname: "/cash-flow/expenses",
                              });
                            }}
                            className="w-full border border-[#999999] hover:border-[#57BA52] rounded-lg py-2 bg-transparent px-5 font-medium capitalize text-[#999999] hover:text-[#57BA52]"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </form>
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
  if (user?.dob === undefined || user?.dob?.length === 0) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  if (!ctx?.query?.expenseId) {
    return {
      redirect: {
        destination: "/cash-flow/expenses",
        permanent: false,
      },
    };
  }
  let expenseId = ctx?.query?.expenseId;
  return { props: { user, expenseId } };
};
