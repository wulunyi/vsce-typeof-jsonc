import { JSDOM } from 'jsdom';
import { map, isEmpty } from 'lodash';

export default function parseTable(tableHtml: string): string[][] {
  try {
    const dom = new JSDOM(tableHtml);

    const trTags = dom.window.document.getElementsByTagName('tr');

    return map(trTags, tr => {
      const tdTags = tr.getElementsByTagName('td');

      return map(tdTags, td => td.textContent || '');
    }).filter(tr => !isEmpty(tr));
  } catch (error) {
    throw error;
  }
}

