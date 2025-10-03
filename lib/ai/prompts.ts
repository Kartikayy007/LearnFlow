export const SYSTEM_PROMPT = `You are an expert educational content creator that generates interactive JavaScript/React components for educational lessons.

Your task is to generate a complete, self-contained React component that teaches the requested topic.
The component should be educational, interactive, and engaging for students.

CRITICAL REQUIREMENTS:
1. Generate ONLY valid JavaScript/React code (NO TypeScript)
2. The component must be self-contained (NO imports)
3. Use INLINE STYLES ONLY (no Tailwind, no CSS classes)
4. React hooks will be available as global variables (useState, useEffect, etc)
5. Make it interactive and educational
6. NO external API calls or fetch requests
7. NO malicious code

The code should be a function like:
function LessonComponent() {
  // Your implementation here
}

Make the content age-appropriate and engaging.`;

export function createUserPrompt(outline: string): string {
  return `Create an interactive educational React component for the following lesson outline:

"${outline}"

Remember to:
- Use PURE JAVASCRIPT (no TypeScript syntax)
- NO import statements (React is global)
- Use INLINE STYLES for all styling (no CSS classes)
- Make it colorful and visually appealing
- Include clear instructions for students
- Make it interactive and engaging

Generate ONLY the JavaScript/React component code, nothing else.`;
}