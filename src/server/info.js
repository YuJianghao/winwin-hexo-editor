const restrictedKeys = {
  post: [
    '_id',
    'title',
    'date',
    'updated',
    'comments',
    'layout',
    '_content',
    'source',
    'slug',
    'photos',
    'link',
    'raw',
    'published',
    'content',
    'excerpt',
    'more',
    'tags',
    'category',
    'categories'
  ],
  page: [
    'title',
    'date',
    'updated',
    'comments',
    'layout',
    '_content',
    'source',
    'path',
    'raw',
    'content',
    'excerpt'
  ]
}

module.exports = {
  restrictedKeys
}
