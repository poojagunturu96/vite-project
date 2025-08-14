import gulp from 'gulp';
const { series, task } = gulp;
import gulpSvgo from 'gulp-svgo';
import svgSprite from 'gulp-svg-sprite';
import rename from 'gulp-rename';

const copyIcons = () =>
  gulp
    .src('./dist/icons/sprites/symbol/svg/sprite.symbol.svg')
    .pipe(rename('icons.twig'))
    .pipe(gulp.dest('./src/templates/partials'));

const minifySvgs = (src) =>
  gulp.src(src).pipe(
    gulpSvgo({
      plugins: [
        { removeTitle: true },
        { removeXMLNS: true },
        { removeAttrs: { attrs: '(stroke)' } },
        {
          addAttributesToSVGElement: {
            attributes: [{ 'fill-rule': 'evenodd' }]
          }
        }
      ]
    })
  );

// create svg sprite
const buildIconSprite = () =>
  minifySvgs('./src/icons/*.svg')
    .pipe(
      svgSprite({
        svg: {
          xmlDeclaration: false
        },
        shape: {
          id: {
            generator: 'icon-%s'
          }
        },
        mode: {
          symbol: {
            // Activate the defs mode
            bust: false, // Cache busting
            example: true // Build a page
          }
        }
      })
    )
    .pipe(gulp.dest('./dist/icons/sprites'));

task('icons', series(buildIconSprite, copyIcons));
