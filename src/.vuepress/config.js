module.exports = {
  base:'/winwin-hexo-editor/',
  locales: {
    // 键名是该语言所属的子路径
    // 作为特例，默认语言可以使用 '/' 作为其路径。
    '/': {
      lang: 'zh-CN', // 将会被设置为 <html> 的 lang 属性
      title: 'winwin-hexo-editor',
      description: '来一起在线编辑hexo博客！'
    },
    '/en/': {
      lang: 'en-US',
      title: 'winwin-hexo-editor',
      description: `Let's hexo online!`
    }
  },
  themeConfig: {
    locales:{
      '/':{
        // 多语言下拉菜单的标题
        selectText: '选择语言',
        // 该语言在下拉菜单中的标签
        label: '简体中文',
        nav: [
          { text: '快速上手', link: '/guide', areaLabel: 'guide' },
          { text: '更新日志', link: '/releasenotes', areaLabel: 'releasenotes' },
          { text: '支持', link: '/support', areaLabel: 'support' },
          { text: 'FAQ', link: '/faq', areaLabel: 'faq' },
        ],
        sidebar: [
          '/guide',
          '/preview',
          '/releasenotes',
          '/support',
          '/faq',
          '/contribute',
          '/acknowledgement',
        ],
        lastUpdated: '最后编辑于',
      },
      '/en/':{
        // 多语言下拉菜单的标题
        selectText: 'Language',
        // 该语言在下拉菜单中的标签
        label: 'English',
        nav: [
          { text: 'Guide', link: '/en/guide', areaLabel: 'guide' },
          { text: 'Releasenotes', link: '/en/releasenotes', areaLabel: 'releasenotes' },
          { text: 'Support', link: '/en/support', areaLabel: 'support' },
          { text: 'FAQ', link: '/en/faq', areaLabel: 'faq' },
        ],
        sidebar: [
          '/en/guide',
          '/en/releasenotes',
          '/en/support',
          '/en/faq',
          '/en/contribute',
          '/en/acknowledgement',
        ],
        lastUpdated: 'Last Updated',
      }
    },
    logo: '/img/hexo-editor-logo.svg',
    search: false,
    smoothScroll: true,
  },
  head:[
    ['link', { rel: 'icon', href: '/img/hexo-editor-logo.svg' }]
  ]
}