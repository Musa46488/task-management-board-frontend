import { Task } from "@/types/task";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";

interface Props {
  task: Task;
  deleteTask: (id: string) => void;
  openEditModal: (task: Task) => void;
}

const SortableItem = ({ task, deleteTask, openEditModal }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const isCompleted = task.status === "completed";

  const handleDelayedAction = (action: () => void) => {
    setTimeout(action, 150);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white/80 backdrop-blur-sm p-4 rounded-xl mb-4 shadow-md border border-white/50 group hover:shadow-lg transition-all"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <div className="flex justify-between items-start mb-1">
          <h3
            className={`font-bold text-gray-800 leading-tight ${
              isCompleted ? "line-through text-gray-500 opacity-70" : ""
            }`}
          >
            {task.title}
          </h3>
          <div className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 7h2v2H7V7zm0 4h2v2H7v-2zm4-4h2v2h-2V7zm0 4h2v2h-2v-2z" />
            </svg>
          </div>
        </div>

        {task.description && (
          <p className="text-sm text-gray-600 line-clamp-2 italic mb-2">
            {task.description}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-3 pt-3 border-t border-gray-200/50">
        <motion.button
          onClick={() => handleDelayedAction(() => openEditModal(task))}
          className="text-xs font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.9, y: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          Edit
        </motion.button>
        <motion.button
          onClick={() => handleDelayedAction(() => deleteTask(task.id))}
          className="text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-700 transition-colors cursor-pointer"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.9, y: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          Delete
        </motion.button>
      </div>
    </div>
  );
};

export default SortableItem;
