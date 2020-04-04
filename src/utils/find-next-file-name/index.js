'use strict';

const { existsSync } = require('fs');
const { resolve, parse } = require('path');

module.exports = function (directory, fileName, continuCounting) {
    let _fileName = fileName;
    if (!fileName) {
        const direcotryTree = directory.split("/");
        _fileName = direcotryTree.pop();
    }

    if (_fileName === "" || _fileName.indexOf(".") === -1) {
        throw new Error("Wrong file name.");
    }

    const parsedfileName = parse(_fileName);
    let name = parsedfileName.name;
    const ext = parsedfileName.ext;
    let i = 1;

    if (continuCounting === true) {
        const lastOpenBracketPos = name.lastIndexOf("(");
        if (lastOpenBracketPos !== -1) {
            const lastCloseBracketPos = name.lastIndexOf(")");
            if (lastCloseBracketPos > lastOpenBracketPos && lastCloseBracketPos === name.length-1) {
                const bracketsWithText = name.substring(lastOpenBracketPos, lastCloseBracketPos+1);
                if ((/\(\d+\)/).test(bracketsWithText)) {
                    i = (+bracketsWithText.substr(1, bracketsWithText.length-2)) + 1;
                    name = name.substring(0, lastOpenBracketPos-1);
                }
            }
        }
    }
        
    let currentFileName = _fileName;
    let nextPathName = resolve(directory, currentFileName);
    while (existsSync(nextPathName)) {
        currentFileName = `${name}-${i}${ext}`;
        nextPathName = resolve(directory, currentFileName);
        i++;
    }

    return currentFileName;
};
