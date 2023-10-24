import fs from 'fs';
import path from 'path';
import { createServer, ViteDevServer } from 'vite';

// @ts-ignore
import { renderTemplate } from '../../deploy/server/common';

import type { render, ServerResContext } from './entry-server';

export const indexPage = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');

export type ViteServerDev = {
  middlewares: ViteDevServer['middlewares'],
  // eslint-disable-next-line no-unused-vars
  render: (data: Parameters<typeof render>[0]) => Promise<{
    pageHtml: string,
    server?: ServerResContext,
  }>,
};

export default new Promise<ViteServerDev>(async (resolve, reject) => { // eslint-disable-line no-async-promise-executor
  try {
    const vite = await createServer({
      root: __dirname,
      server: {
        middlewareMode: true,
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100,
        },
      },
      appType: 'custom',
    });

    resolve({
      middlewares: vite.middlewares,
      async render(data) {
        try {
          // 2. Apply Vite HTML transforms. This injects the Vite HMR client,
          //    and also applies HTML transforms from Vite plugins, e.g. global
          //    preambles from @vitejs/plugin-react
          const template = await vite.transformIndexHtml(data.url, indexPage);

          // 3. Load the server entry. ssrLoadModule automatically transforms
          //    ESM source code to be usable in Node.js! There is no bundling
          //    required, and provides efficient invalidation similar to HMR.
          const { render: renderPage } = await vite.ssrLoadModule('/entry-server.ts');

          // 4. render the app HTML. This assumes entry-server.js's exported
          //     `render` function calls appropriate framework SSR APIs,
          //    e.g. ReactDOMServer.renderToString()
          const { appHtml, headTags, server } = await renderPage(data);

          return {
            pageHtml: renderTemplate(template, { appHtml, headTags }),
            server,
          };
        } catch (err) {
          // If an error is caught, let Vite fix the stack trace so it maps back
          // to your actual source code.
          if (err instanceof Error) {
            vite.ssrFixStacktrace(err);
          }
          throw err;
        }
      },
    });
  } catch (err) {
    reject(err);
  }
});
