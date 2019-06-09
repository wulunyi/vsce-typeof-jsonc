import * as tsDom from 'dts-dom';
import { pascalCase } from 'change-case';
import { getType } from './type';
import parseTable from './parse-table';

interface Options {
  name: string;
  nameCol: number;
  typeCol: number;
  descCol: number;
}

export function typeofTable(tableHtml: string, options: Options = {
    name: 'root',
    nameCol: 0,
    typeCol: 1,
    descCol: 2
}): string {
    const table = parseTable(tableHtml);
    const result = tsDom.create.interface(`${pascalCase(options.name)}`);

    table.forEach(column => {
        const [name = '', type, desc = ''] = [
            column[options.nameCol],
            getType(column[options.typeCol]),
            column[options.descCol],
        ];

        if (name.length > 0) {
            const propertyType = tsDom.create.property(name, type);

            if (desc.trim().length > 0) {
                propertyType.jsDocComment = desc.trim();
            }

            result.members.push(propertyType);
        }
    });

    return tsDom
        .emit(result, {
            rootFlags: 1,
            singleLineJsDocComments: true,
        })
        .replace('interface', 'export interface');
}
