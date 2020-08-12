<template>
  <header class="header_bar" :style="styleSheet">
    <span class="same left_arrow">
      <slot name="customerArrowEvent">
        <span @click.stop.prevent="backEvent" @touchend.stop.prevent="backEvent">
          <i class="fa fa-angle-left fa-lg"></i>
        </span>
      </slot>
    </span>
    <span class="same header_title">{{customTitle}}</span>
    <span class="same right_menu">
      <slot name="customerMenu">
        <span @click.stop.prevent="switchMenu" @touchend.stop.prevent="switchMenu">···</span>
      </slot>
    </span>
    <template>
      <section class="menu_operator">
        <div
          class="menu_mask"
          @click.stop.prevent="switchMenu"
          @touchend.stop.prevent="switchMenu"
          v-show="showMenu"
        ></div>
        <input
          type="text"
          v-show="showMenu"
          ref="copyInput"
          v-model="copyedLink"
          style="position:absolute;bottom:0;font-size:20px;border:none;background:none;left:200%"
        />
        <div class="operator_cover" :class="showMenu? ' operator_cover_transform' :''">
          <div class="menu_footer">
            <template  v-for="(item, index) in menuList">
              <div
                class="menu_items first_menu"
                :key="index"
                v-if="(shareInfo[item.name] && shareInfo[item.name].showButton) ? shareInfo[item.name].showButton : true"
                @click.stop.prevent="item.fn ? menuEventAgent(item.fn): defaultShareFn(item)"
                @touchend.stop.prevent="item.fn ? menuEventAgent(item.fn) : defaultShareFn(item)"
              >
                <img :src="item.url" alt class="menu_icon" />
                <span class="desc">{{item.desc}}</span>
              </div>
            </template>

            <div style="height:1px;width:100%;background:#cccccc;" v-if="menuList.length>0"></div>
            <template v-for="(item) in commonMenuList">
              <div
                class="menu_items"
                v-if="item.name !=='copyLink' ? true : showCopyLink ? true : false"
                :key="item.name"
                @click.stop.prevent="item.fn ? menuEventAgent(item.fn): defaultShareFn(item)"
                @touchend.stop.prevent="item.fn ? menuEventAgent(item.fn) : defaultShareFn(item)"
              >
                <img :src="item.url" alt class="menu_icon" />
                <span class="desc">{{item.desc}}</span>
              </div>
            </template>
          </div>
        </div>
      </section>
    </template>
  </header>
