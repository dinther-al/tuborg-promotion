import React from "react";
import Ripple from "react-ripplejs";
const PrimaryButton = (props) => {
  return (
    <Ripple onClick={props.onClick} className={`w-80 h-10 rounded-xl text-center ${props.className || ""}`} style={props.style}>
      <button className={`w-full h-full line-clamp-1`}>
        {props.children}
      </button>
    </Ripple>
  );
};
export default PrimaryButton;
