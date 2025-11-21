import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Column from "./Column";
import { DragDropContext } from "react-beautiful-dnd";
import { moveTask } from "../redux/tasksSlice";

export default function Board() {
  const state = useSelector((s) => s.tasks);
  const dispatch = useDispatch();

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    dispatch(moveTask({ source, destination }));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {state.columnOrder.map((colId) => (
          <Column
            key={colId}
            column={state.columns[colId]}
            tasks={state.columns[colId].taskIds.map((id) => state.tasks[id])}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
