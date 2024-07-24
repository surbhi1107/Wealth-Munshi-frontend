const RadioInput = ({ id, label, data, inputClass = "", value, onchange }) => {
  return (
    <div className="w-full grid md:grid-flow-col items-start md:grid-cols-10 gap-[13px]">
      <label className="w-full text-base font-normal col-span-2 leading-tight text-[#111111] ">
        {label}
      </label>
      <div className="flex flex-col col-span-2 gap-2">
        {data.map((v, i) => (
          <div key={i}>
            {/* <div className="flex gap-2 items-center" key={i}>
              <span className="relative flex items-center rounded-full cursor-pointer">
                <input
                  name="color"
                  type="radio"
                  className="before:content[''] peer relative -gray h-5 w-5 cursor-pointer appearance-none rounded-full border border-[#1200E1]  before:absolute before:top-2/4 before:left-2/4 before:block before:h-[17px] before:w-[17px] before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-[#1200E1] before:opacity-0 before:transition-opacity checked:border-[#1200E1] checked:before:bg-[#1200E1] hover:before:opacity-10"
                  id="green"
                />
                <span className="absolute text-[#1200E1] transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                  </svg>
                </span>
              </span>
              <label
                className="text-[#5A577F] text-sm capitalize"
                htmlFor={v.value}
              >
                {v.name}
              </label>
            </div> */}
            <div className="flex gap-2 items-center">
              <input
                type="radio"
                id={v.value}
                checked={v.value === value ? true : false}
                onChange={() => {
                  onchange(v);
                }}
                className="checked:bg-green-500 w-4 h-4"
              />
              <label
                className="text-[#5A577F] text-base capitalize"
                htmlFor={v.value}
              >
                {v.name}
              </label>
            </div>
          </div>
        ))}
      </div>
    </div> //#1200E1 //
  );
};

export default RadioInput;
