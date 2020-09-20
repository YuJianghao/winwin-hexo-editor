# 快速上手

## 在安装之前

### 安装依赖

你需要在你的服务器中安装`Node.js`、`git`、`hexo`。

> **没有Hexo和Node.js经验的同学可以查看[手把手教学](http://blog.yujianghao.cn/2020/03/16/rv13LtBZuoRgOPWy/)**

### 配置hexo博客

你需要在你的服务器上部署你的hexo博客源码并且配置hexo和git的相关命令。

> 本教程中假设你将hexo博客源码部署在了`~/myblog`目录。相应的，hexo配置文件应该在`~/myblog/_config.yml`。

请确保以下命令可以在`~/myblog`路径运行成功：

- `hexo generate`：生成hexo博客
- `hexo deploy`: 生成hexo博客并部署
- `git add . && git commit -m 'server updates'`: 将博客更改添加进git
- `git pull`: 从远端拉取博客内容
- `git push`: 将本地博客内容推送到远端

::: tip 可选配置
如果你不需要使用hexo的部署功能，则`hexo deploy`不用配置。如果你不需要远端的git存储，则`git pull`和`git push`不用配置。
:::

## 安装

### 默认安装

下载源码  

> 本教程假设你将`winwin-hexo-editor`安装在`~/winwin-hexo-editor`目录

```bash
git clone https://github.com/YuJianghao/winwin-hexo-editor
cd winwin-hexo-editor
```

::: warning 安全警告
请不要将博客源码或`winwin-hexo-editor`部署到http服务的网站根目录下，例如`/www`或`/www/wwwroot/`。这很可能会导致一些安全问题。
:::

运行安装程序

```bash
bash ./install.sh
```

开始运行

```bash
# 不使用pm2
npm run start

# 使用pm2
npm run prd
```

<!-- TODO 如何配置pm2 -->

然后用浏览器打开`http://localhost:5777`

::: tip 如果你是windows用户

- 本程序未在windows环境下测试。理论上可以运行。
- 推荐使用WSL，详见[适用于Linux的Windows子系统](https://docs.microsoft.com/zh-cn/windows/wsl/install-win10 )
:::

### 使用自定义服务器

直接使用`http://yourserveripaddress:5777`即可。

### 使用域名

你需要自行配置你的http服务器反向代理。

<!-- TODO: 教学如何配置反向代理 -->

## 更新

```bash
bash ./update.sh
```

更新后你需要手动重启服务

## 卸载

只需要完整删除`winwin-hexo-editor`目录。`winwin-hexo-editor`不会对系统其他文件做任何更改。

## 其他命令

``` bash
# 停止
npm run stop
# 重启
npm run restart

# 开发
npm run dev
```
