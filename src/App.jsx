import React from "react";
import Board from "./components/Board";
import Header from "./components/Header";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto p-4">
        <Board />
      </main>
    </div>
  );
}
