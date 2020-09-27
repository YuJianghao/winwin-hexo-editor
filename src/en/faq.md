# FAQ

## Update fail

Most of it can be solved by running `git reset --hard && git pull && bash install.sh`. If failed, try reinstall.

## Deploy fail

**Why I can't deploy my hexo blog? / Why 503 error?**

Hexo-editor help you configure neither hexo command nor git nor any other CI command.You need to configure them manually. Here's the map:

- `hexo g -d` for deploy button
- `hexo clearn` for clean button
- `hexo g` for generate button
- `git reset && git pull` for git sync button
- `git add . --all && git commit && git push` for git save button!

## Load fail

**Why 404 error?**

Just refresh page. It's because of the outdated data.
