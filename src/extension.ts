'use strict'

import * as vscode from 'vscode'

class OnBraceFormattingProvider implements vscode.OnTypeFormattingEditProvider {
    public async provideOnTypeFormattingEdits(
        document: vscode.TextDocument,
        position: vscode.Position,
        ch: string,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken
    ): Promise<vscode.TextEdit[]> {
        const editor = vscode.window.activeTextEditor!
        await vscode.commands.executeCommand('editor.action.jumpToBracket')
        const formatRange = new vscode.Range(editor.selection.active, position)
        editor.selection = new vscode.Selection(position, position)
        const edits = await vscode.commands.executeCommand<vscode.TextEdit[] | undefined>('vscode.executeFormatRangeProvider', document.uri, formatRange, options) ?? []

        return edits
    }
}

export function activate(context: vscode.ExtensionContext) {
    const configs = vscode.workspace.getConfiguration('formatOnBrace')
    const activeLanguages = configs.get<string[]>('languages') ?? []
    const disposable = vscode.languages.registerOnTypeFormattingEditProvider(activeLanguages, new OnBraceFormattingProvider(), '}')

    context.subscriptions.push(disposable)
}

export function deactivate() {}
