"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function MissionControl() {
  const tasks = useQuery(api.tasks.getAll) || [];
  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.update);
  const deleteTask = useMutation(api.tasks.deleteTask);
  const moveTask = useMutation(api.tasks.moveStatus);
  
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [view, setView] = useState("tasks");

  const todoTasks = tasks.filter((t: any) => t.status === "todo");
  const doingTasks = tasks.filter((t: any) => t.status === "doing");
  const doneTasks = tasks.filter((t: any) => t.status === "done");

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

  async function handleMoveTask(id: string, currentStatus: string) {
    const nextStatus = currentStatus === "todo" ? "doing" : currentStatus === "doing" ? "done" : "todo";
    await moveTask({ id: id as any, newStatus: nextStatus });
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-8">
      <h1 className="text-3xl font-bold mb-2">Mission Control</h1>
      <p className="text-gray-400 mb-8">Concept Zero - $100M Target</p>
      
      <div className="flex gap-4 mb-6">
        {["tasks", "calendar", "agents", "meetings"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 rounded capitalize ${view === v ? "bg-indigo-500" : "bg-white/10 hover:bg-white/20"}`}
          >
            {v}
          </button>
        ))}
      </div>

      {view === "tasks" && (
        <div>
          <form onSubmit={handleCreateTask} className="flex gap-2 mb-6">
            <input 
              type="text" 
              value={newTaskTitle} 
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Create a new task..."
              className="flex-1 bg-white/10 border border-white/20 rounded px-4 py-2"
            />
            <button type="submit" className="bg-indigo-500 px-6 py-2 rounded hover:bg-indigo-600">Add Task</button>
          </form>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-amber-400 font-semibold mb-3">To Do ({todoTasks.length})</h3>
              <div className="space-y-2">
                {todoTasks.map((task: any) => (
                  <TaskCard 
                    key={task._id} 
                    task={task} 
                    onEdit={() => { setEditingTask(task._id); setEditTitle(task.title); }}
                    onDelete={() => handleDeleteTask(task._id)}
                    onMove={() => handleMoveTask(task._id, task.status)}
                    isEditing={editingTask === task._id}
                    editTitle={editTitle}
                    setEditTitle={setEditTitle}
                    onSave={() => handleUpdateTask(task._id)}
                    onCancel={() => setEditingTask(null)}
                    nextLabel="Start →"
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-blue-400 font-semibold mb-3">In Progress ({doingTasks.length})</h3>
              <div className="space-y-2">
                {doingTasks.map((task: any) => (
                  <TaskCard 
                    key={task._id} 
                    task={task}
                    onEdit={() => { setEditingTask(task._id); setEditTitle(task.title); }}
                    onDelete={() => handleDeleteTask(task._id)}
                    onMove={() => handleMoveTask(task._id, task.status)}
                    isEditing={editingTask === task._id}
                    editTitle={editTitle}
                    setEditTitle={setEditTitle}
                    onSave={() => handleUpdateTask(task._id)}
                    onCancel={() => setEditingTask(null)}
                    nextLabel="Complete →"
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-emerald-400 font-semibold mb-3">Done ({doneTasks.length})</h3>
              <div className="space-y-2">
                {doneTasks.map((task: any) => (
                  <TaskCard 
                    key={task._id} 
                    task={task}
                    onEdit={() => { setEditingTask(task._id); setEditTitle(task.title); }}
                    onDelete={() => handleDeleteTask(task._id)}
                    onMove={() => handleMoveTask(task._id, task.status)}
                    isEditing={editingTask === task._id}
                    editTitle={editTitle}
                    setEditTitle={setEditTitle}
                    onSave={() => handleUpdateTask(task._id)}
                    onCancel={() => setEditingTask(null)}
                    nextLabel="Reopen →"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {view === "calendar" && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📅</div>
          <h2 className="text-xl font-semibold mb-2">Calendar Integration</h2>
          <p className="text-gray-400">Connected to: izaak@conceptzero.io</p>
          <p className="text-sm text-gray-500 mt-2">Syncing with Google Calendar...</p>
        </div>
      )}

      {view === "agents" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">AI Agents Team</h2>
            <button 
              onClick={() => {
                const name = prompt("Agent name:");
                const skills = prompt("Skills (comma separated):");
                const purpose = prompt("Purpose:");
                if (name && skills && purpose) {
                  alert(`Creating specialized agent:\n\nName: ${name}\nSkills: ${skills}\nPurpose: ${purpose}\n\nThis will create a new agent session in OpenClaw.`);
                }
              }}
              className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded"
            >
              + Create Agent
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-indigo-500/30 rounded-lg p-4">
              <h3 className="font-semibold text-lg">🤖 Max</h3>
              <p className="text-sm text-indigo-400">Chief Operating Agent</p>
              <p className="text-sm text-gray-400 mt-2">Orchestrates all operations</p>
            </div>
          </div>
        </div>
      )}

      {view === "meetings" && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎥</div>
          <h2 className="text-xl font-semibold mb-2">Meeting Analysis</h2>
          <p className="text-gray-400">Automatic transcript analysis from Google Meet recordings</p>
          <ul className="text-sm text-gray-500 mt-4 space-y-2">
            <li>✓ Detect recording emails automatically</li>
            <li>✓ Analyze with Gemini AI</li>
            <li>✓ Extract insights & action items</li>
            <li>✓ Create tasks from meetings</li>
          </ul>
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, onEdit, onDelete, onMove, isEditing, editTitle, setEditTitle, onSave, onCancel, nextLabel }: any) {
  const priorityColors: Record<string, string> = {
    low: "bg-emerald-500/20 text-emerald-400",
    medium: "bg-amber-500/20 text-amber-400",
    high: "bg-orange-500/20 text-orange-400",
    urgent: "bg-red-500/20 text-red-400",
  };

  if (isEditing) {
    return (
      <div className="bg-white/5 p-3 rounded">
        <input 
          type="text" 
          value={editTitle} 
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 mb-2"
          autoFocus
        />
        <div className="flex gap-2">
          <button onClick={onSave} className="text-emerald-400 text-sm">Save</button>
          <button onClick={onCancel} className="text-gray-400 text-sm">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 p-3 rounded group">
      <div className="flex items-center justify-between mb-2">
        <span className="flex-1">{task.title}</span>
        <span>{task.assignedTo === "max" ? "🤖" : "👤"}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded ${priorityColors[task.priority]}`}>{task.priority}</span>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="text-xs text-gray-400 hover:text-white">Edit</button>
          <button onClick={onDelete} className="text-xs text-red-400 hover:text-red-300">Delete</button>
          <button onClick={onMove} className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded">{nextLabel}</button>
        </div>
      </div>
    </div>
  );
}
