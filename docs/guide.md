# 快速上手

## 安装

> **没有Hexo和Node.js经验的同学可以查看[手把手教学](http://blog.yujianghao.cn/2020/03/16/rv13LtBZuoRgOPWy/)**

### 默认安装

下载源码和依赖

```bash
git clone https://github.com/YuJianghao/winwin-hexo-editor
cd winwin-hexo-editor
yarn
# npm install # 或者使用npm
```

> 推荐使用yarn

运行安装程序

```bash
node install.js
```

开始运行

```bash
# 不使用pm2
npm run start

# 使用pm2
# 开启
npm run prd
# 停止
npm run stop
# 重启
npm run restart

# 开发
npm run dev
```

<!-- TODO 如何配置pm2 -->

然后用浏览器打开`http://localhost:5777`

> **如果你是windows用户**
>
> - 本程序未在windows环境下测试。理论上可以运行。
> - 推荐使用WSL，详见[适用于Linux的Windows子系统](https://docs.microsoft.com/zh-cn/windows/wsl/install-win10 )

### 使用自定义服务器

直接使用`http://yourapiaddress:5777`即可。

### 使用域名

你需要自行配置你的http服务器反向代理。

<!-- TODO: 教学如何配置反向代理 -->

## 更新

```bash
node update.js
```

## 卸载

只需要完整删除`winwin-hexo-editor`目录。`winwin-hexo-editor`不会对系统其他文件做任何更改。
