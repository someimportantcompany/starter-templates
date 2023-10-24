import assert from 'assert';
import { mount } from '@vue/test-utils';
import { test } from 'vitest';

import Home from './Home.vue';

test('It should render the Home page', async () => {
  const wrapper = mount(Home);
  assert(wrapper.text().includes('Documentation'), 'Missing included text');

  const svg = wrapper.find('svg');
  assert(svg.attributes().src, 'Expected svg to have a src');
});
