"use client";
import { BiCopy } from "react-icons/bi";

export default function CopyButton({e}: {e: string}) {
    return (
        <button type="button" onClick={() => navigator.clipboard.writeText(e)}>
          <BiCopy size={16} className="text-blue-500 hover:text-blue-600 transition-all cursor-pointer" />
        </button>
    );
}