import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import { useRouter } from "next/router";
import { use, useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import Input from "@/components/Input";
import * as cookie from "cookie";
import Dropdown from "@/components/Dropdown";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import jsonData from "../../../data.json";
import { getAge } from "@/pages/goals/add";
import PopUp from "@/components/Popup";
import { Checkbox } from "@headlessui/react";

export default function AddDept(props) {
  const router = useRouter();
  let user = props.user;
  let retireagelist = jsonData?.retire_ages ?? [];
  let timelineLists = jsonData?.timeline ?? [];
  let lifeOccurences = jsonData?.occurences ?? [];
  let lifeExpectancylist = jsonData?.life_expectation ?? [];
  const [addLoading, setAddLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [startTime, setStartTime] = useState([
    {
      date: "",
      member: {
        _id: "",
        name: "",
        dob: "",
      },
      value: "",
      type: "now",
      desc: "",
    },
    {
      date: "",
      member: {
        _id: "",
        name: "",
        dob: "",
      },
      value: "",
      type: "year",
      desc: "",
    },
    {
      date: "",
      member: {
        _id: "",
        name: "",
        dob: "",
      },
      value: "",
      type: "age",
      desc: "",
    },
    {
      date: "",
      member: {
        _id: "",
        name: "",
        dob: "",
      },
      value: "",
      type: "age_retire",
      desc: "",
    },
    {
      date: "",
      member: {
        _id: "",
        name: "",
        dob: "",
      },
      value: "",
      type: "life_exp",
      desc: "",
    },
  ]);
  const [endTime, setEndTime] = useState([
    {
      date: "",
      member: {
        _id: "",
        name: "",
        dob: "",
      },
      value: "",
      type: "year",
      desc: "",
    },
    {
      date: "",
      member: {
        _id: "",
        name: "",
        dob: "",
      },
      value: "",
      type: "age",
      desc: "",
    },
    {
      date: "",
      member: {
        _id: "",
        name: "",
        dob: "",
      },
      value: "",
      type: "age_retire",
      desc: "",
    },
    {
      date: "",
      member: {
        _id: "",
        name: "",
        dob: "",
      },
      value: "",
      type: "life_exp",
      desc: "",
    },
    {
      date: "",
      member: {
        _id: "",
        name: "",
        dob: "",
      },
      value: "",
      type: "afteryear",
      desc: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState([]);
  const [ages, setAges] = useState([]);
  const [members, setMembers] = useState([]);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
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
      type: props.state.value,
      name: "",
      curr_amount: 0,
      owner: {
        label: "",
        value: "",
      },
      interest: 0,
      payments: [
        {
          type: "",
          name: "",
          amount: 0,
          timeline: {
            label: "",
            value: "",
          },
          inflation: 0,
          isin_cashflow: false,
          next_payment_start: {
            type: "year",
            value: "",
            date: "",
            member: {
              _id: "",
              name: "",
              dob: "",
              life_expectancy: "",
              age_retire: "",
            },
            desc: "",
          },
          next_payment_end: {
            type: "year",
            value: "",
            date: "",
            member: {
              _id: "",
              name: "",
              dob: "",
              life_expectancy: "",
              age_retire: "",
            },
            desc: "",
          },
        },
      ],
    },
    validationSchema: Yup.object().shape({
      type: Yup.string(),
      name: Yup.string(),
      curr_amount: Yup.number()
        .positive("Enter positive current amount")
        .required("current amount is required"),
      interest: Yup.number()
        .positive("Enter positive Interest")
        .required("interest is required"),
      owner: Yup.object({
        value: Yup.string().required("owner is required"),
        label: Yup.string(),
      }),
      payments: Yup.array().of(
        Yup.object({
          type: Yup.string(),
          name: Yup.string(),
          amount: Yup.number()
            .positive("Enter positive amount")
            .required("Amount is required"),
          timeline: Yup.object({
            label: Yup.string(),
            value: Yup.string(),
          }),
          inflation: Yup.string().required("Inflation is required"),
          isin_cashflow: Yup.bool(),
          next_payment_start: Yup.object({
            date: Yup.string(),
            type: Yup.string(),
            desc: Yup.string(),
            member: Yup.object({
              _id: Yup.string(),
              name: Yup.string(),
              age_retire: Yup.number(),
              life_expectancy: Yup.number(),
              dob: Yup.string(),
            }),
          }),
          next_payment_end: Yup.object({
            date: Yup.string(),
            type: Yup.string(),
            desc: Yup.string(),
            member: Yup.object({
              _id: Yup.string(),
              name: Yup.string(),
              age_retire: Yup.number(),
              life_expectancy: Yup.number(),
              dob: Yup.string(),
            }),
          }),
        })
      ),
    }),
    onSubmit: async (values) => {
      try {
        setAddLoading(true);
        let data = {
          type: values.type,
          name: values.name,
          curr_amount: values.curr_amount,
          owner: values.owner?.value,
          interest: values.interest,
          ...(values.payments?.length >= 1
            ? {
                payment_details: values.payments?.map((v) => {
                  return {
                    type: v?.type,
                    name: v?.name,
                    amount: (v?.amount).toFixed(2),
                    timeline: v?.timeline?.value,
                    inflation: (v?.inflation).toFixed(2),
                    next_payment_start: {
                      type: v?.next_payment_start?.type,
                      value: v?.next_payment_start?.value,
                      date: v?.next_payment_start?.date,
                      ...(v?.next_payment_start?.type !== "year"
                        ? { member: v?.next_payment_start?.member }
                        : {}),
                      desc: v?.next_payment_start?.desc,
                    },
                    next_payment_end: {
                      type: v?.next_payment_end?.type,
                      value: v?.next_payment_end?.value,
                      date: v?.next_payment_end?.date,
                      ...(v?.next_payment_end?.type !== "year" ||
                      v?.next_payment_end?.type !== "afteryear"
                        ? { member: v?.next_payment_end?.member }
                        : {}),
                      desc: v?.next_payment_end?.desc,
                    },
                    isin_cashflow: v?.isin_cashflow,
                  };
                }),
              }
            : {}),
        };
        const res = await fetch(`/api/debt/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data }),
        });
        let res1 = await res.json();
        if (res1.success) {
          successToast(res1?.msg);
          router.push("/resources/debt");
          setAddLoading(false);
        } else {
          setAddLoading(false);
          errorToast(res1.error);
        }
      } catch (error) {
        console.log(error);
        setAddLoading(false);
        errorToast(
          error.response ? error.response.data.error : "An error occurred"
        );
      }
    },
  });

  const getmembers = async () => {
    setLoading(true);
    let response = await fetch(`/api/family-member/all-members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let res1 = await response.json();
    if (res1?.success) {
      setLoading(false);
      let dummymembers = res1?.data?.map((v) => {
        return {
          label: v?.fname,
          value: v?._id,
          dob: v?.dob,
          age_retire: v?.age_retire,
          life_expectancy: v?.life_expectancy,
          type: v?.type,
        };
      });
      setMembers(dummymembers);
      setSelectedId(0);
      setFieldValue("payments", []);
    } else {
      setLoading(false);
      setMembers([]);
    }
  };

  const successToast = (msg) => {
    toast.success(msg, {
      position: "top-right",
    });
  };

  const errorToast = (msg) => {
    toast.error(msg, {
      position: "top-right",
    });
  };

  const getYears = () => {
    let currentYear = new Date().getFullYear();
    //get last 110 year of list
    let damiyears = [];
    for (var i = currentYear + 1; i <= currentYear + 80; i++) {
      damiyears.push({ label: i, value: i });
    }
    setYears(damiyears);
  };

  useEffect(() => {
    if (!ignore) {
      setLoading(true);
      getYears();
      let dummylifeexpectancy = [];
      let dummyage = [];
      for (let i = 50; i <= 100; i++) {
        dummylifeexpectancy = [
          ...dummylifeexpectancy,
          { label: `${i}`, value: i },
        ];
      }
      for (let i = 1; i <= 100; i++) {
        dummyage = [...dummyage, { label: `${i}`, value: i }];
      }
      setAges(dummyage);
      if (dummyage?.length > 0) getmembers();
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
            Add New Liability
          </h1>
          <div className="w-full flex items-center space-x-3">
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
              {values.type?.replace(/_/g, " ")}
            </p>
          </div>
          <p className="text-base text-[#A1A1AA] !mt-3">
            Please confirm that your details are current and click Save.
          </p>
          {loading ? (
            <div className="flex justify-center items-center py-2">
              <Loading />
            </div>
          ) : (
            <form
              className="!mt-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="md:grid md:grid-cols-2 gap-x-8 gap-y-3">
                <Input
                  label={"Name"}
                  value={values.name}
                  id="name"
                  onchange={handleChange}
                  error={touched.name && errors.name ? true : false}
                  errorText={errors.name}
                />
                <Input
                  label={"Current Amount"}
                  value={values.curr_amount}
                  id="curr_amount"
                  keytype="number"
                  min={1}
                  onchange={handleChange}
                  error={
                    touched.curr_amount && errors.curr_amount ? true : false
                  }
                  errorText={errors.curr_amount}
                  require
                  requireClass="text-[#54577A]"
                />
                <Input
                  label={"Annual Interest Rate %"}
                  value={values.interest}
                  id="interest"
                  onchange={handleChange}
                  error={touched.interest && errors.interest ? true : false}
                  errorText={errors.interest}
                  require
                  requireClass="text-[#54577A]"
                />
                <Dropdown
                  placeholder="-Not Set-"
                  label={"Who is this owner of this liability?"}
                  options={members}
                  value={values.owner}
                  onchange={(e) => {
                    let val = e.target.value;
                    let dummymember = members?.find((v) => v.value === val);
                    setFieldValue("owner", {
                      ...dummymember,
                    });
                  }}
                  error={
                    touched.owner?.value && errors.owner?.value ? true : false
                  }
                  errorText={errors.owner?.value}
                  require
                  requireClass="text-[#54577A]"
                />
                <div className="col-span-2">
                  <h3 className="text-[20px] font-semibold text-[#45486A] mb-2">
                    Repayments
                  </h3>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        let findmain = members?.find((v) => v.type === "self");
                        let dummystart = [...startTime];
                        let newary = [];
                        let yearDate = new Date().getFullYear();
                        let age = 50;
                        let age_retire = findmain?.age_retire;
                        let life_expectancy = findmain?.life_expectancy;
                        dummystart.map((v) => {
                          let newdate =
                            v?.type === "year"
                              ? moment(new Date()).startOf("y").format()
                              : getAge(
                                  findmain?.dob,
                                  v?.type === "age"
                                    ? age
                                    : v?.type === "age_retire"
                                    ? age_retire
                                    : life_expectancy
                                );
                          let obj = {
                            member: {
                              _id: findmain?.value,
                              name: findmain?.label,
                              dob: findmain?.dob,
                              age_retire: findmain?.age_retire,
                              life_expectancy: findmain?.life_expectancy,
                            },
                            type: v.type,
                            value:
                              v?.type === "year"
                                ? yearDate
                                : v?.type === "age"
                                ? age
                                : v?.type === "age_retire"
                                ? 0
                                : 0,
                            date: newdate,
                            desc:
                              v?.type === "year"
                                ? `In ${yearDate}`
                                : v?.type === "age"
                                ? `When ${findmain?.label} is ${age} (${moment(
                                    newdate
                                  ).get("year")})`
                                : v?.type === "age_retire"
                                ? `When ${
                                    findmain?.label
                                  } retires ${age_retire} (${moment(
                                    newdate
                                  ).get("year")})`
                                : `When ${
                                    findmain?.label
                                  } retires ${life_expectancy} (${moment(
                                    newdate
                                  ).get("year")})`,
                          };
                          newary.push(obj);
                        });
                        let dummyoccurence = {
                          member: {
                            _id: findmain?.value,
                            name: findmain?.label,
                            dob: findmain?.dob,
                            age_retire: findmain?.age_retire,
                            life_expectancy: findmain?.life_expectancy,
                          },
                          type: "afteryear",
                          value: 2,
                          date: getAge(new Date().toISOString(), 2),
                          desc: `After 2 years`,
                        };
                        let defaultstart = newary.find(
                          (v) => v.type === "year"
                        );
                        setValues({
                          ...values,
                          payments: [
                            ...values.payments,
                            {
                              type: "oneoff",
                              name: "",
                              amount: 0,
                              timeline: {
                                ...timelineLists[0],
                              },
                              inflation: 0,
                              isin_cashflow: false,
                              next_payment_start: {
                                ...defaultstart,
                              },
                              next_payment_end: {
                                ...defaultstart,
                              },
                            },
                          ],
                        });
                        setStartTime(newary);
                        setEndTime([...newary, dummyoccurence]);
                        setSelectedId(values.payments?.length);
                        setOpenPopUp(true);
                      }}
                      className="text-[#999999] border border-[#999999] rounded-lg py-2 bg-transparent px-5 font-medium"
                    >
                      Add one-off repayment
                    </button>
                    <button
                      onClick={() => {
                        let findmain = members?.find((v) => v.type === "self");
                        let dummystart = [...startTime];
                        let newary = [];
                        let yearDate = new Date().getFullYear();
                        let age = 50;
                        let age_retire = findmain?.age_retire;
                        let life_expectancy = findmain?.life_expectancy;
                        dummystart.map((v) => {
                          let newdate =
                            v?.type === "year"
                              ? moment(new Date()).startOf("y").format()
                              : getAge(
                                  findmain?.dob,
                                  v?.type === "age"
                                    ? age
                                    : v?.type === "age_retire"
                                    ? age_retire
                                    : life_expectancy
                                );
                          let obj = {
                            member: {
                              _id: findmain?.value,
                              name: findmain?.label,
                              dob: findmain?.dob,
                              age_retire: findmain?.age_retire,
                              life_expectancy: findmain?.life_expectancy,
                            },
                            type: v.type,
                            value:
                              v?.type === "year"
                                ? yearDate
                                : v?.type === "age"
                                ? age
                                : v?.type === "age_retire"
                                ? 0
                                : 0,
                            date: newdate,
                            desc:
                              v?.type === "year"
                                ? `In ${yearDate}`
                                : v?.type === "age"
                                ? `When ${findmain?.label} is ${age} (${moment(
                                    newdate
                                  ).get("year")})`
                                : v?.type === "age_retire"
                                ? `When ${
                                    findmain?.label
                                  } retires ${age_retire} (${moment(
                                    newdate
                                  ).get("year")})`
                                : `When ${
                                    findmain?.label
                                  } retires ${life_expectancy} (${moment(
                                    newdate
                                  ).get("year")})`,
                          };
                          newary.push(obj);
                        });
                        let dummyoccurence = {
                          member: {
                            _id: findmain?.value,
                            name: findmain?.label,
                            dob: findmain?.dob,
                            age_retire: findmain?.age_retire,
                            life_expectancy: findmain?.life_expectancy,
                          },
                          type: "afteryear",
                          value: 2,
                          date: getAge(new Date().toISOString(), 2),
                          desc: `After 2 years`,
                        };
                        let defaultstart = newary.find(
                          (v) => v.type === "year"
                        );
                        setValues({
                          ...values,
                          payments: [
                            ...values.payments,
                            {
                              type: "regular",
                              name: "",
                              amount: 0,
                              timeline: {
                                ...timelineLists[0],
                              },
                              inflation: 0,
                              isin_cashflow: false,
                              next_payment_start: {
                                ...defaultstart,
                              },
                              next_payment_end: {
                                ...defaultstart,
                              },
                            },
                          ],
                        });
                        setStartTime(newary);
                        setEndTime([...newary, dummyoccurence]);
                        setSelectedId(values.payments?.length);
                        setOpenPopUp(true);
                      }}
                      className="text-[#999999] border border-[#999999] rounded-lg py-2 bg-transparent px-5 font-medium"
                    >
                      Add regular repayment
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full overflow-x-scroll md:overflow-auto max-w-7xl 2xl:max-w-none my-5">
                <table className="table-auto overflow-scroll md:overflow-auto w-full text-left">
                  <thead className="rounded-lg text-base text-white font-semibold w-full">
                    <tr className="bg-white">
                      <th className="py-2 px-3 text-[#57BA52] text-sm font-bold whitespace-nowrap"></th>
                      <th className="py-2 px-3 text-[#57BA52] text-sm font-bold whitespace-nowrap">
                        Debt Repayments
                      </th>
                      <th className="py-2 px-3 text-[#57BA52] text-sm font-bold whitespace-nowrap">
                        Amount
                      </th>
                      <th className="py-2 px-3 text-[#57BA52] text-sm font-bold whitespace-nowrap">
                        Description
                      </th>
                      <th className="py-2 px-3 text-[#57BA52] text-sm font-bold whitespace-nowrap">
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
                    ) : values.payments?.length === 0 ? (
                      <tr height="56px">
                        <td colSpan={7}>
                          <div className="w-full h-[40px] mt-5 flex justify-center items-center text-[#54577A] text-sm font-medium">
                            No Data Found
                          </div>
                        </td>
                      </tr>
                    ) : (
                      values.payments?.map((v, index) => (
                        <tr
                          height="56px"
                          className={`bg-white text-[#54577A] text-sm font-medium`}
                          key={index}
                        >
                          <td className={`py-1 px-3 whitespace-nowrap`}>
                            {`${v.isin_cashflow ? "C" : ""}`}
                          </td>
                          <td className={`py-5 px-3 whitespace-nowrap`}>
                            {"Repayment"}
                          </td>
                          <td className={`py-5 px-3 whitespace-nowrap`}>
                            {`Rs. ${v?.amount}`}
                          </td>
                          <td className={`py-5 px-3 whitespace-nowrap`}>
                            {v.next_payment_start?.desc}
                          </td>
                          <td
                            className={`py-5 px-3 flex items-center justify-center space-x-3`}
                          >
                            <button
                              type="button"
                              className={`border rounded-[5px] border-[#E6E6EB] p-1 text-[#54577A]`}
                              onClick={() => {
                                setSelectedId(index);
                                setIsEdit(true);
                                setOpenPopUp(true);
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
                            <button
                              type="button"
                              className={`${
                                v?.type === "main_client" ? "invisible" : ""
                              } border rounded-[5px] border-[#E6E6EB] p-1 text-[#54577A]`}
                              onClick={() => {
                                let damiary = [...values.payments];
                                damiary = damiary.filter((v, i) => i !== index);
                                setFieldValue("payments", damiary);
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
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-10">
                <div className="grid grid-cols-2 gap-5">
                  {addLoading ? (
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
                        onClick={() => {
                          router.push({
                            pathname: "/resources/debt",
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
          )}
        </div>
      </div>

      <PopUp
        isOpen={openPopUp}
        closePopUp={() => setOpenPopUp(false)}
        title={"Repayment Details"}
        isClose
      >
        <div className="md:grid md:grid-cols-2 gap-x-8 gap-y-3">
          <Input
            label={"Name"}
            value={values.payments?.[selectedId]?.name}
            id="name"
            onchange={(e) => {
              let val = e.target.value;
              setFieldValue(`payments.[${selectedId}].name`, val);
            }}
            error={
              touched.payments?.[selectedId]?.name &&
              errors.payments?.[selectedId]?.name
                ? true
                : false
            }
            errorText={errors.payments?.[selectedId]?.name}
          />
          <div></div>
          <div className="md:flex md:col-span-2 items-center md:gap-x-8 gap-y-3">
            <Input
              label={"Amount"}
              value={values.payments?.[selectedId]?.amount}
              id="amount"
              keytype="number"
              min={1}
              onchange={(e) => {
                let val = e.target.value;
                val = val?.length > 0 ? parseInt(val) : "";
                setFieldValue(`payments.[${selectedId}].amount`, val);
              }}
              error={
                touched.payments?.[selectedId]?.amount &&
                errors.payments?.[selectedId]?.amount
                  ? true
                  : false
              }
              errorText={errors.payments?.[selectedId]?.amount}
              require
              requireClass="text-[#54577A]"
              mainClass="w-max"
            />
            {values.payments?.[selectedId]?.inflation === "regular" ? (
              <Dropdown
                label={"timeline"}
                labelClass="invisible"
                options={timelineLists}
                value={values.payments?.[selectedId]?.timeline}
                onchange={(e) => {
                  let val = e.target.value;
                  let dummyfind = timelineLists?.find((v) => v.value === val);
                  setFieldValue(`payments.[${selectedId}].timeline`, {
                    ...dummyfind,
                  });
                }}
                mainClass="w-max"
                error={
                  touched.income_owner?.value && errors.income_owner?.value
                    ? true
                    : false
                }
                errorText={errors.income_owner?.value}
                require
                requireClass="text-[#54577A]"
              />
            ) : (
              <></>
            )}
          </div>
          <Input
            label={"Inflation %"}
            value={values.payments?.[selectedId]?.inflation}
            id="inflation"
            onchange={(e) => {
              let val = e.target.value;
              val = val?.length > 0 ? parseInt(val) : "";
              setFieldValue(`payments.[${selectedId}].inflation`, val);
            }}
            error={
              touched.payments?.[selectedId]?.inflation &&
              errors.payments?.[selectedId]?.inflation
                ? true
                : false
            }
            errorText={errors.payments?.[selectedId]?.inflation}
            require
            requireClass="text-[#54577A]"
          />
          <div></div>
          <div className="col-span-2 flex items-center gap-2">
            <Checkbox
              checked={values.payments?.[selectedId]?.isin_cashflow}
              id="isin_cashflow"
              onChange={(e) => {
                setFieldValue(`payments.[${selectedId}].isin_cashflow`, e);
              }}
              className="cursor-pointer group block size-4 rounded border border-[#757575] data-[checked]:border-none bg-white data-[checked]:bg-[#57BA52] focus-within:outline-none"
            >
              <svg
                className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M3 8L6 11L11 3.5"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Checkbox>
            <label className="text-[#686677] text-base">
              Exclude from Cash Flow
            </label>
          </div>
          <div className="col-span-2">
            <label
              className={`w-full text-base font-medium col-span-2 leading-tight text-[#9794AA]`}
            >
              When does this repayment start?{" "}
              <span className={`text-red-600`}>*</span>
            </label>
            <div className="w-full mt-3 space-y-2">
              {/* year */}
              <div className="flex gap-2 items-center">
                <span className="relative flex items-center rounded-full cursor-pointer">
                  <input
                    id={"year"}
                    checked={
                      values.payments?.[selectedId]?.next_payment_start
                        ?.type === "year"
                        ? true
                        : false
                    }
                    onChange={() => {
                      let findtype = startTime.find((v) => v.type === "year");
                      setFieldValue(
                        `payments.[${selectedId}].next_payment_start`,
                        findtype
                      );
                    }}
                    name="start_timeline"
                    type="radio"
                    className="before:content[''] peer relative -gray h-4 w-4 cursor-pointer appearance-none rounded-full border border-[#757575] before:absolute before:top-2/4 before:left-2/4 before:block before:h-[17px] before:w-[17px] before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-[#57BA52] before:opacity-0 before:transition-opacity checked:border-[#57BA52] checked:before:bg-[#57BA52]"
                  />
                  <span className="absolute text-[#57BA52] transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-2.5 w-2.5"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                    </svg>
                  </span>
                </span>
                <div className="w-full col-span-2 text-[#686677] text-base flex space-x-3 items-center">
                  <p>In the year</p>
                  <Dropdown
                    options={years}
                    value={{
                      label: startTime?.find((v) => v?.type === "year")?.value,
                      value: startTime?.find((v) => v?.type === "year")?.value,
                    }}
                    mainClass="w-max"
                    onchange={(e) => {
                      let val = parseInt(e.target.value);
                      let dummyyear = years?.find((v) => v.value === val);
                      let dummystart = [...startTime];
                      dummystart = dummystart.map((v) => {
                        if (v?.type === "year") {
                          return {
                            ...v,
                            date: moment(new Date())
                              .set("year", dummyyear?.value)
                              .startOf("y")
                              .format(),
                            desc: `In ${dummyyear?.value}`,
                            value: dummyyear?.value,
                          };
                        }
                        return { ...v };
                      });
                      setStartTime(dummystart);
                      let findtype = dummystart.find((v) => v.type === "year");
                      setFieldValue(
                        `payments.[${selectedId}].next_payment_start`,
                        findtype
                      );
                    }}
                  />
                </div>
              </div>
              {/* age */}
              <div className="flex gap-2 items-center">
                <span className="relative flex items-center rounded-full cursor-pointer">
                  <input
                    id={"age"}
                    checked={
                      values.payments?.[selectedId]?.next_payment_start
                        ?.type === "age"
                        ? true
                        : false
                    }
                    onChange={() => {
                      let findtype = startTime.find((v) => v.type === "age");
                      setFieldValue(
                        `payments.[${selectedId}].next_payment_start`,
                        findtype
                      );
                    }}
                    name="start_timeline"
                    type="radio"
                    className="before:content[''] peer relative -gray h-4 w-4 cursor-pointer appearance-none rounded-full border border-[#757575] before:absolute before:top-2/4 before:left-2/4 before:block before:h-[17px] before:w-[17px] before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-[#57BA52] before:opacity-0 before:transition-opacity checked:border-[#57BA52] checked:before:bg-[#57BA52]"
                  />
                  <span className="absolute text-[#57BA52] transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-2.5 w-2.5"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                    </svg>
                  </span>
                </span>
                <div className="w-full col-span-2 text-[#686677] text-base flex space-x-3 items-center">
                  <p>When</p>
                  <Dropdown
                    options={members}
                    value={{
                      label: startTime?.find((v) => v?.type === "age")?.member
                        ?.name,
                      value: startTime?.find((v) => v?.type === "age")?.member
                        ?._id,
                    }}
                    mainClass="w-max"
                    onchange={(e) => {
                      let val = e.target.value;
                      let dummymember = members?.find((v) => v.value === val);
                      let dummystart = [...startTime];
                      dummystart = dummystart.map((v) => {
                        if (v?.type === "age") {
                          let date = getAge(dummymember?.dob, v.value);
                          return {
                            ...v,
                            date: date,
                            member: {
                              _id: dummymember?.value,
                              name: dummymember?.label,
                              dob: dummymember?.dob,
                              age_retire: dummymember?.age_retire,
                              life_expectancy: dummymember?.life_expectancy,
                            },
                            desc: `When ${dummymember?.label} is ${
                              v.value
                            } (${moment(date)?.get("year")})`,
                          };
                        }
                        return { ...v };
                      });
                      setStartTime(dummystart);
                      let findtype = dummystart.find((v) => v.type === "age");
                      setFieldValue(
                        `payments.[${selectedId}].next_payment_start`,
                        findtype
                      );
                    }}
                  />
                  <p>is</p>
                  <Dropdown
                    options={ages}
                    value={{
                      label: startTime?.find((v) => v?.type === "age")?.value,
                      value: startTime?.find((v) => v?.type === "age")?.value,
                    }}
                    mainClass="w-max"
                    onchange={(e) => {
                      let val = parseInt(e.target.value);
                      let dummystart = [...startTime];
                      dummystart = dummystart.map((v) => {
                        if (v?.type === "age") {
                          let dob = getAge(v.member?.dob, val);
                          return {
                            ...v,
                            date: dob,
                            desc: `When ${v?.member?.name} is ${val} (${moment(
                              dob
                            ).get("year")})`,
                            value: val,
                          };
                        }
                        return { ...v };
                      });
                      setStartTime(dummystart);
                      let findtype = dummystart.find((v) => v.type === "age");
                      setFieldValue(
                        `payments.[${selectedId}].next_payment_start`,
                        findtype
                      );
                    }}
                  />
                </div>
              </div>
              {/* age retire */}
              <div className="flex gap-2 items-center">
                <span className="relative flex items-center rounded-full cursor-pointer">
                  <input
                    id={"age_retire"}
                    checked={
                      values.payments?.[selectedId]?.next_payment_start
                        ?.type === "age_retire"
                        ? true
                        : false
                    }
                    onChange={() => {
                      let findtype = startTime.find(
                        (v) => v.type === "age_retire"
                      );
                      setFieldValue(
                        `payments.[${selectedId}].next_payment_start`,
                        findtype
                      );
                    }}
                    name="start_timeline"
                    type="radio"
                    className="before:content[''] peer relative -gray h-4 w-4 cursor-pointer appearance-none rounded-full border border-[#757575] before:absolute before:top-2/4 before:left-2/4 before:block before:h-[17px] before:w-[17px] before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-[#57BA52] before:opacity-0 before:transition-opacity checked:border-[#57BA52] checked:before:bg-[#57BA52]"
                  />
                  <span className="absolute text-[#57BA52] transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-2.5 w-2.5"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                    </svg>
                  </span>
                </span>
                <div className="w-full col-span-2 text-[#686677] text-base flex space-x-3 items-center">
                  <p>When</p>
                  <Dropdown
                    options={members}
                    value={{
                      label: startTime?.find((v) => v?.type === "age_retire")
                        ?.member?.name,
                      value: startTime?.find((v) => v?.type === "age_retire")
                        ?.member?._id,
                    }}
                    mainClass="w-max"
                    onchange={(e) => {
                      let val = e.target.value;
                      let dummymember = members?.find((v) => v.value === val);
                      let dummystart = [...startTime];
                      dummystart = dummystart.map((v) => {
                        let age = dummymember?.age_retire + v?.value;
                        if (v?.type === "age_retire") {
                          let findretire = retireagelist.find(
                            (d) => d.value === v?.value
                          );
                          let newdate = getAge(dummymember?.dob, age);
                          return {
                            ...v,
                            date: newdate,
                            member: {
                              _id: dummymember?.value,
                              name: dummymember?.label,
                              dob: dummymember?.dob,
                              age_retire: dummymember?.age_retire,
                              life_expectancy: dummymember?.life_expectancy,
                            },
                            desc:
                              findretire?.value === 0
                                ? `when ${dummymember?.label} retires (${moment(
                                    newdate
                                  ).get("year")})`
                                : `${findretire?.label} of ${
                                    dummymember?.label
                                  } (${moment(newdate).get("year")})`,
                          };
                        }
                        return { ...v };
                      });
                      setStartTime(dummystart);
                      let findtype = dummystart.find(
                        (v) => v.type === "age_retire"
                      );
                      setFieldValue(
                        `payments.[${selectedId}].next_payment_start`,
                        findtype
                      );
                    }}
                  />
                  <p>reaches</p>
                  <Dropdown
                    options={retireagelist}
                    value={{
                      label: startTime?.find((v) => v?.type === "age_retire")
                        ?.value,
                      value: startTime?.find((v) => v?.type === "age_retire")
                        ?.value,
                    }}
                    mainClass="w-max"
                    onchange={(e) => {
                      let val = parseInt(e.target.value);
                      let findretire = retireagelist.find(
                        (v) => v.value === val
                      );
                      let dummystart = [...startTime];
                      dummystart = dummystart.map((v) => {
                        let age = v?.member?.age_retire + val;
                        if (v?.type === "age_retire") {
                          let newdate = getAge(v.member?.dob, age);
                          return {
                            ...v,
                            date: newdate,
                            value: val,
                            desc:
                              findretire?.value === 0
                                ? `When ${v?.member?.name} retires (${moment(
                                    newdate
                                  ).get("year")})`
                                : `${findretire?.label} of ${
                                    v?.member?.name
                                  } (${moment(newdate).get("year")})`,
                          };
                        }
                        return { ...v };
                      });
                      setStartTime(dummystart);
                      let findtype = dummystart.find(
                        (v) => v.type === "age_retire"
                      );
                      setFieldValue(
                        `payments.[${selectedId}].next_payment_start`,
                        findtype
                      );
                    }}
                  />
                </div>
              </div>
              {/* life expectancy */}
              <div className="flex gap-2 items-center">
                <span className="relative flex items-center rounded-full cursor-pointer">
                  <input
                    id={"life_exp"}
                    checked={
                      values.payments?.[selectedId]?.next_payment_start
                        ?.type === "life_exp"
                        ? true
                        : false
                    }
                    onChange={() => {
                      let findtype = startTime.find(
                        (v) => v.type === "life_exp"
                      );
                      setFieldValue(
                        `payments.[${selectedId}].next_payment_start`,
                        findtype
                      );
                    }}
                    name="start_timeline"
                    type="radio"
                    className="before:content[''] peer relative -gray h-4 w-4 cursor-pointer appearance-none rounded-full border border-[#757575] before:absolute before:top-2/4 before:left-2/4 before:block before:h-[17px] before:w-[17px] before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-[#57BA52] before:opacity-0 before:transition-opacity checked:border-[#57BA52] checked:before:bg-[#57BA52]"
                  />
                  <span className="absolute text-[#57BA52] transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-2.5 w-2.5"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                    </svg>
                  </span>
                </span>
                <div className="w-full col-span-2 text-[#686677] text-base flex space-x-3 items-center">
                  <p>When</p>
                  <Dropdown
                    options={members}
                    value={{
                      label: startTime?.find((v) => v?.type === "life_exp")
                        ?.member?.name,
                      value: startTime?.find((v) => v?.type === "life_exp")
                        ?.member?._id,
                    }}
                    mainClass="w-max"
                    onchange={(e) => {
                      let val = e.target.value;
                      let dummymember = members?.find((v) => v.value === val);
                      let dummystart = [...startTime];
                      dummystart = dummystart.map((v) => {
                        let age = dummymember?.life_expectancy + v?.value;
                        if (v?.type === "life_exp") {
                          let findretire = lifeExpectancylist.find(
                            (d) => d.value === v?.value
                          );
                          let newdate = getAge(dummymember?.dob, age);
                          return {
                            ...v,
                            date: newdate,
                            member: {
                              _id: dummymember?.value,
                              name: dummymember?.label,
                              dob: dummymember?.dob,
                              age_retire: dummymember?.age_retire,
                              life_expectancy: dummymember?.life_expectancy,
                            },
                            desc:
                              dummymember?.value === 0
                                ? `When ${v?.member?.name} retires (${moment(
                                    newdate
                                  ).get("year")})`
                                : `${dummymember?.label} of ${
                                    findretire?.label
                                  } (${moment(newdate).get("year")})`,
                          };
                        }
                        return { ...v };
                      });
                      setStartTime(dummystart);
                      let findtype = dummystart.find(
                        (v) => v.type === "life_exp"
                      );
                      setFieldValue(
                        `payments.[${selectedId}].next_payment_start`,
                        findtype
                      );
                    }}
                  />
                  <p>reaches</p>
                  <Dropdown
                    options={lifeExpectancylist}
                    value={{
                      label: startTime?.find((v) => v?.type === "life_exp")
                        ?.value,
                      value: startTime?.find((v) => v?.type === "life_exp")
                        ?.value,
                    }}
                    mainClass="w-max"
                    onchange={(e) => {
                      let val = parseInt(e.target.value);
                      let findretire = lifeExpectancylist.find(
                        (v) => v.value === val
                      );
                      let dummystart = [...startTime];
                      dummystart = dummystart.map((v) => {
                        let age = v?.member?.life_expectancy + val;
                        if (v?.type === "life_exp") {
                          let newdate = getAge(v.member?.dob, age);
                          return {
                            ...v,
                            date: newdate,
                            desc:
                              findretire?.value === 0
                                ? `When ${v?.member?.name} expires (${moment(
                                    newdate
                                  ).get("year")})`
                                : `${findretire?.label} of ${
                                    v?.member?.name
                                  } (${moment(newdate).get("year")})`,
                            value: val,
                          };
                        }
                        return { ...v };
                      });
                      setStartTime(dummystart);
                      let findtype = dummystart.find(
                        (v) => v.type === "life_exp"
                      );
                      setFieldValue(
                        `payments.[${selectedId}].next_payment_start`,
                        findtype
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {values.payments?.[selectedId]?.type === "regular" ? (
            <>
              <div className="col-span-2">
                <label
                  className={`w-full text-base font-medium col-span-2 leading-tight text-[#9794AA]`}
                >
                  When does this repayment end?{" "}
                  <span className={`text-red-600`}>*</span>
                </label>
                <div className="w-full mt-3 space-y-2">
                  {/* year */}
                  <div className="flex gap-2 items-center">
                    <span className="relative flex items-center rounded-full cursor-pointer">
                      <input
                        id={"endyear"}
                        checked={
                          values.payments?.[selectedId]?.next_payment_end
                            ?.type === "year"
                            ? true
                            : false
                        }
                        onChange={() => {
                          let findtype = endTime.find((v) => v.type === "year");
                          setFieldValue(
                            `payments.[${selectedId}].next_payment_end`,
                            findtype
                          );
                        }}
                        name="end_timeline"
                        type="radio"
                        className="before:content[''] peer relative -gray h-4 w-4 cursor-pointer appearance-none rounded-full border border-[#757575] before:absolute before:top-2/4 before:left-2/4 before:block before:h-[17px] before:w-[17px] before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-[#57BA52] before:opacity-0 before:transition-opacity checked:border-[#57BA52] checked:before:bg-[#57BA52]"
                      />
                      <span className="absolute text-[#57BA52] transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-2.5 w-2.5"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <circle
                            data-name="ellipse"
                            cx="8"
                            cy="8"
                            r="8"
                          ></circle>
                        </svg>
                      </span>
                    </span>
                    <div className="w-full col-span-2 text-[#686677] text-base flex space-x-3 items-center">
                      <p>In the year</p>
                      <Dropdown
                        options={years}
                        value={{
                          label: endTime?.find((v) => v?.type === "age")?.value,
                          value: endTime?.find((v) => v?.type === "age")?.value,
                        }}
                        mainClass="w-max"
                        onchange={(e) => {
                          let val = parseInt(e.target.value);
                          let dummyyear = years?.find((v) => v.value === val);
                          let dummyendtime = [...endTime];
                          dummyendtime = dummyendtime.map((v) => {
                            if (v?.type === "year") {
                              return {
                                ...v,
                                date: moment(new Date())
                                  .set("year", dummyyear?.value)
                                  .startOf("y")
                                  .format(),
                                desc: `In ${dummyyear?.value}`,
                                value: dummyyear?.value,
                              };
                            }
                            return { ...v };
                          });
                          setEndTime(dummyendtime);
                          let findtype = dummyendtime.find(
                            (v) => v.type === "year"
                          );
                          setFieldValue(
                            `payments.[${selectedId}].next_payment_end`,
                            findtype
                          );
                        }}
                      />
                    </div>
                  </div>
                  {/* age */}
                  <div className="flex gap-2 items-center">
                    <span className="relative flex items-center rounded-full cursor-pointer">
                      <input
                        id={"endage"}
                        checked={
                          values.payments?.[selectedId]?.next_payment_end
                            ?.type === "age"
                            ? true
                            : false
                        }
                        onChange={() => {
                          let findtype = endTime.find((v) => v.type === "age");
                          setFieldValue(
                            `payments.[${selectedId}].next_payment_end`,
                            findtype
                          );
                        }}
                        name="end_timeline"
                        type="radio"
                        className="before:content[''] peer relative -gray h-4 w-4 cursor-pointer appearance-none rounded-full border border-[#757575] before:absolute before:top-2/4 before:left-2/4 before:block before:h-[17px] before:w-[17px] before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-[#57BA52] before:opacity-0 before:transition-opacity checked:border-[#57BA52] checked:before:bg-[#57BA52]"
                      />
                      <span className="absolute text-[#57BA52] transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-2.5 w-2.5"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <circle
                            data-name="ellipse"
                            cx="8"
                            cy="8"
                            r="8"
                          ></circle>
                        </svg>
                      </span>
                    </span>
                    <div className="w-full col-span-2 text-[#686677] text-base flex space-x-3 items-center">
                      <p>When</p>
                      <Dropdown
                        options={members}
                        value={{
                          label: endTime?.find((v) => v?.type === "age")?.member
                            ?.name,
                          value: endTime?.find((v) => v?.type === "age")?.member
                            ?._id,
                        }}
                        mainClass="w-max"
                        onchange={(e) => {
                          let val = e.target.value;
                          let dummymember = members?.find(
                            (v) => v.value === val
                          );
                          let dummyendtime = [...endTime];
                          dummyendtime = dummyendtime.map((v) => {
                            if (v?.type === "age") {
                              let date = getAge(dummymember?.dob, v.value);
                              return {
                                ...v,
                                date: date,
                                member: {
                                  _id: dummymember?.value,
                                  name: dummymember?.label,
                                  dob: dummymember?.dob,
                                  age_retire: dummymember?.age_retire,
                                  life_expectancy: dummymember?.life_expectancy,
                                },
                                desc: `When ${dummymember?.label} is ${
                                  v.value
                                } (${moment(date)?.get("year")})`,
                              };
                            }
                            return { ...v };
                          });
                          setEndTime(dummyendtime);
                          let findtype = dummyendtime.find(
                            (v) => v.type === "age"
                          );
                          setFieldValue(
                            `payments.[${selectedId}].next_payment_end`,
                            findtype
                          );
                        }}
                      />
                      <p>is</p>
                      <Dropdown
                        options={ages}
                        value={{
                          label: endTime?.find((v) => v?.type === "age")?.value,
                          value: endTime?.find((v) => v?.type === "age")?.value,
                        }}
                        mainClass="w-max"
                        onchange={(e) => {
                          let val = parseInt(e.target.value);
                          let dummyendtime = [...endTime];
                          dummyendtime = dummyendtime.map((v) => {
                            if (v?.type === "age") {
                              let dob = getAge(v.member?.dob, val);
                              return {
                                ...v,
                                date: dob,
                                desc: `When ${
                                  v?.member?.name
                                } is ${val} (${moment(dob).get("year")})`,
                                value: val,
                              };
                            }
                            return { ...v };
                          });
                          setEndTime(dummyendtime);
                          let findtype = dummyendtime.find(
                            (v) => v.type === "age"
                          );
                          setFieldValue(
                            `payments.[${selectedId}].next_payment_end`,
                            findtype
                          );
                        }}
                      />
                    </div>
                  </div>
                  {/* age retire */}
                  <div className="flex gap-2 items-center">
                    <span className="relative flex items-center rounded-full cursor-pointer">
                      <input
                        id={"endage_retire"}
                        checked={
                          values.payments?.[selectedId]?.next_payment_end
                            ?.type === "age_retire"
                            ? true
                            : false
                        }
                        onChange={() => {
                          let findtype = endTime.find(
                            (v) => v.type === "age_retire"
                          );
                          setFieldValue(
                            `payments.[${selectedId}].next_payment_end`,
                            findtype
                          );
                        }}
                        name="end_timeline"
                        type="radio"
                        className="before:content[''] peer relative -gray h-4 w-4 cursor-pointer appearance-none rounded-full border border-[#757575] before:absolute before:top-2/4 before:left-2/4 before:block before:h-[17px] before:w-[17px] before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-[#57BA52] before:opacity-0 before:transition-opacity checked:border-[#57BA52] checked:before:bg-[#57BA52]"
                      />
                      <span className="absolute text-[#57BA52] transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-2.5 w-2.5"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <circle
                            data-name="ellipse"
                            cx="8"
                            cy="8"
                            r="8"
                          ></circle>
                        </svg>
                      </span>
                    </span>
                    <div className="w-full col-span-2 text-[#686677] text-base flex space-x-3 items-center">
                      <p>When</p>
                      <Dropdown
                        options={members}
                        value={{
                          label: endTime?.find((v) => v?.type === "age_retire")
                            ?.member?.name,
                          value: endTime?.find((v) => v?.type === "age_retire")
                            ?.member?._id,
                        }}
                        mainClass="w-max"
                        onchange={(e) => {
                          let val = e.target.value;
                          let dummymember = members?.find(
                            (v) => v.value === val
                          );
                          let dummyendtime = [...endTime];
                          dummyendtime = dummyendtime.map((v) => {
                            let age = dummymember?.age_retire + v?.value;
                            if (v?.type === "age_retire") {
                              let findretire = retireagelist.find(
                                (d) => d.value === v?.value
                              );
                              return {
                                ...v,
                                date: getAge(dummymember?.dob, age),
                                member: {
                                  _id: dummymember?.value,
                                  name: dummymember?.label,
                                  dob: dummymember?.dob,
                                  age_retire: dummymember?.age_retire,
                                  life_expectancy: dummymember?.life_expectancy,
                                },
                                desc:
                                  findretire?.value === 0
                                    ? `when ${
                                        dummymember?.label
                                      } retires (${moment(newdate).get(
                                        "year"
                                      )})`
                                    : `${findretire?.label} of ${
                                        dummymember?.label
                                      } (${moment(newdate).get("year")})`,
                              };
                            }
                            return { ...v };
                          });
                          setEndTime(dummyendtime);
                          let findtype = dummyendtime.find(
                            (v) => v.type === "age_retire"
                          );
                          setFieldValue(
                            `payments.[${selectedId}].next_payment_end`,
                            findtype
                          );
                        }}
                      />
                      <p>reaches</p>
                      <Dropdown
                        options={retireagelist}
                        value={{
                          label: endTime?.find((v) => v?.type === "age_retire")
                            ?.value,
                          value: endTime?.find((v) => v?.type === "age_retire")
                            ?.value,
                        }}
                        mainClass="w-max"
                        onchange={(e) => {
                          let val = parseInt(e.target.value);
                          let findretire = retireagelist.find(
                            (v) => v.value === val
                          );
                          let dummyendtime = [...endTime];
                          dummyendtime = dummyendtime.map((v) => {
                            let age = v?.member?.age_retire + val;
                            if (v?.type === "age_retire") {
                              let newdate = getAge(v.member?.dob, age);
                              return {
                                ...v,
                                date: newdate,
                                value: val,
                                desc:
                                  findretire?.value === 0
                                    ? `When ${
                                        v?.member?.name
                                      } retires (${moment(newdate).get(
                                        "year"
                                      )})`
                                    : `${findretire?.label} of ${
                                        v?.member?.name
                                      } (${moment(newdate).get("year")})`,
                              };
                            }
                            return { ...v };
                          });
                          setEndTime(dummyendtime);
                          let findtype = dummyendtime.find(
                            (v) => v.type === "age_retire"
                          );
                          setFieldValue(
                            `payments.[${selectedId}].next_payment_end`,
                            findtype
                          );
                        }}
                      />
                    </div>
                  </div>
                  {/* life expectancy */}
                  <div className="flex gap-2 items-center">
                    <span className="relative flex items-center rounded-full cursor-pointer">
                      <input
                        id={"endlife_exp"}
                        checked={
                          values.payments?.[selectedId]?.next_payment_end
                            ?.type === "life_exp"
                            ? true
                            : false
                        }
                        onChange={() => {
                          let findtype = endTime.find(
                            (v) => v.type === "life_exp"
                          );
                          setFieldValue(
                            `payments.[${selectedId}].next_payment_end`,
                            findtype
                          );
                        }}
                        name="end_timeline"
                        type="radio"
                        className="before:content[''] peer relative -gray h-4 w-4 cursor-pointer appearance-none rounded-full border border-[#757575] before:absolute before:top-2/4 before:left-2/4 before:block before:h-[17px] before:w-[17px] before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-[#57BA52] before:opacity-0 before:transition-opacity checked:border-[#57BA52] checked:before:bg-[#57BA52]"
                      />
                      <span className="absolute text-[#57BA52] transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-2.5 w-2.5"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <circle
                            data-name="ellipse"
                            cx="8"
                            cy="8"
                            r="8"
                          ></circle>
                        </svg>
                      </span>
                    </span>
                    <div className="w-full col-span-2 text-[#686677] text-base flex space-x-3 items-center">
                      <p>When</p>
                      <Dropdown
                        options={members}
                        value={{
                          label: endTime?.find((v) => v?.type === "life_exp")
                            ?.member?.name,
                          value: endTime?.find((v) => v?.type === "life_exp")
                            ?.member?._id,
                        }}
                        mainClass="w-max"
                        onchange={(e) => {
                          let val = e.target.value;
                          let dummymember = members?.find(
                            (v) => v.value === val
                          );
                          let dummyendtime = [...endTime];
                          dummyendtime = dummyendtime.map((v) => {
                            let age = dummymember?.life_expectancy + v?.value;
                            if (v?.type === "life_exp") {
                              let findretire = lifeExpectancylist.find(
                                (d) => d.value === v?.value
                              );
                              let newdate = getAge(dummymember?.dob, age);
                              return {
                                ...v,
                                date: newdate,
                                member: {
                                  _id: dummymember?.value,
                                  name: dummymember?.label,
                                  dob: dummymember?.dob,
                                  age_retire: dummymember?.age_retire,
                                  life_expectancy: dummymember?.life_expectancy,
                                },
                                desc:
                                  dummymember?.value === 0
                                    ? `When ${
                                        v?.member?.name
                                      } retires (${moment(newdate).get(
                                        "year"
                                      )})`
                                    : `${dummymember?.label} of ${
                                        findretire?.label
                                      } (${moment(newdate).get("year")})`,
                              };
                            }
                            return { ...v };
                          });
                          setEndTime(dummyendtime);
                          let findtype = dummyendtime.find(
                            (v) => v.type === "life_exp"
                          );
                          setFieldValue(
                            `payments.[${selectedId}].next_payment_end`,
                            findtype
                          );
                        }}
                      />
                      <p>reaches</p>
                      <Dropdown
                        options={lifeExpectancylist}
                        value={{
                          label: endTime?.find((v) => v?.type === "life_exp")
                            ?.value,
                          value: endTime?.find((v) => v?.type === "life_exp")
                            ?.value,
                        }}
                        mainClass="w-max"
                        onchange={(e) => {
                          let val = parseInt(e.target.value);
                          let findretire = lifeExpectancylist.find(
                            (v) => v.value === val
                          );
                          let dummyendtime = [...endTime];
                          dummyendtime = dummyendtime.map((v) => {
                            let age = v?.member?.life_expectancy + val;
                            if (v?.type === "life_exp") {
                              let newdate = getAge(v.member?.dob, age);
                              return {
                                ...v,
                                date: newdate,
                                desc:
                                  findretire?.value === 0
                                    ? `When ${
                                        v?.member?.name
                                      } expires (${moment(newdate).get(
                                        "year"
                                      )})`
                                    : `${findretire?.label} of ${
                                        v?.member?.name
                                      } (${moment(newdate).get("year")})`,
                                value: val,
                              };
                            }
                            return { ...v };
                          });
                          setEndTime(dummyendtime);
                          let findtype = dummyendtime.find(
                            (v) => v.type === "life_exp"
                          );
                          setFieldValue(
                            `payments.[${selectedId}].next_payment_end`,
                            findtype
                          );
                        }}
                      />
                    </div>
                  </div>
                  {/* occurances */}
                  <div className="flex gap-2 items-center">
                    <span className="relative flex items-center rounded-full cursor-pointer">
                      <input
                        id={"endoccurence"}
                        checked={
                          values.payments?.[selectedId]?.next_payment_end
                            ?.type === "afteryear"
                            ? true
                            : false
                        }
                        onChange={() => {
                          let findtype = endTime.find(
                            (v) => v.type === "afteryear"
                          );
                          setFieldValue(
                            `payments.[${selectedId}].next_payment_end`,
                            findtype
                          );
                        }}
                        name="end_timeline"
                        type="radio"
                        className="before:content[''] peer relative -gray h-4 w-4 cursor-pointer appearance-none rounded-full border border-[#757575] before:absolute before:top-2/4 before:left-2/4 before:block before:h-[17px] before:w-[17px] before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-[#57BA52] before:opacity-0 before:transition-opacity checked:border-[#57BA52] checked:before:bg-[#57BA52]"
                      />
                      <span className="absolute text-[#57BA52] transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-2.5 w-2.5"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <circle
                            data-name="ellipse"
                            cx="8"
                            cy="8"
                            r="8"
                          ></circle>
                        </svg>
                      </span>
                    </span>
                    <div className="w-full col-span-2 text-[#686677] text-base flex space-x-3 items-center">
                      <p>After</p>
                      <Dropdown
                        options={lifeOccurences}
                        value={{
                          label: endTime?.find((v) => v?.type === "afteryear")
                            ?.value,
                          value: endTime?.find((v) => v?.type === "afteryear")
                            ?.value,
                        }}
                        mainClass="w-max"
                        onchange={(e) => {
                          let val = parseInt(e.target.value);
                          let dummyoccu = lifeOccurences?.find(
                            (v) => v.value === val
                          );
                          let dummyendtime = [...endTime];
                          dummyendtime = dummyendtime.map((v) => {
                            if (v?.type === "afteryear") {
                              return {
                                ...v,
                                date: getAge(new Date().toISOString(), val),
                                desc: `After ${val} years`,
                                value: dummyoccu?.value,
                              };
                            }
                            return { ...v };
                          });
                          setEndTime(dummyendtime);
                          let findtype = dummyendtime.find(
                            (v) => v.type === "afteryear"
                          );
                          setFieldValue(
                            `payments.[${selectedId}].next_payment_end`,
                            findtype
                          );
                        }}
                      />
                      <p>years</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
          <button
            onClick={() => {
              setOpenPopUp(false);
            }}
            className="w-full border border-[#999999] hover:border-[#57BA52] rounded-lg py-2 bg-transparent px-5 font-medium capitalize text-[#999999] hover:text-[#57BA52]"
          >
            save
          </button>
          <button
            onClick={() => {
              if (isEdit) setIsEdit(false);
              else {
                let findmain = members?.find((v) => v.type === "self");
                let dummystart = [...startTime];
                let newary = [];
                let yearDate = new Date().getFullYear();
                let age = 50;
                let age_retire = findmain?.age_retire;
                let life_expectancy = findmain?.life_expectancy;
                dummystart.map((v) => {
                  let newdate =
                    v?.type === "year"
                      ? moment(new Date()).startOf("y").format()
                      : getAge(
                          findmain?.dob,
                          v?.type === "age"
                            ? age
                            : v?.type === "age_retire"
                            ? age_retire
                            : life_expectancy
                        );
                  let obj = {
                    member: {
                      _id: findmain?.value,
                      name: findmain?.label,
                      dob: findmain?.dob,
                      age_retire: findmain?.age_retire,
                      life_expectancy: findmain?.life_expectancy,
                    },
                    type: v.type,
                    value:
                      v?.type === "year"
                        ? yearDate
                        : v?.type === "age"
                        ? age
                        : v?.type === "age_retire"
                        ? 0
                        : 0,
                    date: newdate,
                    desc:
                      v?.type === "year"
                        ? `In ${yearDate}`
                        : v?.type === "age"
                        ? `When ${findmain?.label} is ${age} (${moment(
                            newdate
                          ).get("year")})`
                        : v?.type === "age_retire"
                        ? `When ${
                            findmain?.label
                          } retires ${age_retire} (${moment(newdate).get(
                            "year"
                          )})`
                        : `When ${
                            findmain?.label
                          } retires ${life_expectancy} (${moment(newdate).get(
                            "year"
                          )})`,
                  };
                  newary.push(obj);
                });
                let dummyoccurence = {
                  member: {
                    _id: findmain?.value,
                    name: findmain?.label,
                    dob: findmain?.dob,
                    age_retire: findmain?.age_retire,
                    life_expectancy: findmain?.life_expectancy,
                  },
                  type: "afteryear",
                  value: 2,
                  date: getAge(new Date().toISOString(), 2),
                  desc: `After 2 years`,
                };
                let payments = [...values.payments];
                let dummypayment = payments.splice(0, payments?.length - 1);
                setFieldValue("payments", dummypayment);
                setStartTime(newary);
                setEndTime([...newary, dummyoccurence]);
              }
              setOpenPopUp(false);
            }}
            className="w-full border border-[#999999] hover:border-[#57BA52] rounded-lg py-2 bg-transparent px-5 font-medium capitalize text-[#999999] hover:text-[#57BA52]"
          >
            cancel
          </button>
        </div>
      </PopUp>
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
  if (!ctx?.query?.debt_type) {
    return {
      redirect: {
        destination: "/resources/debt",
        permanent: false,
      },
    };
  }
  let debt_type =
    ctx?.query?.debt_type === undefined
      ? ""
      : JSON.parse(ctx?.query?.debt_type);
  return { props: { state: debt_type, user: user } };
};
