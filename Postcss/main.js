const postcss = require('postcss');
const fs = require('fs');
const path = require('path');
const extractColorDel = require('./extract-color-del');

const from = './test.css';
const to = './out.css';
const css = fs.readFileSync(path.resolve(__dirname, './test.css'), 'utf8');
/**
 * @type {import('postcss').Processor}
 */
const processor = postcss().use(
  extractColorDel({
    htmlDatasetNameDel: 'datasetName', // 不用改
    replaceColor: '#F1F5FF', // 现在只能替换一个色值，特殊色值只能手改out.css
    replaceColorDel: 'color', // 不用改
  })
);

processor.process(css, { from, to }).then((result) => {
  const css = result.css.replace(/\n|\r|\t/g, ''); // 压缩换行
  fs.writeFileSync(path.resolve(__dirname, './out.css'), css);
});
