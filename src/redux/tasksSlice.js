import { createSlice, nanoid } from "@reduxjs/toolkit";
import { storage } from "../utils/storage";

const STORAGE_KEY = "kanban_tasks_v1";

const initialState = storage.get(STORAGE_KEY, {
  columns: {
    todo: { id: "todo", title: "To Do", taskIds: [] },
    inprogress: { id: "inprogress", title: "In Progress", taskIds: [] },
    done: { id: "done", title: "Done", taskIds: [] },
  },
  tasks: {},
  columnOrder: ["todo", "inprogress", "done"],
});

const save = (state) => storage.set(STORAGE_KEY, state);

const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: {
      reducer(state, action) {
        const { id, title, description, priority, dueDate, columnId } =
          action.payload;
        state.tasks[id] = { id, title, description, priority, dueDate };
        state.columns[columnId].taskIds.unshift(id);
        save(state);
      },
      prepare({ title, description, priority, dueDate, columnId = "todo" }) {
        return {
          payload: {
            id: nanoid(),
            title,
            description,
            priority,
            dueDate,
            columnId,
          },
        };
      },
    },
    updateTask(state, action) {
      const { id, title, description, priority, dueDate } = action.payload;
      if (state.tasks[id]) {
        state.tasks[id] = {
          ...state.tasks[id],
          title,
          description,
          priority,
          dueDate,
        };
        save(state);
      }
    },
    deleteTask(state, action) {
      const id = action.payload;
      delete state.tasks[id];
      Object.values(state.columns).forEach((col) => {
        col.taskIds = col.taskIds.filter((tid) => tid !== id);
      });
      save(state);
    },
    moveTask(state, action) {
      // payload: { source, destination } where source/destination have { droppableId, index }
      const { source, destination } = action.payload;
      if (!destination) return;
      const start = state.columns[source.droppableId];
      const finish = state.columns[destination.droppableId];

      if (start === finish) {
        const newTaskIds = Array.from(start.taskIds);
        const [moved] = newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, moved);
        state.columns[start.id].taskIds = newTaskIds;
      } else {
        const startTaskIds = Array.from(start.taskIds);
        const [moved] = startTaskIds.splice(source.index, 1);
        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, moved);
        state.columns[start.id].taskIds = startTaskIds;
        state.columns[finish.id].taskIds = finishTaskIds;
      }
      save(state);
    },
  },
});

export const { addTask, updateTask, deleteTask, moveTask } = slice.actions;
export default slice.reducer;
