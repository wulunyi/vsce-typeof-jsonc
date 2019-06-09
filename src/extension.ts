import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "typeof-table" is now active!');

    context.subscriptions.push(require('./commands/typeof'));
}

export function deactivate() {}
