
import Koa from 'koa'
import routes from './routes'
import { logger, serve, slashes, views } from './middleware'

/**
 * Environment variables.
 *
 * @type {String}
 */

const { PORT } = process.env

/**
 * App.
 *
 * @type {Koa}
 */

const app = new Koa()
  .use(logger)
  .use(views)
  .use(serve)
  .use(slashes)
  .use(routes)

/**
 * Listen.
 */

app.listen(PORT, () => {
  console.log(`
    Listening at http://localhost:${PORT} ...
  `)
})
