import React from 'react';
import { render, mount } from 'enzyme';
import Spin from '..';

describe('Spin', () => {
  it('should only affect the spin element when set style to a nested <Spin>xx</Spin>', () => {
    const wrapper = mount(
      <Spin style={{ background: 'red' }}>
        <div>content</div>
      </Spin>,
    );
    expect(
      wrapper
        .find('.alu-spin-nested-loading')
        .at(0)
        .prop('style'),
    ).toBeFalsy();
    expect(
      wrapper
        .find('.alu-spin')
        .at(0)
        .prop('style').background,
    ).toBe('red');
  });

  it("should render custom indicator when it's set", () => {
    const customIndicator = <div className="custom-indicator" />;
    const wrapper = render(<Spin indicator={customIndicator} />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('delay spinning', () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should render with delay when it's mounted with spinning=true and delay", () => {
      const wrapper = mount(<Spin spinning delay={500} />);
      expect(
        wrapper
          .find('.alu-spin')
          .at(0)
          .hasClass('alu-spin-spinning'),
      ).toEqual(false);
    });

    it('should render when delay is init set', () => {
      const wrapper = mount(<Spin spinning delay={100} />);

      expect(
        wrapper
          .find('.alu-spin')
          .at(0)
          .hasClass('alu-spin-spinning'),
      ).toEqual(false);

      jest.runAllTimers();
      wrapper.update();

      expect(
        wrapper
          .find('.alu-spin')
          .at(0)
          .hasClass('alu-spin-spinning'),
      ).toEqual(true);
    });
  });

  it('should be controlled by spinning', () => {
    const wrapper = mount(<Spin spinning={false} />);
    expect(wrapper.instance().state.spinning).toBe(false);
    wrapper.setProps({ spinning: true });
    expect(wrapper.instance().state.spinning).toBe(true);
  });
});
