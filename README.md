# README.md

# Secure Upload Notifier

`Secure Upload Notifier` 是一个用于上传文件时发送通知的 npm 包。该项目主要使用 TypeScript 和 Rollup 构建，旨在提供一个简单而有效的方式来提醒用户上传文件的注意事项。

## 功能

- 自动检测页面是否有上传元素
- 自动触发上传文件时的安全警告
- 支持自定义安全警告的内容和样式

## 安装

使用 yarn / pnpm 安装：

```bash
# yarn
yarn add @digital-rd/secure-upload-notifier
```

```bash
# pnpm
pnpm add @digital-rd/secure-upload-notifier
```

## 使用

```typescript
import { Notifier,  createNotifier, NotifierConfig } from 'secure-upload-notifier';

// 初始化通知器
const notifier = new createNotifier();
notifier.init()

// 自定义配置
const notifierConfig: NotifierConfig = { ... }
notifier.init(notifierConfig)
```

默认配置

```javascript
const defaultConfig = {
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
  uploadSelectors: [".el-upload", 'input[type="file"]', ".ant-upload", ".van-uploader"],
};
```
