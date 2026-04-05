import React from "react";
import { Check } from "lucide-react";

export const CheckboxButton = ({ condition, clickHandler, type="button",}) => {
  return (
    <button
      type={type}
      className={`flex justify-center items-center cursor-pointer w-6 h-6 rounded-full border border-gray-300 pointer-events-auto ${
        condition &&
        "bg-linear-to-r from-gradient-blue to-gradient-violet  border-none"
      }`}
      onClick={clickHandler}
      aria-pressed={condition}
      aria-label="toggle"
    >
      {condition && <Check className="h-4 w-4 text-white" />}
    </button>
  );
};
