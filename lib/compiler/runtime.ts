import { transform } from 'sucrase';

export function compileTypeScript(code: string): string {
  try {
    const result = transform(code, {
      transforms: ['typescript', 'jsx'],
      production: true,
    });

    return result.code;
  } catch (error) {
    console.error('Compilation error:', error);
    throw new Error('Failed to compile TypeScript');
  }
}

export function createComponent(compiledCode: string): React.ComponentType {
  try {
    const moduleFunc = new Function('React', 'require', compiledCode + '\n\nreturn LessonComponent;');

    const React = require('react');
    const mockRequire = (module: string) => {
      if (module === 'react') return React;
      throw new Error(\`Module not allowed: \${module}\`);
    };

    const Component = moduleFunc(React, mockRequire);

    if (typeof Component !== 'function') {
      throw new Error('Invalid component generated');
    }

    return Component;
  } catch (error) {
    console.error('Runtime error:', error);
    throw new Error('Failed to create component');
  }
}

// Safer alternative using iframe sandboxing
export function createSandboxedComponent(code: string): string {
  // This returns an HTML string that can be rendered in an iframe
  return \`
    <!DOCTYPE html>
    <html>
    <head>
      <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
      <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      <div id="root"></div>
      <script type="text/babel">
        \${code}

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<LessonComponent />);
      </script>
    </body>
    </html>
  \`;
}