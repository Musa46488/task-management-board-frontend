"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
  rectIntersection,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import Column from "@/components/Column";
import SortableItem from "@/components/SortableItem";
import EditTaskModal from "@/components/EditTaskModal";

import { type Task, type Status, columns } from "@/types/task";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const TaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch(console.error);
  }, [token]);

  const addTask = async (event: React.SubmitEvent) => {
    event.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, status: "todo" }),
      });

      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await fetch(`${API_BASE}/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingTask) return;

    try {
      const res = await fetch(`${API_BASE}/tasks/${editingTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      });

      const updatedTask = await res.json();
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
      );

      setIsEditModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((task) => task.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeTaskItem = tasks.find((task) => task.id === active.id);
    if (!activeTaskItem) return;

    const overTaskItem = tasks.find((task) => task.id === over.id);

    let newTasks = [...tasks];

    if (overTaskItem) {
      if (activeTaskItem.status === overTaskItem.status) {
        const columnTasks = tasks.filter(
          (task) => task.status === activeTaskItem.status,
        );

        const oldIndex = columnTasks.findIndex((task) => task.id === active.id);
        const newIndex = columnTasks.findIndex((task) => task.id === over.id);

        const newColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);

        newTasks = [
          ...tasks.filter((task) => task.status !== activeTaskItem.status),
          ...newColumnTasks,
        ];
      } else {
        newTasks = newTasks.map((task) =>
          task.id === active.id
            ? { ...task, status: overTaskItem.status }
            : task,
        );
      }
    } else {
      const newStatus = over.id as Status;
      newTasks = newTasks.map((task) =>
        task.id === active.id ? { ...task, status: newStatus } : task,
      );
    }

    setTasks(newTasks);

    try {
      await fetch(`${API_BASE}/tasks/reorder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tasks: newTasks.map((task, index) => ({
            id: task.id,
            status: task.status,
            order: index + 1,
          })),
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="p-6 min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 text-black">
        <h1 className="text-5xl font-extrabold py-2.5 mb-10 text-center tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white to-gray-300 drop-shadow-lg">
          Task Management Board
        </h1>

        <form
          onSubmit={addTask}
          className="flex flex-col gap-4 mb-10 max-w-4xl mx-auto bg-white/20 p-6 rounded-2xl backdrop-blur-md shadow-2xl border border-white/30"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col flex-1 gap-1.5">
              <label className="text-white text-sm font-semibold ml-1 drop-shadow-sm">
                Task Title
              </label>
              <input
                type="text"
                className="bg-white/90 border-0 p-3 rounded-lg focus:ring-4 focus:ring-blue-400 outline-none transition-all placeholder-gray-400 text-gray-800"
                placeholder="What needs to be done?"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="flex flex-col justify-end">
              <motion.button
                type="submit"
                className="bg-linear-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white font-bold px-8 py-3 rounded-lg shadow-lg cursor-pointer h-12.5 md:mb-0"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.9, y: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                Add Task
              </motion.button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-white text-sm font-semibold ml-1 drop-shadow-sm">
              Description
            </label>
            <textarea
              className="bg-white/90 border-0 p-3 rounded-lg focus:ring-4 focus:ring-blue-400 outline-none transition-all placeholder-gray-400 text-gray-800 resize-none h-24"
              placeholder="Add more details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </form>

        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {columns.map((column) => {
              const columnTasks = tasks.filter(
                (task) => task.status === column.id,
              );

              return (
                <Column key={column.id} id={column.id} title={column.title}>
                  <SortableContext
                    items={columnTasks.map((task) => task.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {columnTasks.map((task) => (
                      <SortableItem
                        key={task.id}
                        task={task}
                        deleteTask={deleteTask}
                        openEditModal={openEditModal}
                      />
                    ))}
                  </SortableContext>
                </Column>
              );
            })}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="bg-white p-5 rounded-xl shadow-2xl border-l-4 border-blue-500 opacity-90 cursor-grabbing scale-105 transition-transform">
                <h3 className="font-bold text-lg text-gray-800">
                  {activeTask.title}
                </h3>
                {activeTask.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {activeTask.description}
                  </p>
                )}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <EditTaskModal
        isOpen={isEditModalOpen}
        editingTask={editingTask}
        editTitle={editTitle}
        editDescription={editDescription}
        setEditTitle={setEditTitle}
        setEditDescription={setEditDescription}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
      />
    </>
  );
};

export default TaskBoard;
