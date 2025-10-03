import { NextRequest, NextResponse } from 'next/server';
import * as ts from 'typescript';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({
        success: false,
        error: 'No code provided'
      }, { status: 400 });
    }

    console.log('Transpiling TypeScript code, length:', code.length);

    const result = ts.transpileModule(code, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2015,
        module: ts.ModuleKind.None,
        jsx: ts.JsxEmit.React
      }
    });

    console.log('Transpilation successful, output length:', result.outputText.length);

    if (result.diagnostics && result.diagnostics.length > 0) {
      console.log('TypeScript diagnostics:', result.diagnostics);
    }

    return NextResponse.json({
      success: true,
      javascript: result.outputText,
      diagnostics: result.diagnostics || []
    });

  } catch (error) {
    console.error('Transpilation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown transpilation error'
    }, { status: 500 });
  }
}