import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.createCMakeLists', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('Откройте папку проекта для создания CMakeLists.txt');
            return;
        }

        const folderPath = workspaceFolders[0].uri.fsPath;

        const files = fs.readdirSync(folderPath);
        const hasCppFiles = files.some(file => file.endsWith('.cpp') || file.endsWith('.h'));

        if (!hasCppFiles) {
            vscode.window.showErrorMessage('В папке проекта не найдено файлов C++. Убедитесь, что это C++ проект.');
            return;
        }

        const cmakeFilePath = path.join(folderPath, 'CMakeLists.txt');

        const cmakeContent = `cmake_minimum_required(VERSION 3.10)

project(MyProject)

set(CMAKE_CXX_STANDARD 11)

add_executable(MyExecutable main.cpp)
`;

        fs.writeFile(cmakeFilePath, cmakeContent, (err) => {
            if (err) {
                vscode.window.showErrorMessage('Ошибка при создании CMakeLists.txt');
                return;
            }
            vscode.window.showInformationMessage('CMakeLists.txt успешно создан!');
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
