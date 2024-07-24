const Input = ({ value, onchange, id, label, keytype, inputClass = "" }) => {
  return (
    <div className="w-full md:grid md:grid-flow-col md:items-center md:grid-cols-10 gap-[13px]">
      <label className="w-full text-base font-normal col-span-2 leading-tight text-[#111111] ">
        {label}
      </label>
      <input
        onChange={onchange}
        id={id}
        value={value}
        type={keytype ? keytype : "text"}
        className={`w-full md:col-span-2 rounded border-0 ring-[0.5px] ring-[#A9A6CF] bg-transparent px-[5px] py-2 text-base font-normal text-blue-gray-700 outline-0  focus:ring-2 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 ${inputClass}`}
      />
    </div>
  );
};

export default Input;
