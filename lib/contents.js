
import { get } from 'popsicle'

/**
 * Environment variables.
 *
 * @type {String}
 */

const { CONTENTS_COLLECTION } = process.env

/**
 * Fetch all the articles from Contents.
 *
 * @return {Array}
 */

async function getArticles() {
  const url = `https://cdn.contents.io/collections/${CONTENTS_COLLECTION}/items`
  const res = await get(url)
  return res.body
}

/**
 * Export.
 *
 * @type {Object}
 */

export {
  getArticles
}
