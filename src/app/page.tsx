"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function MissionControl() {
  const tasks = useQuery(api.tasks.getAll) || [];
  const memories = useQuery(api.memories.getAll) || [];
  const proactive = useQuery(api.proactive.getPending) || [];
  
  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.update);
  const moveTask = useMutation(api.tasks.moveStatus);
  const deleteTask = useMutation(api.tasks.deleteTask);
  
  const [selectedView, setSelectedView] = useState("dashboard");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const todoTasks = tasks.filter((t) => t.status === "todo");
  const doingTasks = tasks.filter((t) => t.status === "doing");
  const doneTasks = tasks.filter((t) => t.status === "done");
  const myTasks = tasks.filter((t) => t.assignedTo === "max" && t.status !== "done");
  const urgentTasks = tasks.filter((t) => t.priority === "urgent" && t.status !== "done");

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await createTask({
      title: newTaskTitle,
      status: "todo",
      priority: "medium",
      assignedTo: "izaak",
      createdBy: "izaak",
      tags: [],
    });
    setNewTaskTitle("");
  }

  async function handleUpdateTask(id: string) {
    if (!editTitle.trim()) return;
    await updateTask({ id: id as any, title: editTitle });
    setEditingTask(null);
    setEditTitle("");
  }

  async function handleDeleteTask(id: string) {
    if (confirm("Delete this task?")) {
      await deleteTask({ id: id as any });
    }
  }

  async function handleMoveTask(id: string, newStatus: string) {
    await moveTask({ id: id as any, newStatus });
  }

  const priorityColors: Record<string, string> = {
    low: "bg-emerald-500/20 text-emerald-400",
    medium: "bg-amber-500/20 text-amber-400",
    high: "bg-orange-500/20 text-orange-400",
    urgent: "bg-red-500/20 text-red-400 animate-pulse",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="bg-[#12121a] border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-lg flex items-center justify-center text-xl">🎯</div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">Mission Control</h1>
              <p className="text-xs text-gray-500">Concept Zero - $100M Target</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {urgentTasks.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-sm text-red-400">{urgentTasks.length} URGENT</span>
              </div>
            )}
            {proactive.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
                <span className="text-sm text-indigo-400">{proactive.length} Suggestions</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0f0f14] border-r border-white/10 min-h-[calc(100vh-73px)] p-4">
          <nav className="space-y-1">
            {["dashboard", "tasks", "calendar", "agents", "meetings", "proactive", "memory"].map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all capitalize ${
                  selectedView === view ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "text-gray-400 hover:bg-white/5"
                }`}
              >
                {view === "dashboard" && "🏠 "}
                {view === "tasks" && "📋 "}
                {view === "calendar" && "📅 "}
                {view === "agents" && "👥 "}
                {view === "meetings" && "🎥 "}
                {view === "proactive" && "💡 "}
                {view === "memory" && "🧠 "}
                {view}
              </button>
            ))}
          </nav>

          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase">Max Status</h3>
            <p className="text-sm text-gray-400">Active Tasks: <span className="text-indigo-400 font-semibold">{myTasks.length}</span></p>
            <p className="text-sm text-gray-400 mt-1">Status: <span className="text-emerald-400">{myTasks.length < 3 ? "✓ Available" : "Busy"}</span></p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* DASHBOARD */}
          {selectedView === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-[#12121a] border border-white/10 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Total Tasks</p>
                  <p className="text-3xl font-bold">{tasks.length}</p>
                  <p className="text-xs text-gray-500 mt-1">{myTasks.length} assigned to Max</p>
                </div>
                <div className="bg-[#12121a] border border-white/10 rounded-xl p-4">
                  <p className="text-sm text-gray-500">To Do</p>
                  <p className="text-3xl font-bold text-amber-400">{todoTasks.length}</p>
                </div>
                <div className="bg-[#12121a] border border-white/10 rounded-xl p-4">
                  <p className="text-sm text-gray-500">In Progress</p>
                  <p className="text-3xl font-bold text-blue-400">{doingTasks.length}</p>
                </div>
                <div className="bg-[#12121a] border border-white/10 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Done</p>
                  <p className="text-3xl font-bold text-emerald-400">{doneTasks.length}</p>
                </div>
              </div>

              {/* Quick Task Creation */}
              <form onSubmit={handleCreateTask} className="flex gap-3">
                <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="Create a new task..." className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50" />
                <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">Add Task</button>
              </form>

              {/* My Tasks */}
              <div className="bg-[#12121a] border border-white/10 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">Max's Active Tasks</h2>
                {myTasks.length === 0 ? (
                  <p className="text-gray-400">No tasks assigned. Ready to take work!</p>
                ) : (
                  <div className="space-y-2">
                    {myTasks.map((task) => (
                      <div key={task._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span>{task.title}</span>
                        <span className={`text-xs px-2 py-1 rounded ${priorityColors[task.priority]}`}>{task.priority}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TASKS */}
          {selectedView === "tasks" && (
            <div>
              <form onSubmit={handleCreateTask} className="flex gap-3 mb-6">
                <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="What needs to be done?" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50" />
                <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">Add Task</button>
              </form>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { title: "To Do", status: "todo", color: "amber", tasks: todoTasks },
                  { title: "In Progress", status: "doing", color: "blue", tasks: doingTasks },
                  { title: "Done", status: "done", color: "emerald", tasks: doneTasks },
                ].map((col) => (
                  <div key={col.status}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`font-semibold text-${col.color}-400 flex items-center gap-2`}>
                        <span className={`w-2 h-2 bg-${col.color}-400 rounded-full`}></span>
                        {col.title}
                      </h3>
                      <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-500">{col.tasks.length}</span>
                    </div>
                    <div className="space-y-2">
                      {col.tasks.map((task) => (
                        <div key={task._id} className="bg-[#12121a] border border-white/10 rounded-lg p-3 group">
                          {editingTask === task._id ? (
                            <div className="flex gap-2">
                              <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-sm" autoFocus />
                              <button onClick={() => handleUpdateTask(task._id)} className="text-emerald-400 text-sm">✓</button>
                              <button onClick={() => setEditingTask(null)} className="text-red-400 text-sm">✕</button>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-start justify-between mb-2">
                                <p className="text-sm text-white flex-1">{task.title}</p>
                                <span className="text-xs ml-2">{task.assignedTo === "max" ? "🤖" : "👤"}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>{task.priority}</span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => { setEditingTask(task._id); setEditTitle(task.title); }} className="text-xs text-gray-400 hover:text-white px-2 py-1">Edit</button>
                                  <button onClick={() => handleDeleteTask(task._id)} className="text-xs text-red-400 hover:text-red-300 px-2 py-1">Delete</button>
                                  <button onClick={() => handleMoveTask(task._id, col.status === "todo" ? "doing" : col.status === "doing" ? "done" : "todo")} className="text-xs bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white px-2 py-1 rounded">
                                    {col.status === "todo" ? "Start →" : col.status === "doing" ? "Complete →" : "Reopen →"}
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CALENDAR */}
          {selectedView === "calendar" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Calendar Integration</h2>
              <div className="bg-[#12121a] border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-400">Connected to: izaak@conceptzero.io</p>
                  <button 
                    onClick={async () => {
                      // Fetch real calendar events
                      const response = await fetch('/api/calendar');
                      const events = await response.json();
                      console.log('Calendar events:', events);
                    }}
                    className="text-sm bg-indigo-500/20 text-indigo-400 px-4 py-2 rounded-lg hover:bg-indigo-500/30 transition-colors"
                  >
                    🔄 Sync Calendar
                  </button>
                </div>
                <div className="p-8 text-center">
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-gray-400">Calendar sync in progress...</p>
                  <p className="text-sm text-gray-500 mt-2">Upcoming meetings with Google Meet will appear here automatically</p>
                </div>
              </div>
            </div>
          )}

          {/* AGENTS */}
          {selectedView === "agents" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">AI Agents Team</h2>
                <button 
                  onClick={() => {
                    const name = prompt("Agent name:");
                    const skills = prompt("Skills (comma separated):");
                    const purpose = prompt("Purpose:");
                    if (name && skills && purpose) {
                      alert(`Creating agent: ${name}\nSkills: ${skills}\nPurpose: ${purpose}\n\nThis will spawn a new specialized agent in OpenClaw.`);
                    }
                  }}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  + Create New Agent
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Max - Main Agent */}
                <div className="bg-[#12121a] border border-indigo-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-2xl">🤖</div>
                    <div>
                      <h3 className="font-semibold">Max</h3>
                      <p className="text-xs text-indigo-400">Chief Operating Agent</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">Orchestrates all operations. Your main point of contact.</p>
                  <div className="flex gap-2">
                    <span className="text-xs bg-white/10 px-2 py-1 rounded">Strategy</span>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded">Coordination</span>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded">Execution</span>
                  </div>
                </div>

                {/* Placeholder for new agents */}
                <div className="bg-[#12121a] border border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center justify-center text-gray-500 hover:border-indigo-500/50 hover:text-indigo-400 transition-colors cursor-pointer" onClick={() => alert("Click '+ Create New Agent' to add a specialized agent")}>
                  <div className="text-4xl mb-2">+</div>
                  <p className="text-sm">Create Specialized Agent</p>
                </div>
              </div>
            </div>
          )}

          {/* MEETINGS */}
          {selectedView === "meetings" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Meeting Recordings & Analysis</h2>
              <div className="bg-[#12121a] border border-white/10 rounded-xl p-6">
                <div className="p-8 text-center">
                  <div className="text-6xl mb-4">🎥</div>
                  <h3 className="text-lg font-semibold mb-2">Automatic Meeting Analysis</h3>
                  <p className="text-gray-400 mb-4">When you receive Google Meet recordings via email:</p>
                  <ul className="text-sm text-gray-500 space-y-2 text-left max-w-md mx-auto">
                    <li>✓ I'll automatically detect the recording email</li>
                    <li>✓ Analyze the transcript with AI</li>
                    <li>✓ Extract key insights and decisions</li>
                    <li>✓ Create actionable tasks</li>
                    <li>✓ Suggest follow-ups</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* PROACTIVE */}
          {selectedView === "proactive" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Proactive Suggestions</h2>
              {proactive.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">💡</div>
                  <p className="text-gray-400">No pending suggestions</p>
                  <p className="text-sm text-gray-500 mt-2">I'm monitoring everything to suggest actions</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {proactive.map((s) => (
                    <div key={s._id} className="bg-[#12121a] border border-indigo-500/20 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{s.title}</h3>
                          <p className="text-sm text-gray-400 mt-1">{s.description}</p>
                          <p className="text-xs text-indigo-400 mt-2">🤖 {s.reasoning}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded text-sm">Do It</button>
                          <button className="bg-white/5 text-gray-400 px-3 py-1.5 rounded text-sm">Dismiss</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MEMORY */}
          {selectedView === "memory" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Memory Bank</h2>
              {memories.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🧠</div>
                  <p className="text-gray-400">Building memory context...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {memories.map((m) => (
                    <div key={m._id} className="bg-[#12121a] border border-white/10 rounded-lg p-4">
                      <h3 className="font-semibold">{m.title}</h3>
                      <p className="text-sm text-gray-400 mt-2">{m.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
MFEOF

# Guardar el archivo
mv /tmp/page.tsx src/app/page.tsx 2>/dev/null || cat > src/app/page.tsx << 'PAGECONTENT'
"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function MissionControl() {
  const tasks = useQuery(api.tasks.getAll) || [];
  const createTask = useMutation(api.tasks.create);
  const deleteTask = useMutation(api.tasks.deleteTask);
  const [newTask, setNewTask] = useState("");

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTask.trim()) return;
    await createTask({
      title: newTask,
      status: "todo",
      priority: "medium",
      assignedTo: "izaak",
      createdBy: "izaak",
      tags: [],
    });
    setNewTask("");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Mission Control</h1>
      <form onSubmit={addTask} className="flex gap-2 mb-6">
        <input 
          type="text" 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task..."
          className="flex-1 bg-white/10 border border-white/20 rounded px-4 py-2"
        />
        <button type="submit" className="bg-indigo-500 px-6 py-2 rounded hover:bg-indigo-600">Add</button>
      </form>
      <div className="space-y-2">
        {tasks.map((task: any) => (
          <div key={task._id} className="flex items-center justify-between bg-white/5 p-3 rounded">
            <span>{task.title}</span>
            <button 
              onClick={() => deleteTask({ id: task._id })}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
PAGECONTENT

echo "✅ Page recreated"