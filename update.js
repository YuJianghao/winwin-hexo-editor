const fs = require('fs')
const chalk = require('chalk')
const packageJson = require('./package.json')
const { Printer, Executer } = require('./scripts/lib')
const logo = fs.readFileSync('./assets/logo.art')
const printer = new Printer()

async function update () {
  // #region LOGO
  printer.log(chalk.blue.bold(logo + chalk.underline('/ winwin-hexo-editor ') + '/'))
  // #endregion

  // #region Version
  printer.printSection('Check Version')
  printer.info('Current Version ' + packageJson.version)
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

  // #region Fetch Updates
  printer.printSection('Fetch Updates')
  try {
    printer.info('Fetching updates')
    await Executer.run('git reset --hard')
    await Executer.run('git submodule foreach \'git reset --hard\'')
    await Executer.run('git pull')
    printer.success('Updated')
  } catch (err) {
    const failed = new Printer('Installation Failed')
    failed.error(err)
    failed.error('error occured when fetching updates')
    process.exit(201)
  }
  // #endregion

  // #region Fetch Submodules
  printer.printSection('Fetch Submodules')
  try {
    printer.info('Fetching submodules updates')
    await Executer.run('git submodule sync')
    await Executer.run('git submodule update --init --recursive')
    printer.success('Submodules updated')
  } catch (err) {
    const failed = new Printer('Installation Failed')
    failed.error(err)
    failed.error('error occured when fetching submodules')
    process.exit(301)
  }
  // #endregion

  // #region Install Dependences
  printer.printSection('Install Dependences')
  const cmd = hasYarn ? 'yarn' : 'npm install'
  try {
    printer.info('Dependences installing')
    await Executer.run(cmd)
    printer.success('Dependences installed')
  } catch (err) {
    const failed = new Printer('Installation Failed')
    failed.error(err)
    failed.error(cmd, 'failed')
    failed.error('error occured when install dependences')
    process.exit(401)
  }
  // #endregion

  // #region Finished
  printer.clear()
  printer.log(chalk.green.bold('Finished!'))
  printer.log('Run ' + chalk.blue.bold('`npm start`') + ' to start with node')
  printer.log('Run ' + chalk.blue.bold('`npm run prd`') + ' to start with pm2')
  printer.log('Run ' + chalk.blue.bold('`npm run stop`') + ' to stop')
  printer.log('Run ' + chalk.blue.bold('`npm run restart`') + ' to restart')
  printer.log()
  printer.log(chalk.green.bold('Remember to restart your service manually!'))
  printer.log('Have fun :p')
  printer.log(chalk.grey('For uninstall:'))
  printer.log(chalk.grey('- Remove the following folder: ' + process.cwd()))
  printer.log(chalk.grey('- Stop youre service manually.'))
  // #endregion
}

update()
