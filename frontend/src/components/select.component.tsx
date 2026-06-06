import { forwardRef, SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

type Option = {
  label: string;
  value: string;
};

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  placeholder: string;
  options: Option[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ placeholder, options, id, className = '', ...props }, ref) => {
    const parentDivClassName = 'relative w-full';
    const selectClassName =
      'block w-full appearance-none px-3.5 py-2.5 pr-10 text-sm bg-snow text-ink-800 border border-ink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors duration-150 disabled:bg-ink-50 disabled:text-ink-400';
    const chevronClassName =
      'pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400';

    return (
      <div className={parentDivClassName}>
        <select
          id={id}
          ref={ref}
          className={`${selectClassName} ${className}`}
          {...props}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className={chevronClassName} aria-hidden="true" />
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
