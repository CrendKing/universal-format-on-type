'use strict'

import * as vscode from 'vscode'

class UniversalOnTypeFormattingProvider implements vscode.OnTypeFormattingEditProvider {
    public async provideOnTypeFormattingEdits(
        document: vscode.TextDocument,
        position: vscode.Position,
        ch: string,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken
    ): Promise<vscode.TextEdit[]> {
        let formatRange

        switch (ch) {
            case '}':
                const editor = vscode.window.activeTextEditor!
                await vscode.commands.executeCommand('editor.action.jumpToBracket')
                formatRange = new vscode.Range(editor.selection.active, position)
                editor.selection = new vscode.Selection(position, position)
                break
            case '\n':
                formatRange = new vscode.Range(new vscode.Position(position.line - 1, 0), new vscode.Position(position.line, 0))
                break
            case ';':
                formatRange = new vscode.Range(new vscode.Position(position.line, 0), new vscode.Position(position.line + 1, 0))
                break
        }

        return await vscode.commands.executeCommand<vscode.TextEdit[] | undefined>('vscode.executeFormatRangeProvider', document.uri, formatRange, options) ?? []
    }
}

export function activate(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration('universalFormatOnType')

    const langToTriggerChars = new Map<string, string[]>()

    const setdefault = (lang: string) => {
        const def: string[] = []
        langToTriggerChars.set(lang, def)
        return def
    }

    for (const [variantKey, variantChar] of [['brace', '}'], ['newline', '\n'], ['semicolon', ';']]) {
        for (const lang of config.get<string[]>(variantKey) ?? []) {
            (langToTriggerChars.get(lang) ?? setdefault(lang)).push(variantChar)
        }
    }

    for (const [lang, triggerChars] of langToTriggerChars) {
        context.subscriptions.push(
            vscode.languages.registerOnTypeFormattingEditProvider(lang, new UniversalOnTypeFormattingProvider(), triggerChars.shift()!, ...triggerChars)
        )
    }
}

export function deactivate() { }
