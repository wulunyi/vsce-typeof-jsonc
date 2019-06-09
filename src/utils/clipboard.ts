import * as osascript from '@expo/osascript';

function unpack (raw: string) {
    const needle = '«data HTML';
    const end = '»';

    raw = raw.substring(raw.indexOf(needle) + needle.length, raw.indexOf(end));

    return Buffer.from(raw, 'hex').toString('utf8');
}

export function readHtml() {
    return osascript.execAsync('the clipboard as "HTML"').then((data) => {
        return unpack(data);
    });
}