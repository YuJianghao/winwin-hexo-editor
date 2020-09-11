const controllers = require('./controllers')
const Router = require('koa-router')
const router = new Router()

router.prefix('settings')

router.post('/install', controllers.install)
