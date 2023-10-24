import assert from 'assert';
import { test } from 'vitest';

import { createApp } from './main';

test('createApp should run cleanly', async () => {
  const { app, router } = createApp();
  assert(app, 'Expected an app to be returned');
  assert(router, 'Expected a router to be returned');

  await router.push('/');
  await router.isReady();

  assert.strictEqual(router.currentRoute?.value?.fullPath, '/', 'Expected router to resolve');
});
