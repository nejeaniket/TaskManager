// src/components/TaskCard.jsx
import React from 'react'
import { useDispatch } from 'react-redux'
import { deleteTask, moveTaskUp, moveTaskDown } from '../redux/tasksSlice'

export default function TaskCard({ task, index, columnId }) {
  const dispatch = useDispatch()

  const onDragStart = (e) => {
    const payload = JSON.stringify({ taskId: task.id, fromColumnId: columnId })
    e.dataTransfer.setData('text/plain', payload)
    // show copy/move cursor
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="p-3 bg-gray-50 border rounded flex justify-between items-start gap-3"
    >
      <div className="flex-1">
        <div className="font-medium">{task.title}</div>
        <div className="text-sm text-gray-500">{task.description}</div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <div className="flex gap-1">
          <button onClick={() => dispatch(moveTaskUp({ columnId, index }))} className="px-2 py-1 border rounded text-xs">▲</button>
          <button onClick={() => dispatch(moveTaskDown({ columnId, index }))} className="px-2 py-1 border rounded text-xs">▼</button>
        </div>
        <button onClick={() => dispatch(deleteTask(task.id))} className="px-2 py-1 border rounded text-xs">Del</button>
      </div>
    </div>
  )
}
