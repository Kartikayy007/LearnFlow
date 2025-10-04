'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputSubmit,
  PromptInputModelSelect,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectValue,
} from "@/components/ui/shadcn-io/ai/prompt-input";
import { Brain, Zap } from 'lucide-react';
import { MultiStepLoader } from '@/components/ui/multi-step-loader';

const loadingStates = [
  { text: "Analyzing your topic..." },
  { text: "Understanding key concepts..." },
  { text: "Researching educational content..." },
  { text: "Identifying learning objectives..." },
  { text: "Structuring the lesson flow..." },
  { text: "Designing interactive elements..." },
  { text: "Creating visual components..." },
  { text: "Planning hands-on activities..." },
  { text: "Writing clear explanations..." },
  { text: "Adding code examples..." },
  { text: "Crafting practice exercises..." },
  { text: "Building quiz questions..." },
  { text: "Designing UI components..." },
  { text: "Adding animations..." },
  { text: "Creating interactive demos..." },
  { text: "Writing step-by-step guides..." },
  { text: "Adding helpful tooltips..." },
  { text: "Organizing content sections..." },
  { text: "Implementing gamification..." },
  { text: "Adding progress tracking..." },
  { text: "Creating engaging visuals..." },
  { text: "Polishing user experience..." },
  { text: "Optimizing for learning..." },
  { text: "Adding accessibility features..." },
  { text: "Testing interactions..." },
  { text: "Refining explanations..." },
  { text: "Adding real-world examples..." },
  { text: "Creating illustrations..." },
  { text: "Implementing feedback systems..." },
  { text: "Designing assessment tools..." },
  { text: "Adding hints and tips..." },
  { text: "Creating challenge modes..." },
  { text: "Building knowledge checks..." },
  { text: "Adding fun facts..." },
  { text: "Crafting memorable analogies..." },
  { text: "Designing reward systems..." },
  { text: "Creating practice scenarios..." },
  { text: "Adding reference materials..." },
  { text: "Building comprehension checks..." },
  { text: "Optimizing content flow..." },
  { text: "Adding interactive diagrams..." },
  { text: "Creating summary sections..." },
  { text: "Designing learning pathways..." },
  { text: "Adding concept maps..." },
  { text: "Building skill assessments..." },
  { text: "Creating flashcards..." },
  { text: "Adding multimedia elements..." },
  { text: "Polishing interactions..." },
  { text: "Testing comprehension..." },
  { text: "Finalizing lesson structure..." },
  { text: "Adding final touches..." },
  { text: "Almost ready..." },
];

interface LessonPromptProps {
  input: string;
  setInput: (value: string) => void;
}

export function LessonPrompt({ input, setInput }: LessonPromptProps) {
  const router = useRouter();
  const [model, setModel] = useState('smart');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setStatus('Generating lesson...');

    try {
      const response = await fetch('/api/lessons/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outline: input,
          model: model
        })
      });

      const data = await response.json();

      if (data.success && data.lessonId) {
        setStatus('Lesson generated successfully!');
        setInput('');
        setTimeout(() => {
          router.push(`/lessons/${data.lessonId}`);
        }, 1000);
      } else {
        setStatus('Failed to generate lesson');
        setLoading(false);
      }
    } catch {
      setStatus('Error generating lesson');
      setLoading(false);
    }
  };

  return (
    <>
      <MultiStepLoader loadingStates={loadingStates} loading={loading} duration={2000} loop={false} />

      <div className="w-full max-w-2xl">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            placeholder="What would you like to learn today?"
            disabled={loading}
          />
          <PromptInputToolbar>
            <PromptInputModelSelect value={model} onValueChange={setModel} disabled={loading}>
              <PromptInputModelSelectTrigger>
                <PromptInputModelSelectValue placeholder="Select model" />
              </PromptInputModelSelectTrigger>
              <PromptInputModelSelectContent>
                <PromptInputModelSelectItem value="smart">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    <span>Smart</span>
                  </div>
                </PromptInputModelSelectItem>
                <PromptInputModelSelectItem value="fast">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>Fast</span>
                  </div>
                </PromptInputModelSelectItem>
              </PromptInputModelSelectContent>
            </PromptInputModelSelect>
            <PromptInputSubmit disabled={!input.trim() || loading} />
          </PromptInputToolbar>
        </PromptInput>
        {status && !loading && (
          <p className="text-sm text-center mt-2 text-muted-foreground">
            {status}
          </p>
        )}
      </div>
    </>
  );
}
