import { defineConfig } from 'vite';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import yaml from 'js-yaml';
import twig from '@vituum/vite-plugin-twig';
import vituum from 'vituum';
import _ from 'lodash';

const PROD = process.env.NODE_ENV === 'production';
const TEST = process.env.CI;

// const ymlData = yaml.load(fs.readFileSync('./src/data/data.yml', 'utf8'));
// const imageStyles = yaml.load(fs.readFileSync('./src/data/image_styles.yml', 'utf8'));

// const data = {
//   ...ymlData,
//   ...imageStyles,
//   env: {
//     test: TEST,
//     production: PROD,
//     vercel: Boolean(process.env.VERCEL_URL)
//   }
// };
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => ({
  // publicDir: 'dist',
  plugins: [
    vituum({
      pages: {
        dir: './src/templates/pages'
      }
    }),
    twig({
      root: './src/templates/pages',
      filters: {
        exists: (value, args) => {
          if (!value) {
            throw new Error('value is falsy');
          }

          return value;
        },
        groupBy: (items, field) => {
          const grouped = _.groupBy(items, field[0]);

          const groupArr = Object.keys(grouped).map((key) => ({
            group: key,
            items: grouped[key]
          }));

          return groupArr;
        },
        cast_to_array: (items) => {
          return Object.keys(items).map((key) => {
            return {
              ...items[key],
              key
            };
          });
        }
      },
      data: ['src/data/*.json']
    }),
  ],
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
			input: resolve(__dirname, 'src/templates/pages/**/*.twig'),
		},
  }
}));
