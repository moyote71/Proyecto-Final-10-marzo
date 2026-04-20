import { inputStyles } from "./InputStyles";
import { cn } from "../../../utils/cn";

export default function Input({
    label,
    id,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    disabled = false,
    variant,
    size,
    className,
}) {
    const inputId = id || `input-${Math.random().toString(36).slice(2)}`;

    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            <input
                id={inputId}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                    inputStyles({ variant, size }),
                    disabled && "opacity-50 cursor-not-allowed",
                    className
                )}
            />
        </div>
    );
}
