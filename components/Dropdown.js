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
