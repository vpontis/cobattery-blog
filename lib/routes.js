
import Router from 'koa-router'
import { getArticles } from './contents'
import { bySeasons, formatArticle, getAuthor, render } from './utils'

/**
 * Environment variables.
 *
 * @type {String}
 */

const {
  MAX_AGE,
  SEGMENT_WRITE_KEY: segment
} = process.env

/**
 * Cache control header.
 *
 * @type {String}
 */

const CACHE_CONTROL = `public, max-age=${MAX_AGE}, s-maxage=${MAX_AGE}`

/**
 * Router.
 *
 * @type {Router}
 */

const router = new Router()

/**
 * Author.
 *
 * @type {Object}
 */

const author = getAuthor()

/**
 * Set cache control settings on all routes.
 *
 * @param {Object} ctx
 * @param {Function} next
 */

router.use(async (ctx, next) => {
  ctx.set('Cache-Control', CACHE_CONTROL)
  return next()
})

/**
 * RSS route.
 *
 * @param {Object} ctx
 */

router.get('/atom.xml', async (ctx) => {
  const raws = await getArticles()
  const articles = raws.map(article => formatArticle(article, { title: false }))

  await ctx.render('atom.xml', {
    articles,
    author,
    date: new Date().toISOString(),
    origin: ctx.request.origin,
  })

  ctx.type = 'application/xml'
})

/**
 * Index route.
 *
 * @param {Object} ctx
 */

router.get('/', async (ctx) => {
  const raws = await getArticles()
  const articles = raws.map(formatArticle)

  await ctx.render('index.html', {
    author,
    seasons: bySeasons(articles),
    segment,
  })
})

/**
 * Article route.
 *
 * @param {Object} ctx
 * @param {Function} next
 */

router.get('/:slug', async (ctx, next) => {
  const { slug } = ctx.params
  const raws = await getArticles()
  const articles = raws.map(formatArticle)
  const article = articles.find(article => article.properties.slug == slug)
  const index = articles.indexOf(article)

  if (!article) return next()

  await ctx.render('article.html', {
    article,
    author,
    next: articles[index - 1],
    previous: articles[index + 1],
    segment,
  })
})

/**
 * 404 route.
 *
 * @param {Object} ctx
 */

router.use(async (ctx) => {
  await ctx.render('404.html', {
    author,
    segment,
  })
})

/**
 * Export.
 *
 * @type {Function}
 */

export default router.routes()
