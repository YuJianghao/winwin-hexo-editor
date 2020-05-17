# FAQ

## 升级失败 ｜ Update fail

大部分升级失败可以通过`git reset --hard && git pull && node ./install.js`解决

Most of it can be solved by running `git reset --hard && git pull && node ./install.js`

## 部署失败 ｜ Deploy fail

**为什么我不能部署博客？503错误？**

Hexo-editor仅仅帮你运行`hexo deploy`和`git pull/push`，以此来完成部署和同步工作，你需要自行配置这几个命令。以下是操作和命令的对照表

部署：`hexo g -d`

同步到git：`git add . && git commit && git push`

**Why I can't deploy my hexo blog? / Why 503 error?**

Hexo-editor help you configure neither `hexo deploy` command nor `git pull/push` nor any other CI command.You need to configure them manually.

Hexo-editor simply run `hexo g -d` for deploy button, `git reset && git pull` for git sync button and `git add . && git commit && git push` for git save button!