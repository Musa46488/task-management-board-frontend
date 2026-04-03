import { Task } from "@/types/task";
import { motion } from "framer-motion";

interface Props {
  isOpen: boolean;
  editingTask: Task | null;
  editTitle: string;
  editDescription: string;
  setEditTitle: (value: string) => void;
  setEditDescription: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}

const EditTaskModal = ({
  isOpen,
  editingTask,
  editTitle,
  editDescription,
  setEditTitle,
  setEditDescription,
  onClose,
  onSave,
}: Props) => {
  if (!isOpen || !editingTask) return null;

  const handleDelayedAction = (action: () => void) => {
    setTimeout(action, 150);
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    handleDelayedAction(onSave);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/50 ring-1 ring-black/5">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 tracking-tight">
          Edit Task
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-500 text-xs font-bold uppercase tracking-wider ml-1">
              Task Title
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-4 focus:ring-blue-400/50 focus:border-blue-400 outline-none transition-all text-gray-800 font-medium"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-gray-500 text-xs font-bold uppercase tracking-wider ml-1">
              Description
            </label>
            <textarea
              className="bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-4 focus:ring-blue-400/50 focus:border-blue-400 outline-none transition-all text-gray-800 resize-none h-32"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <motion.button
              type="button"
              onClick={() => handleDelayedAction(onClose)}
              className="px-6 py-2.5 text-gray-500 font-semibold hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.9, y: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              Cancel
            </motion.button>

            <motion.button
              type="submit"
              className="px-8 py-2.5 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 cursor-pointer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.9, y: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              Save Changes
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
