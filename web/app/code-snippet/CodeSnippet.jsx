import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';


const CodeSnippet = ({ code }) => {


  return (
    <SyntaxHighlighter language="javascript" style={dracula}>
      {code}
    </SyntaxHighlighter>
  );
};

export default CodeSnippet;
