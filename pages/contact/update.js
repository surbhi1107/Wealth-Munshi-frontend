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
import * as cookie from "cookie";
import Dropdown from "@/components/Dropdown";
import { toast, ToastContainer } from "react-toastify";
import jsonData from "../../data.json";

const Update = (props) => {
  let contactId = props?.query?.contactId;
  let months = jsonData.months ?? [];
  let genders = jsonData.genders ?? [];
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [years, setYears] = useState([]);
  const [days, setDays] = useState([]);
  const [selectedYear, setSelectedYear] = useState();
  const [selectedMonth, setSelectedMonth] = useState();
  const [selectedDay, setSelectedDay] = useState();
  const [lifeExpectancies, setLifeExpectancies] = useState([]);
  const [ages, setAges] = useState([]);
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
      type: "",
      fname: "",
      mname: "",
      lname: "",
      dob: "",
      age_retire: {
        label: "65",
        value: 65,
      },
      life_expectancy: {
        label: "85",
        value: 85,
      },
      gender: {
        name: "Male",
        value: 1,
      },
    },
    validationSchema: Yup.object({
      type: Yup.string(),
      fname: Yup.string().required("First Name is required"),
      mname: Yup.string(),
      lname: Yup.string().required("Last Name is required"),
      dob: Yup.string().required("Dob is required"),
      gender: Yup.object({
        value: Yup.string(),
        name: Yup.string(),
      }),
      age_retire: Yup.object({
        value: Yup.string().required("Required"),
        label: Yup.string(),
      }),
      life_expectancy: Yup.object({
        value: Yup.string().required("Required"),
        label: Yup.string(),
      }),
    }),
    onSubmit: async (values) => {
      try {
        setUpdateLoading(true);
        let data = {
          contactId: contactId,
          details: {
            type: props?.state?.value,
            fname: values.fname,
            mname: values.mname,
            lname: values.lname,
            dob: values.dob,
            age_retire: values.age_retire?.value,
            life_expectancy: values.life_expectancy?.value,
            gender: values.gender.value,
          },
        };
        const res = await fetch(`/api/contact/update`, {
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
          errorToast(res1.error);
        }
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

  const getContactData = async (age, life) => {
    try {
      setLoading(true);
      let data = { contactId };
      const res = await fetch(`/api/contact/get-contact-byid`, {
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
        let damiage = age.find((v) => v.value === res1?.data?.age_retire);
        let damilife = life.find(
          (v) => v.value === res1?.data?.life_expectancy
        );
        setValues({
          ...values,
          fname: res1?.data?.fname ?? "",
          mname: res1?.data?.mname ?? "",
          lname: res1?.data?.lname ?? "",
          age_retire: {
            label: damiage?.label,
            value: damiage?.value,
          },
          life_expectancy: {
            label: damilife?.label,
            value: damilife?.value,
          },
          gender: {
            name: damigender?.name,
            value: damigender?.value,
          },
          dob: res1?.data?.dob ?? "",
          type: res1?.data?.type ?? "",
        });
      } else {
        setLoading(false);
        errorToast(res1.error);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      errorToast("");
    }
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
      if (dummylifeexpectancy.length > 0 && dummyage?.length > 0)
        getContactData(dummyage, dummylifeexpectancy);
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
            Update Contact
          </h1>
          {loading ? (
            <div className="w-full flex justify-center mt-10">
              <Loading />
            </div>
          ) : (
            <>
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
                  {values?.type ?? ""}
                </p>
              </div>
              <p className="text-base text-[#A1A1AA] !mt-3">
                Please confirm that your details are current and click Save.
              </p>
              <form
                className="!mt-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <div className="md:grid md:grid-cols-2 gap-x-8 gap-y-3">
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
                  <div className="">
                    <label className="w-full text-base font-medium col-span-2 leading-tight text-[#54577A] mb-2">
                      Date of Birth <span className={`text-red-600`}>*</span>
                    </label>
                    <div className="w-full lg:w-[75%] grid grid-cols-3 gap-5">
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
                            let dummyfind = days?.find((v) => v.value === val);
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
                            let dummyfind = years?.find((v) => v.value === val);
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
                  <Dropdown
                    label={"Age to retire"}
                    options={ages}
                    value={values.age_retire}
                    onchange={(e) => {
                      let val = parseInt(e.target.value);
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
                      touched.age_retire?.value && errors?.age_retire?.value
                        ? true
                        : false
                    }
                    errorText={errors?.age_retire?.value}
                  />
                  <Dropdown
                    label={"Life expectancy"}
                    options={lifeExpectancies}
                    value={values.life_expectancy}
                    onchange={(e) => {
                      let val = parseInt(e.target.value);
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
                      touched.life_expectancy?.value &&
                      errors.life_expectancy?.value
                        ? true
                        : false
                    }
                    errorText={errors.life_expectancy?.value}
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
                        <button
                          type="button"
                          onClick={() => {
                            router.push({
                              pathname: "/",
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
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Update;
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
  if (!ctx?.query?.contactId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: { query: { ...ctx?.query } } };
};
