import * as vscode from 'vscode';


async function getSymbolTraceAtCursor(symbols: vscode.SymbolInformation[], position: vscode.Position): Promise<string | null> {
  for (const symbol of symbols) {
    if (symbol.location.range.contains(position)) {
      if ((symbol as any).children && (symbol as any).children.length > 0) {
        const subSymbol = await getSymbolTraceAtCursor((symbol as any).children, position);
        return subSymbol ? `${subSymbol} ${symbol.name}` : symbol.name;
      } else {
        return symbol.name;
      }
    }
  }
  return null;
}


async function getSymbolAtCursor(editor: vscode.TextEditor): Promise<string | null> {
  const position = editor.selection.active;
  const document = editor.document;

  const symbols = await vscode.commands.executeCommand<vscode.SymbolInformation[]>(
    'vscode.executeDocumentSymbolProvider', document.uri
  );

  if (!symbols) { return null; }

  return await getSymbolTraceAtCursor(symbols, position);
}


export const relativeWithSymbols = vscode.commands.registerTextEditorCommand(
  'copy-relative-file-path-with-symbols.copy',
  async (editor) => {
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found!');
      return;
    }

    const relativePath = vscode.workspace.asRelativePath(editor.document.uri);
    const symbolsTrace = await getSymbolAtCursor(editor);

    if (!symbolsTrace) { return null; }

    const textToCopy = `${relativePath}@${symbolsTrace} `;
    try {
      await vscode.env.clipboard.writeText(textToCopy);
    } catch (err) {
      vscode.window.showErrorMessage(`Failed to copy path: ${err}`);
    }
  }
);
