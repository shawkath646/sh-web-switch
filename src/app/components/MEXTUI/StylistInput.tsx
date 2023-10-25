import { StylistInputPropsType } from "./types";

const StylistInput: React.FC<StylistInputPropsType> = ({ label, errorText="", ...props }) => {
    return (
        <div className="w-full">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={label.split(" ").join("")}>{label}</label>
            <input {...props} className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${errorText ? "border-red-500" : "border-blue-500"} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`} id={label.split(" ").join("")} />
            <p className="text-red-500 text-xs italic h-5">{errorText}</p>
        </div>
    );
}

export default StylistInput;