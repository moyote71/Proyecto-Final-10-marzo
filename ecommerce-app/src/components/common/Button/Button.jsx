import { buttonStyles } from "./ButtonStyles";
import { cn } from "../../../utils/cn";
import LiquidButton from "../../ui/LiquidButton";

export default function Button({
    children,
    type = "button",
    onClick,
    disabled = false,
    variant = "primary",
    size = "md",
    className,
}) {
    return (
        <LiquidButton
            as="button"
            type={type}
            onClick={onClick}
            disabled={disabled}
            variant={variant}
            size={size}
            className={cn(buttonStyles({ variant, size }), className)}
        >
            {children}
        </LiquidButton>
    );
}
