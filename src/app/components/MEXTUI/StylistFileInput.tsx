import { useRef } from "react";
import { StylistFileInputPropsType } from "./types";
import { AiOutlineCloudUpload } from "react-icons/ai";

const StylistFileInput: React.FC<StylistFileInputPropsType> = ({ label, selectedName, ...props }) => {

    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    }

    return (
        <>
            <button type="button" onClick={handleClick} className="w-40 lg:w-64 space-y-2">
                <label className="flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-blue-700 transition-all">
                    <AiOutlineCloudUpload size={32} />
                    <p>{label}</p>
                </label>
                <p className="w-[300px] truncate overflow-hidden">{selectedName}</p>
            </button>
            <input type="file" ref={inputRef} hidden {...props} />
        </>
    );
}

export default StylistFileInput;