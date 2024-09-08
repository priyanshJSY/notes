import NoteCard from "./NotesCard";
import { useState, useRef } from "react";

export default function MainPage() {
  const editorRef = useRef(null);
  const [content, setContent] = useState("");
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
  }

  const handleContentChange = () => {
    setContent(editorRef.current.innerHTML);
  }
  return (
    <>
      <div className="main-page">
        <div className="side-bar">
          <ul className="note-list">
            <li>
              <NoteCard notetitle={"Note 1"} />
            </li>
            <li>
              <NoteCard notetitle={"My Vegetables List"} />
            </li>
            <li>
              <NoteCard notetitle={"Tasks of the day"} />
            </li>
            <li>
              <NoteCard notetitle={"Note 4"} />
            </li>
            <li>
              <NoteCard notetitle={"Note 5"} />
            </li>
            <li>
              <NoteCard notetitle={"Note 6"} />
            </li>
          </ul>
        </div>

        <div className="editor-div">
          <input className="editor-head" placeholder="your heading here" />
          <textarea ref={editorRef} contentEditable = {true} onInput={handleContentChange} className="editor-text" placeholder="start tinkering..." /> {content}
          <div className="bottom-bar">
            <div className="tools">
              <button className="tool-btn" onClick={() => {
                formatText("bold");
              }}>
                <strong>B</strong>
              </button>
              <button className="tool-btn">
                {" "}
                <i>I</i>{" "}
              </button>
              <button className="tool-btn">
                {" "}
                <u>U</u>{" "}
              </button>
              <button className="tool-btn"> -- </button>
            </div>
            <div className="save-div">
                <button className="save-btn">Save</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
