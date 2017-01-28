
import Logger from 'koa-logger'
import Serve from 'koa-static'
import Views from 'koa-views'
import Slashes from 'koa-slash'
import convert from 'koa-convert'
import { resolve } from 'path'

/**
 * Log in development.
 *
 * @type {Function}
 */

const logger = process.env.NODE_ENV == 'development'
  ? Logger()
  : async (ctx, next) => next()

/**
 * Serve public files.
 *
 * @type {Function}
 */

const serve = Serve(resolve(__dirname, '../public'), {
  defer: false,
})

/**
 * Ignore trailing slashes.
 *
 * @type {Function}
 */

const slashes = Slashes()

/**
 * Render views.
 *
 * @type {Function}
 */

const views = Views(resolve(__dirname, '../templates'), {
  map: {
    html: 'mustache',
    xml: 'mustache',
  },
})

/**
 * Export.
 *
 * @type {Object}
 */

export {
  logger,
  serve,
  slashes,
  views,
}
