import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import ExploreItem from '@/components/ExploreItem.vue';
import * as quizHooks from '@/api/quizHooks';
import { createRouter, createWebHistory } from 'vue-router';


vi.mock('@/api/quizHooks', () => ({
    getCategories: vi.fn().mockResolvedValue([
        { id: 1, name: 'Science' },
        { id: 2, name: 'Math' },
        { id: 3, name: 'History' }
    ])
}));

describe('ExploreItem', () => {
let wrapper: VueWrapper<any>; 

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
            { id: 1, name: 'Science' },
            { id: 2, name: 'Math' },
            { id: 3, name: 'History' }
        ]);

        expect(wrapper.findAll('.card-item')).toHaveLength(4); 
    });

    it('filters categories based on search term', async () => {
        wrapper.vm.searchTerm = 'Sci';
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.filteredCategories).toEqual([
            { id: 1, name: 'Science' }
        ]);
    });
});
