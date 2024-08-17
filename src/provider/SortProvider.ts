import * as vscode from 'vscode';
import { EOL } from 'os';


export default class SortProvider implements vscode.CodeActionProvider
{
	/**
	 * @param document 
	 * @param range 
	 * @param context 
	 * @param token 
	 * @returns ProviderResult | undefined
	 */
	public provideCodeActions(
		document : vscode.TextDocument,
		range : vscode.Range | vscode.Selection,
		context : vscode.CodeActionContext,
		token : vscode.CancellationToken
	) : vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> | undefined
	{
		const start : vscode.Position = range.start;
		const line : vscode.TextLine = document.lineAt(start.line);

		if (!this.isValidLine(line))
		{
			return;
		}

		const sortAndReplaceUses : vscode.CodeAction = this.createFix(document, range);

		return [
			sortAndReplaceUses,
		];
	}


	/**
	 * Verifica se está na linha para mostrar a dica.
	 * 
	 * @param document 
	 * @param range 
	 * @returns 
	 */
	private isValidLine(line : vscode.TextLine) : boolean
	{
		return line.text.trim().toLowerCase().substring(0, 3) === 'use';
	}


	/**
	 * Cria a ação de correção do código-fonte.
	 * 
	 * @param document 
	 * @param range 
	 * @returns A ação gerada.
	 */
	private createFix(document : vscode.TextDocument, range : vscode.Range) : vscode.CodeAction
	{
		const fix : vscode.CodeAction = new vscode.CodeAction('Sort uses', vscode.CodeActionKind.QuickFix);
		const container : UseContainer = this.findUses(document, range);
		const newRange : vscode.Range = new vscode.Range(container.begin, container.end);
		const newText : string = `${container.lines.sort().join(EOL)}${EOL}`;

		fix.edit = new vscode.WorkspaceEdit;
		fix.edit.replace(document.uri, newRange, newText);

		return fix;
	}


	/**
	 * Busca por todas as linhas que começam com o apalvra-chave "use".
	 * 
	 * @param document 
	 * @param range 
	 * @returns O container das linhas que contém a palavra chave.
	 */
	private findUses(document : vscode.TextDocument, range : vscode.Range) : UseContainer
	{
		const pos : vscode.Position = range.start;
		const lines : string[] = [];
		let prev : number = pos.line;
		let next : number = prev + 1;
		let hasPrevLine : boolean = true;
		let hasNextLine : boolean = true;

		do
		{
			const prevLine : vscode.TextLine = document.lineAt(prev);
			const nextLine : vscode.TextLine = document.lineAt(next);

			if (hasPrevLine)
			{
				hasPrevLine = this.isValidLine(prevLine);
				prev -= hasPrevLine ? 1 : 0;
			}
			if (hasNextLine)
			{
				hasNextLine = this.isValidLine(nextLine);
				next += hasNextLine ? 1 : 0;
			}
		} while (hasPrevLine || hasNextLine);

		++prev;

		for (let i = prev; i < next; ++i)
		{
			lines.push(document.lineAt(i).text);
		}

		return {
			begin: new vscode.Position(prev, 0),
			end: new vscode.Position(next, 0),
			lines: lines,
		};
	}
};


interface UseContainer
{
	begin : vscode.Position,
	end : vscode.Position,
	lines : string[],
};