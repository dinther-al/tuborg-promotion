import React from "react";

export interface IFiled {
  children: any;
  label: any;
  error?: any,
  className?: React.ComponentProps<'div'>['className']
}

export const Field = (
  { children, label, error, className }: IFiled) => {
  const id = getChildId(children);

  return (
    <div className={`col-sm-12 mb-3 flex flex-col w-full ${className}`}>
      <label htmlFor={id} className="form-label mb-[0.2rem]">
        {label}
      </label>
      {children}
      {error && <small className="error text-sm mt-2 text-red-400">{error.message}</small>}
    </div>
  );
};

export const getChildId = (children) => {
  const child = React.Children.only(children);

  if ("id" in child?.props) {
    return child.props.id;
  }
};
