import * as vscode from 'vscode';


export const relativeWithLineNumber = vscode.commands.registerTextEditorCommand(
  'copy-relative-file-path-with-line.copy',
  (editor) => {
    const relativePath = vscode.workspace.asRelativePath(editor.document.uri);
    const line = editor.selection.start.line + 1;
    const character = editor.selection.start.character + 1;
    const textToCopy = [relativePath, line, character].join(':');

    try {
      vscode.env.clipboard.writeText(textToCopy);
    } catch (err) {
      vscode.window.showErrorMessage(`Failed to copy path: ${err}`);
    }
  }
);
