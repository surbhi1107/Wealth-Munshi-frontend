import Input from "@/components/Input";
import RadioInput from "@/components/RadioInput";
import * as Yup from "yup";
import { useFormik } from "formik";
import Dropdown from "@/components/Dropdown";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import logo from "../public/Images/logo.png";
import SideImage from "../public/Images/auth_bg.png";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import Link from "next/link";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";

let client_types = [
  { label: "individual", value: -1 },
  { label: "couple", value: 1 },
  { label: "trust/company", value: 2 },
];

let currencies = [
  { label: "Afghan Afghani", value: "AFA" },
  { label: "Albanian Lek", value: "ALL" },
  { label: "Algerian Dinar", value: "DZD" },
  { label: "Angolan Kwanza", value: "AOA" },
  { label: "Argentine Peso", value: "ARS" },
  { label: "Armenian Dram", value: "AMD" },
  { label: "Aruban Florin", value: "AWG" },
  { label: "Australian Dollar", value: "AUD" },
  { label: "Azerbaijani Manat", value: "AZN" },
  { label: "Bahamian Dollar", value: "BSD" },
  { label: "Bahraini Dinar", value: "BHD" },
  { label: "Bangladeshi Taka", value: "BDT" },
  { label: "Barbadian Dollar", value: "BBD" },
  { label: "Belarusian Ruble", value: "BYR" },
  { label: "Belgian Franc", value: "BEF" },
  { label: "Belize Dollar", value: "BZD" },
  { label: "Bermudan Dollar", value: "BMD" },
  { label: "Bhutanese Ngultrum", value: "BTN" },
  { label: "Bitcoin", value: "BTC" },
  { label: "Bolivian Boliviano", value: "BOB" },
  { label: "Bosnia-Herzegovina Convertible Mark", value: "BAM" },
  { label: "Botswanan Pula", value: "BWP" },
  { label: "Brazilian Real", value: "BRL" },
  { label: "British Pound Sterling", value: "GBP" },
  { label: "Brunei Dollar", value: "BND" },
  { label: "Bulgarian Lev", value: "BGN" },
  { label: "Burundian Franc", value: "BIF" },
  { label: "Cambodian Riel", value: "KHR" },
  { label: "Canadian Dollar", value: "CAD" },
  { label: "Cape Verdean Escudo", value: "CVE" },
  { label: "Cayman Islands Dollar", value: "KYD" },
  { label: "CFA Franc BCEAO", value: "XOF" },
  { label: "CFA Franc BEAC", value: "XAF" },
  { label: "CFP Franc", value: "XPF" },
  { label: "Chilean Peso", value: "CLP" },
  { label: "Chilean Unit of Account", value: "CLF" },
  { label: "Chinese Yuan", value: "CNY" },
  { label: "Colombian Peso", value: "COP" },
  { label: "Comorian Franc", value: "KMF" },
  { label: "Congolese Franc", value: "CDF" },
  { label: "Costa Rican Colón", value: "CRC" },
  { label: "Croatian Kuna", value: "HRK" },
  { label: "Cuban Convertible Peso", value: "CUC" },
  { label: "Czech Republic Koruna", value: "CZK" },
  { label: "Danish Krone", value: "DKK" },
  { label: "Djiboutian Franc", value: "DJF" },
  { label: "Dominican Peso", value: "DOP" },
  { label: "East Caribbean Dollar", value: "XCD" },
  { label: "Egyptian Pound", value: "EGP" },
  { label: "Eritrean Nakfa", value: "ERN" },
  { label: "Estonian Kroon", value: "EEK" },
  { label: "Ethiopian Birr", value: "ETB" },
  { label: "Euro", value: "EUR" },
];

let phoneTypes = [
  { label: "Home", value: 1 },
  { label: "Work", value: 2 },
  { label: "Mobile", value: 3 },
];

