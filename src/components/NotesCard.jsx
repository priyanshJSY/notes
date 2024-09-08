import React from "react";
import { PushPin as PinIcon, PushPinOutlined as PinDropIcon, DeleteRounded as DeleteOutlineIcon } from "@mui/icons-material";

export default function NoteCard({
  notetitle,
  onClick,
  onPin,
  onDelete,
  isPinned,
  lastUpdated,
}) {
  // Function to format time ago
  const timeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = Math.floor((now - then) / (1000 * 60)); // Difference in minutes

    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff} mins ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hrs ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  };

  // Function to truncate long titles
  const truncateTitle = (title, maxLength = 10) => {
    if (title.length > maxLength) {
      return `${title.slice(0, maxLength - 3)}…`;
    }
    return title;
  };

  return (
    <div className="note-card">
      <button
        className="list-item"
        onClick={onClick}
        aria-label={`Open note: ${notetitle}`}
      >
        {truncateTitle(notetitle)}
        <div className="time-ago">{timeAgo(lastUpdated)}</div>
      </button>
      <div className="note-card-options">
        <button
          className="nco-btn"
          onClick={onPin}
          aria-label={isPinned ? "Unpin note" : "Pin note"}
        >
          {isPinned ? <PinIcon /> : <PinDropIcon />}
        </button>
        <button
          className="nco-btn"
          onClick={onDelete}
          aria-label="Delete note"
        >
          <DeleteOutlineIcon color="error" />
        </button>
      </div>
    </div>
  );
}
