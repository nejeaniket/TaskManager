import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import { deleteTask } from "../redux/tasksSlice";

export default function TaskCard({ task, index }) {
  const dispatch = useDispatch();
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="p-3 bg-gray-50 border rounded"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium">{task.title}</div>
              <div className="text-sm text-gray-500">{task.description}</div>
            </div>
            <div className="text-xs text-gray-400">
              <button
                onClick={() => dispatch(deleteTask(task.id))}
                className="px-2 py-1 border rounded"
              >
                Del
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
