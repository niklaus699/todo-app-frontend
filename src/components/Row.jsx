import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckboxButton } from "./CheckboxButton";
import { DeleteButton } from "./DeleteButton";

const Row = ({
  handleToggle,
  isCompleted,
  textContent,
  todoId,
  handleRemove,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todoId });

  const transformStyle = transform
    ? `${CSS.Transform.toString(transform)} scale(1.02)`
    : undefined;
  const style = {
    transition: transition || undefined,
    transform: transformStyle,
    willChange: transform ? "transform" : "box-shadow",
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={style}
      className={`flex justify-between items-center border-b border-gray-300 py-4 px-5 -mx-3 md:py-5 todo-row transition-shadow  ${
        isDragging
          ? "shadow-2xl z-50 bg-card opacity-100 cursor-grabbing drag-shadow"
          : "opacity-90 cursor-grab"
      }`}
    >
      <div className="font-sans flex justify-between items-center w-full">
        <div
          ref={setActivatorNodeRef}
          {...listeners}
          className="flex items-center gap-4"
        >
          {/* LEFT SIDE (drag activator area) */}
          {/* <div
            ref={setActivatorNodeRef}
            {...listeners}
            className="flex items-center gap-4 flex-1 cursor-grab"
          >
            {" "}
            {dragIcon}{" "}
          </div> */}
          <CheckboxButton condition={isCompleted} clickHandler={handleToggle} />

          <span
            className={`text-[var(--color-primary)]  ${
              isCompleted
                ? "line-through opacity-40 text-[var(--color-secondary)]"
                : ""
            }`}
          >
            {textContent}
          </span>
        </div>
        <DeleteButton handleRemove={handleRemove} />
      </div>
    </div>
  );
};

export default Row;
