import * as vscode from 'vscode';
import { relativeWithLineNumber } from "./path_with_line_number";
import { relativeWithSymbols } from "./path_with_symbols";


export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(relativeWithLineNumber);
  context.subscriptions.push(relativeWithSymbols);
}


export function deactivate() {}
