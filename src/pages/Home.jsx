import React, { useState } from "react";
import Board from "../components/Board";
import Header from "../components/Header";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";


// Optional small toolbar for search/filter and dark-mode toggle.
// Note: Board currently reads from redux; this toolbar is UI-only
// unless you wire a global filter into the slice.
export default function Home() {
  const [query, setQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dark, setDark] = useState(false);

  // simple body class toggle for dark mode
  React.useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
      <Header />

      <main className="max-w-6xl mx-auto p-4">
        <div className="mb-4 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks by title or description..."
              className="w-full sm:w-80 border p-2 rounded"
            />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="all">All priorities</option>
              <option value="low">Low</option>
              <option value="med">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={dark}
                onChange={(e) => setDark(e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm">Dark</span>
            </label>
          </div>
        </div>

        {/* NOTE:
            The current Board component reads directly from Redux and doesn't accept filters.
            This page shows UI for search/filters; if you'd like I can patch Board to accept
            `query` and `priorityFilter` props and apply the filtering before rendering columns.
        */}
        <Board />
      </main>
    </div>
  );
}
