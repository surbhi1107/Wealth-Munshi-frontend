import Input from "@/components/Input";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import Image from "next/image";
import logo from "../../../public/Images/logo.png";
import SideImage from "../../../public/Images/auth_bg.png";
import { useRouter } from "next/router";
import Loading from "@/components/Loading";
import { toast, ToastContainer } from "react-toastify";

const ResetPassword = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
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
      password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Password is required"),
      confirm_password: Yup.string()
        .required("Confirm Password is required")
        .oneOf(
          [Yup.ref("password"), null],
          "Password and Confirm Password must match"
        ),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError("");
        let data = {
          password: values.password,
          id: props?.id,
          token: props?.token,
        };
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data }),
        });
        let res1 = await res.json();
        if (res1.success) {
          router.push("/login");
          successToast(res1?.msg);
          // setLoading(false);
        } else {
          setError(res1.error);
          errorToast(res1.error);
          setLoading(false);
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
    <div className={`w-full h-full min-h-screen md:flex px-5 py-5`}>
      <div className="lg:min-h-[650px] w-full items-center md:w-[20%] lg:w-[10%] flex-auto px-12">
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
              <div className="text-left mb-2">
                <h2 className="text-[32px] font-semibold">Reset Password</h2>
                {/* <p className="text-[#49475A] mt-2">
                Please login to continue to your account.
              </p> */}
              </div>
              <div className="grid gap-3">
                <Input
                  label={"Password"}
                  value={values.password}
                  id="password"
                  keytype="password"
                  isPassword
                  onchange={handleChange}
                  error={touched.password && errors.password ? true : false}
                  errorText={errors.password}
                />
                <Input
                  label={"Confirm Password"}
                  value={values.confirm_password}
                  id="confirm_password"
                  keytype="password"
                  onchange={handleChange}
                  isPassword
                  error={
                    touched.confirm_password && errors.confirm_password
                      ? true
                      : false
                  }
                  errorText={errors.confirm_password}
                />
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
                    Reset Password
                  </button>
                )}
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
          className="min-h-[650px] max-h-screen h-full w-full"
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  return { props: ctx.params };
};

export default ResetPassword;
