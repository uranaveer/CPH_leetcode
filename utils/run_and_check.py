import os
import subprocess
import sys
import re
import json


def get_lang(ext):
    if(ext=='.cpp'):
        return "cpp"
    elif(ext=='.py'):
        return "python"
    else:
        return None
    
def normalize_output(output):
    output = output.replace('\n', ' ')
    output = re.sub(r'\s+', ' ', output)
    return output.strip()

current_directory  = os.path.dirname(os.path.abspath(__file__))
current_directory = os.path.dirname(current_directory)


def run_and_validate(file_path, input_dir, output_dir):
    file_ext = os.path.splitext(file_path)[-1]
    if file_ext == ".py":
        program = ["python", file_path]
    elif file_ext == ".cpp":
        compiled_program = "solution.out"
        compile_result = subprocess.run(["g++", file_path, "-o", compiled_program], capture_output=True, text=True)
        if compile_result.returncode != 0:
            print(f"Compilation error:\n{compile_result.stderr}")
            return
        program = [f"./{compiled_program}"]
    else:
        print(f"Unsupported file type: {file_ext}")
        return
    j=0
    results =[]
    for input_file in sorted(os.listdir(input_dir)):
        j=j+1
        input_path = os.path.join(input_dir, input_file)
        output_path = os.path.join(output_dir, f"output_{input_file.split('_')[1]}")

        test_result ={
            'test_passed':0,
            'user_output':'',
        }
        if not os.path.exists(output_path):
            continue

        with open(input_path, "r") as infile, open(output_path, "r") as expected_file:
            expected_output = expected_file.read().strip()
            expected_output = normalize_output(expected_output)

            try:
                result = subprocess.run(program, input=infile.read(), capture_output=True, text=True)
                user_output = result.stdout.strip()
                user_output = normalize_output(user_output)
                test_result['user_output']=user_output
                if user_output == expected_output:
                    test_result["test_passed"]=1
                else:
                    test_result["test_passed"]=0
            except Exception as e:
                test_result['user_output']=str(e)
        results.append(test_result)
    
    print(json.dumps(results))
    if file_ext == ".cpp" and os.path.exists(compiled_program):
        os.remove(compiled_program)


def run_test_cases(lang,code):
    lang = get_lang(lang)
    input_dir = os.path.join(current_directory,"test_cases","inputs")
    output_dir = os.path.join(current_directory,"test_cases","outputs")
    if(lang == 'cpp'):
        f_path = os.path.join(current_directory,"solution.cpp")
        with open(f_path,'w') as f:
            f.write(code)
        run_and_validate(f_path,input_dir,output_dir)
    elif(lang == "python"):
        f_path = os.path.join(current_directory,"solution.py")
        with open(f_path,'w') as f:
            f.write(code)
        run_and_validate(f_path,input_dir,output_dir)
    
    return ("Test Run Completed\n")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python run_and_check.py <lang> <code>")
        sys.exit(1)
    
    lang = sys.argv[1]
    code = sys.argv[2]
    result = run_test_cases(lang, code)
    
