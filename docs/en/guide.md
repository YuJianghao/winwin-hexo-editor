# Getting Started

## Installation

> **For bigginers with no background knowledge about Hexo and Node.js, please visit [Hand by hand installation guide](http://blog.yujianghao.cn/2020/03/16/rv13LtBZuoRgOPWy/)**

### Default installation

Download source and Dependences

```bash
git clone https://github.com/YuJianghao/winwin-hexo-editor
cd winwin-hexo-editor
yarn
# npm install # r use npm
```

> `yarn` is recommended for package management

Run Installer

```bash
node install.js
```

Start service

```bash
# without pm2
npm run start

# with pm2
# start
npm run prd
# stop
npm run stop
# restart
npm run restart

# for development
npm run dev
```

<!-- TODO 如何配置pm2 -->

Then open `http://localhost:5777` from your browser.

### With custom server address

Just open `http://yourapiaddress:5777`.

### With domain

You need to configure your HTTP server proxy.

<!-- TODO: 教学如何配置反向代理 -->

## Update

```bash
node update.js
```

## Uninstall

Just delete entire `winwin-hexo-editor` folder. `winwin-hexo-editor` has never changed other files.