</template>
<script>
import { interactWithApp, copymsg } from '../assets/js/util'
import { share } from '../assets/js/share'
import { setTimeout } from 'timers'
export default {
  name: 'header-bar',
  props: {
    menus: {
      type: Array,
      default: () => {
        return []
      }
    },
    styleSheet: {
      type: Object,
      default: () => {
        return {
          background: '#ff5722',
          color: '#fff'
        }
      }
    },
    customTitle: {
      type: String,
      default: () => {
        return document.title || 'default title'
      }
    },
    extendMenuList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data: function () {
    return {
      showMenu: false,
      showCopyLink: process.env.VUE_APP_ENV !== 'production',
      copyedLink: '',
      commonMenuList: [
        {
          name: 'copyLink',
          url:
            'https://f.taikang.com/static/assets/images/menuIcon/copyLink.png',
          desc: '复制链接',
          fn: () => {
            copymsg(this.$refs.copyInput)
          }
        },
        {
          name: 'refresh',
          url:
            'https://f.taikang.com/static/assets/images/menuIcon/refresh.png',
          desc: '刷新',
          fn: () => {
            setTimeout(() => {
              window.location.reload()
            }, 400)
          }
        }
      ],
      menuList: [
        {
          name: 'onShareMenuFriend',
          url: 'https://f.taikang.com/static/assets/images/menuIcon/friend.png',
          desc: '分享朋友',
          fn: () => {
            this.shareAgent({
              shareType: 'onShareMenuFriend'
            })
          }
        },
        {
          name: 'onShareMenuTimeline',
          url:
            'https://f.taikang.com/static/assets/images/menuIcon/timeLine.png',
          desc: '分享朋友圈',
          fn: () => {
            this.shareAgent({
              shareType: 'onShareMenuTimeline'
            })
          }
        }
      ],
      shareInfo: {}
    }
  },
  computed: {},
  methods: {
    shareAgent (opt) {
      !opt && (opt = {})
      this.shareInfo[opt.shareType] && (opt = this.shareInfo[opt.shareType])
      if (!opt.otherType) {
        share({
          isalesShare: {
            share: true,
            shareName: 'shareByNative',
            menuList: [opt.shareType]
          },
          title: opt.title || document.title,
          desc: opt.desc || document.title,
          shareLink: opt.shareLink || location.href,
          shareImageURL:
            opt.shareImageURL ||
            'http://isales.life.taikang.com/static/assets/images/shareImgs/share.png',
          timelineDesc: opt.timelineDesc || document.title, // 预留分享朋友圈定制文案
          shareParams: opt.shareParams, // 分享参数指定
          callBack: opt.callBack || function () {} // 分享成功或失败后回调方法
        })
      }
      // interactWithApp('',opt)
    },
    switchMenu () {
      this.showMenu = !this.showMenu
    },
    defaultShareFn (item) {
      share({
        isalesShare: {
          share: true,
          shareName: 'shareByNative',
          menuList: [item.name]
        },
        title: document.title,
        desc: document.title,
        shareLink: location.href
      })
    },
    backEvent () {
      this.switchMenu()
      if (this.customerBackEvent) {
        this.$emit('backEventUp')
      } else {
        let result = window.history.go(-1)
        if (!result) {
          try {
            interactWithApp('closeByNative')
          } catch (error) {
            console.log(error)
          }
        }
      }
    },
    menuEventAgent (fn) {
      this.switchMenu()
      typeof fn === 'function' && fn()
    },
    processShareInfo () {
      this.menus
        .filter((val, index, arr) => {
          !val.showButton && (val.showButton = true)
          return val.shareType !== '' && val.shareType !== undefined && val.showButton
        })
        .map((item, ind, arrs) => {
          this.shareInfo[item.shareType] = item
        })
      this.filterMenuList()
    },
    processExtendMenu () {
      let tempML = this.extendMenuList.filter((val, index, arr) => {
        return val.name && val.url && val.desc && val.fn
      })
      tempML.length > 0 && this.menuList.push(...tempML)
      this.filterMenuList()
    },
    filterMenuList () {
      this.menuList = this.menuList.filter((val, index, arr) => {
        return this.shareInfo[val.name].showButton
      })
    }
  },
  created () {
    this.copyedLink = window.location.href
    this.GLOBAL.hasTitle = !!/hasTitle=y/.test(location.href) && !/micromessenger/.test(navigator.userAgent.toLowerCase())
    if (document.getElementById('fontAwesomeCss')) {
      return
    }
    let linkDom = document.createElement('link')
    linkDom.id = 'fontAwesomeCss'
    linkDom.href = '//netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
    linkDom.rel = 'stylesheet'
    document.head.insertBefore(linkDom, document.getElementsByTagName('title')[0])
  },
  mounted () {
    this.processShareInfo()
    this.processExtendMenu()
    if (!/isales/.test(navigator.userAgent.toLowerCase())) {
      this.menuList = []
    }
  },
  watch: {
    'this.menus' (old, newValue) {
      if (newValue.length === 0) {
        this.menus = []
        this.shareInfo = {}
        this.processShareInfo()
      } else {
        this.processShareInfo()
      }
    },
    'this.$route' () {
      this.menus = []
      this.shareInfo = {}
      this.processShareInfo()
    }
  }
}
</script>
<style scoped lang="stylus">
.header_bar {
  font-size: 0;
  height: 88px;
  width: 100%;
  line-height: 88px;
  position fixed
  top 0
  left 0
  right 0
  z-index 9999
  .same {
    font-size: 40px;
    display: inline-block;
    vertical-align: middle;
    height: 100%;
    box-sizing: border-box;
  }

  .left_arrow {
    width: 10%;
    font-size: 42px;
  }

  .header_title {
    width: 80%;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 32px;
    font-weight: 480;
  }

  .right_menu {
    width: 10%;
    text-align: right;
    padding-right: 20px;
    font-weight: bolder;
    font-size: xx-large;
  }

  .menu_operator {
  }

  .menu_mask {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: calc(100% - 88px);
    background: rgba(0, 0, 0, 0.3);
    z-index: 1000;
    transition: all 0.5s;
  }

  .operator_cover {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 1009;
    line-height: 1;
    transition: transform 0.4s;
    transform: translateY(100%);

    .menu_footer {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      // position absolute
      // top 0
      // left 0
      width: 100%;
      height: auto;
      line-height: 1;
      z-index: 1000;
      background: #ffffff;
      overflow-x: scroll;
      --webkit-overflow-scrolling: touch;
      text-align: left;
      padding: 2% 5%;

      .menu_items {
        display: inline-block;
        width: 120px;
        vertical-align: top;
        box-sizing: border-box;
        margin-bottom: 10px;
        margin-right: 20px;

        .menu_icon {
          display: block;
          width: 72%;
          margin: 0 auto;
          margin-top: 20px;
          box-sizing: border-box;
          margin-bottom: 16px;
        }

        .desc {
          font-size: 18px;
          color: #999;
          display: block;
          text-align: center;
          line-height: 1;
        }
      }

      .first_menu {
        margin-bottom: 20px;
      }
    }
  }

  .operator_cover_transform {
    transform: translateY(0%);
  }
}
</style>
