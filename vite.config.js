import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'node:fs';
import yaml from 'js-yaml';
import twig from '@vituum/vite-plugin-twig';
import vituum from 'vituum';
import _ from 'lodash';

const PROD = process.env.NODE_ENV === 'production';
const TEST = process.env.CI;

const ymlData = yaml.load(fs.readFileSync('./src/data/data.yml', 'utf8'));
const imageStyles = yaml.load(fs.readFileSync('./src/data/image_styles.yml', 'utf8'));

const data = {
  ...ymlData,
  ...imageStyles,
  env: {
    test: TEST,
    production: PROD,
    vercel: Boolean(process.env.VERCEL_URL)
  }
};

export default defineConfig ({
  // publicDir: 'dist',
  plugins: [
    vituum(),
    twig({
      root: './src',
      // ignoredPaths: ['./src/templates/*layout.twig'],
      filters: {
        exists: (value, args) => {
          if (!value) {
            // console.log(args);
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
      data: data
    }),
  ],
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      // input: ['./src/templates/**/*.twig'],
      output: {
        // assetFileNames: (assetInfo) => {
        //   console.log(assetInfo);
        //   if (assetInfo.names[0] == "index.css") return "css/styles.css";
        //   return assetInfo.names;
        // },
      }
    }
  }
})
