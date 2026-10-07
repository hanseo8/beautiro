import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parse } from '@formatjs/icu-messageformat-parser';

const read = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const leaves = (value, path = '', result = {}) => {
  if (typeof value === 'string') result[path] = value;
  else for (const [key, child] of Object.entries(value)) leaves(child, `${path}.${key}`, result);
  return result;
};
let checked = 0;
for (const locale of ['zh', 'th', 'vi']) {
  for (const [source, target] of [
    ['src/messages/en.json', `src/messages/${locale}.json`],
    ['src/messages/partials/marketing-en.json', `src/messages/partials/marketing-${locale}.json`],
  ]) {
    const base = leaves(read(source));
    const translated = leaves(read(target));
    assert.deepEqual(Object.keys(translated).sort(), Object.keys(base).sort(), `${locale}: message keys`);
    for (const [key, value] of Object.entries(translated)) {
      assert(value.trim(), `${locale}${key}: empty translation`);
      parse(value);
      const variables = text => [...text.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort();
      assert.deepEqual(variables(value), variables(base[key]), `${locale}${key}: variables`);
      if (key.endsWith('.href')) assert.equal(value, base[key], `${locale}${key}: URL`);
      checked++;
    }
  }
  const catalog = read('src/lib/seranplus-catalog.json');
  const keys = catalog.groups.flatMap(group => [group.key, ...group.items.map(item => item.key)]).sort();
  const labels = read(`src/messages/treatments-${locale}.json`);
  assert.deepEqual(Object.keys(labels).sort(), keys, `${locale}: treatment coverage`);
  assert(Object.values(labels).every(label => label.trim()), `${locale}: treatment labels`);
}
console.log(`Passed: ${checked} messages, ICU syntax, variables, URLs and all treatment labels.`);
