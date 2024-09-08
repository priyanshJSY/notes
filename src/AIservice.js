export const getGlossaryTerms = async (content) => {
  try {
    const response = await fetch("http://localhost:5000/get-glossary-terms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    const data = await response.json();

    if (data.glossaryTerms && Array.isArray(data.glossaryTerms)) {
      return data.glossaryTerms;
    }

    console.error("Glossary terms are not in the expected format:", data);
    return [];
  } catch (error) {
    console.error("Error fetching glossary terms:", error);
    throw error;
  }
};