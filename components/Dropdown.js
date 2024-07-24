import Select from "react-select";

const Dropdown = ({
  options = [],
  value,
  onchange,
  label,
  dropdownClass = "",
}) => {
  return (
    <>
      <div className="w-full md:grid md:grid-flow-col md:items-center md:grid-cols-10 gap-[13px]">
        {label && (
          <label className="w-full text-base font-normal md:col-span-2 leading-tight text-[#111111] ">
            {label}
          </label>
        )}
        <div className={`col-span-2 ${dropdownClass}`}>
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
                padding: "1px",
                paddingRight: "5px",
                paddingLeft: "5px",
              }),
              dropdownIndicator: (base) => ({
                ...base,
                padding: "0px",
                paddingRight: "1px",
              }),
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 6,
              colors: {
                ...theme.colors,
                primary: "#A9A6CF",
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
      </div>
    </>
  );
};

export default Dropdown;
