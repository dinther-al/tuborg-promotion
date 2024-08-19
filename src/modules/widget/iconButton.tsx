import React from "react";
import Ripple from "react-ripplejs";

const IconButton = (props) => {
  const { onClick, disabled, className, style, children } = props;

  const buttonContent = (
    <div className="w-full h-full flex items-center justify-center bg-transparent line-clamp-1 truncate">
      {children}
    </div>
  );

  return disabled ? (
    <button
      className={`text-xs rounded-2xl mt-1 ${className || ""} cursor-not-allowed opacity-50`}
      style={style}
      disabled
    >
      {buttonContent}
    </button>
  ) : (
    <Ripple onClick={onClick} className={`text-xs rounded-2xl mt-1 ${className || ""}`} style={style}>
      {buttonContent}
    </Ripple>
  );
};

export default IconButton;
