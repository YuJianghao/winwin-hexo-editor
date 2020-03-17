# @winwin/hexo-editor

An online hexo blog editor. 

See also [hexo-editor-client](https://github.com/YuJianghao/winwin-hexo-editor-client), [hexo-editor-server](https://github.com/YuJianghao/winwin-hexo-editor-server) and [hexo-editor-sdk](https://github.com/YuJianghao/winwin-hexo-editor-sdk).

## Feature

- [x] Post editing and preview
- [x] Drafts support
- [x] Categories and tags support
- [x] Publish/Unpublish post
- [x] Deploy blog
- [x] Git push and pull
- [x] Markdown editor
- [ ] Front-matter support
- [ ] Post sort
- [ ] ~~Image CDN support~~(use [picgo](https://picgo.github.io/PicGo-Doc/zh/guide/) instead)
- [ ] let me know what you need ...

## Installation

Download project

```bash
git clone https://github.com/YuJianghao/winwin-hexo-editor
```

Install dependence

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

Server will listen to `http://localhost:5777` by default.

## Update client and server

You can build latest @winwin/hexo-editor-client yourself and copy distribution files to `./public`. Read more at [hexo-editor-client](https://github.com/YuJianghao/winwin-hexo-editor-client)

You can update @winwin/hexo-editor-server by simply run `npm install`

## Contribute

All kinds of PR are welcomed, including crazy change!

If this project help you a bit, please leave a ⭐ with your ❤ :p!