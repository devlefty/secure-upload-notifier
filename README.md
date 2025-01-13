# README.md

# Secure Upload Notifier

`Secure Upload Notifier` 是一个用于上传文件时发送通知的 npm 包。该项目主要使用 TypeScript 和 Rollup 构建，旨在提供一个简单而有效的方式来通知用户上传文件的成功或失败。

## 功能

- 初始化上传通知功能
- 发送上传成功或失败的通知
- 验证上传文件的有效性

## 安装

使用 npm 安装：

```bash
npm install secure-upload-notifier
```

## 使用

```typescript
import { Notifier } from 'secure-upload-notifier';

// 初始化通知器
const notifier = new Notifier();

// 发送通知
notifier.sendNotification('文件上传成功！');
```

## 贡献

欢迎提交问题和拉取请求！请确保在提交之前检查现有的问题和请求。

## 许可证

该项目使用 MIT 许可证。有关更多信息，请参阅 LICENSE 文件。