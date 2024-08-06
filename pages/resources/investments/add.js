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

export default function Add(props) {
  const router = useRouter();
  let user = props.user;
  let retireagelist = jsonData?.retire_ages ?? [];
  let lifeExpectancylist = jsonData?.life_expectation ?? [];
  const [addLoading, setAddLoading] = useState(false);
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
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState([]);
  const [ages, setAges] = useState([]);
  const [members, setMembers] = useState([]);
  const [goalData, setGoalData] = useState([]);
  const [error, setError] = useState("");
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
      curr_valuation: 0,
      owner: {
        label: "",
        value: "",
      },
      goalselected: "all",
      surplusgoalselected: "all",
      goals: [
        {
          label: "",
          value: "",
        },
      ],
      surplus_goals: [
        {
          label: "",
          value: "",
        },
      ],
      resources_access_time: {
        type: "now",
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
      savings: [
        {
          type: "",
          name: "",
          amount: "",
          timeline: "",
          inflation: "",
          isin_cashflow: false,
          saving_start: {
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
          saving_end: {
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
      curr_valuation: Yup.number()
        .positive("Enter positive current valuation")
        .required("current valuation is required"),
      owner: Yup.object({
        value: Yup.string().required("owner is required"),
        label: Yup.string(),
      }),
      goals: Yup.array().of(
        Yup.object({
          label: Yup.string(),
          value: Yup.string(),
        })
      ),
      surplus_goals: Yup.array().of(
        Yup.object({
          label: Yup.string(),
          value: Yup.string(),
        })
      ),
      goalselected: Yup.string(),
      surplusgoalselected: Yup.string(),
      resources_access_time: Yup.object({
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
      savings: Yup.array().of(
        Yup.object().shape({
          type: Yup.string(),
          name: Yup.string(),
          amount: Yup.number().positive("Enter positive amount"),
          timeline: Yup.string(),
          inflation: Yup.string(),
          start_timeline: Yup.object({
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
          end_timeline: Yup.object({
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
        let dummystartfind = startTime.find(
          (v) => v.type === values.resources_access_time.type
        );
        let data = {
          type: values.type,
          name: values.name,
          curr_valuation: values.curr_valuation,
          owner: values.owner?.value,
          isAssest: false,
          goals: values.goals?.map((v) => {
            return v?.value;
          }),
          goal_state: values.goalselected,
          surplusgoal_state: values.surplusgoalselected,
          ...(values?.goalselected === "specific"
            ? {
                surplus_goals: values.surplus_goals?.map((v) => {
                  return v?.value;
                }),
              }
            : {}),
          resources_access_time: {
            ...dummystartfind,
            member: dummystartfind.member?._id,
          },
        };
        const res = await fetch(`/api/resources/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data }),
        });
        let res1 = await res.json();
        if (res1.success) {
          router.push("/resources");
          setAddLoading(false);
        } else {
          setAddLoading(false);
          errorToast(res1.error);
        }
      } catch (error) {
        console.error(error);
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
      let dummymembers = res1?.data?.map((v) => {
        return {
          label: v?.fname,
          value: v?._id,
          dob: v?.dob,
          age_retire: v?.age_retire,
          life_expectancy: v?.life_expectancy,
        };
      });
      setMembers(dummymembers);
      let findmain = res1?.data?.find((v) => v.type === "self");
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
            _id: findmain?._id,
            name: findmain?.fname,
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
              ? `When ${findmain?.fname} is ${age} (${moment(newdate).get(
                  "year"
                )})`
              : v?.type === "age_retire"
              ? `When ${findmain?.fname} retires ${age_retire} (${moment(
                  newdate
                ).get("year")})`
              : `When ${findmain?.fname} retires ${life_expectancy} (${moment(
                  newdate
                ).get("year")})`,
        };
        newary.push(obj);
      });
      let nowdate = getAge(new Date().toISOString(), 0);
      let dummyNow = {
        member: {
          _id: findmain?._id,
          name: findmain?.fname,
          dob: findmain?.dob,
          age_retire: findmain?.age_retire,
          life_expectancy: findmain?.life_expectancy,
        },
        type: "now",
        value: 0,
        date: nowdate,
        desc: `Accessible now ${moment(nowdate).get("year")}`,
      };
      setStartTime([{ ...dummyNow }, ...newary]);
      setValues({
        ...values,
        resources_access_time: {
          ...dummyNow,
        },
      });
      getGoalData(dummyNow);
    } else {
      setLoading(false);
      setMembers([]);
    }
  };

  const getGoalData = async (resources_time) => {
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
      let dummygoals = res1?.data?.map((v) => {
        return {
          label: v?.type?.replace("_", " "),
          value: v?._id,
        };
      });
      setGoalData(dummygoals);
      setValues({
        ...values,
        resources_access_time: {
          ...resources_time,
        },
        goals: [...dummygoals],
        goalselected: "all",
        surplus_goals: [...dummygoals],
        surplusgoalselected: "all",
      });
    } else {
      setLoading(false);
      setGoalData([]);
    }
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
            Add New Asset
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
              {props?.state?.name?.replace("_", " ")}
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
                  label={"Current Valuation"}
                  value={values.curr_valuation}
                  id="curr_valuation"
                  keytype="number"
                  min={1}
                  onchange={handleChange}
                  error={
                    touched.curr_valuation && errors.curr_valuation
                      ? true
                      : false
                  }
                  errorText={errors.curr_valuation}
                  require
                  requireClass="text-[#54577A]"
                />
                <Dropdown
                  placeholder="-Not Set-"
                  label={"Who is this owner of this resource?"}
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
                <div></div>
                <div className="col-span-2">
                  <h3 className="text-[20px] font-semibold text-[#45486A] mb-2">
                    Goal Funding
                  </h3>
                  <label
                    className={`w-full text-base font-medium col-span-2 leading-tight text-[#9794AA]`}
                  >
                    How should this resource be used to fund goals?{" "}
                    <span className={`text-red-600`}>*</span>
                  </label>
                  <div className="w-full mt-3 space-y-2">
                    {/* all Goals */}
                    <div className="flex gap-2 items-center">
                      <p className="w-1/6 text-[#686677] text-base">
                        Fund all goals
                      </p>
                      <span className="relative flex items-center rounded-full cursor-pointer">
                        <input
                          id={"all_goal"}
                          checked={values.goalselected === "all" ? true : false}
                          onChange={() => {
                            setValues({
                              ...values,
                              goals: [...goalData],
                              goalselected: "all",
                            });
                          }}
                          name="goal"
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
                    </div>
                    {/* specific goal */}
                    <div className="flex gap-2 items-center">
                      <p className="w-1/6 text-[#686677] text-base">
                        Fund one specific goal{" "}
                      </p>
                      <span className="relative flex items-center rounded-full cursor-pointer">
                        <input
                          id={"specific_goal"}
                          checked={
                            values.goalselected === "specific" ? true : false
                          }
                          onChange={() => {
                            setValues({
                              ...values,
                              goals: [{ ...goalData?.[0] }],
                              goalselected: "specific",
                            });
                          }}
                          name="goal"
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
                      <Dropdown
                        options={goalData}
                        value={{
                          value: values.goals?.[0]?._id,
                          label: values.goals?.[0]?.type,
                        }}
                        onchange={(e) => {
                          let val = e.target.value;
                          let dummygoal = goalData?.find(
                            (v) => v.value === val
                          );
                          setFieldValue("goals", [{ ...dummygoal }]);
                        }}
                        mainClass="w-max"
                      />
                    </div>
                    {/* Exclude from goals */}
                    <div className="flex gap-2 items-center">
                      <p className="w-1/6 text-[#686677] text-base">
                        Exclude from goals{" "}
                      </p>
                      <span className="relative flex items-center rounded-full cursor-pointer">
                        <input
                          id={"exclude_goal"}
                          checked={
                            values.goalselected === "exclude" ? true : false
                          }
                          onChange={() => {
                            setValues({
                              ...values,
                              goals: [],
                              goalselected: "exclude",
                            });
                          }}
                          name="goal"
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
                    </div>
                  </div>
                </div>
                {values.goalselected === "specific" ? (
                  <div className="col-span-2">
                    <label
                      className={`w-full text-base font-medium col-span-2 leading-tight text-[#9794AA]`}
                    >
                      After funding the goal specified above, how should any
                      surplus be used? <span className={`text-red-600`}>*</span>
                    </label>
                    <div className="w-full mt-3 space-y-2">
                      {/* all Goals */}
                      <div className="flex gap-2 items-center">
                        <p className="w-1/6 text-[#686677] text-base">
                          Fund all goals
                        </p>
                        <span className="relative flex items-center rounded-full cursor-pointer">
                          <input
                            id={"all_surplusgoal"}
                            checked={
                              values.surplusgoalselected === "all"
                                ? true
                                : false
                            }
                            onChange={() => {
                              setValues({
                                ...values,
                                surplus_goals: [...goalData],
                                surplusgoalselected: "all",
                              });
                            }}
                            name="surplusgoal"
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
                      </div>
                      {/* specific goal */}
                      <div className="flex gap-2 items-center">
                        <p className="w-1/6 text-[#686677] text-base">
                          Fund one specific goal{" "}
                        </p>
                        <span className="relative flex items-center rounded-full cursor-pointer">
                          <input
                            id={"specific_surplusgoal"}
                            checked={
                              values.surplusgoalselected === "specific"
                                ? true
                                : false
                            }
                            onChange={() => {
                              setValues({
                                ...values,
                                surplus_goals: [{ ...goalData?.[0] }],
                                surplusgoalselected: "specific",
                              });
                            }}
                            name="surplusgoal"
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
                        <Dropdown
                          options={goalData}
                          value={{
                            value: values.surplus_goals?.[0]?._id,
                            label: values.surplus_goals?.[0]?.type,
                          }}
                          onchange={(e) => {
                            let val = e.target.value;
                            let dummygoal = goalData?.find(
                              (v) => v.value === val
                            );
                            setFieldValue("surplus_goals", [{ ...dummygoal }]);
                          }}
                          mainClass="w-max"
                        />
                      </div>
                      {/* Exclude from goals */}
                      <div className="flex gap-2 items-center">
                        <p className="w-1/6 text-[#686677] text-base">
                          Exclude from goals{" "}
                        </p>
                        <span className="relative flex items-center rounded-full cursor-pointer">
                          <input
                            id={"exclude_surplusgoal"}
                            checked={
                              values.surplusgoalselected === "exclude"
                                ? true
                                : false
                            }
                            onChange={() => {
                              setValues({
                                ...values,
                                surplus_goals: [],
                                surplusgoalselected: "exclude",
                              });
                            }}
                            name="surplusgoal"
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
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                <div className="col-span-2">
                  <label
                    className={`w-full text-base font-medium col-span-2 leading-tight text-[#9794AA]`}
                  >
                    When can this resource be accessed to fund goals?{" "}
                    <span className={`text-red-600`}>*</span>
                  </label>
                  <div className="w-full mt-3 space-y-2">
                    {/* Accesible now */}
                    <div className="flex gap-2 items-center">
                      <span className="relative flex items-center rounded-full cursor-pointer">
                        <input
                          id={"now"}
                          checked={
                            values.resources_access_time?.type === "now"
                              ? true
                              : false
                          }
                          onChange={() => {
                            let findmain = members?.find(
                              (v) => v.type === "self"
                            );
                            let dummyNow = {
                              member: {
                                _id: findmain?._id,
                                name: findmain?.fname,
                                dob: findmain?.dob,
                                age_retire: findmain?.age_retire,
                                life_expectancy: findmain?.life_expectancy,
                              },
                              type: "now",
                              value: 0,
                              date: nowdate,
                              desc: `Accessible now ${moment(nowdate).get(
                                "year"
                              )}`,
                            };
                            setFieldValue("resources_access_time", dummyNow);
                          }}
                          name="resources_access_time"
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
                      <p className="text-[#686677] text-base">Accessible now</p>
                    </div>
                    {/* year */}
                    <div className="flex gap-2 items-center">
                      <span className="relative flex items-center rounded-full cursor-pointer">
                        <input
                          id={"year"}
                          checked={
                            values.resources_access_time?.type === "year"
                              ? true
                              : false
                          }
                          onChange={() => {
                            let findtype = startTime.find(
                              (v) => v.type === "year"
                            );
                            setFieldValue("resources_access_time", findtype);
                          }}
                          name="resources_access_time"
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
                            label: startTime?.find((v) => v?.type === "year")
                              ?.value,
                            value: startTime?.find((v) => v?.type === "year")
                              ?.value,
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
                            values.resources_access_time?.type === "age"
                              ? true
                              : false
                          }
                          onChange={() => {
                            let findtype = startTime.find(
                              (v) => v.type === "age"
                            );
                            setFieldValue("resources_access_time", findtype);
                          }}
                          name="resources_access_time"
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
                            label: startTime?.find((v) => v?.type === "age")
                              ?.member?.name,
                            value: startTime?.find((v) => v?.type === "age")
                              ?.member?._id,
                          }}
                          mainClass="w-max"
                          onchange={(e) => {
                            let val = e.target.value;
                            let dummymember = members?.find(
                              (v) => v.value === val
                            );
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
                                    life_expectancy:
                                      dummymember?.life_expectancy,
                                  },
                                  desc: `When ${dummymember?.label} is ${
                                    v.value
                                  } (${moment(date)?.get("year")})`,
                                };
                              }
                              return { ...v };
                            });
                            setStartTime(dummystart);
                          }}
                        />
                        <p>is</p>
                        <Dropdown
                          options={ages}
                          value={{
                            label: startTime?.find((v) => v?.type === "age")
                              ?.value,
                            value: startTime?.find((v) => v?.type === "age")
                              ?.value,
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
                                  desc: `When ${
                                    v?.member?.name
                                  } is ${val} (${moment(dob).get("year")})`,
                                  value: val,
                                };
                              }
                              return { ...v };
                            });
                            setStartTime(dummystart);
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
                            values.resources_access_time?.type === "age_retire"
                              ? true
                              : false
                          }
                          onChange={() => {
                            let findtype = startTime.find(
                              (v) => v.type === "age_retire"
                            );
                            setFieldValue("resources_access_time", findtype);
                          }}
                          name="resources_access_time"
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
                            label: startTime?.find(
                              (v) => v?.type === "age_retire"
                            )?.member?.name,
                            value: startTime?.find(
                              (v) => v?.type === "age_retire"
                            )?.member?._id,
                          }}
                          mainClass="w-max"
                          onchange={(e) => {
                            let val = e.target.value;
                            let dummymember = members?.find(
                              (v) => v.value === val
                            );
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
                                    life_expectancy:
                                      dummymember?.life_expectancy,
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
                            setStartTime(dummystart);
                          }}
                        />
                        <p>reaches</p>
                        <Dropdown
                          options={retireagelist}
                          value={{
                            label: startTime?.find(
                              (v) => v?.type === "age_retire"
                            )?.value,
                            value: startTime?.find(
                              (v) => v?.type === "age_retire"
                            )?.value,
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
                            setStartTime(dummystart);
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
                            values.resources_access_time?.type === "life_exp"
                              ? true
                              : false
                          }
                          onChange={() => {
                            let findtype = startTime.find(
                              (v) => v.type === "life_exp"
                            );
                            setFieldValue("resources_access_time", findtype);
                          }}
                          name="resources_access_time"
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
                            label: startTime?.find(
                              (v) => v?.type === "life_exp"
                            )?.member?.name,
                            value: startTime?.find(
                              (v) => v?.type === "life_exp"
                            )?.member?._id,
                          }}
                          mainClass="w-max"
                          onchange={(e) => {
                            let val = e.target.value;
                            let dummymember = members?.find(
                              (v) => v.value === val
                            );
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
                                    life_expectancy:
                                      dummymember?.life_expectancy,
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
                            setStartTime(dummystart);
                          }}
                        />
                        <p>reaches</p>
                        <Dropdown
                          options={lifeExpectancylist}
                          value={{
                            label: startTime?.find(
                              (v) => v?.type === "life_exp"
                            )?.value,
                            value: startTime?.find(
                              (v) => v?.type === "life_exp"
                            )?.value,
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
                            setStartTime(dummystart);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
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
                        type="button"
                        onClick={() => {
                          router.push({
                            pathname: "/resources",
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
  if (!ctx?.query?.investment_type) {
    return {
      redirect: {
        destination: "/resources",
        permanent: false,
      },
    };
  }
  let investment_type =
    ctx?.query?.investment_type === undefined
      ? ""
      : JSON.parse(ctx?.query?.investment_type);
  return { props: { state: investment_type, user: user } };
};
