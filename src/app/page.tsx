"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function MissionControl() {
  // Queries
  const tasks = useQuery(api.tasks.getAll) || [];
  const memories = useQuery(api.memories.getAll) || [];
  const events = useQuery(api.events.getUpcoming) || [];
  const meetings = useQuery(api.meetings.getAllWithInsights) || [];
  const proactive = useQuery(api.proactive.getPending) || [];
  const unprocessedMeetings = useQuery(api.meetings.getUnprocessed) || [];
  
  // Mutations
  const createTask = useMutation(api.tasks.create);
  const moveTask = useMutation(api.tasks.moveStatus);
  const createMemory = useMutation(api.memories.create);
  const createSuggestion = useMutation(api.proactive.createSuggestion);
  const processMeeting = useMutation(api.meetings.processRecording);
  
  // State
  const [selectedView, setSelectedView] = useState("dashboard");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [searchQuery, setSearchQuery] = useState("");
  const [showProactiveAlert, setShowProactiveAlert] = useState(true);

  // Filter tasks
  const todoTasks = tasks.filter((t) => t.status === "todo");
  const doingTasks = tasks.filter((t) => t.status === "doing");
  const doneTasks = tasks.filter((t) => t.status === "done");
  const urgentTasks = tasks.filter((t) => t.priority === "urgent" && t.status !== "done");
  const myTasks = tasks.filter((t) => t.assignedTo === "max" && t.status !== "done");

  // Get upcoming meetings with Meet
  const upcomingMeetings = events.filter(e => e.meetLink && e.startTime > Date.now());

  // Create task handler
  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    await createTask({
      title: newTaskTitle,
      status: "todo",
      priority: newTaskPriority,
      assignedTo: "izaak",
      createdBy: "izaak",
      source: "manual",
      tags: [],
    });
    setNewTaskTitle("");
  }

  // Quick assign to Max
  async function assignToMax(taskTitle: string, priority: string = "medium") {
    await createTask({
      title: taskTitle,
      status: "todo",
      priority,
      assignedTo: "max",
      createdBy: "max",
      source: "proactive",
      tags: ["auto"],
    });
  }

  // Create proactive suggestion
  async function suggestAction(title: string, description: string, reasoning: string) {
    await createSuggestion({
      type: "task",
      source: "analysis",
      title,
      description,
      reasoning,
      priority: "medium",
      autoExecute: false,
      executed: false,
    });
  }

  // Process meeting recording
  async function analyzeMeeting(meetingId: string, insights: string, actions: string[]) {
    await processMeeting({
      id: meetingId as any,
      tasksCreated: actions,
    });
    
    // Create tasks from action items
    for (const action of actions) {
      await createTask({
        title: action,
        status: "todo",
        priority: "medium",
        assignedTo: "max",
        createdBy: "max",
        source: "meeting",
        tags: ["meeting-action"],
      });
    }
  }

  // Priority colors
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
            {/* Proactive Alerts */}
            {unprocessedMeetings.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full cursor-pointer hover:bg-blue-500/30 transition-colors" onClick={() => setSelectedView("meetings")}>
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                <span className="text-sm text-blue-400">{unprocessedMeetings.length} recordings to analyze</span>
              </div>
            )}
            
            {proactive.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full cursor-pointer hover:bg-indigo-500/30 transition-colors" onClick={() => setSelectedView("proactive")}>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
                <span className="text-sm text-indigo-400">{proactive.length} suggestions</span>
              </div>
            )}
            
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
              onClick={() => setSelectedView("dashboard")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between ${
                selectedView === "dashboard" ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "text-gray-400 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-3"><span>🏠</span> Dashboard</span>
            </button>
            
            <button
              onClick={() => setSelectedView("tasks")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between ${
                selectedView === "tasks" ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "text-gray-400 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-3"><span>📋</span> Tasks</span>
              <span className="text-xs bg-white/10 px-2 py-1 rounded">{tasks.length}</span>
            </button>
            
            <button
              onClick={() => setSelectedView("calendar")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between ${
                selectedView === "calendar" ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "text-gray-400 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-3"><span>📅</span> Calendar</span>
              {upcomingMeetings.length > 0 && <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded">{upcomingMeetings.length}</span>}
            </button>
            
            <button
              onClick={() => setSelectedView("meetings")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between ${
                selectedView === "meetings" ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "text-gray-400 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-3"><span>🎥</span> Meetings</span>
              {unprocessedMeetings.length > 0 && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded animate-pulse">{unprocessedMeetings.length}</span>}
            </button>
            
            <button
              onClick={() => setSelectedView("proactive")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between ${
                selectedView === "proactive" ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "text-gray-400 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-3"><span>💡</span> Suggestions</span>
              {proactive.length > 0 && <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded animate-pulse">{proactive.length}</span>}
            </button>
            
            <button
              onClick={() => setSelectedView("memory")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between ${
                selectedView === "memory" ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "text-gray-400 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-3"><span>🧠</span> Memory</span>
              <span className="text-xs bg-white/10 px-2 py-1 rounded">{memories.length}</span>
            </button>
          </nav>

          {/* Quick Actions */}
          <div className="px-4 pb-4">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Max Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">My Active Tasks</span>
                  <span className="text-indigo-400 font-semibold">{myTasks.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Available</span>
                  <span className="text-emerald-400 text-sm">{myTasks.length < 3 ? "✓ Ready" : "Busy"}</span>
                </div>
              </div>
              
              {myTasks.length < 3 && todoTasks.filter(t => t.assignedTo === "izaak").length > 0 && (
                <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                  <p className="text-xs text-indigo-400 mb-2">🤖 I can take tasks from your list</p>
                  <button 
                    onClick={() => {
                      const unassigned = todoTasks.filter(t => t.assignedTo === "izaak")[0];
                      if (unassigned) assignToMax(unassigned.title, unassigned.priority);
                    }}
                    className="text-xs bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded transition-colors w-full"
                  >
                    Assign Next Task to Me
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* DASHBOARD VIEW */}
          {selectedView === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-[#12121a] border border-white/10 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Active Tasks</p>
                  <p className="text-3xl font-bold text-white">{tasks.filter(t => t.status !== "done").length}</p>
                  <p className="text-xs text-gray-500 mt-1">{myTasks.length} assigned to Max</p>
                </div>
                <div className="bg-[#12121a] border border-white/10 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Upcoming Meetings</p>
                  <p className="text-3xl font-bold text-white">{upcomingMeetings.length}</p>
                  <p className="text-xs text-gray-500 mt-1">{upcomingMeetings.filter(m => m.meetLink).length} with Meet</p>
                </div>
                <div className="bg-[#12121a] border border-white/10 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Recordings</p>
                  <p className="text-3xl font-bold text-white">{meetings.length}</p>
                  <p className="text-xs text-gray-500 mt-1">{unprocessedMeetings.length} to analyze</p>
                </div>
                <div className="bg-[#12121a] border border-white/10 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Memories</p>
                  <p className="text-3xl font-bold text-white">{memories.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Context preserved</p>
                </div>
              </div>

              {/* Today's Schedule */}
              <div className="bg-[#12121a] border border-white/10 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>
                {upcomingMeetings.length === 0 ? (
                  <p className="text-gray-400">No meetings scheduled for today</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingMeetings.slice(0, 5).map((meeting) => (
                      <div key={meeting._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="text-center min-w-[60px]">
                            <p className="text-sm font-semibold">{new Date(meeting.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            <p className="text-xs text-gray-500">{new Date(meeting.startTime).toLocaleDateString([], {weekday: 'short'})}</p>
                          </div>
                          <div>
                            <p className="font-medium">{meeting.title}</p>
                            <p className="text-sm text-gray-400">{meeting.attendees?.length || 0} attendees</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {meeting.meetLink && (
                            <a href={meeting.meetLink} target="_blank" rel="noopener noreferrer" className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded hover:bg-blue-500/30 transition-colors">
                              Join Meet
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Proactive Suggestions */}
              {proactive.length > 0 && (
                <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <span className="text-indigo-400">💡</span> Proactive Suggestions
                    </h2>
                    <button onClick={() => setSelectedView("proactive")} className="text-sm text-indigo-400 hover:text-indigo-300">
                      View All →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {proactive.slice(0, 3).map((suggestion) => (
                      <div key={suggestion._id} className="bg-white/5 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{suggestion.title}</p>
                            <p className="text-sm text-gray-400 mt-1">{suggestion.description}</p>
                            <p className="text-xs text-indigo-400 mt-2">🤖 {suggestion.reasoning}</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded hover:bg-emerald-500/30 transition-colors">
                              Do It
                            </button>
                            <button className="text-xs bg-white/5 text-gray-400 px-3 py-1.5 rounded hover:bg-white/10 transition-colors">
                              Dismiss
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* My Active Tasks */}
              <div className="bg-[#12121a] border border-white/10 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">My Active Tasks ({myTasks.length})</h2>
                {myTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-3">No active tasks assigned to me</p>
                    {todoTasks.filter(t => t.assignedTo === "izaak").length > 0 && (
                      <button 
                        onClick={() => assignToMax(todoTasks.filter(t => t.assignedTo === "izaak")[0].title)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        🎯 Assign Me a Task
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {myTasks.slice(0, 5).map((task) => (
                      <div key={task._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🤖</span>
                          <span className={task.priority === "urgent" ? "text-red-400" : ""}>{task.title}</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${priorityColors[task.priority]}`}>{task.priority}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TASKS VIEW */}
          {selectedView === "tasks" && (
            <div>
              <form onSubmit={handleCreateTask} className="flex gap-3 mb-6">
                <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="What needs to be done?" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50" />
                <select value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-white">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">Add Task</button>
              </form>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-amber-400 flex items-center gap-2"><span className="w-2 h-2 bg-amber-400 rounded-full"></span>To Do</h3>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-500">{todoTasks.length}</span>
                  </div>
                  <div className="space-y-2">
                    {todoTasks.map((task) => (
                      <TaskCard key={task._id} task={task} onMove={(id, status) => moveTask({id: id as any, newStatus: status})} priorityColors={priorityColors} />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-blue-400 flex items-center gap-2"><span className="w-2 h-2 bg-blue-400 rounded-full"></span>In Progress</h3>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-500">{doingTasks.length}</span>
                  </div>
                  <div className="space-y-2">
                    {doingTasks.map((task) => (
                      <TaskCard key={task._id} task={task} onMove={(id, status) => moveTask({id: id as any, newStatus: status})} priorityColors={priorityColors} />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-emerald-400 flex items-center gap-2"><span className="w-2 h-2 bg-emerald-400 rounded-full"></span>Done</h3>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-500">{doneTasks.length}</span>
                  </div>
                  <div className="space-y-2">
                    {doneTasks.map((task) => (
                      <TaskCard key={task._id} task={task} onMove={(id, status) => moveTask({id: id as any, newStatus: status})} priorityColors={priorityColors} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CALENDAR VIEW */}
          {selectedView === "calendar" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Calendar & Meetings</h2>
              {events.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-gray-400">No upcoming events</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event._id} className="bg-[#12121a] border border-white/10 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          <p className="text-sm text-gray-400 mt-1">
                            {new Date(event.startTime).toLocaleString()} - {event.attendees?.length || 0} attendees
                          </p>
                          {event.meetLink && (
                            <div className="mt-3 flex items-center gap-3">
                              <a href={event.meetLink} target="_blank" rel="noopener noreferrer" className="text-sm bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors inline-flex items-center gap-2">
                                <span>🎥</span> Join Google Meet
                              </a>
                              <span className="text-xs text-gray-500">Recording will be analyzed automatically</span>
                            </div>
                          )}
                        </div>
                        <span className={`text-xs px-3 py-1 rounded ${event.status === "confirmed" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MEETINGS VIEW */}
          {selectedView === "meetings" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Meeting Recordings & Transcripts</h2>
                {unprocessedMeetings.length > 0 && (
                  <span className="text-sm text-blue-400">{unprocessedMeetings.length} pending analysis</span>
                )}
              </div>
              
              {meetings.length === 0 ? (
                <div className="text-center py-20 bg-[#12121a] border border-white/10 rounded-xl">
                  <div className="text-6xl mb-4">🎥</div>
                  <h3 className="text-lg font-semibold mb-2">No recordings yet</h3>
                  <p className="text-gray-400 mb-4">When you receive Google Meet recordings via email, I'll automatically:</p>
                  <ul className="text-sm text-gray-500 space-y-1 text-left max-w-md mx-auto">
                    <li>• Analyze the transcript with AI</li>
                    <li>• Extract action items and insights</li>
                    <li>• Create tasks from action items</li>
                    <li>• Suggest follow-ups</li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-4">
                  {meetings.map((meeting) => (
                    <div key={meeting._id} className={`bg-[#12121a] border rounded-lg p-4 ${meeting.processed ? "border-white/10" : "border-blue-500/30"}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{meeting.summary}</h3>
                          <p className="text-sm text-gray-400">Received: {new Date(meeting.receivedAt).toLocaleString()}</p>
                        </div>
                        {!meeting.processed && (
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded animate-pulse">New - Needs Analysis</span>
                        )}
                      </div>
                      
                      {meeting.processed ? (
                        <div className="mt-3 space-y-3">
                          <div className="p-3 bg-white/5 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Insights</p>
                            <p className="text-sm">{meeting.insights}</p>
                          </div>
                          {meeting.actionItems && meeting.actionItems.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-500 mb-2">Action Items Created:</p>
                              <div className="space-y-1">
                                {meeting.actionItems.map((item, idx) => (
                                  <div key={idx} className="text-sm flex items-center gap-2">
                                    <span className="text-emerald-400">✓</span> {item}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="mt-3">
                          <button 
                            onClick={() => {
                              // Simulate analysis
                              analyzeMeeting(
                                meeting._id,
                                "Key discussion points identified. Follow-up required on project timeline.",
                                ["Follow up with designer", "Update project timeline", "Send recap email"]
                              );
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                          >
                            🤖 Analyze Recording
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROACTIVE VIEW */}
          {selectedView === "proactive" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Proactive Suggestions</h2>
              {proactive.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">💡</div>
                  <p className="text-gray-400">No pending suggestions</p>
                  <p className="text-sm text-gray-500 mt-2">I'm monitoring your emails, meetings, and tasks to suggest actions</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {proactive.map((suggestion) => (
                    <div key={suggestion._id} className="bg-[#12121a] border border-indigo-500/20 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs px-2 py-1 rounded ${priorityColors[suggestion.priority]}`}>{suggestion.priority}</span>
                            <span className="text-xs text-gray-500">{suggestion.source}</span>
                          </div>
                          <h3 className="font-semibold">{suggestion.title}</h3>
                          <p className="text-sm text-gray-400 mt-1">{suggestion.description}</p>
                          <p className="text-xs text-indigo-400 mt-2">🤖 {suggestion.reasoning}</p>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <button className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-4 py-2 rounded-lg text-sm transition-colors">
                            Execute
                          </button>
                          <button className="bg-white/5 text-gray-400 hover:bg-white/10 px-4 py-2 rounded-lg text-sm transition-colors">
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MEMORY VIEW */}
          {selectedView === "memory" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Memory Bank</h2>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search memories..." className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 w-64" />
              </