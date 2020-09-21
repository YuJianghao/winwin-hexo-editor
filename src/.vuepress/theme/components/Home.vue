<template>
  <div class="home">
    <div class="section welcome" :class="{hide:hideWelcome}" v-rellax="{speed:-7}">
      <div class="background"></div>
      <div class="cube" v-rellax="{speed:-10}"></div>
      <a href='https://gitee.com/winwin_2011/winwin-hexo-editor' class="gitee-corner">
        <img src='https://gitee.com/nobodyknowme/FloatWindowDemo/widgets/widget_1.svg?color=4172cf' alt='Fork me on Gitee'></img>
      </a>
      <img class="screen" src="/img/screen.png" alt="">
      <div class="container">
        <div class="content">
          <h2 class="title">
            <div v-if="!Array.isArray(frontmatter.welcome.title)">{{frontmatter.welcome.title}}</div>
            <template v-else>
              <div v-for="line in frontmatter.welcome.title">{{line}}</div>
            </template>
          </h2>
          <div class="subtitle">{{frontmatter.welcome.subtitle}}</div>
          <router-link class="action" :to="frontmatter.welcome.actionLink">{{frontmatter.welcome.actionText}}</router-link>
        </div>
      </div>
    </div>
    <div class="section intro">
      <div class="container">
        <h2 class="title"
          data-aos-once="true"
          data-aos="fade-in"
          data-aos-duration="500"
        >{{frontmatter.intro.title}}</h2>
        <div class="item-list">
          <div class="item"
            data-aos-once="true"
            data-aos="fade-left"
            data-aos-duration="500"
            data-aos-delay="150"
          >
            <img src="/img/edit.png" alt="编辑">
            <div class="desc">{{frontmatter.intro.edit}}</div>
          </div>
          <div class="item"
            data-aos-once="true"
            data-aos="fade-left"
            data-aos-duration="500"
            data-aos-delay="300"
          >
            <img src="/img/organize.png" alt="整理">
            <div class="desc">{{frontmatter.intro.organize}}</div>
          </div>
          <div class="item"
            data-aos-once="true"
            data-aos="fade-left"
            data-aos-duration="500"
            data-aos-delay="450"
          >
            <img src="/img/deploy.png" alt="发布">
            <div class="desc">{{frontmatter.intro.deploy}}</div>
          </div>
          <div class="item"
            data-aos-once="true"
            data-aos="fade-left"
            data-aos-duration="500"
            data-aos-delay="600"
          >
            <img src="/img/storage.png" alt="存储">
            <div class="desc">{{frontmatter.intro.storage}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="section screen">
      <div class="container" id="screen-parallax-container">
        <div id="screen-parallax-content" :style="`transform: translateY(${position}px)`">
          <img src="/img/screen.png" alt="">
        </div>
      </div>
    </div>
    <div class="section feature">
      <div class="container">
        <ul>
          <li
            data-aos-offset="100"
            data-aos-once="true"
            data-aos="fade-right"
            data-aos-duration="500"
            :data-aos-delay="50*idx"
            v-for="(item, idx) in frontmatter.features"
            :key="item"
            >{{item}}</li>
        </ul>
      </div>
    </div>
    <div class="section install">
      <div class="container">
        <pre>&gt; echo "Four more lines to install ..."</pre>
        <pre>&gt; git clone https://github.com/YuJianghao/winwin-hexo-editor</pre>
        <pre>&gt; cd winwin-hexo-editor</pre>
        <pre>&gt; bash install.sh</pre>
        <pre>&gt; npm run start</pre>
        <p>{{frontmatter.install.text}}
          <router-link :to="frontmatter.install.linkUrl">■{{frontmatter.install.linkText}}</router-link>
          </p>
      </div>
    </div>
    <div class="footer">
      <div>{{frontmatter.footer}}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Home",
  data(){
    return {
      position: 0,
      hideWelcome: false
    }
  },
  computed:{
    frontmatter(){
      return Object.assign({
        welcome:{
          title:['在自己的服务器上搭建','Hexo博客编辑器'],
          subtitle: '或者仅在本地运行',
          actionText: '现在开始',
          actionLink: '/guide/'
        },
        intro:{
          title:'在一个地方在线完成所有Hexo任务',
          edit:'编辑',
          organize:'整理',
          deploy:'发布',
          storage:'存储',
        },
        features:[
          '文章增删改、发布和取消',
          'Markdown自动补全',
          '多级分类和多标签',
          'front-matters',
          'git push/reset/pull',
          'Hexo generate/deploy/clean',
          '有限hexo page支持',
          '和其他你需要但我没想到的内容',
        ],
        install:{
          text: '或查看',
          linkText: '安装指南',
          linkUrl: '/guide/'
        }
      },this.$page.frontmatter)
    }
  },
  methods:{
    handleScroll(){
      const screenHeight = window.innerHeight
      const container = document.getElementById('screen-parallax-container')
      const containerTop = container.getBoundingClientRect().top
      const containerHeight = container.clientHeight
      const content = document.getElementById('screen-parallax-content')
      const contentHeight = content.clientHeight
      this.hideWelcome = containerTop < 0
      const x1 = screenHeight
      const y1 = -contentHeight
      const x2 = -containerHeight
      const y2 = containerHeight
      const k = (y2-y1)/(x2-x1)
      const b = (y1*x2-y2*x1)/(x2-x1)
      this.position = k*containerTop + b
    }
  },
  mounted(){
    window.addEventListener("scroll", this.handleScroll)
  },
  beforeDestroy(){
    window.removeEventListener("scroll", this.handleScroll)
  }
}
</script>
<style lang="stylus">

