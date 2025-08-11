/* eslint-env node */

const reLowerCase = /([a-z][a-z\d]*(-[a-z\d]+)*)/;
const reName = new RegExp(
  `^${reLowerCase.source}((--|__)${reLowerCase.source})*$`
);

module.exports = {
  extends: ['stylelint-config-xo-scss', 'stylelint-prettier/recommended'],
  // most of our rules override XO config
  rules: {
    // we use important on utils and other areas selectively. We may want to re-enable this at some point
    'declaration-no-important': null,

    // xo enables this which would require us to add .scss extension to all imports
    'scss/at-import-partial-extension': null,

    // xo disables border: 0 which is fine
    'declaration-property-value-disallowed-list': null,

    // too many errors with this one currently
    'no-descending-specificity': null,

    // long hand is better in some cases and css minifies anyway
    'declaration-block-no-redundant-longhand-properties': null,

    // xo blacklists float property and we need it for floating images within text
    // otherwise flexbox usage is encouraged.
    // 'property-blacklist': null,

    // Allow empty blocks since cssnano removes them and we have some BEM blocks defined without styles currently
    'block-no-empty': null,

    // override xo to allow :before/:after since cssnano outputs single colon
    'selector-pseudo-element-colon-notation': 'single',

    // avoid id selectors
    'selector-max-id': 0,

    // override xo selector and mixin patterns
    'scss/at-mixin-pattern': reName,
    'selector-class-pattern': reName,

    // allow imports within partials
    'scss/partial-no-import': null,

    // allow older color manipulation functions
    'scss/function-color-relative': null,

    // Override no-missing-generic-font from xo since we use object-fit polyfill
    // which requires `font-family: 'object-fit: <value>;';`
    'font-family-no-missing-generic-family-keyword': null,

    // Check if alpha-values are using the number notation
    'alpha-value-notation': 'number',

    // Allow class selectors qualified by type
    'selector-no-qualifying-type': [
      true, 
      {
        'ignore': ['class']
      }
    ],

    // deprecated rules in Stylelint v15
    'indentation': null,
    'no-eol-whitespace': null,
    'media-query-list-comma-newline-after': null,
    'declaration-colon-newline-after': null,
    'at-rule-name-newline-after': null,

    // Disallow qualifying a selector by type.
    'selector-no-qualifying-type': [
      true,
      {
        ignore: ['attribute']
      }
    ]
  }
};
