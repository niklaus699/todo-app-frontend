import React from "react";

const FilterButton = ({ filter, handleChangeFilter, actionName }) => {
  return (
    <button
      className={` cursor-pointer capitalize ${
        filter === actionName
          ? "text-blue-500"
          : "text-[var(--color-secondary)] hover:text-[var(--color-primary)] "
      }`}
      onClick={handleChangeFilter}
    >
      {actionName}
    </button>
  );
};

export default FilterButton;
