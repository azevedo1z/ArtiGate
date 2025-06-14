import { forwardRef, SelectHTMLAttributes } from "react";

type Option = {
    label: string;
    value: string;
}

interface SelectProps extends SelectHTMLAttributes<SelectHTMLAttributes> {
    
}

const Select = forwardRef<SelectHTMLAttributes, SelectProps>(
    ({id, ...props}, ref) => {
        return();
    }
);

Select.displayName = 'Select';

export default Select;