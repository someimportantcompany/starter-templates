import { renderToString } from 'vue/server-renderer'
import { renderSSRHead } from '@unhead/ssr';

import { createApp } from './main'

export type ServerReqContext = {
  origin: string,
  url: string,
  ipAddress: string,
  userAgent: string,
}
export type ServerResContext = {
  statusCode: number | undefined,
  headers: Record<string, string | undefined>,
}

/**
 * Render a Vue page via SSR
 */
export async function render(data: ServerReqContext): Promise<{
  appHtml: string,
  headTags: Record<string, string>,
  server?: ServerResContext,
}> {
  const { app, router, head } = createApp();

  await router.push(data.url);
  await router.isReady();

  // passing SSR context object which will be available via useSSRContext()
  // @vitejs/plugin-vue injects code into a component's setup() that registers
  // itself on ctx.modules. After the render, ctx.modules would contain all the
  // components that have been instantiated during this render call.
  const ctx = {
    data,
    server: {
      statusCode: undefined,
      headers: {},
    },
  };

  const html = await renderToString(app, ctx);

  const headTags = await renderSSRHead(head);

  return {
    appHtml: html,
    headTags: headTags as unknown as Record<string, string>,
    server: ctx.server,
  };
}
