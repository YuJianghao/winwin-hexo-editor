const chalk = require('chalk')
const cp = require('child_process')

exports.Printer = class Printer {
  constructor (prefix) {
    this.prefix = prefix
  }

  printSection (name) {
    console.log()
    console.log(chalk.blue.bold('⚙ ' + name))
    console.log()
  }

  log () {
    console.log(...arguments)
  }

  printEmptyLine () {
    console.log()
  }

  success () {
    console.log(chalk.green(`[${this.prefix || 'SUCCESS'}]`), ...arguments)
  }

  info () {
    console.log(chalk.blue(`[${this.prefix || 'INFO'}]`), ...arguments)
  }

  warn () {
    console.log(chalk.yellow(`[${this.prefix || 'WARN'}]`), ...arguments)
  }

  error () {
    console.log(chalk.red(`[${this.prefix || 'ERROR'}]`), ...arguments)
  }

  clear () {
    console.clear(...arguments)
  }
}

class Executer {
  static setLog (log) {
    this.log = !!log
  }

  static run (command) {
    if (Executer.log) console.log(chalk.blue.bold('executer >'), command)

    return new Promise((resolve, reject) => {
      cp.exec(command, { log: Executer.log, cwd: process.cwd(0) }, (err, stdout, stderr) => {
        if (err) {
          err.stdout = stdout
          err.stderr = stderr
          reject(err)
          return
        }

        resolve(stdout)
      })
    })
  }

  static async hasCommand (cmd) {
    try {
      return !!await Executer.run('command -v ' + cmd)
    } catch (err) {
      return false
    }
  }
}
Executer.log = false
exports.Executer = Executer
