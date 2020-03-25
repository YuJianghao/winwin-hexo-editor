# @winwin/hexo-editor

An online hexo blog editor by winwin2011

<img src="https://img.shields.io/github/package-json/v/yujianghao/winwin-hexo-editor?style=flat-square"><br/>

<img src="https://img.shields.io/npm/v/@winwin/hexo-editor-client?label=%40winwin%2Fhexo-editor-client&style=flat-square"><img src="https://img.shields.io/npm/v/@winwin/hexo-editor-server?label=%40winwin%2Fhexo-editor-server&style=flat-square"><img src="https://img.shields.io/npm/v/@winwin/hexo-editor-sdk?label=%40winwin%2Fhexo-editor-sdk&style=flat-square">

## Schreenshots

[Please visit homepage](https://yujianghao.github.io/winwin-hexo-editor/)

![Main page](https://cdn.yujianghao.cn/Zc8QgOwVQQrsmCVp.png)

## Feature

- [x] Post add/delete/update and preview
- [x] Post puiblish/unpublish/drafts
- [x] Markdown editor
- [x] categories
- [x] tags
- [x] git push/reset/pull
- [x] hexo generate/deploy/clean
- [x] Basic authentication
- [ ] front-matters
- [ ] Post sort
- [ ] Search
- [ ] ~~Image CDN~~(use [picgo](https://picgo.github.io/PicGo-Doc/zh/guide/) instead)
- [ ] let me know what you need ...

## Installation

### With localhost

**For bigginers with no background knowledge about Hexo and Node.js, please visit [Hand by hand installation guide](http://blog.yujianghao.cn/2020/03/16/rv13LtBZuoRgOPWy/)**

Download source

```bash
git clone https://github.com/YuJianghao/winwin-hexo-editor
```

Install dependences

```bash
cd winwin-hexo-editor
npm install
```

Setup your hexo blog path in `./env` file

```.env
HEXO_ROOT='' # path to your blog folder
```

Start

```bash
# without pm2
npm run start
# with pm2
npm run prd
# for development
npm run dev
```

Then open `http://localhost:5777` from your browser.

### With custom server address

You need to build your own `@winwin/hexo-editor-client` with server address correctly setup. See build guide in [this repo](https://github.com/YuJianghao/winwin-hexo-editor-client).

If you have questions maybe you can find answers in [How to deploy service with custom server address, instead of localhost?](https://github.com/YuJianghao/winwin-hexo-editor/issues/1) Commet it if no answer found!


## Options

All options are set through `./.env` file, inlcluding `username`, `password` and `HEXO_ROOT`. See .env file for details.

## Update client and server

You can build latest [@winwin/hexo-editor-client](https://github.com/YuJianghao/winwin-hexo-editor-client) yourself and copy distribution files to `./public`.

You can update [@winwin/hexo-editor-server](https://github.com/YuJianghao/winwin-hexo-editor-client) by simply run `npm install @winwin/hexo-editor-server`

## Contribute

All kinds of PR are welcomed, including crazy change!

If this project helped you a bit, please leave a ⭐ with your ❤ :p!

## Acknowledgement

[hexo-client](https://github.com/gaoyoubo/hexo-client) by [gaoyoubo](https://github.com/gaoyoubo), [homepage](https://www.mspring.org/tags/HexoClient/)

[hexo-admin](https://github.com/jaredly/hexo-admin) by [jaredly](https://github.com/jaredly), [homepage](https://jaredforsyth.com/hexo-admin/)

I learnt a lot about hexo usage from them!

[Qusar Login Form Card Component](https://gist.github.com/justinatack/39ec7f37064b2e9fa61fbd450cba3826) by [justinatack](https://gist.github.com/justinatack/)
