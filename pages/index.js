import Input from "@/components/Input";
import RadioInput from "@/components/RadioInput";
import * as Yup from "yup";
import { useFormik } from "formik";
import Dropdown from "@/components/Dropdown";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

let client_types = [
  { name: "individual", value: "individual" },
  { name: "couple", value: "couple" },
  { name: "trust/company", value: "company" },
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
  { label: "Home", value: "home" },
  { label: "Work", value: "work" },
  { label: "Mobile", value: "mobile" },
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

export default function Home() {
  const [years, setYears] = useState([]);
  const [days, setDays] = useState([]);
  const [selectedYear, setSelectedYear] = useState();
  const [selectedMonth, setSelectedMonth] = useState();
  const [selectedDay, setSelectedDay] = useState();
  const { values, handleChange, setFieldValue, setValues, handleSubmit } =
    useFormik({
      initialValues: {
        phone_number: "",
        client_type: {
          name: "individual",
          value: "individual",
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
          value: "home",
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
        dob: Yup.string().required("Dob is required"),
        currency: Yup.object({
          value: Yup.string().required("Required"),
          label: Yup.string(),
        }),
        phone_type: Yup.object({
          value: Yup.string().required("Required"),
          label: Yup.string(),
        }),
      }),
      onSubmit: (values) => {
        console.log(values);
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

  return (
    <main
      className={`flex w-full min-h-screen flex-col items-center justify-between px-12 md:px-24 lg:px-[130px] bg-white`}
    >
      <div className="w-full">
        <div className="bg-[#F4F3FF] px-10 md:px-14 lg:px-[65px] py-6 md:py-9 rounded-md mt-2">
          <form onSubmit={handleSubmit}>
            <div className="w-full grid gap-5">
              <div className="w-full grid md:grid-flow-col items-center md:grid-cols-10 gap-[13px]">
                <label className="w-full text-base font-normal col-span-2 leading-tight text-[#111111] ">
                  Phone Number
                </label>
                <div className={`md:col-span-2  lg:col-span-2 xl:col-span-1`}>
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
                        padding: "1px",
                        paddingRight: "5px",
                        paddingLeft: "5px",
                      }),
                      dropdownIndicator: (base) => ({
                        ...base,
                        padding: "0px",
                        paddingRight: "1px",
                      }),
                    }}
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 6,
                      colors: {
                        ...theme.colors,
                        primary: "#A9A6CF",
                      },
                    })}
                  />
                  {/* <select
                  value={values.phone_type}
                  onChange={handleChange}
                  className="bg-white !border-white ring-1 ring-[#A9A6CF] text-gray-900 text-sm rounded focus:!ring-2 focus:ring-[#A9A6CF] focus:!border-0 focus-visible:!border-white block w-full p-2 py-2"
                >
                  {phoneTypes.map((option, i) => (
                    <option value={option.value} className="" key={i}>
                      {option.label}
                    </option>
                  ))}
                </select> */}
                </div>
                <input
                  value={values.phone_number}
                  id="phone_number"
                  onChange={handleChange}
                  type="number"
                  className={`h-full w-full md:col-span-2 rounded border-0 ring-[0.5px] ring-[#A9A6CF] bg-transparent px-[5px] py-2 text-base font-normal text-blue-gray-700 outline-0  focus:ring-2 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50`}
                />
              </div>
              <RadioInput
                data={client_types}
                label={"Type Of Client"}
                value={values.client_type.value}
                onchange={(v) => {
                  setFieldValue("client_type.value", v.value);
                  setFieldValue("client_type.name", v.name);
                }}
              />
              <Input
                label={"First name"}
                value={values.fname}
                id="fname"
                onchange={handleChange}
              />
              <Input
                label={"Last name"}
                value={values.lname}
                id="lname"
                onchange={handleChange}
              />
              <Input
                label={"Email"}
                inputClass="!col-span-4"
                value={values.email}
                id="email"
                keytype="email"
                onchange={handleChange}
              />
              <div className="w-full md:grid md:grid-flow-col md:items-center md:grid-cols-10 gap-[13px]">
                <div className="md:col-span-2"></div>
                <div className="md:col-span-4">
                  <p>Main Contact</p>
                </div>
              </div>
              <div className="w-full md:grid md:grid-flow-col md:items-center md:grid-cols-10 gap-[13px]">
                <label className="w-full text-base font-normal col-span-2 leading-tight text-[#111111] ">
                  DOB
                </label>
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
                      padding: "1px",
                      paddingRight: "5px",
                      paddingLeft: "5px",
                    }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      padding: "0px",
                      paddingRight: "1px",
                    }),
                  }}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 6,
                    colors: {
                      ...theme.colors,
                      primary: "#A9A6CF",
                    },
                  })}
                />
                <Select
                  value={selectedMonth}
                  placeholder="Month:"
                  onChange={(v) => {
                    setSelectedMonth(v);
                    // get list of days in selected month
                    let year = selectedYear?.value ?? new Date().getFullYear();
                    let month = v.value;
                    const numDays = (y, m) => new Date(y, m, 0).getDate();
                    let monthofDays = numDays(year, month);
                    let damimonthDays = [];
                    for (var i = 1; i <= monthofDays; i++) {
                      damimonthDays.push({ label: i, value: i });
                    }
                    setDays(damimonthDays);
                    if (selectedDay?.value && selectedDay.value > monthofDays)
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
                      padding: "1px",
                      paddingRight: "5px",
                      paddingLeft: "5px",
                    }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      padding: "0px",
                      paddingRight: "1px",
                    }),
                  }}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 6,
                    colors: {
                      ...theme.colors,
                      primary: "#A9A6CF",
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
                    let month = selectedMonth?.value ?? new Date().getMonth();
                    const numDays = (y, m) => new Date(y, m, 0).getDate();
                    let monthofDays = numDays(year, month);
                    let damimonthDays = [];
                    for (var i = 1; i <= monthofDays; i++) {
                      damimonthDays.push({ label: i, value: i });
                    }
                    setDays(damimonthDays);
                    if (selectedDay?.value && selectedDay.value > monthofDays)
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
                      padding: "1px",
                      paddingRight: "5px",
                      paddingLeft: "5px",
                    }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      padding: "0px",
                      paddingRight: "1px",
                    }),
                  }}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 6,
                    colors: {
                      ...theme.colors,
                      primary: "#A9A6CF",
                    },
                  })}
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
              />
            </div>
            <div className="w-full flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-3 py-2 bg-navyBlue text-[#fff] rounded-[27px]"
              >
                Next
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 43 43"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="21.5545" cy="21.5425" r="21.2212" fill="white" />
                  <g clip-path="url(#clip0_8_415)">
                    <path
                      opacity="0.984"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M17.9244 12.0606C18.1008 12.0606 18.2772 12.0606 18.4535 12.0606C18.6146 12.1296 18.7674 12.2177 18.9121 12.3252C21.5871 15.0002 24.2621 17.6752 26.9371 20.3502C27.291 20.7719 27.3262 21.2187 27.0429 21.6906C24.2856 24.4479 21.5283 27.2052 18.771 29.9625C18.6619 30.017 18.5561 30.07 18.4535 30.1212C18.2772 30.1212 18.1008 30.1212 17.9244 30.1212C17.4635 29.8667 17.0696 29.5257 16.7427 29.0983C16.5251 28.7042 16.5369 28.3162 16.778 27.9342C19.0595 25.6585 21.3348 23.3774 23.6036 21.0909C21.3103 18.7917 19.0233 16.4871 16.7427 14.1771C16.5321 13.7955 16.5439 13.4192 16.778 13.0483C17.0543 12.772 17.3306 12.4957 17.6069 12.2194C17.716 12.1648 17.8218 12.1119 17.9244 12.0606Z"
                      fill="#090071"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_8_415">
                      <rect
                        width="18.0606"
                        height="18.0606"
                        fill="white"
                        transform="translate(12.9758 12.0606)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export async function getServerSideProps(context) {
  // console.log("././", context);
  return {
    props: {},
  };
}
