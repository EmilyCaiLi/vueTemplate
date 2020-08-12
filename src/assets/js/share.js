// const wx = require('weixin-js-sdk')
import { base64, interactWithApp, isPlatform, hideWxMenu } from './util'
import flyio from 'flyio'
let wx = require('weixin-js-sdk')
let isIsales = isPlatform('isales')
let isWechat = isPlatform('microMessenger')
let baseOpt = {
  env: {
    'appId': 'wx90b252e89d5742e3',
    'debug': true,
    'host': 'http://wxpt-t.taikang.com'
  },
  pro: {
    'appId': 'wx2f763d09aa9ca523',
    'debug': false,
    'host': 'http://wxpt.taikang.com'
  }
}
let [tkWxHost, hosts, yourUrlByEncode, thebase] = [{}, window.location.origin, '', base64()]
tkWxHost = /(uat)/ig.test(hosts) || /localhost/ig.test(hosts) ? baseOpt.env : baseOpt.pro
/**
 * 微信配置初始化
 * @param {Object} data 微信签名
 * @param {Object} opt 分享配置自定义信息
 */
export function wxInit (data, opt) {
  let defaultParam = {
    // 微信分享
    wechatShare: {
      debug: opt.wechatShare ? opt.wechatShare.debug || false : false,
      share: opt.wechatShare ? opt.wechatShare.share || false : false,
      shareFriend: opt.wechatShare ? opt.wechatShare.shareFriend || false : false,
      shareTimeline: opt.wechatShare ? opt.wechatShare.shareTimeline || false : false,
      menuList: opt.wechatShare ? opt.wechatShare.menuList || [] : [] // ['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:favorite']
    },
    // 泰行销分享
    isalesShare: {
      share: opt.isalesShare ? opt.isalesShare.share || false : false, // 是否执行分享
      shareName: opt.isalesShare ? opt.isalesShare.shareName || [] : [], // ['shareFromNative'], // 分享方法名
      menuList: opt.isalesShare ? opt.isalesShare.menuList || [] : [] // || ['onShareMenuFriend', 'onShareMenuTimeline']
    },
    title: opt.title || '未定义分享标题', // 分享标题
    desc: opt.desc || '未定义分享描述', // 分享描述
    timelineDesc: opt.timelineDesc || '未定义分享朋友圈文案', // 预留分享朋友圈定制文案
    shareParams: opt.shareParams || {}, // 分享参数指定
    shareImageURL: opt.shareImageURL || 'http://isales.life.taikang.com/static/assets/images/shareImgs/share.png', // 分享图片地址
    shareLink: opt.shareLink || window.location.href, // 分享链接
    shareOAuthLink: opt.shareOAuthLink || false, // 是否使用oauth链接，值为false时为普通链接，拿不到openId
    shareOAuthLink2: opt.shareOAuthLink2 || false, // 高级授权oauth 可获取用户名等，需用户点击确认授权
    blankPathConfig: opt.blankPathConfig || 'http://isales.life.taikang.com/static/shareJumpPage/blank.html', // 为微信预留空链接
    callBack: opt.callBack || function () {
      console.log('no callback fn')
    }
  }
  // opt = { ...defaultParam, opt }
  opt = defaultParam
  // 如果微信和泰行销都不执行分享就终止
  if (!opt.wechatShare.share && !opt.isalesShare.share) {
    hideWxMenu()
    return
  }
  let paramLink = ''
  // if (opt.shareParamName && opt.shareParamName.length > 0) {
  //   // for (var i = 0; i < opt.shareParamName.length; i++) {
  //   //   let reg = /[(一-龥)]+/
  //   //   if (reg.test(window[opt.shareParamName[i]])) {
  //   //     window[opt.shareParamName[i]] = encodeURIComponent(window[opt.shareParamName[i]])
  //   //   }
  //   //   if (/\?/.test(paramLink)) {
  //   //     paramLink += window[opt.shareParamName[i]] !== '' && window[opt.shareParamName[i]] !== null && window[opt.shareParamName[i]] !== undefined ? '&' + opt.shareParamName[i] + '=' + window[opt.shareParamName[i]] || '' : ''
  //   //   } else {
  //   //     paramLink += window[opt.shareParamName[i]] !== '' && window[opt.shareParamName[i]] !== null && window[opt.shareParamName[i]] !== undefined ? '?' + opt.shareParamName[i] + '=' + window[opt.shareParamName[i]] || '' : ''
  //   //   }
  //   // }
  // }
  if (opt.shareParams && !(JSON.stringify(opt.shareParams) === '{}')) {
    for (var i in opt.shareParams) {
      if (opt.shareParams.hasOwnProperty(i)) {
        paramLink += (i + '=' + opt.shareParams[i] + '&')
      }
    }
  }
  paramLink = paramLink.slice(0, paramLink.length - 1)
  let linkf = (opt.shareLink.indexOf('?') > -1 ? opt.shareLink.split('?')[0] : opt.shareLink)
  yourUrlByEncode = thebase.encode(((paramLink.indexOf('?') > -1 ? linkf : linkf + '?') + paramLink).toString())
  let finalShareLink = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${tkWxHost.appId}&redirect_uri=${tkWxHost.host}/tkmap/wechat/oauth2/redirect/${tkWxHost.appId}?other=${yourUrlByEncode}&response_type=code&scope=snsapi_base&state=redict#wechat_redirect`
  if (!opt.shareOAuthLink) {
    finalShareLink = (paramLink.indexOf('?') > -1 ? linkf : linkf + '?') + paramLink
  } else if (opt.shareOAuthLink2) {
    finalShareLink = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${tkWxHost.appId}&redirect_uri=${tkWxHost.host}/tkmap/wechat/oauth2/redirect/${tkWxHost.appId}?other=${yourUrlByEncode}&response_type=code&scope=snsapi_userinfo&state=redict#wechat_redirect`
  }
  // 泰行销APP分享
  if (isIsales && opt.isalesShare.share) {
    interactWithApp(opt.isalesShare.shareName, {
      'secret': '', // 16位以内秘钥 字母或数字
      'shareType': opt.isalesShare.shareName === 'shareByNative' ? opt.isalesShare.menuList[0] || 'onShareMenuFriend' : opt.isalesShare.menuList || ['onShareMenuFriend', 'onShareMenuTimeline'], // onShareMenuFriend表示微信，onShareMenuTimeline表示朋友圈
      'shareUrl': finalShareLink, // 分享地址
      'shareTitle': opt.title, // 分享标题
      'shareTimelineTitle': opt.timelineDesc, // 分享朋友圈标题或描述
      'shareBitmap': opt.shareImageURL, // 分享图片的URL
      'shareIntroduce': opt.desc, // 分享简介
      'callBack': function (info) { // 分享成功或失败后回调方法
        if (info.code === '0') {
          console.log('分享成功')
          typeof opt.callBack === 'function' && opt.callBack(info)
        }
      }
    })
  }
  if (isWechat && opt.wechatShare.share) {
    // console.log(wx)
    finalShareLink = /open.weixin/.test(finalShareLink) ? finalShareLink : encodeURIComponent(finalShareLink)
    wx.config({
      debug: opt.wechatShare.debug,
      appId: tkWxHost.appId,
      timestamp: data.timestamp,
      nonceStr: data.noncestr,
      signature: data.signature,
      jsApiList: ['checkJsApi', 'updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice', 'startRecord', 'stopRecord', 'onRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard']
    })
    wx.ready(function () {
      wx.showOptionMenu()
      // wx.hideOptionMenu()
      // wx.hideAllNonBaseMenuItem()
      if (opt.wechatShare.menuList.length <= 0) {
        wx.hideAllNonBaseMenuItem()
        return
      }
      wx.hideMenuItems({
        menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:favorite', 'menuItem:share:QZone', 'menuItem:openWithQQBrowser', 'menuItem:openWithSafari', 'menuItem:share:email',
          'menuItem:originPage', 'menuItem:copyUrl', 'menuItem:share:weiboApp', 'menuItem:readMode', 'menuItem:favorite',
          'menuItem:share:facebook', 'menuItem:delete', 'menuItem:editTag', 'menuItem:share:qq', 'menuItem:share:brand']
      })
      wx.showMenuItems({
        menuList: [...opt.wechatShare.menuList]
      })
      // 分享到朋友圈
      opt.wechatShare.shareTimeline && wx.onMenuShareTimeline({
        title: opt.title, // 分享标题
        link: `${opt.blankPathConfig}?jump=${finalShareLink}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: opt.shareImageURL, // 分享图标
        success: function (res) {
          // 用户确认分享后执行的回调函数
          typeof opt.callBack === 'function' && opt.callBack(res)
        }
      })
      // 分享到朋友圈新
      opt.wechatShare.shareTimeline && wx.updateTimelineShareData({
        title: opt.title, // 分享标题
        link: `${opt.blankPathConfig}?jump=${finalShareLink}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: opt.shareImageURL, // 分享图标
        success: function (res) {
          // 用户确认分享后执行的回调函数
          typeof opt.callBack === 'function' && opt.callBack(res)
        }
      })
      // 分享给微信好友
      opt.wechatShare.shareFriend && wx.onMenuShareAppMessage({
        title: opt.title,
        desc: opt.desc,
        link: `${opt.blankPathConfig}?jump=${finalShareLink}`,
        imgUrl: opt.shareImageURL,
        success: function (res) {
          typeof opt.callBack === 'function' && opt.callBack(res)
        }
      })
      // 分享给微信好友新
      opt.wechatShare.shareFriend && wx.updateAppMessageShareData({
        title: opt.title,
        desc: opt.desc,
        link: `${opt.blankPathConfig}?jump=${finalShareLink}`,
        imgUrl: opt.shareImageURL,
        success: function (res) {
          typeof opt.callBack === 'function' && opt.callBack(res)
        }
      })
    })
  } else {
    hideWxMenu()
  }
}
/**
 * 微信分享
 * @param {Object} opt 分享自定义配置
 * opt含以下字段
 * wechatShare: {  微信分享
 *   share: true,
 *   shareFriend: true,
 *   shareTimeline: true,
 *   menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:favorite']
 * },
 * isalesShare: { 泰行销分享
 *   share: true, 是否执行分享
 *   shareName: 'shareFromNative', // 分享方法名
 *   menuList: ['onShareMenuFriend', 'onShareMenuTimeline']
 * },
 * title: '', 分享标题
 * desc: '', 分享描述
 * timelineDesc: '', 预留分享朋友圈定制文案
 * shareParamName: {}, 分享参数指定
 *  shareImageURL: '', 分享图片地址
 * shareLink: '', 分享链接
 * shareOAuthLink: true,   是否使用oauth链接，值为false时为普通链接，拿不到openId
 * shareOAuthLink2: false,  高级授权oauth 可获取用户名等，需用户点击确认授权
 * blankPathConfig: '', 为微信预留空链接 可传空
 * callBack: function(){}
 */
