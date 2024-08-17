import * as vscode from 'vscode';
import SortProvider from './provider/SortProvider';


export function activate(context: vscode.ExtensionContext)
{
	const sortUsesAction = vscode.languages.registerCodeActionsProvider('php', new SortProvider, {
		providedCodeActionKinds: [ vscode.CodeActionKind.QuickFix ],
	});

	context.subscriptions.push(sortUsesAction);
}


export function deactivate() {}
