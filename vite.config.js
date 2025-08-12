import { defineConfig } from 'vite';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'node:url';
import { globSync } from 'glob';
import twig from '@vituum/vite-plugin-twig';
import vituum from 'vituum';
import _ from 'lodash';
import viteImagemin from '@vheemstra/vite-plugin-imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminOptipng from 'imagemin-optipng';
import imageminSvgo from 'imagemin-svgo';

const PROD = process.env.NODE_ENV === 'production';
const TEST = process.env.CI;

const __dirname = dirname(fileURLToPath(import.meta.url));

const getPages = () => {
  const files = globSync('src/templates/pages/**/*.twig');
  let elems = '';

  for (const path of files) {
    const anchorText = `${path.split('/').slice(3).join('/')}`;
    const anchorHref = anchorText.replace('.twig', '.html');
    elems += `<li><a href="/${anchorHref}">${anchorText}</a></li>`;
  }

  return elems;
};

const createPagesList = () => {
  return {
    name: 'create-pages-list',
    enforce: 'post',
    transformIndexHtml(html, context) {
      if (context.filename.endsWith('pages.twig.html')) {
        let list = getPages();
        html = html.replace(
          `<ol id="page-list"><ol>`,
          `<ol id="page-list" style="columns: 18rem auto;">${list}<ol>`
        );
      }
      return html;
    }
  };
};

const updateJsFilePaths = () => {
  return {
    name: 'update-js-file-paths',
    apply: 'build',
    buildStart() {
      this.emitFile({
        type: 'chunk',
        id: 'src/js/index.ts',
        fileName: 'js/main.bundle.js'
      });
      this.emitFile({
        type: 'chunk',
        id: 'src/js/journey-module.ts',
        fileName: 'js/journey.bundle.js'
      });
    }
  };
};

export default defineConfig(() => ({
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
      globals: {
        env: {
          test: TEST,
          production: PROD,
          // store if this is vercel, so we can change templates for deploy previews
          vercel: Boolean(process.env.VERCEL_URL)
        }
      },
      data: ['src/data/*.json']
    }),
    viteImagemin({
      plugins: {
        jpg: imageminMozjpeg({ progressive: true }),
        png: imageminOptipng({ optimizationLevel: 5 }),
        svg: imageminSvgo({ cleanupIDs: false })
      }
    }),
    updateJsFilePaths(),
    createPagesList()
  ],
  server: {
    port: 3000,
    open: '/pages.html'
  },
  preview: {
    port: 3000
  },
  css: {
    devSourcemap: true
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
            return `${extType}/[name][extname]`;
          }
          return 'images/[name][extname]';
        },
        chunkFileNames: 'js/chunks/[name].js'
      }
    }
  }
}));
