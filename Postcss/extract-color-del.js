const colorValTag = ['#', 'rgb', 'rgba', 'transparent', 'hsl', 'hsla', 'hwb'];

/**
 *
 * @param {object} opts
 * @param {object} opts.htmlDatasetNameDel
 * @param {object} opts.replaceColorDel
 * @param {object} opts.replaceColor
 */
module.exports = (opts = {}) => {
  /**
   * @type {import('postcss').Plugin}
   */
  const plugin = {
    postcssPlugin: 'extract-color-del',
    Comment(comment, helpers) {
      comment.remove();
    },
    Rule(rule, helpers) {
      let selectors = [];
      rule.selectors.forEach((selector) => {
        let newSelector = selector.replace(
          `html[data-\${${opts.htmlDatasetNameDel}}="\${${opts.replaceColorDel}}"] `,
          ''
        );
        // console.info(newSelector);
        if (!(newSelector.indexOf('html[data-') > -1)) {
          selectors.push(
            `html[data-\${${opts.htmlDatasetNameDel}}="\${${opts.replaceColorDel}}"] ` +
              newSelector
          );
        } else {
          selectors.push(
            `html[data-\${${opts.htmlDatasetNameDel}}] ` + selector
          );
        }
      });
      rule.assign({
        selectors,
      });
      // console.info(rule.selectors);
    },
    Declaration(decl, helpers) {
      if (
        !colorValTag.find(
          (tag) =>
            decl.value.indexOf(tag) > -1 ||
            decl.value.indexOf(`\${${opts.replaceColorDel}}`) > -1
        )
      ) {
        if (decl.parent.nodes.length === 1) {
          decl.parent.remove();
        } else {
          decl.remove();
        }
      } else {
        if (decl.value.toUpperCase() === opts.replaceColor.toUpperCase()) {
          decl.assign({
            prop: decl.prop,
            value: `\${${opts.replaceColorDel}}`,
          });

          console.info(decl.prop, decl.value);
        }
      }
    },
  };

  return plugin;
};
module.exports.postcss = true;
