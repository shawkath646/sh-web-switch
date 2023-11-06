import { Path, UseFormRegister } from "react-hook-form";
import { DefaultFormDataTypes } from "@/app/lib/defaultData";

export interface StylistButtonPropsType extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    bgColor?: string;
    textColor?: string;
    bgColorOnHover?: string;
    childrenBeforeLabel?: boolean;
    loading?: boolean;
    onLoading?: React.ReactNode;
    loadingLabel?: string;
    space?: number;
    label?: string;
    size?: string;
}

export interface StylistInputPropsTypes {
    errorText?: string;
    type: string;
    label: Path<DefaultFormDataTypes>;
    labelText: string;
    register: UseFormRegister<DefaultFormDataTypes>;
}

export interface StylistFileInputPropsType extends React.InputHTMLAttributes<HTMLInputElement> {
    labelText: string;
    selectedName: string;
}