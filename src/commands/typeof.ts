import * as vscode from 'vscode';
import { typeofJsonc } from 'typeof-jsonc';
import { isJsonc, findWordPosition } from '../utils';
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
            const typeName = 'Root';

            if (isJsonc(pasteText)) {
                result = typeofJsonc(pasteText, 'Root',  {
                    addExport: true,
                    singleLineJsDocComments: true,
                });
            } else {
                const value = await readHtml();
                
                const userInput = await vscode.window.showInputBox({
                    placeHolder: "请分别输入属性名列号，类型列号，描述列号",
                    prompt: "例如: 0, 1, 2",
                    validateInput(value = '') {
                        return value.split(/[,，]/).length === 3 ? null : '请输入正确的参数';
                    }
                });
    
                if (userInput) {
                    const [nameCol, typeCol, descCol] = userInput.split(/[,，]/).map(str => str.trim());
        
                    result = typeofTable(value, {
                        name: 'Root',
                        nameCol: +nameCol || 0,
                        typeCol: +typeCol || 1,
                        descCol: +descCol || 2
                    });
                }
            }
            
            let [ line, start ] = findWordPosition(result, typeName);

            if (result !== '') {
                activeTextEditor.edit((editBuilder) => {
                    const active = activeTextEditor.selection.active;
                    line += active.line;

                    editBuilder.insert(active, result);
                }).then(() => {
                    activeTextEditor.selection = new vscode.Selection(new vscode.Position(line, start), new vscode.Position(line, start + typeName.length));

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