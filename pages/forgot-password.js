import Input from "@/components/Input";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import Image from "next/image";
import logo from "../public/Images/logo.png";
import SideImage from "../public/Images/auth_bg.png";
import Loading from "@/components/Loading";
import { toast, ToastContainer } from "react-toastify";

const ForgotPassword = () => {
  const [successMsg, setSuccessMsg] = useState("");
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
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Email is required"),
    }),
    onSubmit: async (values) => {
      try {
        setError("");
        setLoading(true);
        let data = {
          email: values.email,
        };
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data }),
        });
        let res1 = await res.json();
        if (res1.success) {
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
                <h2 className="text-[32px] font-semibold">
                  Forget Your Password
                </h2>
                <p className="text-[#49475A] mt-2">
                  Enter your email and we will send your link to email address.
                </p>
              </div>
              <div className="grid gap-3 mt-3 mb-10">
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
                    Submit
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
      <div className="flex-1 bg-[#57BA52] rounded-[20px] p-[20px]">
        <div className="h-full backdrop-filter backdrop-contrast-75 rounded-[20px] text-[30px] md:text-[45px] font-bold text-white p-[20px]">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s.
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
