import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Popup from '@/components/Popup.vue';

describe('Popup.vue', () => {
  it('is visible when isVisible is true', () => {
    const wrapper = mount(Popup, {
      props: {
        errorMessage: 'Test Error Message',
        fontColor: 'red'
      }
    });
    expect(wrapper.isVisible()).toBe(true);
    expect(wrapper.find('.popup-overlay').exists()).toBe(true);
  });

  it('displays the error message and applies font color', () => {
    const wrapper = mount(Popup, {
      props: {
        errorMessage: 'Test Error Message',
        fontColor: 'red'
      }
    });
    const messageElement = wrapper.find('.message');
    expect(messageElement.text()).toContain('Test Error Message');
    expect(messageElement.attributes('style')).toContain('color: red');
  });

  it('hides the popup and emits an event when clicked', async () => {
    const wrapper = mount(Popup, {
      props: {
        errorMessage: 'Test Error Message',
        fontColor: 'red'
      }
    });

    await wrapper.find('.popup-overlay').trigger('click');

    expect(wrapper.emitted()).toHaveProperty('popup-closed');
    expect(wrapper.vm.isVisible).toBe(false);
    expect(wrapper.find('.popup-overlay').exists()).toBe(false);
  });
});