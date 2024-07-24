import Input from "@/components/Input";
import RadioInput from "@/components/RadioInput";
import * as Yup from "yup";
import { useFormik } from "formik";
import Dropdown from "@/components/Dropdown";
import Select from "react-select";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import logo from "../Images/logo.png";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Loading from "@/components/Loading";

const login = () => {
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
      const res = await fetch("/api/auth/login", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data }),
      });
      let res1 = await res.json();
      if (res1.success) {
        Cookies.set("access-token", res1.token);
        router.push("/");
        setLoading(false);
      } else {
        setLoading(false);
        setError(res1.error);
      }
    },
  });

  useMemo(() => {
    setError("");
  }, [values]);

  return (
    <div className={`w-full h-full lg:min-h-screen md:flex px-5 py-5 bg-white`}>
      <div className="lg:min-h-[650px] w-full items-center md:w-[20%] lg:w-[10%] md:flex-auto px-12">
        <div className="h-full flex flex-col justify-between">
          <div className="flex flex-col items-center">
            <div className="mb-8">
              <Image src={logo} priority={true} width="160" alt="logo" />
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4">
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
                  <a
                    href="/forgot-password"
                    className="text-sm text-[#57BA52] mt-1"
                  >
                    Forgot Password?
                  </a>
                </span>
              </div>
              <div className="w-full mt-2">
                {error?.length > 0 && (
                  <span className="w-full text-sm mt-2 text-[#ff0000]">
                    {error}
                  </span>
                )}
                {loading ? (
                  <div className="rounded-lg bg-[#57BA52] py-[8.5px] w-full flex justify-center">
                    <Loading />
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full border border-[#57BA52] rounded-lg py-2 text-[#57BA52] relative bg-transparent px-5 font-medium uppercase text-gray-800 transition-colors before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:origin-top-left before:scale-y-0 before:bg-[#57BA52] before:transition-transform before:duration-300 before:content-[''] hover:text-[#fff] before:hover:scale-y-100 before:rounded-lg"
                  >
                    Sign In
                  </button>
                )}
                <div className="text-[#49475A] text-center mt-3">
                  Don’t have an account?{" "}
                  <a
                    href="/register"
                    className="text-[#57BA52] underline decoration-[#57BA52]"
                  >
                    Sing up
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
      <div className="flex-1 min-h-[650px]">
        <div className="min-h-[650px] h-full rounded-md bg-auth-side-img bg-[length:100%_100%]"></div>
      </div>
    </div>
  );
};

export default login;

export function getServerSideProps(ctx) {
  const authSession = ctx.req;
  console.log(ctx.req.cookies);
  return {
    props: {},
  };
}
