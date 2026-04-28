'use client';

import {
  Code,
  CodeBlock,
  CodeHeader,
} from '@/components/animate-ui/components/animate/code';
import { Code2Icon, CodeIcon, File } from 'lucide-react';

interface CodeDemoProps {
  duration: number;
  delay: number;
  writing: boolean;
  cursor: boolean;
}

export const CodeDemo = ({
  duration,
  delay,
  writing,
  cursor,
}: CodeDemoProps) => {
  return (
    <Code
      key={`${duration}-${delay}-${writing}-${cursor}`}
      className="w-full sm:w-110 h-120 border-none"
      code={`'use client';

import { useEffect, useState } from 'react';

export function useMocktailMentors() {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    
    async function syncMentors() {
      try {
        const res = await fetch('/api/v1/mentors/live', {
          signal: controller.signal 
        });
        const data = await res.json();
        setMentors(data.filter(m => m.isAvailable));
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Mocktail Sync Error:', err);
        }
      }
    }

    syncMentors();
    return () => controller.abort();
  }, []);

  return { mentors };
}`}
    >
      <CodeHeader icon={Code2Icon} copyButton>
       Use-fet
      </CodeHeader>

      <CodeBlock
        cursor={cursor}
        lang="tsx"
        writing={writing}
        duration={duration}
        delay={delay}
      />
    </Code>
  );
};