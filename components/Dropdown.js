import Select from "react-select";

const Dropdown = ({
  options = [],
  value,
  onchange,
  label,
  dropdownClass = "",
  error,
  errorText,
}) => {
  return (
    <>
      <div className="w-full">
        {label && (
          <label className="w-full text-base font-medium col-span-2 leading-tight text-[#9794AA] mb-2">
            {label}
          </label>
        )}
        <div className={`${dropdownClass}`}>
          <Select
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
          />
          {/* <select
            value={value.value}
            onChange={onchange}
            className="bg-white !border-white ring-1 ring-[#A9A6CF] text-gray-900 text-sm rounded focus:!ring-2 focus:ring-[#A9A6CF] focus:!border-0 focus-visible:!border-white block w-full p-2 py-2"
          >
            {options.map((option, i) => (
              <option
                value={option.value}
                selected={option.value === value.value ? true : false}
                className=""
                key={i}
              >
                {option.name}
              </option>
            ))}
          </select> */}
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
