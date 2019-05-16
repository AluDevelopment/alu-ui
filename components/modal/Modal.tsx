import * as React from 'react';
import Dialog from 'rc-dialog';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import addEventListener from 'rc-util/lib/Dom/addEventListener';
import { getConfirmLocale } from './locale';
import Icon from '../icon';
import Button from '../button';
import { ButtonType, NativeButtonProps } from '../button/button';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import { ConfigConsumer, ConfigConsumerProps } from '../config-provider';

let mousePosition: { x: number; y: number } | null;
let mousePositionEventBinded: boolean;
export const destroyFns: Array<() => void> = [];

export interface ModalProps {
  /** 对话框是否可见*/
  visible?: boolean;
  /** 确定按钮 loading*/
  confirmLoading?: boolean;
  /** 标题*/
  title?: React.ReactNode | string;
  /** 是否显示右上角的关闭按钮*/
  closable?: boolean;
  /** 点击确定回调*/
  onOk?: (e: React.MouseEvent<any>) => void;
  /** 点击模态框右上角叉、取消按钮、Props.maskClosable 值为 true 时的遮罩层或键盘按下 Esc 时的回调*/
  onCancel?: (e: React.MouseEvent<any>) => void;
  afterClose?: () => void;
  /** 垂直居中 */
  centered?: boolean;
  /** 宽度*/
  width?: string | number;
  /** 底部内容*/
  footer?: React.ReactNode;
  /** 确认按钮文字*/
  okText?: string;
  /** 确认按钮类型*/
  okType?: ButtonType;
  /** 取消按钮文字*/
  cancelText?: string;
  /** 点击蒙层是否允许关闭*/
  maskClosable?: boolean;
  /** 强制渲染 Modal*/
  forceRender?: boolean;
  okButtonProps?: NativeButtonProps;
  cancelButtonProps?: NativeButtonProps;
  destroyOnClose?: boolean;
  style?: React.CSSProperties;
  wrapClassName?: string;
  maskTransitionName?: string;
  transitionName?: string;
  className?: string;
  getContainer?: (instance: React.ReactInstance) => HTMLElement;
  zIndex?: number;
  bodyStyle?: React.CSSProperties;
  maskStyle?: React.CSSProperties;
  mask?: boolean;
  keyboard?: boolean;
  wrapProps?: any;
  prefixCls?: string;
}

export interface ModalFuncProps {
  prefixCls?: string;
  className?: string;
  visible?: boolean;
  title?: React.ReactNode;
  content?: React.ReactNode;
  onOk?: (...args: any[]) => any | PromiseLike<any>;
  onCancel?: (...args: any[]) => any | PromiseLike<any>;
  okButtonProps?: NativeButtonProps;
  cancelButtonProps?: NativeButtonProps;
  centered?: boolean;
  width?: string | number;
  iconClassName?: string;
  okText?: string;
  okType?: ButtonType;
  cancelText?: string;
  icon?: React.ReactNode;
  /* Deperated */
  iconType?: string;
  maskClosable?: boolean;
  zIndex?: number;
  okCancel?: boolean;
  style?: React.CSSProperties;
  maskStyle?: React.CSSProperties;
  type?: string;
  keyboard?: boolean;
  getContainer?: (instance: React.ReactInstance) => HTMLElement;
  autoFocusButton?: null | 'ok' | 'cancel';
}

export type ModalFunc = (
  props: ModalFuncProps,
) => {
  destroy: () => void;
  update: (newConfig: ModalFuncProps) => void;
};

export interface ModalLocale {
  okText: string;
  cancelText: string;
  justOkText: string;
}

export default class Modal extends React.Component<ModalProps, {}> {
  static info: ModalFunc;
  static success: ModalFunc;
  static error: ModalFunc;
  static warn: ModalFunc;
  static warning: ModalFunc;
  static confirm: ModalFunc;
  static destroyAll: () => void;

  static defaultProps = {
    width: 520,
    transitionName: 'zoom',
    maskTransitionName: 'fade',
    confirmLoading: false,
    visible: false,
    okType: 'primary' as ButtonType,
    okButtonDisabled: false,
    cancelButtonDisabled: false,
  };

