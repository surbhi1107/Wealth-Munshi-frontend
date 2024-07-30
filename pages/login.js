import Input from "@/components/Input";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import Image from "next/image";
import logo from "../public/Images/logo.png";
import SideImage from "../public/Images/auth_bg.png";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Loading from "@/components/Loading";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      setError("");
      setLoading(true);
      let data = {
        email: values.email,
        password: values.password,
      };
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_END_POINT}/user/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...data }),
          }
        );
        let res = await response.json();
        if (res?.success) {
          successToast("Logged in Successfully please wait.");
          Cookies.set("access-token", res?.token);
          Cookies.set("user", JSON.stringify(res?.user));
          router.push({
            pathname: "/",
          });
          // setLoading(false);
        } else {
          setLoading(false);
          setError(res.error);
          errorToast(res.error);
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

  useMemo(() => {
    setError("");
  }, [values]);

  return (
    <div className={`w-full h-full lg:min-h-screen md:flex px-5 py-5`}>
      <div className="lg:min-h-[650px] w-full items-center md:w-[20%] lg:w-[10%] md:flex-auto px-12">
        <div className="h-full flex flex-col justify-between">
          <div className="flex flex-col items-center">
            <div className="mb-8">
              <Image src={logo} priority={true} width="160" alt="logo" />
            </div>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="text-left mb-2">
                <h2 className="text-[32px] font-semibold">
                  Welcome to Wealthmunshi 👋
                </h2>
                <p className="text-[#49475A] mt-2">
                  Please login to continue to your account.
                </p>
              </div>
              <div className="grid gap-3">
                <Input
                  label={"Email Address"}
                  value={values.email}
                  id="email"
                  keytype="email"
                  onchange={handleChange}
                  error={touched.email && errors.email ? true : false}
                  errorText={errors.email}
                />
                <Input
                  label={"Password"}
                  value={values.password}
                  id="password"
                  onchange={handleChange}
                  error={touched.password && errors.password ? true : false}
                  errorText={errors.password}
                  isPassword
                />
                <span className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-[#57BA52] mt-1"
                  >
                    Forgot Password?
                  </Link>
                </span>
              </div>
              <div className="w-full mt-2">
                {loading ? (
                  <div className="rounded-lg bg-[#57BA52] py-[8.5px] w-full flex justify-center">
                    <Loading isWhiteSpinner={true} />
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full border border-[#57BA52] rounded-lg py-2 text-[#57BA52] relative bg-transparent px-5 font-medium uppercase text-gray-800 transition-colors before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:origin-top-left before:scale-y-0 before:bg-[#57BA52] before:transition-transform before:duration-300 before:content-[''] hover:text-white before:hover:scale-y-100 before:rounded-lg"
                  >
                    Sign In
                  </button>
                )}
                <div className="text-[#49475A] text-center mt-3">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="text-[#57BA52] underline decoration-[#57BA52]"
                  >
                    Sign up
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
        <div
          className="h-full backdrop-filter backdrop-contrast-75 rounded-[20px] text-[22px] md:text-[28px] font-bold text-white p-[20px]"
          style={{
            backgroundColor: "#B7E9F640",
            backdropFilter: "contrast(75%)",
            border: "1px solid",
          }}
        >
          Start your journey by one click, explore your wealth!
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
