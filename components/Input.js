import { useState } from "react";

const Input = ({
  value,
  onchange,
  id,
  label,
  keytype = "text",
  inputClass = "",
  error,
  errorText,
  isPassword = false,
  isSearch = false,
  placeholder = "",
}) => {
  let dummytype = isPassword ? "password" : keytype;
  const [type, setType] = useState(dummytype);
  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = () => {
    if (showPassword) setType("password");
    else setType("text");
    setShowPassword(!showPassword);
  };
  return (
    <div className="w-full">
      {label && (
        <label className="w-full text-base font-medium col-span-2 leading-tight text-[#9794AA] mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          onChange={onchange}
          id={id}
          value={value}
          type={type}
          placeholder={placeholder}
          className={`w-full rounded border-0 ring-[0.5px] ring-[#CBCAD7] text-[#686677] bg-transparent px-2 py-2 text-base font-normal text-blue-gray-700 outline-0  focus:ring-2 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 ${inputClass}`}
        />
        {isPassword ? (
          <div className="absolute top-[10px] right-[10px] cursor-pointer">
            {showPassword ? (
              <span onClick={handleToggle}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.2"
                  stroke="#49475A"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              </span>
            ) : (
              <span onClick={handleToggle}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#49475A"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </span>
            )}
          </div>
        ) : isSearch ? (
          <div className="absolute top-[11px] right-[8px] cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 30 30"
              strokeWidth="1.5"
              stroke="#49475A"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
        ) : (
          <></>
        )}
      </div>
      {error && (
        <span className="w-full text-sm mt-2 text-[#ff0000]">{errorText}</span>
      )}
    </div>
  );
};

export default Input;
