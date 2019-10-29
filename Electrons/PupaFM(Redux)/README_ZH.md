## PupaFM

![screen](./screen.png)

[douban.fm](https://douban.fm) 桌面客户端。

[![Build Status](https://travis-ci.org/xwartz/PupaFM.svg?branch=master)](https://travis-ci.org/xwartz/PupaFM)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
[![Dependency Status](https://david-dm.org/xwartz/PupaFM.svg?style=flat-square)](https://david-dm.org/xwartz/PupaFM)
[![MIT Licensed](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)](https://opensource.org/licenses/MIT)

[English](./README.md)

## 用到的一些技术

![based on](./erb-logo.png)

1. 跨平台工具: [Electron](http://electron.atom.io/)

2. 打包工具: [Webpack](http://webpack.github.io/docs/), [Babel](https://babeljs.io), [electron-builder](https://github.com/electron-userland/electron-builder)

3. 编写语言: [ES2015](https://babeljs.io/docs/learn-es2015/), [Sass](http://sass-lang.com/)

4. 使用的框架(库): [React](https://facebook.github.io/react/), [Redux](https://github.com/reactjs/redux),
[React Router](https://github.com/reactjs/react-router),
[React Hot Loader](https://github.com/gaearon/react-hot-loader),
[Redux Thunk](https://github.com/gaearon/redux-thunk)

5. 代码静态检测: [ESLint](http://eslint.org/)

## 下载最新版本
[Releases](https://github.com/xwartz/PupaFM/releases)

## 开发

![based on](./dev.png)

### 配合使用 Redux DevTools

redux-devtools 主题 [redux-devtools-dock-monitor](https://github.com/gaearon/redux-devtools-dock-monitor).

快捷键：
> ctrl + h: 显示/隐藏
> ctrl + q: 切换显示位置

### 本地开发

首先克隆这个仓库:

```bash
git clone git@github.com:xwartz/PupaFM.git
```

安装模块依赖，推荐使用淘宝镜像 `cnpm`

```bash
$ cd PupaFM && npm i
```

### 本地跑起服务

```bash
$ npm run hot-server
$ npm run hot-start
```

或者使用 `pm2` 更方便，监控 `webpack`等配置文件的修改，自动重启。`pm2` 的配置文件可查看 [eco.json](./eco.json)

```bash
$ npm start
$ npm stop
$ npm restart
```

## 打包

```bash
$ npm run compile
$ npm run pack
```

或者执行

```bash
$ npm run package
```

## 打包成可安装的版本

默认打包当前开发环境的版本

```bash
$ npm run builder
```

Windows x64版本

```bash
$ npm run builder:win
```

Linux 版本

```bash
$ npm run builder:linux
```

具体其他平台的打包可以查看文档[electron-builder](https://github.com/electron-userland/electron-builder/wiki/Multi-Platform-Build)

## 注意

打包之前最好先查看下这个文档[electron-builder docs](https://github.com/electron-userland/electron-builder#readme)

还有了解下 [Code Signing](https://github.com/electron-userland/electron-builder#code-signing)

## 跪求贡献代码

请遵循这个编码风格 [code style](./.eslintrc.js)

```bash
$ npm install
# install pre-commit lint hook
$ npm run install-hook
```

## License
MIT © [xwartz](https://github.com/xwartz)
