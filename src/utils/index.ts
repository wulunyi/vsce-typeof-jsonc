export function isJsonc(value: string): boolean {
    return /^\{[\W\w]*?\}$/.test(value.trim());
}

export function findWordPosition(str: string, word: string): [number, number] {
    let result = [0, 0] as [number, number];

    str.split(/\r\n|\r|\n/).some((item, line) => {
        const index = item.indexOf(word);

        if (index !== -1) {
            result = [line, index];
        }

        return index !== -1;
    });

    return result;
}
