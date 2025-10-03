import { NextRequest, NextResponse } from 'next/server';
import * as ts from 'typescript';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'No code provided' },
        { status: 400 }
      );
    }

    const result = ts.transpileModule(code, {
      compilerOptions: {
        module: ts.ModuleKind.ES2015,
        target: ts.ScriptTarget.ES2015,
        jsx: ts.JsxEmit.React,
        removeComments: true,
        esModuleInterop: true,
        skipLibCheck: true,
        strict: false,
      },
    });

    if (result.diagnostics && result.diagnostics.length > 0) {
      const errors = result.diagnostics.map(d =>
        ts.flattenDiagnosticMessageText(d.messageText, '\n')
      );
      return NextResponse.json(
        { error: 'Compilation failed', details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      javascript: result.outputText,
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to compile TypeScript', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}