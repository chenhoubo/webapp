## 简介

[webapp](https://github.com/chenhoubo/webapp) 是一个后台管理 spa 页面，它基于 [vue](https://github.com/vuejs/vue) 和 [element-ui](https://github.com/ElemeFE/element) 采用了最新的前端技术栈，实现了登录权限验证，动态路由生成，并自己搭建 [spring boot](https://github.com/chenhoubo/springboot_service) 后台，实现了典型的业务模型案例，它可以帮你快速搭建后台管理系统模板，并根据实际的业务需求添加路由来实现企业级管理页面，相信本项目一定能帮助到你。

- [在线预览-github](https://github.com/chenhoubo/webapp)   （本项目前端）
- [在线预览-gitee](https://github.com/chenhoubo/springboot_service) （本项目后台）

**目前版本基于 `webpack 4.0+` 和 `vue-cli 3.x` 版本构建，需要 [Node.js](https://nodejs.org/) 8.9 或更高版本（推荐 8.11.0+），相关知识可以自行进官网进行了解**

## 快速开始

> 在开始之前，请确保在本地安装 node 和 webpack 及 git。 本项目涉及的技术栈主要有 [ES6](http://es6.ruanyifeng.com/) 、[vue](https://cn.vuejs.org/) 、[vuex](https://vuex.vuejs.org/zh/) 、[vue-router](https://router.vuejs.org/zh/) 、[vue-cli](https://cli.vuejs.org/zh/guide/) 、[axios](http://www.axios-js.com/) 、[webpack](https://www.webpackjs.com/) 、[element-ui](https://element.eleme.io/#/zh-CN) 、[easyMock](https://www.easy-mock.com/) ,所以你最好提前熟悉了解这些知识，这将对你认识学习该项目有很大帮助

详细的项目介绍，可以关注我的的相关文章：

### 安装

```
# 克隆项目
git clone https://github.com/chenhoubo/webapp.git

# 进入项目目录
cd webapp

# 安装依赖
npm install

# 启动服务
npm run serve
```

### 功能

```
- 登录 / 注销
  - 登录仿GeeTest-极验安全策略

- 页面
  - 初次进入引导用户
  - sideBar收缩和展开
  - 全屏控制

- 侧边栏
  - 根据不同用户权限展示相应的动态左侧菜单

- 权限验证
  - 管理员页面
  - 用户页面
  - 访客页面
  - 项目商品、价格、订单列表等等
  - 权限设置

- 表格操作
  - 涉及平常业务遇到的相关表格操作（参考）
- Excel
 - Excel导出
 - Excel导入
 - 多级表头导出

- Echarts
 - 滑动显示更多数据
 - 动态切换charts
 - map地图使用

- Icons
 - element-icon
 - 阿里iconfont
```

## License

1、git add .（文件添加到暂存区）
2、git commit -m ""
3、git pull origin dev
4、git push origin dev


