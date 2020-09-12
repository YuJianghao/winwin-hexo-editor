const fs = require('fs')
const chalk = require('chalk')
const inquirer = require('inquirer')
const packageJson = require('./package.json')
const { Printer, Executer } = require('./scripts/lib')
const logo = fs.readFileSync('./assets/logo.art')
const config = require('./config.default')
const printer = new Printer()

async function install () {
  // #region LOGO
  printer.log(chalk.blue.bold(logo + chalk.underline('/ winwin-hexo-editor ') + '/'))
  // #endregion

  // #region Version
  printer.printSection('Check Version')
  printer.info('Version ' + packageJson.version)
  if (packageJson.version.indexOf('-') >= 0) {
    printer.warn('This is a preview version!')
  }
  // #endregion

  // #region  Check Dependences
  printer.printSection('Check Dependences')

  const NODE = 'node'
  const hasNode = await Executer.hasCommand(NODE)
  if (!hasNode) {
    printer.error('Node is required! Please install node.js first')
    process.exit(101)
  } else {
    printer.info(`${NODE} : ${chalk.green('pass')}`)
  }

  const NPM = 'npm'
  const hasNPM = await Executer.hasCommand(NPM)
  if (!hasNPM) {
    printer.error('npm not found, is there anything wrong with your node installation?')
    process.exit(102)
  } else {
    printer.info(`${NPM} : ${chalk.green('pass')}`)
  }

  const YARN = 'yarn'
  const hasYarn = await Executer.hasCommand(YARN)
  if (!hasYarn) {
    printer.info(`${NODE} : ${chalk.red('pass')}`)
    printer.warn('yarn not found, use npm instead.')
  } else {
    printer.info(`${YARN} : ${chalk.green('pass')}`)
  }
  // #endregion

  // #region Fetch Submodules
  printer.printSection('Fetch Submodules')
  try {
    printer.info('Fetching submodules updates')
    await Executer.run('git submodule update --init --recursive')
    printer.success('Submodules updated')
  } catch (err) {
    const failed = new Printer('Installation Failed')
    failed.error(err)
    failed.error('error occured when fetching submodules')
    process.exit(201)
  }
  // #endregion

  // #region Install Dependences
  printer.printSection('Install Dependences')
  let cmd = 'yarn'
  if (fs.existsSync('./package-lock.json') || !hasYarn) {
    if (hasYarn) {
      printer.info('package-lock.json found, use npm')
    }
    cmd = 'npm install'
  }
  try {
    printer.info('Dependences installing')
    await Executer.run(cmd)
    printer.success('Dependences installed')
  } catch (err) {
    const failed = new Printer('Installation Failed')
    failed.error(err)
    failed.error(cmd, 'failed')
    failed.error('error occured when install dependences')
    process.exit(301)
  }
  // #endregion

  // #region Configuation
  printer.printSection('Configuation')
  const answer = await inquirer
    .prompt([{
      name: 'port',
      message: 'Which port do you like your hexo-editor running at?',
      default: config.port || 5777,
      validate (v) {
        return !isNaN(v) || `number is required ${typeof v} given`
      },
      prefix: chalk.blue('?')
    }])
  fs.writeFileSync('./config.user.js', `module.exports = {\n  port: ${answer.port}\n}\n`)
  // #endregion

  // #region Finished
  printer.clear()
  printer.log(chalk.green.bold('Finished!'))
  printer.log('Run ' + chalk.blue.bold('`npm start`') + ' to start with node')
  printer.log('Run ' + chalk.blue.bold('`npm run prd`') + ' to start with pm2')
  printer.log('Run ' + chalk.blue.bold('`npm run stop`') + ' to stop')
  printer.log('Run ' + chalk.blue.bold('`npm run restart`') + ' to restart')
  printer.log()
  printer.log(chalk.green.bold('Remember to finish the following steps:'))
  printer.log(chalk.blue.bold(' 1. (Re)Start your service manually!'))
  printer.log(chalk.blue.bold(' 2. Finish installation via your browser'))
  printer.log('Have fun :p')
  printer.log(chalk.grey('For uninstall:'))
  printer.log(chalk.grey('- Remove the following folder: ' + process.cwd()))
  printer.log(chalk.grey('- Stop youre service manually.'))
  // #endregion
}

install()
