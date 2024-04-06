import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import ExploreItem from '@/components/ExploreItem.vue';
import * as quizHooks from '@/api/quizHooks';
import { createRouter, createWebHistory } from 'vue-router';

// Mock the `getCategories` function
vi.mock('@/api/quizHooks', () => ({
    getCategories: vi.fn().mockResolvedValue(['Science', 'Math', 'History'])
}));

describe('ExploreItem', () => {
let wrapper: VueWrapper<any>; // Specify the type of `wrapper`

  beforeEach(async () => {
    wrapper = mount(ExploreItem, {
      global: {
        plugins: [createRouter({
          history: createWebHistory(),
          routes: []
        })],
      }
    });

    await wrapper.vm.$nextTick(); 
  });

  it('renders categories after fetch', () => {
    expect(quizHooks.getCategories).toHaveBeenCalled();

    expect((wrapper.vm as any).categories).toEqual([
        { id: 'Science', name: 'Science' },
        { id: 'Math', name: 'Math' },
        { id: 'History', name: 'History' }
    ]);

    expect(wrapper.findAll('.card-item')).toHaveLength(4); 
  });
});
