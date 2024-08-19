import React, { forwardRef, InputHTMLAttributes } from "react";
import { Input as PersonalInput } from 'personal-standard-ui-custom';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  placeholder?: string;
  customProp?: string;
  onClick?: () => void;
}

export const InputAddress = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, placeholder, customProp, onClick, onBlur, ...rest } = props;
  return (
    <PersonalInput
      ref={ref}
      className={`form-control px-5 py-2 mt-2 text-lg  !bg-white  border-gray-300 focus:border-primaryColor font-normal rounded-lg ${className || ""}`}
      placeholder={placeholder}
      onClick={onClick}
      onBlur={onBlur}
      {...rest}
    />
  );
});
