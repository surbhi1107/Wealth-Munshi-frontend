const Dropdown = ({
  options = [],
  value,
  onchange,
  label,
  mainClass = "",
  dropdownOuterClass = "",
  dropdownClass = "",
  labelClass = "",
  placeholder = "",
  error,
  errorText,
}) => {
  let newVal = options.find((v) => v?.value === value?.value) ?? {};
  return (
    <>
      <div className={`w-full ${mainClass}`}>
        {label && (
          <label
            className={`w-full text-base font-medium col-span-2 leading-tight text-[#9794AA] ${labelClass}`}
          >
            {label}
          </label>
        )}
        <div className={`${dropdownOuterClass} mt-1`}>
          <select
            value={newVal?.value}
            onChange={onchange}
            className={`w-full h-[40px] block px-1.5 bg-white !border-white ring-[0.5px] ring-[#CBCAD7] text-[#686677] text-base rounded focus:!ring-2 focus:ring-[#A9A6CF] focus:!border-0 focus-visible:!outline-none ${dropdownClass}`}
          >
            {placeholder?.length > 0 ? (
              <option value="">{placeholder}</option>
            ) : (
              <></>
            )}
            {options.map((option, i) => (
              <option
                value={option.value}
                selected={option.value === newVal.value ? true : false}
                className=""
                key={i}
              >
                {option.label}
              </option>
            ))}
          </select>
          {/* <Select
            value={value}
            onChange={onchange}
            options={options}
            components={{ IndicatorSeparator: null }}
            styles={{
              container: (base) => ({
                ...base,
                fontSize: "16px",
              }),
              valueContainer: (base) => ({
                ...base,
                padding: "4px",
                paddingLeft: "5px",
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
          /> */}
        </div>
        {error && (
          <span className="w-full text-sm mt-2 text-[#ff0000]">
            {errorText}
          </span>
        )}
      </div>
    </>
  );
};

export default Dropdown;
