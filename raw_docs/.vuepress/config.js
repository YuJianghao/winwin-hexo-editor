module.exports = {
  base:'/winwin-hexo-editor/',
  title:'winwin-hexo-editor',
  dest:'docs',
  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      { text: '指导', link: '/guide/' }
    ],
    sidebar: [
      '/guide/',
    ],
    sidebarDepth:3,
    search:false
  }
}