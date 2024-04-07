import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CardItem from '@/components/CardItem.vue'; // Adjust the import path as needed

describe('CardItem.vue', () => {
  it('renders title and description', () => {
    const wrapper = mount(CardItem, {
      props: {
        id: 1,
        title: 'Test Title',
        image: 'test.jpg',
        description: 'Test Description',
        clickable: true,
        tags: [{ id: 1, tagName: 'Tag1' }],
        creationDate: '2021-01-01',
      },
    });

    expect(wrapper.text()).toContain('Test Title');
    expect(wrapper.text()).toContain('Test Description');
  });

  it('conditionally renders description and footer based on props', () => {
    const wrapper = mount(CardItem, {
      props: {
        id: 1,
        title: 'Test Title',
        image: 'test.jpg',
        clickable: true,
        type: 'quiz',
        authorName: 'Author',
        tags: [{ id: 1, tagName: 'Tag1' }],
        creationDate: '2021-01-01',
      },
    });

    // Description not provided, should not be rendered
    expect(wrapper.find('p').exists()).toBe(false);

    // Footer should be rendered for type 'quiz'
    expect(wrapper.find('.card-item-footer').exists()).toBe(true);
  });

  it('emits clicked event when the card is clicked and is clickable', async () => {
    const wrapper = mount(CardItem, {
      props: {
        id: 1,
        title: 'Test Title',
        image: 'test.jpg',
        clickable: true,
      },
    });

    await wrapper.trigger('click');
    expect(wrapper.emitted()).toHaveProperty('clicked');
    expect(wrapper.emitted().clicked[0]).toEqual([1]);
  });

  it('does not emit clicked event when the card is not clickable', async () => {
    const wrapper = mount(CardItem, {
      props: {
        id: 1,
        title: 'Test Title',
        image: 'test.jpg',
        clickable: false,
      },
    });

    await wrapper.trigger('click');
    expect(wrapper.emitted().clicked).toBeFalsy();
  });
});