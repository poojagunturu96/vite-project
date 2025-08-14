import { createLogger, defineConfig } from 'vite';
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

const logger = createLogger();

const getPages = () => {
  const files = globSync('src/pages/**/*.twig');
  let elems = '';

  for (const path of files) {
    const anchorText = `${path.split('/').slice(2).join('/')}`;
    const anchorHref = anchorText.replace('.twig', '.html');
    elems += `<li class="pr-2 pb-3"><a href="/${anchorHref}">${anchorText}</a></li>`;
  }

  return elems;
};

const createPagesList = () => {
  return {
    name: 'create-pages-list',
    enforce: 'post',
    transformIndexHtml(html, context) {
      if (context.filename.endsWith('index.twig.html')) {
        let list = getPages();
        html = html.replace(
          `<ol id="page-list"><ol>`,
          `<ol id="page-list" style="columns: 20rem auto;">${list}<ol>`
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
    vituum(),
    twig({
      root: './src/templates',
      filters: {
        exists: (value) => {
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
      },
      verbose: false
    }),
    updateJsFilePaths(),
    createPagesList()
  ],
  server: {
    port: 3000,
    open: '/'
  },
  preview: {
    port: 3000
  },
  css: {
    devSourcemap: true
  },
  customLogger: {
    ...logger,
    info: (msg, options) => {
      if (msg.includes('.html')) return;
      logger.info(msg, options);
    }
  },
  build: {
    outDir: 'dist',
    publicDir: '/',
    rollupOptions: {
      external: [/moment$/],
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
