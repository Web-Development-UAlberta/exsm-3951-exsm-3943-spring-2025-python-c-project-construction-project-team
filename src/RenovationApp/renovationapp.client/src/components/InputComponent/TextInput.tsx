import React, { forwardRef, useId } from 'react';

export type TextInputRows = number | string;
export type TextInputSize = 'sm' | ''; // Bootstrap size classes
export type TextInputType = 'text' | 'number' | 'tel';

export type OmitProps = 'size' | 'ref';

export type TextInputProps = Omit<React.ComponentPropsWithoutRef<'input'>, OmitProps> & {
    // Basic props
    id?: string;
    label?: string;
    type?: TextInputType;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>, value: string) => void;
    value?: string | number; // Sets the value of the input, use with `onChange` prop. Otherwise, use `defaultValue` prop
    name?: string;
    placeholder?: string;

    // Validation props
    required?: boolean;
    error?: string; // Error message to be displayed below the input

    // Helper props
    helperText?: string; // Helper text to be displayed below the input

    // Styling props
    disabled?: boolean;
    fullWidth?: boolean; // Whether the input should take the full width of its container
    className?: string;
    size?: TextInputSize;

    // Input Group props - Only used with `variant` set to `standard`
    prepend?: React.ReactNode; // Prepend element - e.g. currency symbol or icons
    append?: React.ReactNode; // Append element - e.g. metric unit or buttons
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({
    // Basic props
    id,
    label,
    type = 'text',
    onChange,
    value,
    name,
    defaultValue,
    placeholder,

    // Validation props
    required = false,
    error = '',

    // Helper props
    helperText = '',

    // Styling props
    disabled = false,
    fullWidth = false,
    size = '',

    // Input groups
    prepend,
    append,

    className = '',
    ...rest
}, ref) => {
    // Bootstrap form-control with size modifier
    const inputClassName = `form-control ${size ? `form-control-${size}` : ''} ${className} ${error ? 'is-invalid' : ''}`;
    
    // Generate unique ID if not provided
    const generatedId = useId();
    const inputId = id || name || `input-${generatedId}`;

    const inputElement = (
        <input
            id={inputId}
            name={name}
            type={type}
            className={inputClassName}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            ref={ref}
            {...rest}
        />
    );

    return (
        <div className={`mb-3 ${fullWidth ? 'w-100' : ''}`}>
            {label && (
                <label htmlFor={inputId} className="form-label">
                    {label}
                    {required && <span className="text-danger ms-1">*</span>}
                </label>
            )}
            
            {(prepend || append) ? (
                <div className="input-group">
                    {prepend && <span className="input-group-text">{prepend}</span>}
                    {inputElement}
                    {append && <span className="input-group-text">{append}</span>}
                </div>
            ) : (
                inputElement
            )}
            
            {helperText && (
                <div id={`${inputId}-helper-text`} className="form-text">{helperText}</div>
            )}
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
});

TextInput.displayName = 'TextInput';

export default TextInput;