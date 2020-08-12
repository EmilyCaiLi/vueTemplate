<template>
  <div class="home-wrap ">
    <header-bar
      v-if="hasTitle"
      class="Header_cover"
      :custom-title="specificTitle"
      :menus="menuShareInfo"
    >
      <!-- 自定义返回箭头及其事件（默认< 历史回退） -->
      <!-- <span slot="customerArrowEvent" @click="functionname">···</span> -->
      <!-- 自定义menu及其事件（默认三个点） -->
      <!-- <span slot="customerMenu" @click="functionname">···</span> -->
    </header-bar>
    <section class="content" ref="app_content">
      <div class="inner_cover">
        <div>首页内容</div>
      </div>
    </section>
    <footer-bar :footer-content="footers" v-if="hasFooter">
      <span>what</span>
    </footer-bar>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import HeaderBar from '../../components/header'
import FooterBar from '../../components/footer'
import { share } from '../../assets/js/share'
import { hideWxMenu } from '../../assets/js/util'
export default {
  name: 'app',
  data () {
    return {
      hasTitle: false,
      hasFooter: true,
      contentHeight: 1,
      specificTitle: document.title,
      menuShareInfo: [
        {
          'showButton': true, // 缺省后默认为 true
          'shareType': 'onShareMenuFriend', // 分享类型 必传
          'shareLink': location.href, // 分享地址
          'title': document.title, // 分享标题
          'desc': document.title, // 分享朋友圈标题或描述
          'timelineDesc': document.title, // 分享朋友圈标题或描述
          'shareParams': { // 分享携带参数
            test1: '1234',
            test2: '23e43'
          },
          'shareImageUrl': 'http://isales.life.taikang.com/static/assets/images/shareImgs/share.png', // 分享图片的URL
          'shareIntroduce': document.title, // 分享简介
          'callBack': function (info) { // 分享成功或失败后回调方法
            console.log(info)
          }
        },
        {
          'showButton': true, // 缺省后默认为 true
          'shareType': 'onShareMenuTimeline', // 分享类型 必传
          'shareLink': location.href, // 分享地址
          'timelineDesc': document.title, // 分享朋友圈标题或描述
          'shareImageUrl': 'http://isales.life.taikang.com/static/assets/images/shareImgs/share.png', // 分享图片的URL
          'shareIntroduce': document.title, // 分享简介
          'callBack': function (info) { // 分享成功或失败后回调方法
            console.log(info)
          }
        }
      ]
    }
  },
  components: {
    HeaderBar,
    FooterBar
  },
  created () {
    this.hasTitle = this.GLOBAL.hasTitle
    if (!this.hasTitle && !/isales/.test(navigator.userAgent.toLowerCase())) {
      hideWxMenu()
    }
    this.GLOBAL.hasFooter = this.hasFooter
  },
  mounted () {
    // this.contentHeight =
    //   document.documentElement.clientHeight -
    //   this.$refs['app_content'].getBoundingClientRect().top
    // 自定义菜单出现时容器的top值自动切换
    this.$refs['app_content'].style.cssText = `position:${this.GLOBAL.hasTitle ? 'absolute' : 'relative'};
    padding-bottom:${this.hasFooter ? '44px' : 0};
    min-height:calc(100% - 40px);top:${this.GLOBAL.hasTitle ? '44px' : 0};`
  },
  methods: {
    share () {
      share({
        // 微信分享
        wechatShare: {
          share: true,
          shareFriend: true,
          shareTimeline: false,
          menuList: ['menuItem:share:appMessage']
        },
        // 泰行销分享
        isalesShare: {
          share: true, // 是否执行分享
          shareName: 'shareFromNative', // 分享方法名
          menuList: ['onShareMenuFriend', 'onShareMenuTimeline']
        },
        title: '测试分享标题', // 分享标题
        desc: '测试分享描述', // 分享描述
        timelineDesc: '测试分享朋友圈', // 预留分享朋友圈定制文案
        shareParamName: {}, // 分享参数指定
        shareImageURL:
          'https://planbook.taikang.com/planbook/xfnj/plan/config/shareImage/share.jpg', // 分享图片地址
        shareLink: location.href, // 分享链接
        blankPathConfig: '', // 为微信预留空链接
        callBack: function (res) {
          console.log(res)
        } // 回调
      })
    }
  }
}
</script>

<style scoped lang="stylus">
.home-wrap {
  pointer-events: visible;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;

  .content {
    position: absolute;
    width: 100%;
    overflow-y: scroll;
  }

  .inner_cover {
    width: 100%;
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
