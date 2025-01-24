
const vscode = acquireVsCodeApi();

console.log("Script loaded successfully!");

document.querySelector('#url').addEventListener('click',(e)=>{
    e.preventDefault();
    const existingError = document.querySelector('#fetchResult');
    if (existingError) {
        existingError.remove();
    }
}
);
let testCases =null;



window.addEventListener('message',(e)=>{
    // console.log("Received message:", message);
    // console.log(message);
    const message = e.data;
    if(message.type == 'fetch_result'){
        if(message.value === 0){
              
        }
        else{
            const test_cases = message.value;
            testCases=test_cases;
            const parent_cont = document.getElementById('testcases');
            const existingDetail_1 = document.querySelector('#view_1');
            if (existingDetail_1) {
                existingDetail_1.remove();
            }
            const existingDetail_2 = document.querySelector('#view_2');
            if (existingDetail_2) {
                existingDetail_2.remove();
            }
            
            const container_1= document.createElement('div');
            container_1.id = "view_1";

            const container_2= document.createElement('div');
            container_2.id = "view_2";
            parent_cont.appendChild(container_1);
            parent_cont.appendChild(container_2);

            const text_conatiner = document.getElementById('text');
            const add_testCase = document.createElement('div');
            add_testCase.id = "add_testCase";
            add_testCase.className ="case";
            add_testCase.textContent = "➕";
            text_conatiner.textContent = "Test Cases";
            container_1.appendChild(add_testCase);
            test_cases.forEach((item,index)=>{
                const case_div = document.createElement('div');
                case_div.textContent = `Case-${index+1}`;
                case_div.className = "case";
                case_div.id = `case_${index+1}`;

                case_div.addEventListener('click',()=>{
                    const existingDetails = document.querySelector('.details');
                    if (existingDetails) {
                        existingDetails.remove();
                    }
                    const details_div = document.createElement('div');
                    details_div.className = "details";
                    details_div.id = `details_${index + 1}`;
                    details_div.textContent = `Test Case ${index+1}`

                    const input_cont = document.createElement('div');
                    input_cont.className = "input_cont";
                    input_cont.id = `input_cont${index+1}`;
                    input_cont.textContent = "INPUT";
                    details_div.appendChild(input_cont);

                    const input_div = document.createElement('div');
                    input_div.className = "input_div";
                    input_div.id = `input_div${index+1}`;
                    input_div.innerHTML = item.input.replace(/\r\n|\n/g, '<br>');
                    input_cont.appendChild(input_div);

                    const output_cont = document.createElement('div');
                    output_cont.className = "output_cont";
                    output_cont.id = `output_cont${index+1}`;
                    output_cont.textContent = "EXPECTED OUTPUT";
                    details_div.appendChild(output_cont);

                    const output_div = document.createElement('div');
                    output_div.className = "output_div";
                    output_div.id = `output_div${index+1}`;
                    output_div.innerHTML = item.output.replace(/\r\n|\n/g, '<br>');
                    output_cont.appendChild(output_div);
        

                    container_2.appendChild(details_div);
                    
                });
                container_1.appendChild(case_div);
            }
        );
        }
    }
    else if(message.type == 'run_result'){
       const results = message.value;
       
       results.forEach((item,index)=>{
            const case_div = document.querySelector(`#case_${index+1}`);
            const parent_cont = document.getElementById('view_2');

            if(item.test_passed ==1){
                case_div.style.color = "green";
            }
            else{
                case_div.style.color = "red";
            }

            case_div.addEventListener('click',()=>{
                const existingDetails = document.querySelector('.outs_div');
                if (existingDetails) {
                    existingDetails.remove();
                }
                const outs = document.createElement('div');
                outs.className = "outs_div";
                outs.id = `outs_${index + 1}`;

                const user_output_cont = document.createElement('div');
                user_output_cont.textContent = "USER OUTPUT";
                user_output_cont.className = "user_output";
                user_output_cont.id = `user_output_${index+1}`;
                outs.appendChild(user_output_cont);

                const user_output_div = document.createElement('div');
                user_output_div.className ="user_out_div";
                user_output_div.id =`user_out_div_${index+1}`;
                user_output_div.innerHTML = item.user_output.replace(/\r\n|\n/g, '<br>');
                user_output_cont.appendChild(user_output_div);

                const verdict = document.createElement('div');
                verdict.className ="verdict";
                verdict.id =`verdict_${index+1}`;
                const ver = ['Failed!','Passed!'];
                verdict.textContent = ver[item.test_passed];
                if(item.test_passed ==1){
                    verdict.style.color = "green";
                }
                else{
                    verdict.style.color = "red";
                }
                outs.appendChild(verdict);

                parent_cont.appendChild(outs);

            }
        );


       }
    );
    }
}

);

document.querySelector('#fetch_test_case').addEventListener('click', (e) => {
    e.preventDefault();

    // Get the problem URL from input
    let problem_url = document.querySelector('#url').value.trim();

    

    // Input validation
    if (!problem_url) {
        document.querySelector('#functions').insertAdjacentHTML(
            'beforeend',
            '<p id="fetchResult" style="color:red;">URL field cannot be empty</p>'
        );
        return;
    } else if (problem_url.substring(0, 30) !== 'https://leetcode.com/problems/') {
        document.querySelector('#functions').insertAdjacentHTML(
            'beforeend',
            '<p id="fetchResult" style="color:red;">Enter Valid URL</p>'
        );
        return;
    }

    // Send message to VSCode backend
    vscode.postMessage({ type: 'fetchTestCases', value: problem_url });
});

document.querySelector('#run_test_case').addEventListener('click',(e)=>{
    e.preventDefault();
    vscode.postMessage({ type: 'runTestCases'});
}
);
