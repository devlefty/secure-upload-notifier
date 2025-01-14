// config.js - 配置文件
const defaultConfig: NotifierConfig = {
  // 警告框配置
  alert: {
    duration: 0, // 持续时间(ms)，0 表示一直显示
    position: {
      top: "20px",
      right: "20px",
    },
    width: {
      min: "400px",
      max: "450px",
    },
    animation: {
      duration: 300, // 动画时间(ms)
      type: "ease-in-out",
    },
    resetTimeout: 2 * 60 * 1000, // 状态重置时间(ms)
    mobile: {
      position: {
        top: "20px",
        left: "10px",
        right: "10px",
      },
      width: {
        min: "300px",
        max: "100%", // 移动端宽度建议跟随屏幕
      },
      padding: "12px 15px", // 移动端内边距可以适当调整
    },
  },

  // UI配置
  ui: {
    icon: `<svg viewBox="0 0 30 30" width="30" height="30">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" fill="currentColor"/>
            </svg>`,
    title: "警告",
    message: "严禁在本互联网非涉密平台处理传输国家秘密，请确认扫描传输的文件、资料不涉及国家秘密。",
    closeButton: "×",
  },

  // 样式配置
  style: {
    colors: {
      primary: "#ff4d4f",
      text: "#333333",
      close: "#999",
      closeHover: "#666",
    },
    borderRadius: "4px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },

  // 上传组件选择器
  uploadSelectors: [
    ".el-upload",
    'input[type="file"]',
    ".ant-upload",
    ".van-uploader", // 移动端常用上传组件
    ".weui-uploader",
    ".am-upload",
    ".mui-upload",
    ".mint-upload",
    "[data-role='mobile-upload']",
  ],
};
import { NotifierConfig, DeepRequired } from "../types/index";
class Notifier {
  private config: DeepRequired<NotifierConfig>;
  private static instance: Notifier | null = null;
  private alertElement: HTMLElement | null;
  private isAlertShown: boolean;
  private isClosedByUser: boolean;
  private isMobile: boolean;
  // 添加延迟显示的配置
  private static readonly SHOW_DELAY = 500;

  // 单例模式
  public static getInstance(config?: NotifierConfig): Notifier {
    if (!Notifier.instance) {
      Notifier.instance = new Notifier(config);
    }
    return Notifier.instance;
  }

  constructor(config?: NotifierConfig) {
    this.config = this.mergeConfig(defaultConfig, config || {});
    this.isMobile = this.checkIsMobile();

    this.alertElement = null;
    this.isAlertShown = false;
    this.isClosedByUser = false; // 添加用户手动关闭的标志
  }
  private mergeConfig(defaultConfig: NotifierConfig, customConfig: NotifierConfig): DeepRequired<NotifierConfig> {
    return {
      alert: {
        ...defaultConfig.alert,
        ...customConfig.alert,
        position: {
          ...defaultConfig.alert?.position,
          ...customConfig.alert?.position,
        },
        width: {
          ...defaultConfig.alert?.width,
          ...customConfig.alert?.width,
        },
        animation: {
          ...defaultConfig.alert?.animation,
          ...customConfig.alert?.animation,
        },
      },
      ui: {
        ...defaultConfig.ui,
        ...customConfig.ui,
      },
      style: {
        ...defaultConfig.style,
        ...customConfig.style,
        colors: {
          ...defaultConfig.style?.colors,
          ...customConfig.style?.colors,
        },
      },
      uploadSelectors: [...(defaultConfig.uploadSelectors || []), ...(customConfig.uploadSelectors || [])],
    };
  }

  private checkIsMobile(): boolean {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.innerWidth <= 768
    );
  }

  // 创建警告弹窗
  createAlertElement() {
    const { ui, style, alert } = this.config;

    const alertDiv = document.createElement("div");
    alertDiv.className = "security-alert";
    alertDiv.innerHTML = `
        <div class="security-alert-content">
          <div class="security-alert-icon">${ui.icon}</div>
          <div class="security-alert-text">
            <h4 class="security-alert-title">${ui.title}</h4>
            <p class="security-alert-message">${ui.message}</p>
          </div>
          <button class="security-alert-close">${ui.closeButton}</button>
        </div>
      `;

    // 动态创建样式
    const styleElement = document.createElement("style");
    styleElement.textContent = this.generateStyles();
    document.head.appendChild(styleElement);

    alertDiv?.querySelector(".security-alert-close")?.addEventListener("click", () => {
      this.hideAlert();
    });

    return alertDiv;
  }

  private generateStyles() {
    return [
      this.generateBaseStyles(),
      this.generatePositionStyles(),
      this.generateContentStyles(),
      this.generateTypographyStyles(),
      this.generateCloseButtonStyles(),
      this.generateAnimationStyles(),
    ].join("\n");
  }

  private generateBaseStyles(): string {
    const { style } = this.config;

    return `
      .security-alert {
        position: fixed;
        z-index: 9999;
        background: #fff;
        box-shadow: ${style.boxShadow};
        border-radius: ${style.borderRadius};
        border-left: 4px solid ${style.colors?.primary};
      }
    `;
  }

  private generatePositionStyles(): string {
    const { alert } = this.config;
    const position = this.isMobile ? alert.mobile?.position : alert.position;
    const width = this.isMobile ? alert.mobile?.width : alert.width;

    if (this.isMobile) {
      return `
        .security-alert {
          top: ${position?.top};
          bottom: ${position?.bottom};  
          left: ${position?.left};
          right: ${position?.right};
          transform: translateY(-150%);
          min-width: ${width?.min};
          max-width: ${width?.max};
          padding: ${alert.mobile?.padding};
          transition: transform ${alert.animation?.duration}ms ${alert.animation?.type};
        }

        .security-alert.show {
          transform: translateY(0);
        }

        .security-alert.hide {
          transform: translateY(-150%);
        }
      `;
    }

    return `
      .security-alert {
        top: ${position?.top};
        right: -100%;
        min-width: ${width?.min};
        max-width: ${width?.max};
        padding: 16px 20px;
        transition: right ${alert.animation?.duration}ms ${alert.animation?.type};
      }

      .security-alert.show {
        right: 20px;
      }

      .security-alert.hide {
        right: -100%;
      }
    `;
  }
  private generateContentStyles(): string {
    const { style } = this.config;

    return `
      .security-alert-content {
        display: flex;
        align-items: flex-start;
        gap: ${this.isMobile ? "8px" : "12px"};
      }

      .security-alert-icon {
        flex-shrink: 0;
        width: ${this.isMobile ? "24px" : "30px"};
        height: ${this.isMobile ? "24px" : "30px"};
        color: ${style.colors?.primary};
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .security-alert-text {
        flex: 1;
      }
    `;
  }
  private generateTypographyStyles(): string {
    const { style } = this.config;

    return `
      .security-alert-title {
        margin: 0 0 ${this.isMobile ? "4px" : "8px"} 0;
        color: ${style.colors?.primary};
        font-size: ${this.isMobile ? "14px" : "16px"};
        font-weight: 600;
        line-height: 1.4;
      }

      .security-alert-message {
        margin: 0;
        color: ${style.colors?.text};
        font-size: ${this.isMobile ? "12px" : "14px"};
        line-height: 1.6;
      }
    `;
  }

  private generateCloseButtonStyles(): string {
    const { style } = this.config;

    return `
      .security-alert-close {
        flex-shrink: 0;
        background: none;
        border: none;
        cursor: pointer;
        font-size: ${this.isMobile ? "18px" : "20px"};
        color: ${style.colors?.close};
        padding: ${this.isMobile ? "2px" : "4px"};
        line-height: 1;
        transition: color 0.2s;
      }

      .security-alert-close:hover {
        color: ${style.colors?.closeHover};
      }
    `;
  }

  private generateAnimationStyles(): string {
    if (this.isMobile) {
      return `
          @keyframes mobileShake {
              0% { transform: translateY(0); }
              10%, 30%, 50%, 70%, 90% { transform: translateY(-2px); }
              20%, 40%, 60%, 80%, 100% { transform: translateY(2px); }
          }

          .security-alert.show {
              animation: mobileShake 0.5s ease-in-out;
              animation-delay: 300ms;
          }
      `;
    }
    return `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
        20%, 40%, 60%, 80% { transform: translateX(2px); }
      }

      .security-alert.show {
        animation: shake 0.5s ease-in-out;
      }
    `;
  }

  // 显示警告
  showAlert() {
    if (this.isAlertShown || this.isClosedByUser) return;
    const delayTimer = setTimeout(() => {
      if (!this.alertElement) {
        this.alertElement = this.createAlertElement();
        document.body.appendChild(this.alertElement);
        this.alertElement.offsetHeight;
      }

      requestAnimationFrame(() => {
        this.alertElement?.classList.add("show");
        setTimeout(() => {
          this.alertElement?.classList.add("show");
        }, 50); // 添加一个小延迟确保过渡效果生效
      });

      this.isAlertShown = true;
      clearTimeout(delayTimer);
    }, Notifier.SHOW_DELAY);
  }

  // 隐藏警告

  hideAlert() {
    if (this.alertElement) {
      // 添加隐藏动画
      this.alertElement.classList.remove("show");
      this.alertElement.classList.add("hide");

      // 等待动画完成后移除元素
      const removeTimer = setTimeout(() => {
        if (this.alertElement?.parentNode) {
          this.alertElement.parentNode.removeChild(this.alertElement);
          this.alertElement = null;
        }
        clearTimeout(removeTimer);
      }, 300); // 等待时间应与 CSS transition 时间一致

      this.isAlertShown = false;
      this.isClosedByUser = true;

      // 一段时间后重置状态
      const resetTimer = setTimeout(() => {
        this.isClosedByUser = false;
        clearTimeout(resetTimer);
      }, this.config.alert.resetTimeout);
    }
  }

  // 检查是否存在上传元素
  private checkForUploadElements(root = document) {
    return this.config.uploadSelectors.some((selector) => {
      return root.querySelector(selector) !== null;
    });
  }

  // 检查 iframe
  private checkIframes() {
    const iframes = document.getElementsByTagName("iframe");
    Array.from(iframes).forEach((iframe) => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (this.checkForUploadElements(iframeDoc)) {
          this.showAlert();
        }

        // 监听 iframe 内容变化
        const observer = new MutationObserver(() => {
          if (this.checkForUploadElements(iframeDoc)) {
            this.showAlert();
          }
        });
        if (iframeDoc?.body) {
          observer.observe(iframeDoc.body, {
            childList: true,
            subtree: true,
          });
        }
      } catch (e) {
        console.warn("无法访问 iframe 内容:", e);
      }
    });
  }

  // 初始化监听
  public init() {
    // 检查当前页面
    if (this.checkForUploadElements(document)) {
      this.showAlert();
    }

    // 检查 iframe
    this.checkIframes();

    // 监听 DOM 变化
    const observer = new MutationObserver(() => {
      if (this.checkForUploadElements(document)) {
        this.showAlert();
      }
      this.checkIframes();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // 监听动态添加的 iframe
    const iframeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if ((node as HTMLElement).tagName === "IFRAME") {
            this.checkIframes();
          }
        });
      });
    });

    iframeObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // 监听屏幕旋转和窗口大小变化
    window.addEventListener("resize", () => {
      const newIsMobile = this.checkIsMobile();
      if (this.isMobile !== newIsMobile) {
        this.isMobile = newIsMobile;
        // 重新创建警告框以应用新样式
        if (this.isAlertShown) {
          this.hideAlert();
          this.showAlert();
        }
      }
    });
  }
}
const createNotifier = (config?: NotifierConfig) => {
  return Notifier.getInstance(config);
};
export { Notifier, createNotifier };