.gitee-corner
  position absolute
  left 0
  transform rotate(-90deg)
.section
  z-index 2
  position relative
  overflow hidden
  .container
    max-width 1100px
    margin 0 auto
    padding 0 20px
  h2
    border-bottom none
.section.welcome
  width 100vw
  height 100vh
  background-color white
  .background
    position absolute
    width 100%
    height 100%
    background-image url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAkSURBVDhPY/hPLmAAAiiTdDCqmUQwqplEMKqZRDCwmskHDAwA/U03AqHQYqoAAAAASUVORK5CYII=')
    opacity 0.05
  .cube
    position absolute
    top 0
    right 0
    left 50%
    height 60vh
    background #4172cf
    opacity 0.7
  img.screen
    position absolute
    top 25vh
    left 55%
    max-width 70vw
    box-shadow 0 0 5px grey
  .container
    height 100%
    display flex
    flex-direction column
    justify-content center
    position relative
  .title
    color #4172cf
    font-size 36px
    font-weight normal
    line-height 48px
    letter-spacing 1px
    margin 0
  .subtitle
    margin-top 10px
    font-weight bold
    color: #737F8C
    font-size 24px
    letter-spacing 1px
    margin-bottom 20px
  .action
    background-color #4172cf
    color white
    padding 10px 20px
    font-size 20px
    transition all 0.3s
    &:hover
      padding-left 30px
      padding-right 30px
    &:after
      content " →"
.section.intro
  background #4172cf
  padding 70px 0
  z-index 2
  .title
    color #f5f5f5
    text-align center
    font-size 36px
    font-weight normal
    line-height 48px
    letter-spacing 1px
    margin 0
  .item-list
    margin-top 70px
    display flex
    justify-content space-between
  .item
    padding 10px
    display flex
    flex-direction column
    align-items center
    img
      width 75px
      margin-bottom 30px
    .desc
      text-align center
      width 120px
      display inline-block
      padding 7px 40px
      margin-top 30px
      background #f5f5f5
      color #4172cf
      font-size 18px
      font-weight bolder
      text-decoration none
      letter-spacing 1px
.section.screen
  background #d8d8d8
  .container
    height 100vh
    z-index 1
    img
      max-width 100%
      box-shadow 0 0 5px grey
.section.feature
  height 500px
  background #4172cf
  margin-bottom 100vh
  .container
    height 100%
    display flex
    align-items center
  ul
    color #f5f5f5
    flex 1
    line-height 1.5
    font-size 18px
    list-style square
.section.install
  width 100%
  background rgb(65, 74, 83)
  display flex
  align-items center
  position fixed
  top 0
  bottom 40px
  z-index 1
  pre
    font-family 'Courier New', Courier, monospace
    color #f5f5f5
    font-weight bold
    ::selection
      background #f5f5f5
      color rgb(42, 45, 48)
  p
    padding 5px 20px
    color #737F8C
    background #f5f5f5
    font-weight bolder
    a
      text-decoration underline
      color #737F8C
      background #f5f5f5
.footer
  height 40px
  line-height 40px
  text-align center
  z-index 0
  width 100%
  background #f5f5f5
  color #737F8C
  position fixed
  bottom 0
.hide
  z-index 1 
</style>