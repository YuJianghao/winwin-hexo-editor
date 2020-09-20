# Getting Started

## Before Installation

### Dependences

- `Node.js`
- `hexo`
- `git`

> **For bigginers with no background knowledge about Hexo and Node.js, please visit [Hand by hand installation guide](http://blog.yujianghao.cn/2020/03/16/rv13LtBZuoRgOPWy/)**

### Configurate hexo blog

You need to clone your hexo blog source code on your server and configure `hexo` and `git` commands.

> In this tutorial, we assume that you have cloned the hexo blog source code into `~/myblog`. Correspondingly, the hexo configuration file should be in `~/myblog/_config.yml`.

Please make sure that the following commands can run successfully in the path `~/myblog`:

- `hexo generate`: Generate hexo blog
- `hexo deploy`: Generate hexo blog and deploy
- `git add. && git commit -m'server updates'`: add blog changes to git
- `git pull`: pull blog content from remote
- `git push`: push local blog content to remote

::: tip Optional configuration
If you do not need the deploy method from hexo, `hexo deploy` is unnecessary. If you don't need remote git storage, `git pull` and `git push` are unnecessary.
:::

## Installation

### Default installation

Download source code

> We assumes that you will install `winwin-hexo-editor` in `~/winwin-hexo-editor`.
> 
```bash
git clone https://github.com/YuJianghao/winwin-hexo-editor
cd winwin-hexo-editor
```

::: warning Security warning
Please do not deploy the blog source code or `winwin-hexo-editor` to websites' root directories, such as `/www` or `/www/wwwroot/`. This will cause security issues.
:::

Run Installer

```bash
bash ./install.sh
```

Start service

```bash
# without pm2
npm run start

# with pm2
npm run prd
```

<!-- TODO 如何配置pm2 -->

Then open `http://localhost:5777` from your browser.

### With custom server address

Just open `http://yourserveripaddress:5777`.

### With domain

You need to configure your HTTP server proxy.

<!-- TODO: 教学如何配置反向代理 -->

## Update

```bash
bash ./update.sh
```

Remember to restart your service manually after update.

## Uninstall

Just delete entire `winwin-hexo-editor` folder. `winwin-hexo-editor` has never changed other files.

## Other commands

```bash
# stop
npm run stop
# restart
npm run restart

# for development
npm run dev
```
