"use client";

import { useEffect, useState } from "react";
import CodeSnippet from "./CodeSnippet";
import LiveOutput from "./LiveOutput";

const CodeSnippetPage = ({ id }) => {
  const [snippet, setSnippet] = useState(null);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const response = await fetch(
          `http://localhost:5520/user/code-snippet/list`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        if (data && data.data?.length > 0) {
          setSnippet(data.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch snippet:", error);
      }
    };

    fetchSnippet();
  }, []); // Empty dependency array to ensure this only runs once on mount

  if (!snippet) return <div>Loading...</div>;

  return (
    <div className="flex justify-center">
      <div>
        <h2>{snippet.title}</h2>
        <div dangerouslySetInnerHTML={{ __html: snippet.description }} />

        {snippet.cssCode && (
          <div>
            <h3>CSS Code</h3>
            <CodeSnippet code={snippet.cssCode} language="css" />
          </div>
        )}

        <div>
          <h3>JavaScript Code</h3>
          <CodeSnippet code={snippet.jsCode} language="javascript" />
        </div>
      </div>

      {snippet.isOutput && (
        <LiveOutput jsCode={snippet.jsCode} cssCode={snippet.cssCode} />
      )}
    </div>
  );
};

export default CodeSnippetPage;
