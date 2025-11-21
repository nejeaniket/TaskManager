// src/components/Column.jsx
import React, { useState } from 'react'
import TaskCard from './TaskCard'
import TaskForm from './TaskForm'
import { useDispatch } from 'react-redux'
import { moveTaskToColumn } from '../redux/tasksSlice'

export default function Column({ column, tasks }){
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()

  const onDragOver = (e) => {
    e.preventDefault() // allow drop
  }

  const onDrop = (e) => {
    e.preventDefault()
    try {
      const payload = JSON.parse(e.dataTransfer.getData('text/plain'))
      // payload: { taskId, fromColumnId }
      if (payload && payload.taskId) {
        dispatch(moveTaskToColumn({ taskId: payload.taskId, fromColumnId: payload.fromColumnId, toColumnId: column.id }))
      }
    } catch (err) {
      // ignore bad data
      console.log(err);
      
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow" onDragOver={onDragOver} onDrop={onDrop}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold">{column.title} ({tasks.length})</h2>
        <button onClick={()=>setOpen(o => !o)} className="text-sm px-2 py-1 border rounded">{open ? 'Close' : 'Add'}</button>
      </div>

      {open && <TaskForm columnId={column.id} onClose={()=>setOpen(false)} />}

      <div className="space-y-2 min-h-[100px]">
        {tasks.map((task, index) => task && <TaskCard key={task.id} task={task} index={index} columnId={column.id} />)}
      </div>
    </div>
  )
}
