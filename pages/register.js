import Input from "@/components/Input";
import RadioInput from "@/components/RadioInput";
import * as Yup from "yup";
import { useFormik } from "formik";
import Dropdown from "@/components/Dropdown";
import Select from "react-select";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import logo from "../public/Images/logo.png";
import SideImage from "../public/Images/auth_bg.png";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";

let client_types = [
  { name: "individual", value: -1 },
  { name: "couple", value: 1 },
  { name: "trust/company", value: 2 },
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
  const [selectedYear, setSelectedYear] = useState();
  const [selectedMonth, setSelectedMonth] = useState();
  const [selectedDay, setSelectedDay] = useState();
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
      dob: Yup.string().required("Dob is required"),
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
          dob: values.dob,
          currency: values.currency.value,
          age_retire: values.age_retire,
          life_expectancy: values.life_expectancy,
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
          router.push("/login");
          setLoading(false);
        } else {
          setLoading(false);
          setError(res1.error);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        setError(
          error.response ? error.response.data.error : "An error occurred"
        );
      }
    },
  });

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
                <div className="">
                  <Input
                    label={"Email Address"}
                    value={values.email}
                    id="email"
                    keytype="email"
                    onchange={handleChange}
                    error={touched.email && errors.email ? true : false}
                    errorText={errors.email}
                  />
                </div>
                <div className="">
                  <label className="w-full text-base font-medium col-span-2 leading-tight text-[#9794AA] mb-2">
                    Phone Number
                  </label>
                  <div className="w-full grid grid-cols-3 gap-5">
                    <Select
                      value={values.phone_type}
                      id="phone_type"
                      onChange={(v) => {
                        setValues({
                          ...values,
                          phone_type: {
                            label: v.label,
                            value: v.value,
                          },
                        });
                      }}
                      options={phoneTypes}
                      components={{ IndicatorSeparator: null }}
                      styles={{
                        container: (base) => ({
                          ...base,
                          fontSize: "16px",
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          padding: "4px",
                          color: "#686677",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "#686677",
                        }),
                        input: (base) => ({
                          ...base,
                          color: "#686677",
                        }),
                        menu: (base) => ({
                          ...base,
                          color: "#686677",
                        }),
                      }}
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 6,
                        colors: {
                          ...theme.colors,
                          primary: "#CBCAD7",
                        },
                      })}
                    />
                    <input
                      value={values.phone_number}
                      id="phone_number"
                      onChange={handleChange}
                      type="number"
                      className={`w-full md:col-span-2 rounded border-0 ring-[0.5px] ring-[#CBCAD7] text-[#686677] bg-transparent px-2 py-2 text-base font-normal text-blue-gray-700 outline-0  focus:ring-2 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50`}
                    />
                  </div>
                  {touched.phone_number && errors.phone_number ? (
                    <span className="w-full text-sm mt-2 text-[#ff0000]">
                      {errors.phone_number}
                    </span>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="">
                  <label className="w-full text-base font-medium col-span-2 leading-tight text-[#9794AA] mb-2">
                    Date of Birth
                  </label>
                  <div className="grid grid-cols-3 gap-5">
                    <Select
                      value={selectedDay}
                      placeholder="Day:"
                      onChange={(v) => {
                        setSelectedDay(v);
                        if (selectedMonth?.value && selectedYear?.value) {
                          let day = v.value;
                          let month = selectedMonth.value;
                          let year = selectedYear.value;
                          let date = `${day}-${month}-${year}`;
                          setFieldValue("dob", new Date(date));
                        }
                      }}
                      options={days}
                      components={{ IndicatorSeparator: null }}
                      styles={{
                        container: (base) => ({
                          ...base,
                          fontSize: "16px",
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          padding: "4px",
                          color: "#686677",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "#686677",
                        }),
                        input: (base) => ({
                          ...base,
                          color: "#686677",
                        }),
                        menu: (base) => ({
                          ...base,
                          color: "#686677",
                        }),
                      }}
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 6,
                        colors: {
                          ...theme.colors,
                          primary: "#CBCAD7",
                        },
                      })}
                    />
                    <Select
                      value={selectedMonth}
                      placeholder="Month:"
                      onChange={(v) => {
                        setSelectedMonth(v);
                        // get list of days in selected month
                        let year =
                          selectedYear?.value ?? new Date().getFullYear();
                        let month = v.value;
                        const numDays = (y, m) => new Date(y, m, 0).getDate();
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
                          let date = `${day}-${month}-${year}`;
                          setFieldValue("dob", new Date(date));
                        }
                      }}
                      options={months}
                      components={{ IndicatorSeparator: null }}
                      styles={{
                        container: (base) => ({
                          ...base,
                          fontSize: "16px",
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          padding: "4px",
                          color: "#686677",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "#686677",
                        }),
                        input: (base) => ({
                          ...base,
                          color: "#686677",
                        }),
                        menu: (base) => ({
                          ...base,
                          color: "#686677",
                        }),
                      }}
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 6,
                        colors: {
                          ...theme.colors,
                          primary: "#CBCAD7",
                        },
                      })}
                    />
                    <Select
                      value={selectedYear}
                      placeholder="Year:"
                      onChange={(v) => {
                        setSelectedYear(v);
                        // get list of days in selected month
                        let year = v.value;
                        let month =
                          selectedMonth?.value ?? new Date().getMonth();
                        const numDays = (y, m) => new Date(y, m, 0).getDate();
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
                          let date = `${day}-${month}-${year}`;
                          setFieldValue("dob", new Date(date));
                        }
                      }}
                      options={years}
                      components={{ IndicatorSeparator: null }}
                      styles={{
                        container: (base) => ({
                          ...base,
                          fontSize: "16px",
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          padding: "4px",
                          color: "#686677",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "#686677",
                        }),
                        input: (base) => ({
                          ...base,
                          color: "#686677",
                        }),
                        menu: (base) => ({
                          ...base,
                          color: "#686677",
                        }),
                      }}
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 6,
                        colors: {
                          ...theme.colors,
                          primary: "#CBCAD7",
                        },
                      })}
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
                <div className="grid grid-cols-2 gap-5">
                  <Input
                    label={"Age to retire"}
                    value={values.age_retire}
                    id="age_retire"
                    onchange={handleChange}
                    keytype={"number"}
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
                    error={
                      touched.life_expectancy && errors.life_expectancy
                        ? true
                        : false
                    }
                    errorText={errors.life_expectancy}
                  />
                </div>
                <Dropdown
                  label="Currency"
                  options={currencies}
                  value={values.currency}
                  onchange={(v) => {
                    console.log(v);
                    setFieldValue("currency.label", v.label);
                    setFieldValue("currency.value", v.value);
                  }}
                  error={
                    touched.currency?.value && errors.currency?.value
                      ? true
                      : false
                  }
                  errorText={errors.currency?.value}
                />
                <RadioInput
                  data={client_types}
                  label={"Type Of Client"}
                  value={values.client_type.value}
                  onchange={(v) => {
                    setFieldValue("client_type.value", v.value);
                    setFieldValue("client_type.name", v.name);
                  }}
                />
              </div>
              <div className="w-full mt-2">
                {error?.length > 0 && (
                  <span className="w-full text-sm mt-2 text-[#ff0000]">
                    {error}
                  </span>
                )}
                {loading ? (
                  <div className="rounded-lg bg-[#57BA52] py-[8.5px] w-full flex justify-center">
                    <Loading isWhiteSpinner={true} />
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full border border-[#57BA52] rounded-lg py-2 text-[#57BA52] relative bg-transparent px-5 font-medium uppercase text-gray-800 transition-colors before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:origin-top-left before:scale-y-0 before:bg-[#57BA52] before:transition-transform before:duration-300 before:content-[''] hover:text-white before:hover:scale-y-100 before:rounded-lg"
                  >
                    Sign Up
                  </button>
                )}
                <div className="text-[#49475A] text-center mt-3">
                  Don’t have an account?{" "}
                  <a
                    href="/login"
                    className="text-[#57BA52] underline decoration-[#57BA52]"
                  >
                    Sing In
                  </a>
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
      <div className="flex-1 lg:min-h-[650px]">
        <Image
          src={SideImage}
          className="min-h-[650px] lg:max-h-fit h-full w-full"
        />
      </div>
    </div>
  );
}
