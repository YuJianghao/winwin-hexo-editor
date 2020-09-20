module.exports = {
  title: 'winwin-hexo-editor',
  description: `Let's hexo online!`,
  themeConfig: {
    logo: '/img/hexo-editor-logo.svg',
    nav: [
      { text: '安装指南', link: '/guide' },
      { text: '更新日志', link: '/releasenotes' },
      { text: '支持', link: '/support' },
      { text: 'FAQ', link: '/faq' },
    ],
    sidebar: [
      '/guide',
      '/releasenotes',
      '/support',
      '/faq',
      '/contribute',
      '/acknowledgement',
    ],
    search: false,
    lastUpdated: '最后编辑于',
    smoothScroll: true,
  },
  head:[
    ['link', { rel: 'icon', href: '/img/hexo-editor-logo.svg' }]
  ]
}