module.exports = {
  base:'/winwin-hexo-editor/',
  title:'winwin-hexo-editor',
  dest:'../docs',
  themeConfig: {
    nav: [
      { text: '快速上手', link: '/guide/' },
      { text: '更新日志', link: '/releasenotes/' },
      { text: 'FAQ', link: '/support/' }

    ],
    sidebar: [
      '/guide/',
      '/releasenotes/',
      '/support/',
    ],
    sidebarDepth:3,
    search:false
  }
}