"""
Script to apply css variables (convert variable's references to it's value)
Not include SASS/LESS variables. Just pure CSS variables

Ps. Script must be in projetc root folder
"""
import re

# global main definitions
directory = "./css/"
backupFilesPrefix = "backup_" #"use '/' (forward slash) to indicate subdirectories, leave empty to overwrite original file"

# functions declaration
# TODO: transform these functions in a class for external uses
def load_file(adress):
    try:
        with open(directory+adress, 'r') as fileContent:
            return fileContent.read()
    except Exception as e:
        return ""
def save_file(adress, content, backup=True):
    if backup:
        prefix = backupFilesPrefix
        originalFileContent = load_file(adress)
        with open(directory+prefix+adress, 'w') as backupFile:
            backupFile.write(originalFileContent)


    print(content)
    print(originalFileContent)
    with open(directory+adress, 'w') as fileContent:
        fileContent.write(content)

def find_css_files(filesList=[], initialFile=""):
    #get all connected CSS files and its content
    if (not filesList) and initialFile:
        filesList.append(initialFile)

    for fileName in filesList:
        fileContent = load_file(fileName)
        imports = re.findall('@import\s".+\.css', fileContent, re.I)
        if imports:
            # if len(imports)> 1: imports.reverse()
            for adress in imports:
                fileAdress = re.search('".+\.css', adress, re.I)[0][1:]
                if fileAdress:
                    filesList.append(fileAdress)
    filesList.reverse()
    return filesList

def get_css_content(fileName):
    contentObject = {}
    contentObject['name'] = fileName
    contentObject['content'] = load_file(fileName)
    contentObject['wasModified'] = False
    return contentObject

def find_css_variables(cssFiles, variables={}):
    # get CSS variables in whole system
    cssRoot = re.findall(":root\s*\{.+\}",cssFiles['content'], re.DOTALL )
    if cssRoot:
        variablesClosure = re.findall("--.+:.+[;(\n)]", cssRoot[0])
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

def apply_css_variables(cssFile, variablesList):
    # apply all CSS variables in the files
    # TODO: support to apply variables in a line before, instead of replace original
    for variable in variablesList:
        someVarFound = cssFile['content'].find("var(%s)"%variable) > 0
        if (not cssFile['wasModified']) and someVarFound :
            cssFile['wasModified'] = True
        cssFile['content'] = cssFile['content'].replace("var(%s)"%variable, variablesList[variable])


# execution of script

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
for fileName in allFiles:
    filesContent[fileName] = get_css_content(fileName)

cssVariables = {
    # object syntax
    #'variableName': 'variableValue'
}
for fileName in filesContent:
    cssVariables.update( find_css_variables(filesContent[fileName]) )


for fileName in filesContent:
    apply_css_variables( filesContent[fileName], cssVariables )

for fileName in filesContent:
    if filesContent[fileName]['wasModified']:
        save_file(filesContent[fileName]['name'], filesContent[fileName]['content'])
