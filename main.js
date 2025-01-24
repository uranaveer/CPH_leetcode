const { exec,execFile } = require('child_process');
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

function read_input_output(){
    const input_path = path.join(__dirname,'test_cases','inputs');
    const output_path = path.join(__dirname,'test_cases','outputs');
    let results = [];
    let inputs =[];
    let outputs =[];
    
    let input_files =fs.readdirSync(input_path);
    let output_files =fs.readdirSync(output_path);
    


    input_files = input_files.sort((a, b) => a.localeCompare(b));
    output_files = output_files.sort((a, b) => a.localeCompare(b));

    input_files.forEach((file)=>{
        const file_path = path.join(input_path,file);
        const content = fs.readFileSync(file_path, 'utf-8');
        inputs.push(content);
    }
    );

    output_files.forEach((file)=>{
        const file_path = path.join(output_path,file);
        const content = fs.readFileSync(file_path, 'utf-8');
        outputs.push(content);
    }
    );

    
    for(let i=0;i<inputs.length;i++){
        let testcase ={
            input:inputs[i],
            output:outputs[i]
        }
        results.push(testcase);
    } 
    return results;
}

async function fetch_test_cases(url){
    const python_command= "python";
    const file_path  =path.join(__dirname,"utils/helper_function.py");

    return new Promise((resolve, reject) => {
        exec(`${python_command} ${file_path} "${url}"`, (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage(`Error: ${stderr}`);
                console.error(`Error: ${stderr}`);
                reject(error);
            } else {
                vscode.window.showInformationMessage(stdout.trim());
                console.log("hii1");
                // Assuming `read_input_output` is synchronous
                let results = read_input_output(); 
                console.log(results);
                resolve(results);
            }
        });
    });
}

async function run_test_cases(webviewView) {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showErrorMessage("Open your program file");
        return;
    }

    const python_command = "python";
    const script_path = path.join(__dirname, "utils/run_and_check.py");
    const filePath = activeEditor.document.fileName;
    const lang = path.extname(filePath);
    const code = activeEditor.document.getText();

    return new Promise((resolve, reject) => {
        execFile(python_command, [script_path, lang, code], (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage(`Error: ${error.message}`);
                return reject(error);
            }
            if (stderr) {
                vscode.window.showErrorMessage(`Stderr: ${stderr}`);
                return reject(new Error(stderr));
            }

            try {
                const results = JSON.parse(stdout.toString());
            

                console.log(results);
                webviewView.webview.postMessage({
                    type: "run_result",
                    value: results,
                });

                resolve(results);
            } catch (parseError) {
                vscode.window.showErrorMessage("Failed to parse output.");
                reject(parseError);
            }
        });
    });
}

async function run_test_cases_command(webviewView) {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showErrorMessage("Open your program file");
        return;
    }

    const python_command = "python";
    const script_path = path.join(__dirname, "utils/run_and_check.py");
    const filePath = activeEditor.document.fileName;
    const lang = path.extname(filePath);
    const code = activeEditor.document.getText();

    return new Promise((resolve, reject) => {
        execFile(python_command, [script_path, lang, code], (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage(`Error: ${error.message}`);
                return reject(error);
            }
            if (stderr) {
                vscode.window.showErrorMessage(`Stderr: ${stderr}`);
                return reject(new Error(stderr));
            }

            try {
                const results = JSON.parse(stdout.toString());
                
                results.forEach((item,index)=>{
                    if(item.test_passed==1){
                        vscode.window.showInformationMessage(`Test Case ${index+1} Passed!`)
                    }
                    else{
                        vscode.window.showInformationMessage(`Test Case ${index+1} Failed!`)
                    }
                })

                console.log(results);
                webviewView.webview.postMessage({
                    type: "run_result",
                    value: results,
                });

                resolve(results);
            } catch (parseError) {
                vscode.window.showErrorMessage("Failed to parse output.");
                reject(parseError);
            }
        });
    });
}

function get_html_content(webviewView){
    let html_content = fs.readFileSync(path.join(__dirname,'templates','index.html'),'utf-8');
    const css_uri = webviewView.webview.asWebviewUri(vscode.Uri.file(path.join(__dirname,'templates' ,'styles.css')));
    const script_uri = webviewView.webview.asWebviewUri(vscode.Uri.file(path.join(__dirname,'templates' ,'script.js')));
    html_content = html_content.replace(/styles.css/g, css_uri.toString())
    html_content = html_content.replace(/script.js/g, script_uri.toString())

    return html_content;

}


module.exports = { fetch_test_cases,
                 run_test_cases,
                get_html_content,
                run_test_cases_command};