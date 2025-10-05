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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import FuzzyText from '@/components/FuzzyText';

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
  const [errorDrawerOpen, setErrorDrawerOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);

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
        setInput('');
        setTimeout(() => {
          router.push(`/lessons/${data.lessonId}`);
        }, 1000);
      } else {
        const errorMsg = data.details || data.error || 'Failed to generate lesson';
        setErrorMessage(errorMsg);
        setErrorDrawerOpen(true);
        setLoading(false);
      }
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
      setErrorDrawerOpen(true);
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
      </div>

      <Drawer open={errorDrawerOpen} onOpenChange={setErrorDrawerOpen}>
        <DrawerContent>
          <DrawerHeader className="flex flex-col items-center">
            <DrawerTitle className="sr-only">Error</DrawerTitle>
            <DrawerDescription className="sr-only">An error occurred while generating your lesson</DrawerDescription>
            <div className="flex flex-col items-center justify-center py-8">
              <FuzzyText
                fontSize="2rem"
                color="#ffff"
                baseIntensity={0.1}
                hoverIntensity={0.2}
              >
                {errorMessage}
              </FuzzyText>
            </div>
          </DrawerHeader>
          <DrawerFooter className="flex flex-row justify-center gap-4">
            <DrawerClose asChild>
              <Button variant="outline" className="w-32">Close</Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button
                onClick={() => {
                  setErrorDrawerOpen(false);
                }}
                className="w-32"
              >
                Try Again
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
