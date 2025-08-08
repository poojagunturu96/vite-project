import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import sortMediaQueries from 'postcss-sort-media-queries';

export default ({ env }) => {
  const PROD = env === 'production' ? true : false;

  return {
    map: !PROD && 'inline',
    plugins: [
      autoprefixer(),
      PROD && cssnano(),
      PROD && sortMediaQueries(),
    ],
  }
};