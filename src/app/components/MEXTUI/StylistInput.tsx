import { StylistInputPropsTypes } from "./types";


const StylistInput = ({ label, register, errorText, labelText }: StylistInputPropsTypes) => {
    return (
        <div className="w-full">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={label}>{labelText}</label>
            <input {...register(label)} className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${errorText ? "border-red-500" : "border-blue-500"} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white transition-all`} />
            <p className="text-red-500 text-xs italic h-5">{errorText}</p>
        </div>
    );
}

export default StylistInput;