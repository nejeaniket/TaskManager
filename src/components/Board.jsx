// src/components/Board.jsx
import React from 'react'
import { useSelector } from 'react-redux'
import Column from './Column'

export default function Board(){
  const state = useSelector(s => s.tasks)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {state.columnOrder.map(colId => (
        <Column
          key={colId}
          column={state.columns[colId]}
          tasks={state.columns[colId].taskIds.map(id => state.tasks[id])}
        />
      ))}
    </div>
  )
}
