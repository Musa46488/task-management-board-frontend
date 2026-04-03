import { Status } from "@/types/task";
import { useDroppable } from "@dnd-kit/core";
import React from "react";

interface Props {
  id: Status;
  title: string;
  children: React.ReactNode;
}

const Column = ({ id, title, children }: Props) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className="bg-white/15 backdrop-blur-lg rounded-2xl shadow-2xl p-5 min-h-100 border border-white/20 flex flex-col transition-all"
    >
      <h2 className="text-xl font-bold text-white mb-5 tracking-wide drop-shadow-md">
        {title}
      </h2>

      <div className="flex-1 flex flex-col gap-1">{children}</div>
    </div>
  );
};

export default Column;
