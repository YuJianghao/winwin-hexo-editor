# 快速上手 | Getting Started

## 安装 | Installation

::: tip 提示
**没有Hexo和Node.js经验的同学可以查看[手把手教学](http://blog.yujianghao.cn/2020/03/16/rv13LtBZuoRgOPWy/)**
:::

::: tip TIP
**For bigginers with no background knowledge about Hexo and Node.js, please visit [Hand by hand installation guide](http://blog.yujianghao.cn/2020/03/16/rv13LtBZuoRgOPWy/)**
:::

### 默认安装 | Default installation

下载源码 | Download source

```bash
git clone https://github.com/YuJianghao/winwin-hexo-editor
```

安装依赖 | Install dependences

```bash
cd winwin-hexo-editor
npm install
```

运行安装程序 | Run Installer

```bash
node ./install.js
```

> 可以使用默认值 | You can use default settings.

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

### 自定义服务器 | Custom Server

运行安装程序 | Run Installer

```bash
node ./install.js
```

在安装程序中指定`Your hexo-editor server address?`为你的服务器地址，一般类似`http://blabla.com`。Set `Your hexo-editor server address?` to your server address like `http://blabla.com`.

## 选项 | Options

所有选项都通过安装程序设定 | All options are set through installer.

```js
module.exports = {
  port: 5777,
  hexoServerAddress: 'http://localhost:5777',
  hexoRoot: '',         // 博客文件夹目录 | hexo blog folder path
  jwtSecret: 'secret',  // 密钥 | secret
  jwtExpire: '1h',      // 操作过期时间 | access expire time
  jwtRefresh: '7d',     // 登录过期时间 | login expire time
  username: 'admin',
  password: 'admin'
}
```

## 更新 | Update


运行安装程序 | Run Installer

```bash
node ./install.js
```

在第一步中指定需要更新 | Set update to yes at very first step

```bash
installer > Update hexo-editor? Yes
```

在安装程序结束后重启 | Restart after finishing install

```bash
pm2 restart hexoeditor
```

## 支持 | Support

[Gitee Wiki](https://gitee.com/winwin_2011/winwin-hexo-editor/wikis/pages)

[Github Wiki](https://github.com/YuJianghao/winwin-hexo-editor/wiki#faq)

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
