# @winwin/hexo-editor

一个在线hexo博客编辑器 | An online hexo blog editor by winwin2011

<img src="https://img.shields.io/github/package-json/v/yujianghao/winwin-hexo-editor?style=flat-square"><br/>

<img src="https://img.shields.io/npm/v/@winwin/hexo-editor-client?label=%40winwin%2Fhexo-editor-client&style=flat-square"><img src="https://img.shields.io/npm/v/@winwin/hexo-editor-server?label=%40winwin%2Fhexo-editor-server&style=flat-square"><img src="https://img.shields.io/npm/v/@winwin/hexo-editor-sdk?label=%40winwin%2Fhexo-editor-sdk&style=flat-square">

## 截图 | Schreenshots

[请访问主页](https://winwin_2011.gitee.io/winwin-hexo-editor/) | [Please visit homepage](https://yujianghao.github.io/winwin-hexo-editor/)

![Main page](https://cdn.yujianghao.cn/Zc8QgOwVQQrsmCVp.png)

## 功能 | Feature

- [x] 文章增删改和预览 | Post add/delete/update and preview
- [x] 发布和草稿 | Post puiblish/unpublish/drafts
- [x] Markdown编辑 | Markdown editor
- [x] 分类 | categories
- [x] 标签 | tags
- [x] git同步 | git push/reset/pull
- [x] hexo命令 | hexo generate/deploy/clean
- [x] 登录 | Basic authentication
- [ ] front-matters
- [ ] 文章排序 | Post sort
- [ ] 文章搜索 | Search
- [ ] ~~图床Image CDN~~(请使用[picgo](https://picgo.github.io/PicGo-Doc/zh/guide/)替代 | use [picgo](https://picgo.github.io/PicGo-Doc/zh/guide/) instead)
- [ ] 亲，请告诉我您还需要什么 ~ | let me know what you need ...

## 安装 | Installation

### 本地使用 | With localhost

**没有Hexo和Node.js经验的同学可以查看[手把手教学](http://blog.yujianghao.cn/2020/03/16/rv13LtBZuoRgOPWy/)**

**For bigginers with no background knowledge about Hexo and Node.js, please visit [Hand by hand installation guide](http://blog.yujianghao.cn/2020/03/16/rv13LtBZuoRgOPWy/)**

下载源码 | Download source

```bash
git clone https://github.com/YuJianghao/winwin-hexo-editor
```

安装依赖 | Install dependences

```bash
cd winwin-hexo-editor
npm install
```

在`./env`文件中设置你的hexo目录 | Setup your hexo blog path in `./env` file

```.env
HEXO_ROOT='' # path to your blog folder
```

开始运行 | Start

```bash
# 不适用pm2 | without pm2
npm run start

# 使用pm2 | with pm2
# 开启 | start
npm run prd
# 停止 | stop
npm run stop

# 开发 | for development
npm run dev
```

然后用浏览器打开`http://localhost:5777` | Then open `http://localhost:5777` from your browser.

### 使用自定义服务器 | With custom server address

> 临时解决方案：首先完成本地运行所需的所有步骤。然后在`./public`路径下将每一个文件的`http://localhost:5777`替换为你自己的服务地址（服务地址的结构应该看起来和`http://blabla.com`差不多）
>
> Temporary solution: First finish every step as Use With Localhost required. Then, in every files at `./public` : replace every `http://localhost:5777` with your server address like `http://blabla.com`

You need to build your own `@winwin/hexo-editor-client` with server address correctly setup. See build guide in [this repo](https://github.com/YuJianghao/winwin-hexo-editor-client).

If you have questions maybe you can find answers in [How to deploy service with custom server address, instead of localhost?](https://github.com/YuJianghao/winwin-hexo-editor/issues/1) Commet it if no answer found!


## 选项 | Options

所有选项都通过`./.env`文件设定，包括`username`, `password` 和 `HEXO_ROOT`。详细说明请查看`./.env`文件

All options are set through `./.env` file, inlcluding `username`, `password` and `HEXO_ROOT`. See .env file for details.

## 更新客户端和服务器 | Update client and server

根据[@winwin/hexo-editor-client](https://github.com/YuJianghao/winwin-hexo-editor-client)自行构建最新版的客户端然后将分发分拣拷贝到`./public`目录下

You can build latest [@winwin/hexo-editor-client](https://github.com/YuJianghao/winwin-hexo-editor-client) yourself and copy distribution files to `./public`.

运行`npm install @winwin/hexo-editor-server`来更新[@winwin/hexo-editor-server](https://github.com/YuJianghao/winwin-hexo-editor-client)

You can update [@winwin/hexo-editor-server](https://github.com/YuJianghao/winwin-hexo-editor-client) by simply run `npm install @winwin/hexo-editor-server`

## 贡献 | Contribute

欢迎各种各样的PR（魔改也是可以的！）| All kinds of PR are welcomed, including crazy change!

如果这项目帮到你了，点个爱的五角星呗~

If this project helped you a bit, please leave a ⭐ with your ❤ :p!

## 致谢 | Acknowledgement

[hexo-client](https://github.com/gaoyoubo/hexo-client) by [gaoyoubo](https://github.com/gaoyoubo), [homepage](https://www.mspring.org/tags/HexoClient/)

[hexo-admin](https://github.com/jaredly/hexo-admin) by [jaredly](https://github.com/jaredly), [homepage](https://jaredforsyth.com/hexo-admin/)

感谢他们教会我怎么使用hexo！| I learnt a lot about hexo usage from them!

[Qusar Login Form Card Component](https://gist.github.com/justinatack/39ec7f37064b2e9fa61fbd450cba3826) by [justinatack](https://gist.github.com/justinatack/)
