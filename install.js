const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer')
const git = require('simple-git/promise')(process.cwd())
const config = require('./src/loadConfig')
const { exec } = require('child_process')
const logger = require('debug')('hexo-editor:installer')

console.clear()
console.log(chalk.blue.bold(
  fs.readFileSync(
    require('path').join(__dirname, './assets/logo.art'),
    'utf8'
  )) + chalk.blue.bold.underline('/ WINWIN HEXO EDITOR ') +
  chalk.blue.bold('/\n'))
inquirer
  .prompt([
    {
      type: 'confirm',
      name: 'update',
      message: 'Update hexo-editor?',
      default: false
    },
    {
      name: 'hexoRoot',
      message: 'What\'s your hexo blog path? ' + chalk.blue('The same path as your hexo _config.yml file\n'),
      prefix: chalk.blue('?'),
      default: config.hexoRoot,
      validate (v) {
        return checkIsBlog(v)
      }
    }, {
      name: 'port',
      message: 'Which port do you like your hexo-editor running at?',
      default: config.port || 5777,
      validate (v) {
        return !isNaN(v) || `number is required ${typeof v} given`
      },
      prefix: chalk.blue('?')
    },
    {
      name: 'hexoServerAddress',
      message: 'Your hexo-editor server address?',
      default: config.hexoServerAddress || 'http://localhost:5777',
      prefix: chalk.blue('?')
    },
    {
      name: 'jwtSecret',
      message: 'Secret Key?' + chalk.blue('Like a password, can be anything you like.'),
      default: config.jwtSecret || 'secret',
      prefix: chalk.blue('?')
    },
    {
      name: 'jwtExpire',
      message: 'Access token expire time ' + chalk.blue('Eg: "2 days", "10h", "7d" '),
      default: config.jwtExpire || '1h',
      prefix: chalk.blue('?')
    },
    {
      name: 'jwtRefresh',
      message: 'Refresh token expire time ' + chalk.blue('Eg: "2 days", "10h", "7d" '),
      default: config.jwtRefresh || '7d',
      prefix: chalk.blue('?')
    },
    {
      name: 'username',
      default: config.username || 'admin',
      prefix: chalk.blue('?')
    },
    {
      type: 'password',
      name: 'password',
      message: 'password ' +
     chalk.blue('default `' + config.password || 'admin' + '`'),
      default: config.password || 'admin',
      mask: '*',
      prefix: chalk.blue('?')
    }
  ])
  .then(answers => {
    console.clear()
    logger('answers: %O', answers)
    const userConfig = {}
    const userConfigPath = './config.user.js'
    Object.keys(config).map(key => {
      userConfig[key] = answers[key]
    })
    if (fs.existsSync(userConfigPath)) {
      fs.unlinkSync(userConfigPath)
    }
    fs.writeFileSync(userConfigPath, 'module.exports =' + JSON.stringify(userConfig).replace(',', ',\n'))
    const p = exec('npx eslint config.user.js --fix')
    console.clear()
    console.log(chalk.blue.bold('Saving settings'))
    p.on('close', async () => {
      try {
        await git.reset('hard')
        if (answers.update) {
          console.log(chalk.blue.bold('Fetching updates'))
          try {
            await git.pull()
          } catch (_) {
            await git.pull('gitee', 'master')
          }
        }
        console.log(chalk.blue.bold('Installing...'))
        await replace(path.join(process.cwd(), 'public'),
          /http:\/\/localhost:5777/g,
          answers.hexoServerAddress)
        console.clear()
        console.log(chalk.green.bold('Finished!'))
        console.log('You can modify your config by editing ' + chalk.blue.bold('config.user.js'))
        console.log('Run ' + chalk.blue.bold('`npm run prd`') + ' to start')
        console.log('Run ' + chalk.blue.bold('`pm2 stop hexoeditor`') + ' to stop')
        console.log('Run ' + chalk.blue.bold('`pm2 restart hexoeditor`') + ' to restart')
        console.log('Have fun :p')
        console.log(chalk.grey('NOTE. If you want to change your hexo-editor server address, you need to run this installer again.'))
      } catch (err) {
        console.error(chalk.bgRed.white.bold('Install failed'))
        console.error(err)
      }
    })
  })
  .catch(error => {
    if (error.isTtyError) {
      console.log(chalk.redBright(error))
      // Prompt couldn't be rendered in the current environment
    } else {
      console.log(chalk.redBright(error))
      // Something else when wrong
    }
  })

async function replace (file, src, dest) {
  const data = await fs.promises.readdir(file)
  await data.forEach(async item => {
    const itemPath = path.join(file, item)
    let isDir = await fs.promises.lstat(itemPath)
    isDir = isDir.isDirectory()
    if (isDir) {
      logger('dir:', itemPath)
      await replace(itemPath, src, dest)
    } else {
      const content = await fs.promises.readFile(itemPath, 'utf-8')
      const newContent = content.replace(src, dest)
      if (newContent !== content) {
        logger('file:', itemPath)
        await fs.promises.writeFile(itemPath, newContent)
      }
    }
  })
}

function checkIsBlog (blog) {
  const message = `Path \`${blog}\` isn't a hexo blog folder!`
  try {
    const file = fs.readFileSync(path.join(blog, 'package.json'))
    const packageJSON = JSON.parse(file)
    if (!packageJSON.dependencies.hexo) return message
    fs.readFileSync(path.join(blog, '_config.yml'))
    return true
  } catch (err) {
    if (err.code === 'ENOENT') {
      return message
    }
    return err.message
  }
}
