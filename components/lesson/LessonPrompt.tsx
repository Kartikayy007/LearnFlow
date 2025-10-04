import {
  PromptInput,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputSubmit,
} from "@/components/ui/shadcn-io/ai/prompt-input";

interface LessonPromptProps {
  input: string;
  setInput: (value: string) => void;
}

export function LessonPrompt({ input, setInput }: LessonPromptProps) {
  return (
    <div className="w-full max-w-2xl">
      <PromptInput onSubmit={(e) => { e.preventDefault(); console.log('Submitted:', input); }}>
        <PromptInputTextarea
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          placeholder="What would you like to learn today?"
        />
        <PromptInputToolbar>
          <PromptInputSubmit disabled={!input.trim()} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}
