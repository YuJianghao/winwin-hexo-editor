# @winwin/hexo-editor

一个在线hexo博客编辑器 | An online hexo blog editor by winwin2011

<img src="https://img.shields.io/github/package-json/v/yujianghao/winwin-hexo-editor?style=flat-square"><br/>

<img src="https://img.shields.io/github/package-json/v/YuJianghao/winwin-hexo-editor-client?label=%40winwin%2Fhexo-editor-client&style=flat-square">

## 截图 | Screenshots

[请访问主页](https://winwin_2011.gitee.io/winwin-hexo-editor/) | [Please visit homepage](https://yujianghao.github.io/winwin-hexo-editor/)

[移动客户端](https://github.com/maomishen/winwin-hexo-editor-mobile) | [Mobile client](https://github.com/maomishen/winwin-hexo-editor-mobile)

![Main page](https://cdn.yujianghao.cn/uploads/2020/08/07/VWUwO3J3_Snipaste_2020-08-07_10-52-08.png)

## 功能 | Feature

- [x] 文章增删改和预览 | Post add/delete/update and preview
- [x] 发布和草稿 | Post puiblish/unpublish/drafts
- [x] Markdown编辑 | Markdown editor
- [x] 分类 | categories
- [x] 标签 | tags
- [x] git同步 | git push/reset/pull
- [x] hexo命令 | hexo generate/deploy/clean
- [x] 登录 | Basic authentication
- [x] 文章排序 | Post sort
- [x] front-matters
- [x] 文章搜索 | Search
- [x] 自定义slug | Custom slug
- [ ] ~~图床Image CDN~~(请使用[cloudreve](https://cloudreve.org/)替代 | use [cloudreve](https://cloudreve.org/) instead)
- [ ] 亲，请告诉我您还需要什么 ~ | let me know what you need ...

## 安装 | Installation

> **没有Hexo和Node.js经验的同学可以查看[手把手教学](http://blog.yujianghao.cn/2020/03/16/rv13LtBZuoRgOPWy/)**
>
> **For bigginers with no background knowledge about Hexo and Node.js, please visit [Hand by hand installation guide](http://blog.yujianghao.cn/2020/03/16/rv13LtBZuoRgOPWy/)**

### 默认安装 | Default installation

下载源码和依赖 | Download source and Dependences

```bash
git clone https://github.com/YuJianghao/winwin-hexo-editor
cd winwin-hexo-editor
yarn
# npm install # 或者使用npm | or use npm
```

> 推荐使用yarn, yarn is recommended for package management

运行安装程序 | Run Installer

```bash
node install.js
```

开始运行 | Start

```bash
# 不使用pm2 | without pm2
npm run start

# 使用pm2 | with pm2
# 开启 | start
npm run prd
# 停止 | stop
npm run stop
# 重启 | restart
npm run restart

# 开发 | for development
npm run dev
```

<!-- TODO 如何配置pm2 -->

然后用浏览器打开`http://localhost:5777` | Then open `http://localhost:5777` from your browser.

> **如果你是windows用户**
>
> - 本程序未在windows环境下测试。理论上可以运行。
> - 推荐使用WSL，详见[适用于Linux的Windows子系统](https://docs.microsoft.com/zh-cn/windows/wsl/install-win10 )

### 使用自定义服务器 | With custom server address

直接使用`http://yourapiaddress:5777`即可。 | Just open `http://yourapiaddress:5777`.

### 使用域名 ｜ With domain

你需要自行配置你的http服务器反向代理。 | You need to configure your HTTP server proxy.

<!-- TODO: 教学如何配置反向代理 -->

## 更新 | Update

```bash
node update.js
```

## 卸载 | Uninstall

只需要完整删除`winwin-hexo-editor`目录。`winwin-hexo-editor`不会对系统其他文件做任何更改。

Just delete entire `winwin-hexo-editor` folder. `winwin-hexo-editor` has never changed other files.

## 支持 | Support

QQ群：590355610

- [Gitee FAQ](https://winwin_2011.gitee.io/winwin-hexo-editor/support/)
- [Gitee Issue](https://gitee.com/winwin_2011/winwin-hexo-editor/issues)
- [Github FAQ](https://yujianghao.github.io/winwin-hexo-editor/support/)
- [Github Issue](https://github.com/YuJianghao/winwin-hexo-editor/issues)

## 贡献 | Contribute

欢迎各种各样的PR（魔改也是可以的！）

All kinds of PR are welcomed, including crazy change!

如果这项目帮到你了，点个爱的五角星呗~

If this project helped you a bit, please leave a ⭐ with your ❤ :p!

## 致谢 | Acknowledgement

感谢和我一起扣代码的[maomishen](https://github.com/maomishen/)小伙伴！

[hexo-client](https://github.com/gaoyoubo/hexo-client) by [gaoyoubo](https://github.com/gaoyoubo), [homepage](https://www.mspring.org/tags/HexoClient/)

[hexo-admin](https://github.com/jaredly/hexo-admin) by [jaredly](https://github.com/jaredly), [homepage](https://jaredforsyth.com/hexo-admin/)

感谢他们教会我怎么使用hexo！| I learnt a lot about hexo usage from them!

[Qusar Login Form Card Component](https://gist.github.com/justinatack/39ec7f37064b2e9fa61fbd450cba3826) by [justinatack](https://gist.github.com/justinatack/)
