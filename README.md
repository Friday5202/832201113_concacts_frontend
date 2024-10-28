
# 微信小程序前端

## 项目简介
本项目是一个基于微信小程序的应用，旨在提供一个可以添加、修改、删除和搜索联系人的通讯录，同时可以对保存的联系人进行排序。

## 技术栈
- 微信小程序
- WXML
- WXSS
- JavaScript

## 目录结构
├── /pages # 页面目录
│ ├── /index # 首页
│ └── /... # 其他页面
├── /components # 共享组件
├── /utils # 工具函数
├── app.js # 应用入口文件
├── app.json # 应用配置文件
├── app.wxss # 全局样式文件

## 安装与运行
1. 先确保安装了 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。
2. 下载本项目源代码。
3. 在微信开发者工具中，选择“新建小程序”，将代码目录指向本项目目录。
4. 点击“预览”按钮即可在微信开发者工具中运行。

## 代码规范
- 使用 [ESLint](https://eslint.org/) 进行代码检查。
- 遵循 [小程序开发最佳实践](https://developers.weixin.qq.com/miniprogram/dev/framework/)。

## 注意事项
- 请确保你已在小程序后台完成相应的配置，例如：接口域名、合法域名等。
- 相关接口调用请根据后端提供的 API 文档进行。
