const HighlightedText = ({ content, glossary }) => {
  // Go through each keyword and wrap it in a span with hover functionality
  let highlightedContent = content;

  glossary.forEach(({ word, definition }) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    highlightedContent = highlightedContent.replace(
      regex,
      `<span class="highlight" title="${definition}">${word}</span>`
    );
  });

  return <div dangerouslySetInnerHTML={{ __html: highlightedContent }} />;
};

export default HighlightedText;
