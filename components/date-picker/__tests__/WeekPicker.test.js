import React from 'react';
import { mount, render } from 'enzyme';
import { setMockDate, resetMockDate } from '../../../tests/utils';
import DatePicker from '..';
import focusTest from '../../../tests/shared/focusTest';
import { openPanel } from './utils';

const { WeekPicker } = DatePicker;

describe('WeekPicker', () => {
  beforeEach(() => {
    setMockDate();
  });

  afterEach(() => {
    resetMockDate();
  });

  focusTest(WeekPicker);

  it('should support style prop', () => {
    const wrapper = mount(<WeekPicker style={{ width: 400 }} />);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('extra footer works', () => {
    const wrapper = mount(
      <WeekPicker renderExtraFooter={mode => <span className="extra-node">{mode}</span>} />,
    );
    openPanel(wrapper);

    let extraNode = wrapper.find('.extra-node');
    expect(extraNode.length).toBe(1);
    expect(extraNode.text()).toBe('date');

    wrapper
      .find('.alu-calendar-month-select')
      .hostNodes()
      .simulate('click');
    extraNode = wrapper.find('.alu-calendar-month-panel .extra-node');
    expect(extraNode.length).toBe(1);
    expect(extraNode.text()).toBe('month');

    wrapper
      .find('.alu-calendar-year-select')
      .hostNodes()
      .simulate('click');
    extraNode = wrapper.find('.alu-calendar-year-panel .extra-node');
    expect(extraNode.length).toBe(1);
    expect(extraNode.text()).toBe('year');

    wrapper
      .find('.alu-calendar-year-panel-decade-select')
      .hostNodes()
      .simulate('click');
    extraNode = wrapper.find('.alu-calendar-decade-panel .extra-node');
    expect(extraNode.length).toBe(1);
    expect(extraNode.text()).toBe('decade');
  });

  it('should support dateRender', () => {
    const wrapper = mount(
      <WeekPicker open dateRender={current => <span>{current.format('YYYY-MM-DD')}</span>} />,
    );
    expect(
      render(
        wrapper
          .find('Trigger')
          .instance()
          .getComponent(),
      ),
    ).toMatchSnapshot();
  });
});