export function share (opt) {
  let encodeUrl = encodeURIComponent(window.location.href.split('#')[0])
  // let encodeUrl = encodeURIComponent('http://planbookuat.life.taikang.com/static/testTemplate/index.html')
  let url = `${hosts}/tkmap/wechat/jsapi/getSignature.do?appId=${tkWxHost.appId}&url=${encodeUrl}`
  // let url = `https://isales.taikang.com/tkmap/wechat/jsapi/getSignature.do?appId=${tkWxHost.appId}&url=${encodeUrl}`
  if (isPlatform('microMessenger')) {
    opt.wechatShare.share && flyio.get(url).then(res => {
      let resData = typeof res.data !== 'object' ? JSON.parse(res.data) : res.data
      wxInit(resData, opt)
    })
  }
  if (isPlatform('isales')) opt.isalesShare.share && wxInit({}, opt)
}

// let opt = {
//   // 微信分享
//   wechatShare: {
//     share: true,
//     shareFriend: true,
//     shareTimeline: true,
//     menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline', 'menuItem:favorite']
//   },
//   // 泰行销分享
//   isalesShare: {
//     share: true, // 是否执行分享
//     shareName: 'shareFromNative', // 分享方法名
//     menuList: ['onShareMenuFriend', 'onShareMenuTimeline']
//   },
//   title: '', // 分享标题
//   desc: '', // 分享描述
//   timelineDesc: '', // 预留分享朋友圈定制文案
//   shareParamName: {}, // 分享参数指定
//   shareImageURL: '', // 分享图片地址
//   shareLink: '', // 分享链接
//     shareOAuthLink: true,   // 是否使用oauth链接，值为false时为普通链接，拿不到openId
//     shareOAuthLink2: false  // 高级授权oauth 可获取用户名等，需用户点击确认授权
//   blankPathConfig: 'https://lskdfjdlsfj.html'// 为微信预留空链接 可传空
//   callBack: function(){}
// }
// console.log(opt)
