
import Season from 'date-season'
import gravatar from 'gravatar'
import moment from 'moment'
import toExcerpt from 'excerpt-html'
import { clone } from 'lodash'

/**
 * Environment variables.
 *
 * @type {String}
 */

const {
  AUTHOR_BIO,
  AUTHOR_EMAIL,
  AUTHOR_NAME,
  AUTHOR_TWITTER,
} = process.env

/**
 * Create a helper to get the season name from a date.
 *
 * @type {Function}
 */

const toSeason = Season({ north: true })

/**
 * Group a series of `articles` by publish date into seasons.
 *
 * @param {Array} articles
 * @return {Array}
 */

function bySeasons(articles) {
  let previousName
  let seasons = []

  for (const article of articles) {
    const year = new Date(article.published_at).getFullYear()
    const season = toSeason(article.published_at)
    const name = `${season} ${year}`

    if (name != previousName) {
      seasons.push({
        name,
        articles: []
      })
    }

    const last = seasons[seasons.length - 1]
    last.articles.push(article)
    previousName = name
  }

  return seasons
}

/**
 * Format an article with templatable properties.
 *
 * @param {Object} article
 * @return {Object}
 */

function formatArticle(article, options = {}) {
  const ret = clone(article)
  if (options.date !== false) ret.properties.date = getDate(article)
  if (options.excerpt !== false) ret.properties.excerpt = getExcerpt(article)
  if (options.title !== false) ret.properties.name = getName(article)
  return ret
}

/**
 * Get the author information from the environment.
 *
 * @return {Object}
 */

function getAuthor() {
  return {
    bio: AUTHOR_BIO,
    email: AUTHOR_EMAIL,
    gravatar: gravatar.url(AUTHOR_EMAIL, { size: '200' }),
    name: AUTHOR_NAME,
    twitter: AUTHOR_TWITTER,
  }
}

/**
 * Get a readable date to an `article.`
 *
 * @param {Object} article
 * @return {String}
 */

function getDate(article) {
  const publishedAt = moment(article.published_at)
  const date = publishedAt.format('MMMM D, YYYY')
  return date
}

/**
 * Get an excerpt from an `article`.
 *
 * @param {Object} article
 * @return {String}
 */

function getExcerpt(article) {
  // about 4 lines of text long at maximum
  let excerpt = toExcerpt(article.properties.body, {
    pruneLength: 320,
  })

  // handle the excerpt ending in weird characters
  excerpt = excerpt.replace(/(:)$/, '…')
  return excerpt
}

/**
 * Get the name of an article, replacing the last space character with a
 * non-breaking space to prevent widows, if there are any spaces.
 *
 * @param {Object} article
 * @return {String}
 */

function getName(article) {
  const { title } = article.properties
  const last = title.lastIndexOf(' ')
  if (!~last) return title
  const replaced = title.substr(0, last) + '&nbsp;' + title.substr(last + 1)
  return replaced
}

/**
 * Export.
 *
 * @type {Object}
 */

export {
  bySeasons,
  formatArticle,
  getAuthor,
}