  static propTypes = {
    prefixCls: PropTypes.string,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    centered: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    confirmLoading: PropTypes.bool,
    visible: PropTypes.bool,
    align: PropTypes.object,
    footer: PropTypes.node,
    title: PropTypes.node,
    closable: PropTypes.bool,
  };

  handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    const onCancel = this.props.onCancel;
    if (onCancel) {
      onCancel(e);
    }
  };

  handleOk = (e: React.MouseEvent<HTMLButtonElement>) => {
    const onOk = this.props.onOk;
    if (onOk) {
      onOk(e);
    }
  };

  componentDidMount() {
    if (mousePositionEventBinded) {
      return;
    }
    // 只有点击事件支持从鼠标位置动画展开
    addEventListener(document.documentElement, 'click', (e: MouseEvent) => {
      mousePosition = {
        x: e.pageX,
        y: e.pageY,
      };
      // 100ms 内发生过点击事件，则从点击位置动画展示
      // 否则直接 zoom 展示
      // 这样可以兼容非点击方式展开
      setTimeout(() => (mousePosition = null), 100);
    });
    mousePositionEventBinded = true;
  }

  renderFooter = (locale: ModalLocale) => {
    const { okText, okType, cancelText, confirmLoading } = this.props;
    return (
      <div>
        <Button onClick={this.handleCancel} {...this.props.cancelButtonProps}>
          {cancelText || locale.cancelText}
        </Button>
        <Button
          type={okType}
          loading={confirmLoading}
          onClick={this.handleOk}
          {...this.props.okButtonProps}
        >
          {okText || locale.okText}
        </Button>
      </div>
    );
  };

  renderModal = ({ getPrefixCls }: ConfigConsumerProps) => {
    const {
      prefixCls: customizePrefixCls,
      footer,
      visible,
      wrapClassName,
      centered,
      ...restProps
    } = this.props;

    const prefixCls = getPrefixCls('modal', customizePrefixCls);
    const defaultFooter = (
      <LocaleReceiver componentName="Modal" defaultLocale={getConfirmLocale()}>
        {this.renderFooter}
      </LocaleReceiver>
    );

    const closeIcon = (
      <span className={`${prefixCls}-close-x`}>
        <Icon className={`${prefixCls}-close-icon`} component={() => (
          <svg className={`${prefixCls}-close-icon`} width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="费用设置-自定义费用项目管理-新增" transform="translate(-1228.000000, -265.000000)">
                    <g id="分组-6" transform="translate(858.000000, 245.000000)">
                        <g id="分组-2" transform="translate(370.000000, 20.000000)">
                            <g id="分组-16">
                                <circle id="Oval-6" fill="#FFC4C4" cx="12" cy="12" r="12"></circle>
                                <path d="M12.2426407,10.8284271 L15.7781746,7.29289322 C16.1686989,6.90236893 16.8018639,6.90236893 17.1923882,7.29289322 C17.5829124,7.68341751 17.5829124,8.31658249 17.1923882,8.70710678 L13.6568542,12.2426407 L17.1923882,15.7781746 C17.5829124,16.1686989 17.5829124,16.8018639 17.1923882,17.1923882 C16.8018639,17.5829124 16.1686989,17.5829124 15.7781746,17.1923882 L12.2426407,13.6568542 L8.70710678,17.1923882 C8.31658249,17.5829124 7.68341751,17.5829124 7.29289322,17.1923882 C6.90236893,16.8018639 6.90236893,16.1686989 7.29289322,15.7781746 L10.8284271,12.2426407 L7.29289322,8.70710678 C6.90236893,8.31658249 6.90236893,7.68341751 7.29289322,7.29289322 C7.68341751,6.90236893 8.31658249,6.90236893 8.70710678,7.29289322 L12.2426407,10.8284271 Z" id="Combined-Shape" fill="#FF0000"></path>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
          </svg>
        )} />
      </span>
    );

    return (
      <Dialog
        {...restProps}
        prefixCls={prefixCls}
        wrapClassName={classNames({ [`${prefixCls}-centered`]: !!centered }, wrapClassName)}
        footer={footer === undefined ? defaultFooter : footer}
        visible={visible}
        mousePosition={mousePosition}
        onClose={this.handleCancel}
        closeIcon={closeIcon}
      />
    );
  };

  render() {
    return <ConfigConsumer>{this.renderModal}</ConfigConsumer>;
  }
}
