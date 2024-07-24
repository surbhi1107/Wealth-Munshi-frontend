const RadioInput = ({
  id,
  label,
  data,
  inputClass = "",
  value,
  onchange,
  error,
  errorText,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="w-full text-base font-medium col-span-2 leading-tight text-[#9794AA] !mb-4">
          {label}
        </label>
      )}
      <div className="flex col-span-3 gap-3">
        {data.map((v, i) => (
          <div key={i}>
            <div className="flex gap-2 items-center">
              <span className="relative flex items-center rounded-full cursor-pointer">
                <input
                  id={v.value}
                  checked={v.value === value ? true : false}
                  onChange={() => {
                    onchange(v);
                  }}
                  name="color"
                  type="radio"
                  className="before:content[''] peer relative -gray h-4 w-4 cursor-pointer appearance-none rounded-full border border-[#757575] before:absolute before:top-2/4 before:left-2/4 before:block before:h-[17px] before:w-[17px] before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-[#57BA52] before:opacity-0 before:transition-opacity checked:border-[#57BA52] checked:before:bg-[#57BA52]"
                />
                <span className="absolute text-[#57BA52] transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-2.5 w-2.5"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                  </svg>
                </span>
              </span>
              <label
                className="text-[#686677] text-base capitalize"
                htmlFor={v.value}
              >
                {v.name}
              </label>
            </div>
          </div>
        ))}
      </div>
      {error && (
        <span className="w-full text-sm mt-2 text-[#ff0000]">{errorText}</span>
      )}
    </div>
  );
};

export default RadioInput;
