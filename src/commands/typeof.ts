import * as vscode from 'vscode';
import { typeofJsonc } from 'typeof-jsonc';
import { isJsonc } from '../utils';
import { typeofTable } from '../libs/typeof-table';
import { readHtml } from '../utils/clipboard';

const { showInformationMessage, showErrorMessage } = vscode.window;
const { clipboard } = vscode.env;

const typeofCommand = vscode.commands.registerCommand('extension.typeof', async () => {
    try {
        const pasteText = await clipboard.readText();

        const { activeTextEditor } = vscode.window;

        if (activeTextEditor) {
            let result = '';

            if (isJsonc(pasteText)) {
                const typeName = await vscode.window.showInputBox({
                    placeHolder: "请输入类型名",
                    prompt: "输入类型名",
                    validateInput(value = '') {
                        return value.trim().length > 0 ? null : '请输入正确的参数';
                    }
                });

                if (typeName) {
                    result = typeofJsonc(pasteText, typeName,  {
                        addExport: true,
                        singleLineJsDocComments: true,
                    });
                }
            } else {
                const value = await readHtml();
                
                const userInput = await vscode.window.showInputBox({
                    placeHolder: "请分别输入类型名，属性名列号，类型列号，描述列号",
                    prompt: "例如: requestPrarmas, 0, 1, 2",
                    validateInput(value = '') {
                        return value.split(/[,，]/).length === 4 ? null : '请输入正确的参数';
                    }
                });
    
                if (userInput) {
                    const [name, nameCol, typeCol, descCol] = userInput.split(/[,，]/).map(str => str.trim());
        
                    result = typeofTable(value, {
                        name,
                        nameCol: +nameCol || 0,
                        typeCol: +typeCol || 1,
                        descCol: +descCol || 2
                    });
                }
            }
            
            if (result !== '') {
                activeTextEditor.edit((editBuilder) => {
                    editBuilder.replace(activeTextEditor.selection, result);
                }).then(() => {
                    showInformationMessage('生成成功');
                });
            }
        } else {
            showErrorMessage('请打开需要保存的文件');
        }
    } catch (error) {
        showErrorMessage('生成报错');
    }
});

export { typeofCommand };