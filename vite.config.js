import { defineConfig } from 'vite';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import yaml from 'js-yaml';
import twig from '@vituum/vite-plugin-twig';
import vituum from 'vituum';
import _ from 'lodash';
import viteImagemin from '@vheemstra/vite-plugin-imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminOptipng from 'imagemin-optipng';
import imageminSvgo from 'imagemin-svgo';

// const PROD = process.env.NODE_ENV === 'production';
// const TEST = process.env.CI;

function generateHtmlPlugin() {
	return {
		name: 'generate-html',
		buildStart() {
			this.emitFile({
				type: 'chunk',
				id: 'src/js/index.ts',
        fileName: 'assets/js/main.bundle.js'
			});
			this.emitFile({
				type: 'chunk',
				id: 'src/js/journey-module.ts',
        fileName: 'assets/js/journey.bundle.js',
			});
		},
  }
}

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
    viteImagemin({
      plugins: {
        jpg: imageminMozjpeg({ progressive: true }),
        png: imageminOptipng({ optimizationLevel: 5 }),
        svg: imageminSvgo({ cleanupIDs: false })
      },
    }),
    generateHtmlPlugin()
  ],
  server: {
    port: 3000
  },
  preview: {
    port: 3000
  },
  build: {
    modulePreload: {
      polyfill: false
    },
    outDir: 'dist',
    rollupOptions: {
			input: resolve(__dirname, 'src/templates/pages/**/*.twig'),
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.names[0].split('.').at(1);
          if (/css/i.test(extType)) {
            return `assets/${extType}/[name][extname]`;
          }
          return 'assets/images/[name][extname]';
        },
        chunkFileNames: 'assets/js/chunks/[name].js',
      }
		},
  }
}));
