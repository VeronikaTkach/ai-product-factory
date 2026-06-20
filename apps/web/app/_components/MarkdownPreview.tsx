interface IMarkdownPreviewProps {
  markdown: string;
}

/**
 * Minimal, dependency-free markdown rendering for demo output.
 * Handles headings, tables, code fences, and lists well enough for
 * blueprint previews; not a general-purpose markdown renderer.
 */
export function MarkdownPreview({ markdown }: IMarkdownPreviewProps) {
  const lines = markdown.split("\n");
  const blocks: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];

  lines.forEach((line, index) => {
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        blocks.push(
          <pre
            key={`code-${index}`}
            className="mb-3 overflow-x-auto rounded bg-slate-900 p-3 text-xs text-slate-100"
          >
            <code>{codeLines.join("\n")}</code>
          </pre>,
        );
        codeLines = [];
      }
      inCodeBlock = !inCodeBlock;
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    if (line.startsWith("# ")) {
      blocks.push(
        <h1 key={index} className="mb-2 mt-4 text-xl font-bold text-slate-900">
          {line.slice(2)}
        </h1>,
      );
    } else if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={index} className="mb-2 mt-4 text-lg font-semibold text-slate-900">
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={index} className="mb-1 mt-3 text-base font-semibold text-slate-800">
          {line.slice(4)}
        </h3>,
      );
    } else if (line.startsWith("- [ ] ") || line.startsWith("- [x] ")) {
      blocks.push(
        <p key={index} className="ml-4 text-sm text-slate-700">
          ☐ {line.slice(6)}
        </p>,
      );
    } else if (line.startsWith("- ")) {
      blocks.push(
        <li key={index} className="ml-4 list-disc text-sm text-slate-700">
          {line.slice(2)}
        </li>,
      );
    } else if (line.startsWith("|")) {
      blocks.push(
        <div key={index} className="font-mono text-xs text-slate-700">
          {line}
        </div>,
      );
    } else if (line.trim() === "") {
      blocks.push(<div key={index} className="h-2" />);
    } else {
      blocks.push(
        <p key={index} className="mb-1 text-sm text-slate-700">
          {line}
        </p>,
      );
    }
  });

  return <div className="space-y-0">{blocks}</div>;
}
