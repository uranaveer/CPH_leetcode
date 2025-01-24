const vscode = require('vscode');
const { fetch_test_cases , run_test_cases, get_html_content, run_test_cases_command } = require('./main');

/**
 * @param {vscode.ExtensionContext} context
 */



let activeWebviewView = null;

function activate(context) {

	console.log('Congratulations, your extension "cph" is now active!');

	context.subscriptions.push(vscode.window.registerWebviewViewProvider(
		'cph_view',
		{
            resolveWebviewView(webviewView) {
				activeWebviewView = webviewView;
				webviewView.webview.options = {
					enableScripts: true
				};
                webviewView.webview.html = get_html_content(webviewView);

				webviewView.webview.onDidReceiveMessage(async (m)=>{
					if(m.type == 'fetchTestCases'){
						const url = m.value;
						
						const fetchresult = await fetch_test_cases(url);
						console.log('hii');
						console.log(fetchresult);
						webviewView.webview.postMessage(
							{
								type:'fetch_result',
								value:fetchresult
							}
						);
					}
					else if(m.type =='runTestCases'){
						run_test_cases(webviewView);
					}
				});
            }
        },
		{ webviewOptions: { retainContextWhenHidden: true } }
	)
	);

	const fetch_command =  vscode.commands.registerCommand('cph.fetchTestCases', 
		() => {
			vscode.window.showInputBox({prompt:"Enter LeetCode Question URL"}).then(
				(url)=>{
					if(url){
						fetch_test_cases(url);
					}
					else{
						vscode.window.showErrorMessage("URL cant be empty");
					}
				}
		);
		}
	);

	context.subscriptions.push(fetch_command);

	const run_command = vscode.commands.registerCommand('cph.runTestCases',
		()=>run_test_cases_command(activeWebviewView)
	);

	context.subscriptions.push(run_command);


}

// This method is called when your extension is deactivated
function deactivate() {}



module.exports = {
	activate,
	deactivate
}
