import re
from bs4 import BeautifulSoup as bs
import requests
import os
import shutil
import sys

current_directory  = os.path.dirname(os.path.abspath(__file__))
current_directory = os.path.dirname(current_directory)



def get_problem_name(url):
    pattern_1 = r"https://leetcode\.com/problems/([^/]+)/"
    match_1 = re.match(pattern_1, url)
    pattern_2 = r"https://leetcode\.com/problems/([^/]+)"
    match_2 = re.match(pattern_2,url)
    if match_1:
        return match_1.group(1)
    elif match_2:
        return match_2.group(1)
    else:
        return None
    


def get_list_sizes(lst):
    sizes = []
    while isinstance(lst, list):
        sizes.append(len(lst))
        if len(lst) == 0: 
            break
        lst = lst[0] 
    return sizes

def traverse_list(lst):
    result = []
    if isinstance(lst, list):
        for value in lst:
            result.extend(traverse_list(value))  # Recursively collect elements
    else:
        result.append(lst)  # Add the element to the result
    return result


def get_data(url):
    question_title = get_problem_name(url)
    if(question_title is None):
        return None
    data = {
    "operationName": "questionData",
    "variables": {
    "titleSlug": question_title
    },
    "query": """
            query questionData($titleSlug: String!) {
question(titleSlug: $titleSlug) {
    title
    titleSlug
    content
    codeSnippets {
      lang
      code
    }
    
  }
} 
            """
        }
    response_data = requests.post('https://leetcode.com/graphql', json = data).json()

    f = open(os.path.join(current_directory,'response.txt'),'w')
    f.write(str(response_data))
    return response_data





def prepare_directory(dir_path):
    # Check if the directory exists
    dir_path = os.path.join(current_directory,dir_path)
    if os.path.exists(dir_path):
        # Remove all contents of the directory
        shutil.rmtree(dir_path)
    # Recreate the empty directory
    os.makedirs(dir_path, exist_ok=True)
    input_dir = os.path.join(dir_path,"inputs")
    output_dir = os.path.join(dir_path,"outputs")
    os.makedirs(input_dir, exist_ok=True)
    os.makedirs(output_dir, exist_ok=True)


def extract_testcases(response_data):
    question_text = response_data['data']['question']['content']
    soup = bs(question_text, 'html.parser')
    html_elements = soup.find_all('pre')
    j = 1
    for element in html_elements:
        # soup = bs(element, 'html.parser')
        pre_text = element.get_text()  # Extract text inside <pre>
        
        # Extract Input and Output sections
        input_line = pre_text.split("Input:")[1].split("Output:")[0].strip()
        output_line = pre_text.split("Output:")[1].split("Explanation:")[0].strip()
        
        pattern = r'(\w+)\s*=\s*(.+?)(?=,\s*\w+\s*=|$)'  # Match key = value patterns
        result_dict = {}

        # Iterate over all matches
        temp ={"false":'0',"true":'1'}
        for match in re.finditer(pattern, input_line):
          key = match.group(1).strip()  # Extract the variable name
          value = match.group(2).strip()  # Extract the value as a string
          result_dict[key] = value  # Store in the dictionary as string
        
        path1 = os.path.join(current_directory,"test_cases","inputs",f"input_{j}.txt")
        path2 = os.path.join(current_directory,"test_cases",'outputs',f"output_{j}.txt")

        f1 = open(path1,'w')
        f2 = open(path2,'w')

        
        for key,value in result_dict.items():
            if(value in temp.keys()):
                value = temp[value]
            value = eval(value)
            flag =0
            if(type(value) is list):
                flag =1
                sizes = get_list_sizes(value)
                elements = traverse_list(value)
            
            if(flag):
                for i in sizes:
                    f1.write(f"{str(i)} ")
                f1.write("\n")
                for i in elements:
                    if i in temp.keys():
                        i=temp[i]
                    f1.write(f"{str(i)} ")
                f1.write("\n")
            else:
                f1.write(f"{str(value)}\n")
        if output_line in temp.keys():
            output_line = temp[output_line]
        output = eval(output_line)
        flag =0
        if (type(output) is list):
            flag =1
            sizes = get_list_sizes(output)
            elements = traverse_list(output)
        
        if(flag):
            for i in elements:
                if i in temp.keys():
                    i=temp[i]
                f2.write(f"{str(i)} ")
            f2.write("\n")
        else:
            f2.write(f"{str(output)}\n")


        f1.close()
        f2.close()
        j+=1



def fetch_testcases(url):
    prepare_directory("test_cases")
    response_data = get_data(url)
    if(response_data is None):
        return "Enter Valid URL"
    f_path = os.path.join(current_directory,"response.txt")
    with open(f_path, 'w') as f:
        f.write(str(response_data))
    extract_testcases(response_data)
    return "Testcases are fetched"


fetch_testcases("https://leetcode.com/problems/wildcard-matching/description/?envType=problem-list-v2&envId=string")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python helper_function.py <leetcode_url>")
        sys.exit(1)
    
    url = sys.argv[1]
    result = fetch_testcases(url)
    print(result)


