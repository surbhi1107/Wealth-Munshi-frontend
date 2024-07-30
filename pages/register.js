import Input from "@/components/Input";
import RadioInput from "@/components/RadioInput";
import * as Yup from "yup";
import { useFormik } from "formik";
import Dropdown from "@/components/Dropdown";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import logo from "../public/Images/logo.png";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import Link from "next/link";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import jsonData from "../data.json";

export default function Register() {
  const router = useRouter();
  let client_types = jsonData.client_types ?? [];
  let currencies = jsonData.currencies ?? [];
  let phoneTypes = jsonData.phoneTypes ?? [];
  let months = jsonData.months ?? [];
  const [lifeExpectancies, setLifeExpectancies] = useState([]);
  const [ages, setAges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState([]);
  const [days, setDays] = useState([]);
  const [selectedYear, setSelectedYear] = useState({});
  const [selectedMonth, setSelectedMonth] = useState({});
  const [selectedDay, setSelectedDay] = useState({});
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
      phone_number: "",
      client_type: {
        name: "individual",
        value: -1,
      },
      trust_name: "",
      fname: "",
      lname: "",
      email: "",
      dob: "",
      currency: {
        label: "Indian Rupees",
        value: "INR",
      },
      phone_type: {
        label: "Home",
        value: 1,
      },
      age_retire: {
        label: "65",
        value: 65,
      },
      life_expectancy: {
        label: "85",
        value: 85,
      },
      country_code: "",
      partner: {
        fname: "",
        lname: "",
        email: "",
        age_retire: {
          label: "65",
          value: 65,
        },
        life_expectancy: {
          label: "85",
          value: 85,
        },
      },
    },
    validationSchema: Yup.object({
      phone_number: Yup.string().required("Phone Number is required"),
      client_type: Yup.object({
        value: Yup.string().required("Required"),
        name: Yup.string(),
      }),
      fname: Yup.string().required("First Name is required"),
      lname: Yup.string().required("Last Name is required"),
      email: Yup.string().required("Email is required"),
      dob: Yup.string(),
      currency: Yup.object({
        value: Yup.string().required("Required"),
        label: Yup.string(),
      }),
      phone_type: Yup.object({
        value: Yup.string().required("Required"),
        label: Yup.string(),
      }),
      age_retire: Yup.object({
        value: Yup.string().required("Required"),
        label: Yup.string(),
      }),
      life_expectancy: Yup.object({
        value: Yup.string().required("Required"),
        label: Yup.string(),
      }),
      country_code: Yup.string(),
      trust_name: Yup.string(),
      partner: Yup.object({
        fname: Yup.string(),
        lname: Yup.string(),
        email: Yup.string(),
        age_retire: Yup.object({
          value: Yup.string().required("Required"),
          label: Yup.string(),
        }),
        life_expectancy: Yup.object({
          value: Yup.string().required("Required"),
          label: Yup.string(),
        }),
      }),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError("");
        let data = {
          fname: values.fname,
          lname: values.lname,
          phone_type: values.phone_type.value,
          country_code: values.country_code,
          phone_number: values.phone_number,
          client_type: values.client_type.value,
          email: values.email,
          currency: values.currency.value,
          ...(values.client_type.value === -1 ? { dob: values.dob } : {}),
          ...(values.client_type.value === 1
            ? {
                age_retire: values.age_retire?.value,
                life_expectancy: values.life_expectancy?.value,
                partner_details: {
                  fname: values.partner.fname,
                  lname: values.partner.lname,
                  email: values.partner.email,
                  age_retire: values.partner.age_retire?.value,
                  life_expectancy: values.partner.life_expectancy?.value,
                },
              }
            : {}),
          ...(values.client_type?.value === 2
            ? {
                trust_name: values?.trust_name,
              }
            : {}),
        };
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_END_POINT}/user/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...data }),
          }
        );
        let res1 = await res.json();
        if (res1.success) {
          successToast(res1?.msg);
          router.push("/login");
          // setLoading(false);
        } else {
          setLoading(false);
          setError(res1.error);
          errorToast(res1.error);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        setError(
          error.response ? error.response.data.error : "An error occurred"
        );
        errorToast(
          error.response ? error.response.data.error : "An error occurred"
        );
      }
    },
  });

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
    let currentMonth = new Date().getMonth();
    //get last 110 year of list
    let damiyears = [];
    for (var i = currentYear; i >= currentYear - 110; i--) {
      damiyears.push({ label: i, value: i });
    }
    setYears(damiyears);
    // get days of current month
    let damiDays = [];
    const numDays = (y, m) => new Date(y, m, 0).getDate();
    let monthofDays = numDays(currentYear, currentMonth);
    for (var i = 1; i <= monthofDays; i++) {
      damiDays.push({ label: i, value: i });
    }
    setDays(damiDays);
  };

  useEffect(() => {
    if (!ignore) {
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
      setLifeExpectancies(dummylifeexpectancy);
      setAges(dummyage);
    }
    return () => {
      ignore = true;
    };
  }, []);

  useMemo(() => {
    setError("");
  }, [values]);

  return (
    <div className={`w-full h-full md:flex px-5 py-5`}>
      <div className="h-full w-full md:w-[20%] lg:w-[10%] flex-auto px-12">
        <div className="h-full flex flex-col justify-between">
          <div className="flex flex-col items-center">
            <div className="mb-8">
              <Image src={logo} priority={true} width="160" alt="logo" />
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="grid gap-4"
            >
              <div className="text-left">
                <h2 className="text-[32px] font-semibold">
                  Welcome to Wealthmunshi 👋
                </h2>
                <p className="text-[#49475A] mt-2">
                  Please login to continue to your account.
                </p>
              </div>
              <div className="grid gap-3">
                <div className="grid md:grid-cols-2 gap-5 mt-5">
                  <Input
                    label={"First Name"}
                    value={values.fname}
                    id="fname"
                    onchange={handleChange}
                    error={touched.fname && errors.fname ? true : false}
                    errorText={errors.fname}
                  />
                  <Input
                    label={"Last Name"}
                    value={values.lname}
                    id="lname"
                    onchange={handleChange}
                    error={touched.lname && errors.lname ? true : false}
                    errorText={errors.lname}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <Input
                    label={"Email Address"}
                    value={values.email}
                    id="email"
                    keytype="email"
                    onchange={handleChange}
                    error={touched.email && errors.email ? true : false}
                    errorText={errors.email}
                  />
                  <Dropdown
                    label="Type of Client"
                    options={client_types}
                    value={values.client_type}
                    onchange={(e) => {
                      let val =
                        e.target.value?.length > 0
                          ? parseInt(e.target.value)
                          : "";
                      let dummyfind = client_types?.find(
                        (v) => v.value === val
                      );
                      setValues({
                        ...values,
                        isPartner: dummyfind?.value === 1 ? true : false,
                        client_type: {
                          name: dummyfind.name,
                          value: dummyfind.value,
                        },
                      });
                    }}
                    error={
                      touched.client_type?.value && errors.client_type?.value
                        ? true
                        : false
                    }
                    errorText={errors.client_type?.value}
                  />
                </div>
                {values?.client_type?.value === 2 ? (
                  <div className="grid md:grid-cols-2 gap-5">
                    <Input
                      label={"Trust/Company name"}
                      value={values.trust_name}
                      id="trust_name"
                      onchange={handleChange}
                      error={
                        touched.trust_name && values?.trust_name?.length === 0
                          ? true
                          : false
                      }
                      errorText={"Trust Name is Required"}
                    />
                  </div>
                ) : (
                  <></>
                )}
                <div className="w-full">
                  <label className="w-full text-base font-medium col-span-2 leading-tight text-[#9794AA] mb-2">
                    Phone Number
                  </label>
                  <div className="w-full grid md:grid-cols-4 gap-y-2 md:gap-y-0 md:gap-5">
                    <div className="w-full md:col-span-2 grid md:grid-cols-2 gap-y-2 md:gap-y-0 md:gap-x-5">
                      <Dropdown
                        options={phoneTypes}
                        value={values.phone_type}
                        onchange={(e) => {
                          let val =
                            e.target.value?.length > 0
                              ? parseInt(e.target.value)
                              : "";
                          let dummyfind = phoneTypes?.find(
                            (v) => v.value === val
                          );
                          setValues({
                            ...values,
                            phone_type: {
                              label: dummyfind.label,
                              value: dummyfind.value,
                            },
                          });
                        }}
                      />
                      <Input
                        value={values.country_code}
                        id="country_code"
                        onChange={(e) => {
                          let val = e.target.value;
                          let maxLength = 10;
                          if (val.length <= maxLength) {
                            setFieldValue("country_code", val);
                          }
                        }}
                        placeholder="Country Code"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        value={values.phone_number}
                        id="phone_number"
                        onChange={(e) => {
                          let val = e.target.value;
                          let maxLength = 10;
                          if (val.length <= maxLength) {
                            setFieldValue("phone_number", val);
                          }
                        }}
                        placeholder="Phone Number"
                        keytype="tel"
                      />
                    </div>
                  </div>
                  {touched.phone_number && errors.phone_number ? (
                    <span className="w-full text-sm mt-2 text-[#ff0000]">
                      {errors.phone_number}
                    </span>
                  ) : (
                    <></>
                  )}
                </div>
                {values?.client_type?.value === -1 ? (
                  <>
                    <div className="">
                      <label className="w-full text-base font-medium col-span-2 leading-tight text-[#9794AA] mb-2">
                        Date of Birth
                      </label>
                      <div className="grid grid-cols-3 gap-5">
                        <Dropdown
                          options={days}
                          placeholder="Day:"
                          value={selectedDay}
                          onchange={(e) => {
                            if (e.target.value === "") {
                              setSelectedDay({});
                              setFieldValue("dob", "");
                            } else {
                              let val =
                                e.target.value?.length > 0
                                  ? parseInt(e.target.value)
                                  : "";
                              let dummyfind = days?.find(
                                (v) => v.value === val
                              );
                              setSelectedDay({
                                ...dummyfind,
                              });
                              if (selectedMonth?.value && selectedYear?.value) {
                                let day = val;
                                let month = selectedMonth.value;
                                let year = selectedYear.value;
                                let date = `${month}-${day}-${year}`;
                                setFieldValue(
                                  "dob",
                                  moment(date).startOf("D").format()
                                );
                              }
                            }
                          }}
                        />
                        <Dropdown
                          options={months}
                          placeholder="Month:"
                          value={selectedMonth}
                          onchange={(e) => {
                            if (e.target.value === "") {
                              setSelectedMonth({});
                              setFieldValue("dob", "");
                            } else {
                              let val =
                                e.target.value?.length > 0
                                  ? parseInt(e.target.value)
                                  : "";
                              let dummyfind = months?.find(
                                (v) => v.value === val
                              );
                              setSelectedMonth({
                                ...dummyfind,
                              });
                              // get list of days in selected month
                              let year =
                                selectedYear?.value ?? new Date().getFullYear();
                              let month = val;
                              const numDays = (y, m) =>
                                new Date(y, m, 0).getDate();
                              let monthofDays = numDays(year, month);
                              let damimonthDays = [];
                              for (var i = 1; i <= monthofDays; i++) {
                                damimonthDays.push({ label: i, value: i });
                              }
                              setDays(damimonthDays);
                              if (
                                selectedDay?.value &&
                                selectedDay.value > monthofDays
                              )
                                setSelectedDay({
                                  label: monthofDays,
                                  value: monthofDays,
                                });
                              if (selectedDay?.value && selectedYear?.value) {
                                let day = selectedDay.value;
                                let date = `${month}-${day}-${year}`;
                                setFieldValue(
                                  "dob",
                                  moment(date).startOf("D").format()
                                );
                              }
                            }
                          }}
                        />
                        <Dropdown
                          options={years}
                          placeholder="Year:"
                          value={selectedYear}
                          onchange={(e) => {
                            if (e.target.value === "") {
                              setSelectedYear({});
                              setFieldValue("dob", "");
                            } else {
                              let val =
                                e.target.value?.length > 0
                                  ? parseInt(e.target.value)
                                  : "";
                              let dummyfind = years?.find(
                                (v) => v.value === val
                              );
                              setSelectedYear({
                                ...dummyfind,
                              });
                              // get list of days in selected month
                              let year = val;
                              let month =
                                selectedMonth?.value ?? new Date().getMonth();
                              const numDays = (y, m) =>
                                new Date(y, m, 0).getDate();
                              let monthofDays = numDays(year, month);
                              let damimonthDays = [];
                              for (var i = 1; i <= monthofDays; i++) {
                                damimonthDays.push({ label: i, value: i });
                              }
                              setDays(damimonthDays);
                              if (
                                selectedDay?.value &&
                                selectedDay.value > monthofDays
                              )
                                setSelectedDay({
                                  label: monthofDays,
                                  value: monthofDays,
                                });
                              if (selectedMonth?.value && selectedDay?.value) {
                                let day = selectedDay.value;
                                let date = `${month}-${day}-${year}`;
                                setFieldValue(
                                  "dob",
                                  moment(date).startOf("D").format()
                                );
                              }
                            }
                          }}
                        />
                      </div>
                      {touched.dob && values?.dob?.length === 0 ? (
                        <span className="w-full text-sm mt-2 text-[#ff0000]">
                          Date of birth is required
                        </span>
                      ) : (
                        <></>
                      )}
                    </div>
                  </>
                ) : values?.client_type?.value === 1 ? (
                  <div className="grid grid-cols-2 gap-5">
                    <Dropdown
                      label={"Age to retire"}
                      options={ages}
                      value={values.age_retire}
                      onchange={(e) => {
                        let val = e.target.value;
                        let dummyfind = ages?.find((v) => v.value === val);
                        setValues({
                          ...values,
                          age_retire: {
                            label: dummyfind.label,
                            value: dummyfind.value,
                          },
                        });
                      }}
                      error={
                        touched.age_retire &&
                        values.age_retire?.label?.length === 0
                          ? true
                          : false
                      }
                      errorText={"Age retire is Required"}
                    />
                    <Dropdown
                      label={"Life expectancy"}
                      options={lifeExpectancies}
                      value={values.life_expectancy}
                      onchange={(e) => {
                        let val = e.target.value;
                        let dummyfind = lifeExpectancies?.find(
                          (v) => v.value === val
                        );
                        setValues({
                          ...values,
                          life_expectancy: {
                            label: dummyfind.label,
                            value: dummyfind.value,
                          },
                        });
                      }}
                      error={
                        touched.life_expectancy?.label &&
                        values.life_expectancy?.label?.length === 0
                          ? true
                          : false
                      }
                      errorText={"Life expectancy is Required"}
                    />
                  </div>
                ) : (
                  <></>
                )}
                <Dropdown
                  label="Currency"
                  options={currencies}
                  value={values.currency}
                  onchange={(e) => {
                    let val = e.target.value;
                    let dummyfind = currencies?.find((v) => v.value === val);
                    setValues({
                      ...values,
                      currency: {
                        label: dummyfind.label,
                        value: dummyfind.value,
                      },
                    });
                  }}
                  error={
                    touched.currency?.value && errors.currency?.value
                      ? true
                      : false
                  }
                  errorText={errors.currency?.value}
                />
                {values?.client_type.value === 1 ? (
                  <>
                    <div className="text-[#49475A] font-bold mt-1">
                      Partner Details:
                    </div>
                    <div className="grid grid-cols-2 gap-5 !-mt-2">
                      <Input
                        label={"First Name"}
                        value={values.partner.fname}
                        id="fname"
                        onchange={(e) => {
                          setFieldValue("partner.fname", e.target.value);
                        }}
                        error={
                          touched.partner?.fname &&
                          values?.partner?.fname?.length === 0
                            ? true
                            : false
                        }
                        errorText={"First Name is Required"}
                        require
                      />
                      <Input
                        label={"Last Name"}
                        value={values.partner.lname}
                        id="lname"
                        onchange={(e) => {
                          setFieldValue("partner.lname", e.target.value);
                        }}
                        error={
                          touched.partner?.lname &&
                          values?.partner?.lname?.length === 0
                            ? true
                            : false
                        }
                        errorText={"Last Name is Required"}
                        require
                      />
                    </div>
                    <div className="">
                      <Input
                        label={"Email Address"}
                        value={values.partner?.email}
                        id="email"
                        keytype="email"
                        onchange={(e) => {
                          setFieldValue("partner.email", e.target.value);
                        }}
                        error={
                          touched.partner?.email &&
                          values?.partner?.email?.length === 0
                            ? true
                            : false
                        }
                        errorText={"Email is Required"}
                        require
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <Dropdown
                        label={"Age to retire"}
                        options={ages}
                        value={values.partner?.age_retire}
                        onchange={(e) => {
                          let val = e.target.value;
                          let dummyfind = ages?.find((v) => v.value === val);
                          setValues({
                            ...values,
                            partner: {
                              ...values.partner,
                              age_retire: {
                                label: dummyfind.label,
                                value: dummyfind.value,
                              },
                            },
                          });
                        }}
                        error={
                          touched.partner?.age_retire?.value &&
                          values?.partner?.age_retire?.value?.length === 0
                            ? true
                            : false
                        }
                        errorText={"Age Retire is Required"}
                      />
                      <Dropdown
                        label={"Life expectancy"}
                        options={lifeExpectancies}
                        value={values.partner?.life_expectancy}
                        onchange={(e) => {
                          let val = e.target.value;
                          let dummyfind = lifeExpectancies?.find(
                            (v) => v.value === val
                          );
                          setValues({
                            ...values,
                            partner: {
                              ...values.partner,
                              life_expectancy: {
                                label: dummyfind.label,
                                value: dummyfind.value,
                              },
                            },
                          });
                        }}
                        error={
                          touched.partner?.life_expectancy?.value &&
                          values?.partner?.life_expectancy?.value?.length === 0
                            ? true
                            : false
                        }
                        errorText={"Life expectancy is Required"}
                      />
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div className="w-full mt-2">
                {loading ? (
                  <div className="rounded-lg bg-[#57BA52] py-[8.5px] w-full flex justify-center">
                    <Loading isWhiteSpinner={true} />
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full border border-[#57BA52] rounded-lg py-2 text-[#57BA52] relative bg-transparent px-5 font-medium uppercase transition-colors before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:origin-top-left before:scale-y-0 before:bg-[#57BA52] before:transition-transform before:duration-300 before:content-[''] hover:text-white before:hover:scale-y-100 before:rounded-lg"
                  >
                    Sign Up
                  </button>
                )}
                <div className="text-[#49475A] text-center mt-3">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-[#57BA52] underline decoration-[#57BA52]"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </form>
          </div>
          <div className="w-full mt-8 mb-5 md:mb-0">
            <p className="text-center md:text-left text-xs text-[#8A8A8A]">
              {" © 2024 Welathmunshi. All Rights Reserved"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 lg:min-h-[650px] bg-[#57BA52] rounded-[20px] p-[20px]">
        <div
          className="h-full backdrop-filter backdrop-contrast-75 rounded-[20px] text-[22px] md:text-[28px] font-bold text-white p-[20px]"
          style={{
            backgroundColor: "#B7E9F640",
            backdropFilter: "contrast(75%)",
            border: "1px solid",
          }}
        >
          {
            " Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
          }
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
