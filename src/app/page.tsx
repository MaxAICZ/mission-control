"use client";

import { useState } from "react";

// Mock data for now - will connect to Convex after Vercel setup
const mockTasks = [
  { _id: "1", title: "Setup Mission Control", status: "done", priority: "high", assignedTo: "max" },
  { _id: "2", title: "Configure Convex Database", status: "doing", priority: "high", assignedTo: "max" },
  { _id: "3", title: "Deploy to Vercel", status: "todo", priority: "high", assignedTo: "izaak" },
  { _id: "4", title: "Integrate Calendar", status: "todo", priority: "medium", assignedTo: "max" },
];

export default function MissionControl() {
  const [tasks, setTasks] = useState(mockTasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedView, setSelectedView] = useState("tasks");

  const todoTasks = tasks.filter((t) => t.status === "todo");
  const doingTasks = tasks.filter((t) => t.status === "doing");
  const doneTasks = tasks.filter((t) => t.status === "done");

  function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const newTask = {
      _id: Date.now().toString(),
      title: newTaskTitle,
      status: "todo",
      priority: "medium",
      assignedTo: "izaak",
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
  }

  function moveTask(id: string, newStatus: string) {
    setTasks(tasks.map(t => t._id === id ? { ...t, status: newStatus } : t));
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {/* Header */}
      <header className="bg-[#1a1a2e] border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Mission Control
            </h1>
            <p className="text-sm text-gray-400">Concept Zero Command Center</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              {tasks.length} tasks total
            </span>
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="w-64 p-6 border-r border-white/10 min-h-[calc(100vh-80px)]">
          <nav className="space-y-2">
            <button
              onClick={() => setSelectedView("tasks")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                selectedView === "tasks"
                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                  : "text-gray-400 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-3">
                <span>📋</span> Task Board
              </span>
            </button>
            <button
              onClick={() => setSelectedView("calendar")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                selectedView === "calendar"
                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                  : "text-gray-400 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-3">
                <span>📅</span> Calendar
              </span>
            </button>
            <button
              onClick={() => setSelectedView("memory")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                selectedView === "memory"
                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                  : "text-gray-400 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-3">
                <span>🧠</span> Memory
              </span>
            </button>
          </nav>

          {/* Stats */}
          <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">To Do</span>
                <span className="text-amber-400 font-semibold">{todoTasks.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">In Progress</span>
                <span className="text-blue-400 font-semibold">{doingTasks.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Done</span>
                <span className="text-emerald-400 font-semibold">{doneTasks.length}</span>
              </div>
            </div>
          </div>

          {/* Mission */}
          <div className="mt-6 p-4 bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 rounded-lg border border-indigo-500/20">
            <h3 className="text-sm font-semibold text-indigo-400 mb-2">🎯 Meta 2024</h3>
            <p className="text-2xl font-bold text-white">$100M</p>
            <p className="text-xs text-gray-500 mt-1">North Star Target</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {selectedView === "tasks" && (
            <div>
              {/* Add Task Form */}
              <form onSubmit={handleCreateTask} className="mb-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add a new task..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Add Task
                  </button>
                </div>
              </form>

              {/* Kanban Board */}
              <div className="grid grid-cols-3 gap-6">
                {/* To Do Column */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-amber-400 flex items-center gap-2">
                      <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                      To Do
                    </h3>
                    <span className="text-sm text-gray-500">{todoTasks.length}</span>
                  </div>
                  <div className="space-y-3">
                    {todoTasks.map((task) => (
                      <TaskCard key={task._id} task={task} onMove={moveTask} />
                    ))}
                  </div>
                </div>

                {/* Doing Column */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-blue-400 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      In Progress
                    </h3>
                    <span className="text-sm text-gray-500">{doingTasks.length}</span>
                  </div>
                  <div className="space-y-3">
                    {doingTasks.map((task) => (
                      <TaskCard key={task._id} task={task} onMove={moveTask} />
                    ))}
                  </div>
                </div>

                {/* Done Column */}
                <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-emerald-400 flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                      Done
                    </h3>
                    <span className="text-sm text-gray-500">{doneTasks.length}</span>
                  </div>
                  <div className="space-y-3">
                    {doneTasks.map((task) => (
                      <TaskCard key={task._id} task={task} onMove={moveTask} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedView === "calendar" && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📅</div>
              <h2 className="text-2xl font-semibold mb-2">Calendar Integration</h2>
              <p className="text-gray-400">Connected to Google Calendar</p>
              <p className="text-sm text-gray-500 mt-2">Events will appear here automatically</p>
            </div>
          )}

          {selectedView === "memory" && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🧠</div>
              <h2 className="text-2xl font-semibold mb-2">Memory Viewer</h2>
              <p className="text-gray-400">Access all memories and conversations</p>
              <p className="text-sm text-gray-500 mt-2">Global search coming soon</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function TaskCard({ task, onMove }: { task: any; onMove: (id: string, status: string) => void }) {
  const priorityColors: Record<string, string> = {
    low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    high: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const nextStatus: Record<string, string> = {
    todo: "doing",
    doing: "done",
    done: "todo",
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-3 hover:border-indigo-500/30 transition-colors group">
      <p className="text-sm text-white mb-2">{task.title}</p>
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {task.assignedTo === "max" ? "🤖" : "👤"}
          </span>
          <button
            onClick={() => onMove(task._id, nextStatus[task.status])}
            className="text-xs bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white px-2 py-1 rounded transition-colors opacity-0 group-hover:opacity-100"
          >
            Move →
          </button>
        </div>
      </div>
    </div>
  );
}
