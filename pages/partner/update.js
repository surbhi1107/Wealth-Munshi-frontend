import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import { useRouter, withRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import Input from "@/components/Input";
import Select from "react-select";
import RadioInput from "@/components/RadioInput";
import moment from "moment";

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

let genders = [
  { name: "Male", value: -1 },
  { name: "Female", value: 1 },
];

const Update = (props) => {
  let partnerId = props?.query?.partnerId;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [years, setYears] = useState([]);
  const [days, setDays] = useState([]);
  const [selectedYear, setSelectedYear] = useState();
  const [selectedMonth, setSelectedMonth] = useState();
  const [selectedDay, setSelectedDay] = useState();
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
      fname: "",
      mname: "",
      lname: "",
      //   email: "",
      dob: "",
      phone_number: "",
      life_expectancy: "",
      age_retire: "",
      gender: {
        name: "Male",
        value: 1,
      },
    },
    validationSchema: Yup.object({
      fname: Yup.string().required("First Name is required"),
      mname: Yup.string().required("Middle Name is required"),
      lname: Yup.string().required("Last Name is required"),
      //   email: Yup.string().required("Email is required"),
      dob: Yup.string().required("Dob is required"),
      phone_number: Yup.string(),
      gender: Yup.object({
        value: Yup.string(),
        name: Yup.string(),
      }),
      life_expectancy: Yup.number().positive(),
      age_retire: Yup.number()
        .positive()
        .lessThan(
          Yup.ref("life_expectancy"),
          "should be less than life expectancy"
        ),
    }),
    onSubmit: async (values) => {
      try {
        setUpdateLoading(true);
        setError("");
        let data = {
          partnerId: partnerId,
          details: {
            fname: values.fname,
            mname: values.mname,
            lname: values.lname,
            // email: values.email,
            phone_number: values.phone_number,
            dob: values.dob,
            age_retire: values.age_retire,
            life_expectancy: values.life_expectancy,
            gender: values.gender.value,
          },
        };
        const res = await fetch(`/api/partner/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data }),
        });
        let res1 = await res.json();
        if (res1.success) {
          router.push("/");
          setUpdateLoading(false);
        } else {
          setUpdateLoading(false);
          setError(res1.error);
        }
      } catch (error) {
        console.error(error);
        setUpdateLoading(false);
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

  const getmemberData = async () => {
    try {
      setLoading(true);
      let data = { partnerId };
      const res = await fetch(`/api/partner/get-partner-byid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data }),
      });
      let res1 = await res.json();
      if (res1.success) {
        setLoading(false);
        let damigender = genders.find((v) => v.value === res1?.data?.gender);
        setValues({
          ...values,
          fname: res1?.data?.fname ?? "",
          mname: res1?.data?.mname ?? "",
          lname: res1?.data?.lname ?? "",
          //   email: res1?.data?.email ?? "",
          phone_number: res1?.data?.phone_number ?? "",
          life_expectancy: res1?.data?.life_expectancy ?? "",
          age_retire: res1?.data?.age_retire ?? "",
          gender: {
            name: damigender?.name,
            value: damigender?.value,
          },
          dob: res1?.data?.dob ?? "",
        });
      } else {
        setLoading(false);
        setError(res1.error);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError("");
    }
  };

  useMemo(() => {
    setError("");
  }, [values]);

  useEffect(() => {
    if (!ignore) {
      getYears();
      getmemberData();
    }
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <Layout>
      <div className={`w-full space-y-6`}>
        <div className="w-full px-[30px] py-[30px] bg-white rounded-md space-y-6">
          <h1 className="text-xl md:text-[26px] font-semibold text-[#45486A]">
            Update Partner
          </h1>
          {loading ? (
            <div className="w-full flex justify-center mt-10">
              <Loading />
            </div>
          ) : (
            <>
              <p className="text-base text-[#A1A1AA] !mt-3">
                Please confirm that your details are current and click Save.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <div className="md:grid md:grid-cols-2 gap-x-8 gap-y-3 !mt-3">
                  <Input
                    label={"First Name"}
                    value={values.fname}
                    id="fname"
                    onchange={handleChange}
                    error={touched.fname && errors.fname ? true : false}
                    errorText={errors.fname}
                    require
                  />
                  <Input
                    label={"Middle Name"}
                    value={values.mname}
                    id="mname"
                    onchange={handleChange}
                    error={touched.mname && errors.mname ? true : false}
                    errorText={errors.mname}
                    require
                    requireClass="text-[#54577A]"
                  />
                  <Input
                    label={"Last Name"}
                    value={values.lname}
                    id="lname"
                    onchange={handleChange}
                    error={touched.lname && errors.lname ? true : false}
                    errorText={errors.lname}
                    require
                    requireClass="text-[#54577A]"
                  />
                  <Input
                    label={"Contact Number"}
                    value={values.phone_number}
                    id="phone_number"
                    keytype="number"
                    maxLength={10}
                    onchange={(e) => {
                      let val = e.target.value;
                      let maxLength = 10;
                      if (val.length <= maxLength) {
                        setFieldValue("phone_number", val);
                      }
                    }}
                    error={
                      touched.phone_number && errors.phone_number ? true : false
                    }
                    errorText={errors.phone_number}
                  />
                  {/* <Input
                label={"Email Address"}
                value={values.email}
                id="email"
                keytype="email"
                onchange={handleChange}
                error={touched.email && errors.email ? true : false}
                errorText={errors.email}
              /> */}
                  <div className="">
                    <label className="w-full text-base font-medium col-span-2 leading-tight text-[#54577A] mb-2">
                      Date of Birth <span className={`text-[#54577A]}`}>*</span>
                    </label>
                    <div className="w-full lg:w-[75%] grid grid-cols-3 gap-5">
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
                  <Input
                    label={"Age to retire"}
                    value={values.age_retire}
                    id="age_retire"
                    onchange={handleChange}
                    keytype={"number"}
                    min={1}
                    max={values?.life_expectancy}
                    error={
                      touched.age_retire && errors.age_retire ? true : false
                    }
                    errorText={errors.age_retire}
                  />
                  <RadioInput
                    data={genders}
                    label={"Gender"}
                    value={values.gender.value}
                    onchange={(v) => {
                      setValues({
                        ...values,
                        gender: {
                          name: v.name,
                          value: v.value,
                        },
                      });
                    }}
                  />
                </div>
                <div className="mt-5">
                  {error?.length > 0 && (
                    <span className="w-full text-sm text-[#ff0000]">
                      {error}
                    </span>
                  )}
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
                          Update
                        </button>
                        <button className="w-full border border-[#999999] hover:border-[#57BA52] rounded-lg py-2 bg-transparent px-5 font-medium capitalize text-[#999999] hover:text-[#57BA52]">
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Update;
export const getServerSideProps = async (ctx) => {
  if (!ctx?.query?.partnerId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: { query: { ...ctx?.query } } };
};
