(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{371:function(t,s,a){"use strict";a.r(s);var e=a(42),v=Object(e.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"快速上手"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#快速上手"}},[t._v("#")]),t._v(" 快速上手")]),t._v(" "),a("h2",{attrs:{id:"在安装之前"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#在安装之前"}},[t._v("#")]),t._v(" 在安装之前")]),t._v(" "),a("h3",{attrs:{id:"安装依赖"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#安装依赖"}},[t._v("#")]),t._v(" 安装依赖")]),t._v(" "),a("p",[t._v("你需要在你的服务器中安装"),a("code",[t._v("Node.js")]),t._v("、"),a("code",[t._v("git")]),t._v("、"),a("code",[t._v("hexo")]),t._v("。")]),t._v(" "),a("blockquote",[a("p",[a("strong",[t._v("没有 Hexo 和 Node.js 经验的同学可以查看"),a("a",{attrs:{href:"https://blog.yujianghao.cn/how-to-build-a-hexo-blog-from-scratch/",target:"_blank",rel:"noopener noreferrer"}},[t._v("手把手教学"),a("OutboundLink")],1)])])]),t._v(" "),a("h3",{attrs:{id:"配置-hexo-博客"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#配置-hexo-博客"}},[t._v("#")]),t._v(" 配置 hexo 博客")]),t._v(" "),a("p",[t._v("你需要在你的服务器上部署你的 hexo 博客源码并且配置 hexo 和 git 的相关命令。")]),t._v(" "),a("blockquote",[a("p",[t._v("本教程中假设你将 hexo 博客源码部署在了"),a("code",[t._v("~/myblog")]),t._v("目录。相应的，hexo 配置文件应该在"),a("code",[t._v("~/myblog/_config.yml")]),t._v("。")])]),t._v(" "),a("p",[t._v("请确保以下命令可以在"),a("code",[t._v("~/myblog")]),t._v("路径运行成功：")]),t._v(" "),a("ul",[a("li",[a("code",[t._v("hexo generate")]),t._v("：生成 hexo 博客")]),t._v(" "),a("li",[a("code",[t._v("hexo deploy")]),t._v(": 生成 hexo 博客并部署")]),t._v(" "),a("li",[a("code",[t._v("git add . -all && git commit -m 'server updates'")]),t._v(": 将博客更改添加进 git")]),t._v(" "),a("li",[a("code",[t._v("git pull")]),t._v(": 从远端拉取博客内容")]),t._v(" "),a("li",[a("code",[t._v("git push")]),t._v(": 将本地博客内容推送到远端")])]),t._v(" "),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[t._v("可选配置")]),t._v(" "),a("p",[t._v("如果你不需要使用 hexo 的部署功能，则"),a("code",[t._v("hexo deploy")]),t._v("不用配置。如果你不需要远端的 git 存储，则"),a("code",[t._v("git pull")]),t._v("和"),a("code",[t._v("git push")]),t._v("不用配置。")])]),t._v(" "),a("h2",{attrs:{id:"安装"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#安装"}},[t._v("#")]),t._v(" 安装")]),t._v(" "),a("h3",{attrs:{id:"默认安装"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#默认安装"}},[t._v("#")]),t._v(" 默认安装")]),t._v(" "),a("p",[t._v("下载源码")]),t._v(" "),a("blockquote",[a("p",[t._v("本教程假设你将"),a("code",[t._v("winwin-hexo-editor")]),t._v("安装在"),a("code",[t._v("~/winwin-hexo-editor")]),t._v("目录")])]),t._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" clone https://github.com/YuJianghao/winwin-hexo-editor\n"),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v("cd")]),t._v(" winwin-hexo-editor\n")])])]),a("div",{staticClass:"custom-block warning"},[a("p",{staticClass:"custom-block-title"},[t._v("安全警告")]),t._v(" "),a("p",[t._v("请不要将博客源码或"),a("code",[t._v("winwin-hexo-editor")]),t._v("部署到 http 服务的网站根目录下，例如"),a("code",[t._v("/www")]),t._v("或"),a("code",[t._v("/www/wwwroot/")]),t._v("。这很可能会导致一些安全问题。")])]),t._v(" "),a("p",[t._v("安装依赖")]),t._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("yarn")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 或者 npm install")]),t._v("\n")])])]),a("p",[t._v("运行安装程序")]),t._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[t._v("node install.js\n")])])]),a("p",[t._v("开始运行")]),t._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 不使用pm2")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("npm")]),t._v(" run start\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 使用pm2")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("npm")]),t._v(" run prd\n")])])]),t._v(" "),a("p",[t._v("然后用浏览器打开"),a("code",[t._v("http://localhost:5777")])]),t._v(" "),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[t._v("如果你是 windows 用户")]),t._v(" "),a("ul",[a("li",[t._v("本程序未在 windows 环境下测试。理论上可以运行。")]),t._v(" "),a("li",[t._v("推荐使用 WSL，详见"),a("a",{attrs:{href:"https://docs.microsoft.com/zh-cn/windows/wsl/install-win10",target:"_blank",rel:"noopener noreferrer"}},[t._v("适用于 Linux 的 Windows 子系统"),a("OutboundLink")],1)])])]),t._v(" "),a("h3",{attrs:{id:"使用自定义服务器"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#使用自定义服务器"}},[t._v("#")]),t._v(" 使用自定义服务器")]),t._v(" "),a("p",[t._v("直接使用"),a("code",[t._v("http://yourserveripaddress:5777")]),t._v("即可。")]),t._v(" "),a("h3",{attrs:{id:"使用域名"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#使用域名"}},[t._v("#")]),t._v(" 使用域名")]),t._v(" "),a("p",[t._v("你需要自行配置你的 http 服务器反向代理。")]),t._v(" "),a("h2",{attrs:{id:"更新"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#更新"}},[t._v("#")]),t._v(" 更新")]),t._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("bash")]),t._v(" update.js\n")])])]),a("p",[t._v("更新后你需要手动重启服务")]),t._v(" "),a("h2",{attrs:{id:"卸载"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#卸载"}},[t._v("#")]),t._v(" 卸载")]),t._v(" "),a("p",[t._v("只需要完整删除"),a("code",[t._v("winwin-hexo-editor")]),t._v("目录。"),a("code",[t._v("winwin-hexo-editor")]),t._v("不会对系统其他文件做任何更改。")]),t._v(" "),a("h2",{attrs:{id:"其他命令"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#其他命令"}},[t._v("#")]),t._v(" 其他命令")]),t._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 停止")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("npm")]),t._v(" run stop\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 重启")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("npm")]),t._v(" run restart\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 开发")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("npm")]),t._v(" run dev\n")])])])])}),[],!1,null,null,null);s.default=v.exports}}]);