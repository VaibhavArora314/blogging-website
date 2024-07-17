export interface InputField {
    label: string;
    type: string;
    id: string;
    placeholder: string;
    required?: boolean;
    handleOnChange: (target: HTMLInputElement) => void;
}