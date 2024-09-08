import { getGlossaryTerms } from "../AIservice";
import NoteCard from "./NotesCard";
import Toolbar from "./Toolbar";
import { useState, useRef, useEffect } from "react";

// import HighlightedText from "./HighlitedText";

export default function MainPage() {
  const editorRef = useRef(null);
  const titleRef = useRef(null);
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null); // Track the note being edited
  const [glossaryTerms, setGlossaryTerms] = useState([]);

  // Active states for each tool
  const [activeTools, setActiveTools] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    foreColor: "#ffffff", // Default color for the text (white)
  });

  // Load notes from localStorage when component mounts
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    // console.log(savedNotes);
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("notes", JSON.stringify(notes));
    }
  }, [notes]);

  // Set default text color when the editor loads
  useEffect(() => {
    if (editorRef.current) {
      document.execCommand("foreColor", false, activeTools.foreColor);
    }
  }, [editorRef, activeTools.foreColor]);

  // Function to format text and toggle active state
  const toggleFormat = (tool) => {
    const command = tool;

    // Toggle the formatting
    document.execCommand(command, false, null);

    // Toggle active state
    setActiveTools((prev) => ({
      ...prev,
      [tool]: !prev[tool],
    }));
  };

  // Handle font color change
  const handleColorChange = (color) => {
    document.execCommand("foreColor", false, color);

    // Inject a style tag for list bullets and numbers
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
      .editor-text ol, .editor-text ul {
        color: ${color} !important;
      }
    `;

    // Remove any existing style tag for color if exists
    const existingStyleTag = editorRef.current.querySelector("style");
    if (existingStyleTag) {
      existingStyleTag.remove();
    }

    // Append the new style tag
    editorRef.current.appendChild(styleTag);

    // Update active color
    setActiveTools((prev) => ({
      ...prev,
      foreColor: color,
    }));
  };

  const handleFontSizeChange = (size) => {
    document.execCommand("fontSize", false, size);
  };
  // Function to truncate long titles
  const truncateTitle = (title, maxLength = 20) => {
    if (title.length > maxLength) {
      return `${title.slice(0, maxLength)}...`;
    }
    return title;
  };

  //Handle Save Note
  const handleSaveNote = () => {
    const noteTitle = titleRef.current.value.trim();
    const noteContent = editorRef.current.innerHTML.trim();

    if (noteContent) {
      const newNote = {
        title: noteTitle || `Note ${notes.length + 1}`,
        content: noteContent,
        lastUpdated: new Date().toISOString(),
        isPinned: false,
      };

      if (editingNote !== null) {
        setNotes((prevNotes) => {
          const updatedNotes = [...prevNotes];
          updatedNotes[editingNote] = newNote;
          return updatedNotes;
        });
        setEditingNote(null);
      } else {
        setNotes((prevNotes) => [...prevNotes, newNote]);
      }

      editorRef.current.innerHTML = "";
      titleRef.current.value = "";
    }
  };

  // Function to load a note for editing
  const handleEditNote = (index) => {
    const note = notes[index];
    titleRef.current.value = note.title;
    editorRef.current.innerHTML = note.content;
    setEditingNote(index); // Track which note is being edited
  };

  // Function to pin/unpin a note
  const handlePinNote = (index) => {
    const updatedNotes = [...notes];
    updatedNotes[index] = {
      ...updatedNotes[index],
      isPinned: !updatedNotes[index].isPinned,
    };
    setNotes(updatedNotes);
  };

  // Function to delete a note
  const handleDeleteNote = (index) => {
    setNotes((prevNotes) => {
      const updatedNotes = prevNotes.filter((_, i) => i !== index);

      localStorage.setItem("notes", JSON.stringify(updatedNotes));

      return updatedNotes;
    });
  };

  // Function to sort notes (pinned ones first)
  const sortedNotes = notes.sort((a, b) => b.isPinned - a.isPinned);

  const handleContentChange = () => {
    setContent(editorRef.current.innerText); // Update Content
    // debouncedGlossaryTerms();
  };

  const handleGlossaryTerms = async () => {
    const editorContent = editorRef.current.innerText;
    try {
      const terms = await getGlossaryTerms(editorContent);
      setGlossaryTerms(terms);
      highlightGlossaryTerms(terms);
    } catch (error) {
      console.error("Error fetching glossary terms:", error);
    }
  };

  // const debounce = (func, delay) => {
  //   let timer;
  //   return (...args) => {
  //     clearTimeout(timer);
  //     timer = setTimeout(() => func.apply(this, args), delay);
  //   };
  // };

  // const debouncedGlossaryTerms = debounce(handleGlossaryTerms, 500);

  function saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;
    return selection.getRangeAt(0).cloneRange();
  }

  function restoreSelection(range) {
    if (!range) return;
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  const highlightGlossaryTerms = (terms) => {
    if (!editorRef.current) return;

    const savedSelection = saveSelection();
    const editor = editorRef.current;

    // Create a combined regex for all terms
    const combinedKeywords = terms
      .map(({ keyword }) => escapeRegExp(keyword))
      .join("|"); // Combine all keywords into one regex pattern
    const regex = new RegExp(`\\b(${combinedKeywords})\\b`, "gi");

    // Function to wrap matched keywords in <span> tags with their meanings
    const wrapMatchedText = (textNode) => {
      const text = textNode.textContent;

      if (regex.test(text)) {
        const fragment = document.createDocumentFragment();

        let lastIndex = 0;
        text.replace(regex, (match, keyword, offset) => {
          // Append the text before the match
          fragment.appendChild(
            document.createTextNode(text.slice(lastIndex, offset))
          );

          // Create the span element for the matched term
          const span = document.createElement("span");
          const term = terms.find((t) =>
            new RegExp(`\\b${escapeRegExp(t.keyword)}\\b`, "i").test(match)
          );

          span.className = "glossary-term";
          span.setAttribute("data-meaning", escapeHtml(term.meaning));
          span.textContent = match;

          // Append the highlighted term to the fragment
          fragment.appendChild(span);
          lastIndex = offset + match.length;
        });

        // Append the rest of the text after the last match
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));

        // Replace the original text node with the fragment
        textNode.replaceWith(fragment);
      }
    };

    // Walk through all text nodes inside the editor
    const walkNodes = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        wrapMatchedText(node); // Process text nodes to highlight keywords
      } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        !node.classList.contains("glossary-term")
      ) {
        node.childNodes.forEach(walkNodes); // Recursively process child nodes
      }
    };

    // Start processing the editor's content
    walkNodes(editor);

    if (savedSelection) {
      restoreSelection(savedSelection);
    }

    // Add event listeners for hover effects
    const glossaryTerms = editor.querySelectorAll(".glossary-term");
    glossaryTerms.forEach((term) => {
      term.addEventListener("mouseenter", showTooltip);
      term.addEventListener("mouseleave", hideTooltip);
    });
  }; //HighlightGlossaryTerm

  const showTooltip = (event) => {
    const term = event.target;
    const meaning = term.getAttribute("data-meaning");

    const tooltip = document.createElement("div");
    tooltip.className = "glossary-tooltip";
    tooltip.textContent = meaning;

    document.body.appendChild(tooltip);

    const rect = term.getBoundingClientRect();
    tooltip.style.left = `${rect.left}px`;
    tooltip.style.top = `${rect.bottom + window.scrollY}px`;
  };

  const hideTooltip = () => {
    const tooltip = document.querySelector(".glossary-tooltip");
    if (tooltip) {
      tooltip.remove();
    }
  };

  // Helper function to escape special characters in regex
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  // Helper function to escape HTML special characters
  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  return (
    <>
      <div className="main-page">
        <div className="side-bar">
          <ul className="note-list">
            {sortedNotes.map((note, index) => (
              <li key={index}>
                <NoteCard
                  notetitle={truncateTitle(note.title)}
                  index={index} // Pass the index to NoteCard
                  onClick={() => handleEditNote(index)} // Pass the edit handler
                  onPin={() => handlePinNote(index)} // Pass the pin handler
                  onDelete={() => handleDeleteNote(index)} // Pass the delete handler
                  isPinned={note.isPinned}
                  lastUpdated={note.lastUpdated}
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="editor-div">
          <input
            ref={titleRef}
            className="editor-head"
            placeholder="Your heading here"
          />
          <div
            ref={editorRef}
            contentEditable={true}
            className="editor-text"
            onInput={handleContentChange}
            style={{ color: activeTools.foreColor }}
          />
          <div className="bottom-bar">
            <Toolbar
              activeTools={activeTools}
              toggleFormat={toggleFormat}
              handleColorChange={handleColorChange}
              handleFontSizeChange={handleFontSizeChange}
              onGlossaryTerms={handleGlossaryTerms}
            />
            <div className="save-div">
              <button className="save-btn" onClick={handleSaveNote}>
                {editingNote !== null ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
