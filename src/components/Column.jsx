import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";

export default function Column({ column, tasks }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold">
          {column.title} ({tasks.length})
        </h2>
        <button
          onClick={() => setOpen((o) => !o)}
          className="text-sm px-2 py-1 border rounded"
        >
          {open ? "Close" : "Add"}
        </button>
      </div>

      {open && <TaskForm columnId={column.id} onClose={() => setOpen(false)} />}

      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-2 min-h-[100px]"
          >
            {tasks.map(
              (task, index) =>
                task && <TaskCard key={task.id} task={task} index={index} />
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
