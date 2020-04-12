const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer')
const config = require('./src/loadConfig')
const { exec } = require('child_process')
const logger = require('debug')('hexo-editor:installer')

logger('start')
inquirer
  .prompt([{
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
  },
  {
    type: 'bool',
    name: 'update',
    default: false
  }
  ])
  .then(answers => {
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
    logger('formatting user.config.js')
    p.on('close', () => {
      console.log(chalk.green.bold('Install finished!'))
      console.log('You can modify your config by editing ' + chalk.blue.bold('config.user.js'))
      console.log('Run ' + chalk.blue.bold('`npm run prd`') + ' to start')
      console.log('Run ' + chalk.blue.bold('`pm2 stop hexoeditor`') + ' to stop')
      console.log('Run ' + chalk.blue.bold('`pm2 restart hexoeditor`') + ' to restart')
      console.log('Have fun :p')
      console.log(chalk.grey('NOTE. If you want to change your hexo-editor server address, you need to run this installer again.'))
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
