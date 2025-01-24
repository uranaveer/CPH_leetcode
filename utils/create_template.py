import os
import shutil
import sys
from bs4 import BeautifulSoup as bs

current_directory  = os.path.dirname(os.path.abspath(__file__))
current_directory = os.path.dirname(current_directory)

f = open(os.path.join(current_directory,'response.txt'),'r')



response_data = eval(str(f.read()))

def extract_question():
    question_text = response_data['data']['question']['content']
    soup = bs(question_text, 'html.parser')
    question = soup.find('p')
    if question:
        return question.get_text(separator=' ',strip=True)
    return ""

def create_python_template():
    code_snippets = response_data['data']['question']['codeSnippets']
    question_title = response_data['data']['question']['titleSlug']
    question_text =extract_question()
    python_snippet = ""
    for snippet in code_snippets:
        if(snippet['lang']=='Python3'):
            python_snippet = snippet['code']
            break
    
    return f"""
# {question_text}

{python_snippet}pass\n\t\t# You can replace 'pass' with your actual code.

# Take inputs in order mentioned in the /Solution.function/ argument and call the function obj./function()/
# Print The outputs separated space(' ') or newline   


obj = Solution()

"""

def create_cpp_template():
  code_snippets = response_data['data']['question']['codeSnippets']
  question_title = response_data['data']['question']['titleSlug']
  question_text =extract_question()
  cpp_snippet = ""
  t1='{'
  t2='}'
  for snippet in code_snippets:
    if(snippet['lang']=='C++'):
      cpp_snippet = snippet['code']
      break
  
  return f"""
// {question_text}

#include <bits/stdc++.h>
using namespace std;

{cpp_snippet}

// Take inputs in order mentioned in the /Solution.function/ argument and call the function obj./function()/
// Print The outputs separated space(' ') or newline 

int main(){t1}
    Solution obj;

{t2}
"""



  


print(create_cpp_template())

