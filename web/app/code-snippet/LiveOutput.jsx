"use client";

import { useEffect, useRef } from "react";

const LiveOutput = ({ jsCode, cssCode }) => {
  const iframeRef = useRef(null);

  console.group(jsCode)

  useEffect(() => {
    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    // Set up the iframe document structure
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <style>${cssCode}</style>
        </head>
        <body>
            ${jsCode}
        </body>
      </html>
    `);
    iframeDoc.close();
  }, [jsCode, cssCode]);

  return (
    <div className="w-[400px] h-[400px] border">
      <h3>Live Output</h3>
      <iframe ref={iframeRef} title="Live Output" style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default LiveOutput;