let months = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "Jun", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "Octomber", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [years, setYears] = useState([]);
  const [days, setDays] = useState([]);
  const [selectedYear, setSelectedYear] = useState({});
  const [selectedMonth, setSelectedMonth] = useState({});
  const [selectedDay, setSelectedDay] = useState({});
  const [error, setError] = useState("");
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
      age_retire: "",
      life_expectancy: "",
      country_code: "",
      partner: {
        fname: "",
        lname: "",
        email: "",
        age_retire: "",
        life_expectancy: "",
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
      age_retire: Yup.string().required("Age to retire is required"),
      life_expectancy: Yup.string().required("Life expectancy is required"),
      country_code: Yup.string(),
      trust_name: Yup.string(),
      partner: Yup.object({
        fname: Yup.string(),
        lname: Yup.string(),
        email: Yup.string(),
        age_retire: Yup.string(),
        life_expectancy: Yup.string(),
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
          phone_number: values.phone_number,
          client_type: values.client_type.value,
          email: values.email,
          currency: values.currency.value,
          ...(values.client_type.value === -1 ? { dob: values.dob } : {}),
          ...(values.client_type.value === 1
            ? {
                age_retire: values.age_retire,
                life_expectancy: values.life_expectancy,
                partner_details: {
                  fname: values.partner.fname,
                  lname: values.partner.lname,
                  email: values.partner.email,
                  age_retire: values.partner.age_retire,
                  life_expectancy: values.partner.life_expectancy,
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
    getYears();
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
                <div className="grid grid-cols-2 gap-5 mt-5">
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
                <div className="grid grid-cols-2 gap-5">
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
                  <div className="grid grid-cols-2 gap-5">
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
                <div className="">
                  <label className="w-full text-base font-medium col-span-2 leading-tight text-[#9794AA] mb-2">
                    Phone Number
                  </label>
                  <div className="w-full grid grid-cols-4 gap-5">
                    <div className="col-span-2 w-full grid grid-cols-2 gap-x-5">
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
                      {touched.dob && errors.dob ? (
                        <span className="w-full text-sm mt-2 text-[#ff0000]">
                          {errors.dob}
                        </span>
                      ) : (
                        <></>
                      )}
                    </div>
                  </>
                ) : values?.client_type?.value === 1 ? (
                  <div className="grid grid-cols-2 gap-5">
                    <Input
                      label={"Age to retire"}
                      value={values.age_retire}
                      id="age_retire"
                      onchange={handleChange}
                      keytype={"number"}
                      min={1}
                      error={
                        touched.age_retire && errors.age_retire ? true : false
                      }
                      errorText={errors.age_retire}
                    />
                    <Input
                      label={"Life expectancy"}
                      value={values.life_expectancy}
                      id="life_expectancy"
                      onchange={handleChange}
                      keytype={"number"}
                      min={1}
                      error={
                        touched.life_expectancy && errors.life_expectancy
                          ? true
                          : false
                      }
                      errorText={errors.life_expectancy}
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
                      <Input
                        label={"Age to retire"}
                        value={values.partner?.age_retire}
                        id="age_retire"
                        onchange={(e) => {
                          setFieldValue("partner.age_retire", e.target.value);
                        }}
                        keytype={"number"}
                        min={1}
                        error={
                          touched.partner?.age_retire &&
                          values?.partner?.age_retire?.length === 0
                            ? true
                            : false
                        }
                        errorText={"Age Retire is Required"}
                        require
                      />
                      <Input
                        label={"Life expectancy"}
                        value={values.partner?.life_expectancy}
                        id="life_expectancy"
                        onchange={(e) => {
                          setFieldValue(
                            "partner.life_expectancy",
                            e.target.value
                          );
                        }}
                        keytype={"number"}
                        min={1}
                        error={
                          touched.partner?.life_expectancy &&
                          values?.partner?.life_expectancy?.length === 0
                            ? true
                            : false
                        }
                        errorText={"Life expectancy is Required"}
                        require
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
              © 2024 Welathmunshi. All Rights Reserved
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 lg:min-h-[650px] bg-[#57BA52] rounded-[20px] p-[20px]">
        <div className="h-full backdrop-filter backdrop-contrast-75 rounded-[20px] text-[30px] md:text-[45px] font-bold text-white p-[20px]">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s.
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
