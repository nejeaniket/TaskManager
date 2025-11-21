// src/redux/tasksSlice.js
import { createSlice, nanoid } from '@reduxjs/toolkit'
import { storage } from '../utils/storage'

const STORAGE_KEY = 'kanban_tasks_v1'

const initialState = storage.get(STORAGE_KEY, {
  columns: {
    'todo': { id: 'todo', title: 'To Do', taskIds: [] },
    'inprogress': { id: 'inprogress', title: 'In Progress', taskIds: [] },
    'done': { id: 'done', title: 'Done', taskIds: [] },
  },
  tasks: {},
  columnOrder: ['todo','inprogress','done'],
})

const save = (state) => storage.set(STORAGE_KEY, state)

const slice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: {
      reducer(state, action) {
        const { id, title, description, priority, dueDate, columnId } = action.payload
        state.tasks[id] = { id, title, description, priority, dueDate }
        state.columns[columnId].taskIds.unshift(id)
        save(state)
      },
      prepare({ title, description, priority, dueDate, columnId = 'todo' }) {
        return { payload: { id: nanoid(), title, description, priority, dueDate, columnId } }
      }
    },
    updateTask(state, action) {
      const { id, title, description, priority, dueDate } = action.payload
      if (state.tasks[id]) {
        state.tasks[id] = { ...state.tasks[id], title, description, priority, dueDate }
        save(state)
      }
    },
    deleteTask(state, action) {
      const id = action.payload
      delete state.tasks[id]
      Object.values(state.columns).forEach(col => { col.taskIds = col.taskIds.filter(tid => tid !== id) })
      save(state)
    },

    // Move task to a different column (drops add to top)
    moveTaskToColumn(state, action) {
      const { taskId, fromColumnId, toColumnId } = action.payload
      if (!state.tasks[taskId]) return
      // remove from source
      if (state.columns[fromColumnId]) {
        state.columns[fromColumnId].taskIds = state.columns[fromColumnId].taskIds.filter(id => id !== taskId)
      } else {
        // in case we don't know source, remove from any column
        Object.values(state.columns).forEach(col => {
          col.taskIds = col.taskIds.filter(id => id !== taskId)
        })
      }
      // add to top of destination
      if (!state.columns[toColumnId]) return
      state.columns[toColumnId].taskIds.unshift(taskId)
      save(state)
    },

    // Reorder helpers (move up/down inside a column)
    moveTaskUp(state, action) {
      const { columnId, index } = action.payload
      const ids = state.columns[columnId]?.taskIds
      if (!ids || index <= 0 || index >= ids.length) return
      const arr = Array.from(ids)
      const tmp = arr[index - 1]
      arr[index - 1] = arr[index]
      arr[index] = tmp
      state.columns[columnId].taskIds = arr
      save(state)
    },
    moveTaskDown(state, action) {
      const { columnId, index } = action.payload
      const ids = state.columns[columnId]?.taskIds
      if (!ids || index < 0 || index >= ids.length - 1) return
      const arr = Array.from(ids)
      const tmp = arr[index + 1]
      arr[index + 1] = arr[index]
      arr[index] = tmp
      state.columns[columnId].taskIds = arr
      save(state)
    }
  }
})

export const { addTask, updateTask, deleteTask, moveTaskToColumn, moveTaskUp, moveTaskDown } = slice.actions
export default slice.reducer
