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

export interface StylistInputPropsType extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    errorText?: string;
}

export interface StylistFileInputPropsType extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    selectedName: string;
}