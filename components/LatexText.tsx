"use client";

import { InlineMath } from "react-katex";

type Props = {
  text: string;
};

export default function LatexText({ text }: Props) {
  const regex = /\$(.*?)\$/g;
  const parts: React.ReactNode[] = [];

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // texto antes del $...$
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // contenido dentro de $...$
    parts.push(<InlineMath key={match.index} math={match[1]} />);

    lastIndex = regex.lastIndex;
  }

  // resto del texto
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}