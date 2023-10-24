import path from 'path';
import { createServer, ViteDevServer } from 'vite';

export const indexPagePath = path.join(__dirname, 'index.html');

export default new Promise<{
  middlewares: ViteDevServer['middlewares'],
}>(async (resolve, reject) => { // eslint-disable-line no-async-promise-executor
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
    });
  } catch (err) {
    reject(err);
  }
});
