"""
Script to apply css variables (convert variable's references to it's value)
Not include SASS/LESS variables. Just pure CSS variables
"""

import re

# main definitions
directory = "css/"
appliedFilesPrefix = "" #"use '/' (forward slash) to indicate subdirectories, leave empty to overwrite original file"
# mainCSS = input("main CSS file name: ")

def load_file(adress):
    with open(adress, 'r') as fileContent:
        return fileContent.read()
def save_file(adress, content):
    with open(adress, 'w') as fileContent:
        return fileContent.write(content)

# get all connected CSS files and its content
def find_css_files(filesList=[], initialFile=""):
    if (not filesList) and initialFile:
        filesList.append(initialFile)

    for fileName in filesList:
        fileContent = load_file(directory+fileName)
        imports = re.findall('@import\s".+\.css', fileContent, re.I)
        if imports:
            for adress in imports:
                fileAdress = re.search('".+\.css', adress, re.I)[0][1:]
                if fileAdress:
                    filesList.append(fileAdress)
    return filesList

# get CSS variables in whole system
def find_css_variables(variables={}):
    for fileName in filesContent:
        root = re.findall(":root\s*\{.+\}",filesContent[fileName]['content'], re.DOTALL )
        if root:
            variablesClosure = re.findall("--.+:.+[;(\n)]", root[0])
            if variablesClosure:
                for variable in variablesClosure:
                    variableName = re.search("--.+:", variable)[0]
                    variableValue = re.search(variableName+".+", variable)[0]

                    if variableName:
                        endOf_VariableValue = None
                        if variableValue[-1] == ";": endOf_VariableValue = -1
                        variableValue = variableValue[ len(variableName)+1 : endOf_VariableValue ]

                        variables[variableName[0:-1]] = variableValue
    return variables

# apply all CSS variables in the files
def apply_css_variables(cssFile, variablesList):

    for variable in variablesList:
        someVarFound = cssFile['content'].find("var(%s)"%variable) > 0
        if (not cssFile['wasModified']) and someVarFound :
            cssFile['wasModified'] = True
        cssFile['content'] = cssFile['content'].replace("var(%s)"%variable, variablesList[variable])

allFiles = [
    # object syntax
    # "fileName.css"
]
find_css_files(allFiles, initialFile="style.css") # file to start searching of (the main CSS file) - TODO: change files system to search linked CSS in an indicated HTML file

filesContent = {
    # object syntax
    # fileName: {
    #   name: "" (string with file's name)
    #   content: "" (string with all file's content. Imported by script),
    #   wasModified: False (will change to True when modified)
    # }
}
# get all CSS files' content
for fileName in allFiles:
    filesContent[fileName] = {}
    filesContent[fileName]['name'] = fileName
    filesContent[fileName]['content'] = load_file(directory+fileName)
    filesContent[fileName]['wasModified'] = False


cssVariables = {
    # object syntax
    #'variableName': 'variableValue'
}
cssVariables = find_css_variables()

for fileName in filesContent:
    apply_css_variables( filesContent[fileName], cssVariables )

for fileName in filesContent:
    if filesContent[fileName]['wasModified']:
        save_file(directory+appliedFilesPrefix+filesContent[fileName]['name'], filesContent[fileName]['content'])

def debug():
    print("\n"*3+"-"*5,'FILES',"-"*5)
    for fileName in allFiles:
        print(fileName)

    print("\n"*3+"-"*5,"VARIABLES","-"*5)
    for variable in cssVariables:
        print(variable+": "+cssVariables[variable])

    print("\n"*3+"-"*5,"FILES' CONTENT","-"*5)
    for fileName in filesContent:
        print(fileName+": \n"+filesContent[fileName]['name'])

# debug()
