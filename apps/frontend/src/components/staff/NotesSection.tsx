import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../ui/button";

interface Note {
  id: string;
  content: string;
  category: string;
  date: string;
  author: string;
}

interface NotesSectionProps {
  notes: Note[];
  onAddNote: (note: Omit<Note, "id" | "date">) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  onAddNote,
  onDeleteNote,
}) => {
  const [newNote, setNewNote] = useState({
    content: "",
    category: "general",
    author: "",
  });

  const categories = [
    "general",
    "performance",
    "training",
    "disciplinary",
    "achievements",
    "personal",
  ];

  return (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-lg font-medium mb-4">Staff Notes</h3>

      <div className="space-y-4">
        {/* Add New Note */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={newNote.category}
                onChange={(e) =>
                  setNewNote({ ...newNote, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <input
                type="text"
                value={newNote.author}
                onChange={(e) =>
                  setNewNote({ ...newNote, author: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="Your name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Note Content
            </label>
            <textarea
              value={newNote.content}
              onChange={(e) =>
                setNewNote({ ...newNote, content: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              rows={3}
              placeholder="Enter note content..."
            />
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              onClick={() => {
                if (newNote.content && newNote.author) {
                  onAddNote(newNote);
                  setNewNote({ content: "", category: "general", author: "" });
                }
              }}
              disabled={!newNote.content || !newNote.author}
            >
              <Icons.Plus className="w-4 h-4 mr-2" />
              Add Note
            </Button>
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          {notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full">
                    {note.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    Added by {note.author} on {note.date}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteNote(note.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Icons.Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {note.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
