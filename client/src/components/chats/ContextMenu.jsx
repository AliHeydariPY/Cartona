import { Portal } from "react-portal";
import { FaRegCircleCheck } from "react-icons/fa6";
import { TbEditCircle } from "react-icons/tb";
import { FiTrash2 } from "react-icons/fi";

const ContextMenu = ({ contextMenu, onSelect, onEdit, onDelete }) => {
  if (!contextMenu.visible) return null;

  return (
    <Portal>
      <div
        className="bg-white/95 backdrop-blur-sm text-blue-950 border border-gray-200 rounded-lg shadow-xl z-50"
        style={{
          position: "fixed",
          top: contextMenu.y,
          left: Math.max(10, contextMenu.x - 80),
          right: 10,
          maxWidth: "200px",
        }}
      >
        <div
          className="flex items-center gap-2 px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
          onClick={onSelect}
        >
          <FaRegCircleCheck className="text-blue-600" size={14} />
          <span>Select</span>
        </div>

        <div
          className="flex items-center gap-1 px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
          onClick={onEdit}
        >
          <TbEditCircle size={16} className="text-green-600" />
          <span>Edit</span>
        </div>

        <div
          className="flex items-center gap-2 px-3 py-2 hover:bg-blue-100 cursor-pointer text-red-600 text-sm"
          onClick={() => onDelete(contextMenu.message.id)}
        >
          <FiTrash2 size={14} />
          <span>Delete</span>
        </div>
      </div>
    </Portal>
  );
};

export default ContextMenu;