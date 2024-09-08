import { useState } from "react";
import { 
  FormatBold as BoldIcon, 
  FormatItalic as ItalicIcon, 
  FormatUnderlined as UnderlineIcon, 
  StrikethroughS as StrikethroughIcon, 
  FormatListNumbered as OrderedListIcon, 
  FormatListBulleted as UnorderedListIcon, 
  FormatAlignLeft as AlignLeftIcon, 
  FormatAlignCenter as AlignCenterIcon, 
  FormatAlignRight as AlignRightIcon, 
  FormatAlignJustify as AlignJustifyIcon, 
  FormatClear as ClearFormatIcon, 
  Edit as EditIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';

export default function Toolbar({
  activeTools,
  toggleFormat,
  handleColorChange,
  handleFontSizeChange,
  onGlossaryTerms,
}) {
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const handleGlossaryClick = async () => {
    setLoading(true);
    try {
      await onGlossaryTerms();
    } catch (error) {
      console.error("Error fetching glossary terms:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tools">
      {/* Formatting Buttons with Active States */}
      <button
        className={`tool-btn ${activeTools.bold ? "active" : ""}`}
        onClick={() => toggleFormat("bold")}
      >
        <BoldIcon />
      </button>
      <button
        className={`tool-btn ${activeTools.italic ? "active" : ""}`}
        onClick={() => toggleFormat("italic")}
      >
        <ItalicIcon />
      </button>
      <button
        className={`tool-btn ${activeTools.underline ? "active" : ""}`}
        onClick={() => toggleFormat("underline")}
      >
        <UnderlineIcon />
      </button>
      <button
        className={`tool-btn ${activeTools.strikeThrough ? "active" : ""}`}
        onClick={() => toggleFormat("strikeThrough")}
      >
        <StrikethroughIcon />
      </button>

      {/* Font Size */}
      <select
        onChange={(e) => handleFontSizeChange(e.target.value)}
        className="tool-btn"
      >
        <option value="1">Sm</option>
        <option value="3">Nl</option>
        <option value="5">Lg</option>
        <option value="7">Xl</option>
      </select>

      {/* Font Color */}
      <input
        type="color"
        value={activeTools.foreColor}
        onChange={(e) => handleColorChange(e.target.value)}
        className="tool-btn"
        title="Font Color"
      />

      {/* Lists */}
      <button
        className={`tool-btn ${document.queryCommandState("insertOrderedList") ? "active" : ""}`}
        onClick={() => document.execCommand("insertOrderedList")}
      >
        <OrderedListIcon />
      </button>
      <button
        className={`tool-btn ${document.queryCommandState("insertUnorderedList") ? "active" : ""}`}
        onClick={() => document.execCommand("insertUnorderedList")}
      >
        <UnorderedListIcon />
      </button>

      {/* Text Alignment */}
      <button
        className={`tool-btn ${document.queryCommandState("justifyLeft") ? "active" : ""}`}
        onClick={() => document.execCommand("justifyLeft")}
      >
        <AlignLeftIcon />
      </button>
      <button
        className={`tool-btn ${document.queryCommandState("justifyCenter") ? "active" : ""}`}
        onClick={() => document.execCommand("justifyCenter")}
      >
        <AlignCenterIcon />
      </button>
      <button
        className={`tool-btn ${document.queryCommandState("justifyRight") ? "active" : ""}`}
        onClick={() => document.execCommand("justifyRight")}
      >
        <AlignRightIcon />
      </button>
      <button
        className={`tool-btn ${document.queryCommandState("justifyFull") ? "active" : ""}`}
        onClick={() => document.execCommand("justifyFull")}
      >
        <AlignJustifyIcon />
      </button>

      {/* Clear Formatting */}
      <button className="tool-btn" onClick={() => document.execCommand("removeFormat")}>
        <ClearFormatIcon />
      </button>

      {/* Glossary Terms */}
      <button onClick={handleGlossaryClick} disabled={loading} className="tool-btn">
        {loading ? "🔃" : <EditIcon />}
      </button>
    </div>
  );
}