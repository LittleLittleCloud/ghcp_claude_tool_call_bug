// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "claudeemptyresponse" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('claudeemptyresponse.run_llm_with_tool_call', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const models = await vscode.lm.selectChatModels({
			vendor: 'copilot',
			family: 'claude-3.5-sonnet',
		});
		if (models.length === 0) {
			vscode.window.showErrorMessage('No models found');
			return;
		}

		const model = models[0];

		const tools: vscode.LanguageModelChatTool[] = [
			{
				name: 'get_current_time',
				description: 'Get the current time',
				inputSchema: {
					type: 'object',
					properties: {},
					required: [],
				},
			},
			{
				name: 'get_current_weather',
				description: 'Get the current weather',
				inputSchema: {
					type: 'object',
					properties: {},
					required: [],
				},
			},
		]

		const response = await model.sendRequest([
			new vscode.LanguageModelChatMessage(
				vscode.LanguageModelChatMessageRole.User,
				'What is the current weather under the current time?',
			)
		], {
			tools: tools,
		});

		for await (const message of response.stream) {
			if (message instanceof vscode.LanguageModelToolCallPart) {
				console.log('Tool call part: ', message);
			}
			if (message instanceof vscode.LanguageModelTextPart) {
				console.log('text message: ', message);
			}
		}

		vscode.window.showInformationMessage('Hello World from claudeEmptyResponse!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
