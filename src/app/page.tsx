"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function MissionControl() {
  const tasks = useQuery(api.tasks.getAll) || [];
  const memories = useQuery(api.memories.getAll) || [];
  const events = useQuery(api.events.getUpcoming) || [];
  const integrations = useQuery(api.integrations.getAll) || [];
  
  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.update);
  const moveTask = useMutation(api.tasks.moveStatus);
  const createMemory = useMutation(api.memories.create);
  
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [newTaskAssigned, setNewTaskAssigned] = useState("izaak");
  const [selectedView, setSelectedView] = useState("tasks");
  const [searchQuery, setSearchQuery] = useState("");

  const todoTasks = tasks.filter((t) => t.status === "todo");
  const doingTasks = tasks.filter((t) => t.status === "doing");
  const doneTasks = tasks.filter((t) => t.status === "done");
  
  const urgentTasks = tasks.filter((t) => t.priority === "urgent" && t.status !== "done");

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    await createTask({
      title: newTaskTitle,
      status: "todo",
      priority: newTaskPriority,
      assignedTo: newTaskAssigned,
      createdBy: "izaak",
      tags: [],
    });
    setNewTaskTitle("");
  }

  async function handleMoveTask(id: string, newStatus: string) {
    await moveTask({ id: id as any, newStatus });
  }

  async function handleCreateMemory() {
    await createMemory({
      title: "Meta 2024: $100M",
      content: "North Star target for Concept Zero. All actions must serve this goal.",
      category: "context",
      source: "system",
      importance: "critical",
      tags: ["mission", "strategy"],
    });
  }

  const priorityColors: Record<string, string> = {
    low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    urgent: "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="bg-[#12121a] border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-lg flex items-center justify-center text-xl">
              🎯
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                Mission Control
              </h1>
              <p className="text-xs text-gray-500">Concept Zero Command Center</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Urgent Alert */}
            {urgentTasks.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-sm text-red-400">{urgentTasks.length} URGENT</span>
              </div>
            )}
            
            {/* Mission Badge */}
            <div className="text-right">
              <p className="text-xs text-gray-500">Target 2024</p>
              <p className="text-lg font-bold text-emerald-400">$100M</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0f0f14] border-r border-white/10 min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setSelectedView("tasks")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between ${
                selectedView === "tasks"
                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                  : "text-gray-400 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-3">
                <span>📋</span> Task Board
              </span>
              <span className="text-xs bg-white/10 px-2 py-1 rounded">{tasks.length}</span>
            </button>
            
            <button
              onClick={() => setSelectedView("memory")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between ${
                selectedView === "memory"
                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                  : "text-gray-400 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-3">
                <span>🧠</span> Memory
              </span>
              <span className="text-xs bg-white/10 px-2 py-1 rounded">{memories.length}</span>
            </button>
            
            <button
              onClick={() => setSelectedView("calendar")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between ${
                selectedView === "calendar"
                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                  : "text-gray-400 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-3">
                <span>📅</span> Calendar
              </span>
              <span className="text-xs bg-white/10 px-2 py-1 rounded">{events.length}</span>
            </button>
            
            <button
              onClick={() => setSelectedView("team")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                selectedView === "team"
                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                  : "text-gray-400 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-3">
                <span>👥</span> Team
              </span>
            </button>
            
            <button
              onClick={() => setSelectedView("integrations")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                selectedView === "integrations"
                  ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                  : "text-gray-400 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-3">
                <span>🔗</span> Integrations
              </span>
            </button>
          </nav>

          {/* Stats Panel */}
          <div className="px-4 pb-4">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">To Do</span>
                  <span className="text-amber-400 font-semibold">{todoTasks.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">In Progress</span>
                  <span className="text-blue-400 font-semibold">{doingTasks.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Done</span>
                  <span className="text-emerald-400 font-semibold">{doneTasks.length}</span>
                </div>
              </div>
            </div>
            
            {/* Proactive Alert */}
            {doingTasks.filter(t => t.assignedTo === "max").length === 0 && todoTasks.length > 0 && (
              <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                <p className="text-xs text-indigo-400">
                  🤖 Max is available. Ready to take tasks.
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {selectedView === "tasks" && (
            <div>
              {/* Create Task Form */}
              <div className="bg-[#12121a] border border-white/10 rounded-xl p-4 mb-6">
                <form onSubmit={handleCreateTask} className="flex gap-3">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                  />
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-indigo-500/50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <select
                    value={newTaskAssigned}
                    onChange={(e) => setNewTaskAssigned(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-indigo-500/50"
                  >
                    <option value="izaak">👤 Izaak</option>
                    <option value="max">🤖 Max</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Add Task
                  </button>
                </form>
              </div>

              {/* Kanban Board */}
              <div className="grid grid-cols-3 gap-4">
                {/* To Do */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-amber-400 flex items-center gap-2">
                      <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                      To Do
                    </h3>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-400">{todoTasks.length}</span>
                  </div>
                  <div className="space-y-2">
                    {todoTasks.map((task) => (
                      <TaskCard 
                        key={task._id} 
                        task={task} 
                        onMove={handleMoveTask}
                        priorityColors={priorityColors}
                      />
                    ))}
                  </div>
                </div>

                {/* In Progress */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-blue-400 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      In Progress
                    </h3>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-400">{doingTasks.length}</span>
                  </div>
                  <div className="space-y-2">
                    {doingTasks.map((task) => (
                      <TaskCard 
                        key={task._id} 
                        task={task} 
                        onMove={handleMoveTask}
                        priorityColors={priorityColors}
                      />
                    ))}
                  </div>
                </div>

                {/* Done */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-emerald-400 flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                      Done
                    </h3>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-400">{doneTasks.length}</span>
                  </div>
                  <div className="space-y-2">
                    {doneTasks.map((task) => (
                      <TaskCard 
                        key={task._id} 
                        task={task} 
                        onMove={handleMoveTask}
                        priorityColors={priorityColors}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedView === "memory" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Memory Bank</h2>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search memories..."
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 w-64"
                />
              </div>
              
              {memories.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🧠</div>
                  <h3 className="text-lg font-semibold mb-2">No memories yet</h3>
                  <p className="text-gray-400 mb-4">Start building your memory bank</p>
                  <button
                    onClick={handleCreateMemory}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg"
                  >
                    Create First Memory
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {memories.map((memory) => (
                    <div key={memory._id} className="bg-[#12121a] border border-white/10 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">{memory.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${priorityColors[memory.importance]}`}>
                          {memory.importance}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{memory.content}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="bg-white/5 px-2 py-1 rounded">{memory.category}</span>
                        <span>{new Date(memory.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedView === "calendar" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Upcoming Events</h2>
              {events.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-gray-400">No upcoming events</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map((event) => (
                    <div key={event._id} className="bg-[#12121a] border border-white/10 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-gray-400">
                          {new Date(event.startTime).toLocaleString()} - {event.attendees?.join(", ")}
                        </p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded ${
                        event.status === "confirmed" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                      }`}>
                        {event.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedView === "integrations" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Connected Integrations</h2>
              <div className="grid grid-cols-2 gap-4">
                {integrations.map((integration) => (
                  <div key={integration._id} className="bg-[#12121a] border border-white/10 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        integration.status === "connected" ? "bg-emerald-500" : "bg-red-500"
                      }`}></div>
                      <div>
                        <h3 className="font-semibold">{integration.name}</h3>
                        <p className="text-xs text-gray-500">{integration.type}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded ${
                      integration.status === "connected" 
                        ? "bg-emerald-500/20 text-emerald-400" 
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {integration.status}
                    </span>
                  </div>
                ))}
                
                {/* Hardcoded for now until we sync */}
                <div className="bg-[#12121a] border border-white/10 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <div>
                      <h3 className="font-semibold">GitHub</h3>
                      <p className="text-xs text-gray-500">Code & Repos</p>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded bg-emerald-500/20 text-emerald-400">connected</span>
                </div>
                
                <div className="bg-[#12121a] border border-white/10 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <div>
                      <h3 className="font-semibold">Notion</h3>
                      <p className="text-xs text-gray-500">Documents</p>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded bg-emerald-500/20 text-emerald-400">connected</span>
                </div>
                
                <div className="bg-[#12121a] border border-white/10 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <div>
                      <h3 className="font-semibold">Gmail</h3>
                      <p className="text-xs text-gray-500">max@conceptzero.io</p>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded bg-emerald-500/20 text-emerald-400">connected</span>
                </div>
                
                <div className="bg-[#12121a] border border-white/10 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <div>
                      <h3 className="font-semibold">Calendar</h3>
                      <p className="text-xs text-gray-500">Google Calendar</p>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded bg-emerald-500/20 text-emerald-400">connected</span>
                </div>
              </div>
            </div>
          )}

          {selectedView === "team" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Team & Agents</h2>
              <div className="grid grid-cols-3 gap-4">
                {/* Max - Main Agent */}
                <div className="bg-[#12121a] border border-indigo-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-2xl">
                      🤖
                    </div>
                    <div>
                      <h3 className="font-semibold">Max</h3>
                      <p className="text-xs text-indigo-400">Chief Operating Agent</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status</span>
                      <span className="text-emerald-400">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tasks</span>
                      <span>{doingTasks.filter(t => t.assignedTo === "max").length} active</span>
                    </div>
                  </div>
                </div>
                
                {/* Izaak */}
                <div className="bg-[#12121a] border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-2xl">
                      👤
                    </div>
                    <div>
                      <h3 className="font-semibold">Izaak</h3>
                      <p className="text-xs text-amber-400">Founder</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status</span>
                      <span className="text-emerald-400">Online</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tasks</span>
                      <span>{doingTasks.filter(t => t.assignedTo === "izaak").length} active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function TaskCard({ 
  task, 
  onMove, 
  priorityColors 
}: { 
  task: { _id: string; title: string; status: string; priority: string; assignedTo: string }; 
  onMove: (id: string, status: string) => void;
  priorityColors: Record<string, string>;
}) {
  const nextStatus: Record<string, string> = {
    todo: "doing",
    doing: "done",
    done: "todo",
  };

  const statusLabels: Record<string, string> = {
    todo: "Start →",
    doing: "Complete →",
    done: "Reopen →",
  };

  return (
    <div className="bg-[#12121a] border border-white/10 rounded-lg p-3 hover:border-indigo-500/30 transition-all group">
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm text-white flex-1">{task.title}</p>
        <span className="text-xs ml-2">{task.assignedTo === "max" ? "🤖" : "👤"}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-0.5 rounded border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <button
          onClick={() => onMove(task._id, nextStatus[task.status])}
          className="text-xs bg-white/5 hover:bg-indigo-500/20 text-gray-400 hover:text-indigo-400 px-2 py-1 rounded transition-all opacity-0 group-hover:opacity-100"
        >
          {statusLabels[task.status]}
        </button>
      </div>
    </div>
  );
}
