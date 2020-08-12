let docEl = document.documentElement
export function getSize () { // 获取屏幕的宽度
  function getWdith () {
    let myWidth = 0
    if (typeof (window.innerWidth) === 'number') {
      // Non-IE
      myWidth = window.innerWidth
    } else if (document.documentElement && (document.documentElement.clientWidth)) {
      // IE 6+ in 'standards compliant mode'
      myWidth = document.documentElement.clientWidth
    } else if (document.body && (document.body.clientWidth)) {
      // IE 4 compatible
      myWidth = document.body.clientWidth
    }
    return parseInt(myWidth)
  }
  let screenWidth = window.screen.width > getWdith() ? getWdith() : window.screen.width

  if (screenWidth >= 768) {
    screenWidth = 768
  }
  docEl.style.fontSize = screenWidth / (750 / 40) + 'px'
  window.document.addEventListener('focusout', function () {
    window.scrollTo()
  })
  if (!window.ISALES) {
    window.ISALES = {
      ready: function () {}
    }
  } else {
    if (!window.ISALES.ready) {
      window.ISALES.ready = function () {}
    } else {
      if (typeof window.ISALES.ready === 'function') {
        let fn = window.ISALES.ready
        window.ISALES.ready = function () {
          fn()
        }
      } else {
        window.ISALES.ready = function () {}
      }
    }
  }
}

// vue获取地址栏参数
export function getRequest (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var num = +window.location.hash.indexOf('?') + 1
  var r = !/param/.test(window.location.hash) ? window.location.search.substr(1).match(reg) : window.location.hash.substr(num).match(reg)
  if (r != null) return decodeURI(r[2])
  return ''
}
// 判断平台
export function isPlatform (str) {
  // 判断安卓还是ios终端
  let u = navigator.userAgent
  let browser = {
    versions: (function () {
      // let app = navigator.appVersion
      return {
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
      }
    }())
  }
  str = str.toLowerCase()
  if (browser.versions.ios && str === 'ios') {
    return true
  }
  if (browser.versions.android && str === 'android') {
    return true
  }
  if ((u.match(/MicroMessenger/i) && u.match(/MicroMessenger/i)[0].toLowerCase()) === 'MicroMessenger'.toLowerCase() && str === 'micromessenger') {
    return true
  }
  if ((u.match(/isales/i) && u.match(/isales/i)[0].toLowerCase()) === 'isales'.toLowerCase() && str === 'isales') {
    return true
  }
  return false
}
// 强制在微信端打开
export function wxTest (fn) {
  // 对浏览器的UserAgent进行正则匹配，不含有微信独有标识的则为其他浏览器
  var useragent = navigator.userAgent
  if ((useragent.match(/MicroMessenger/i) && useragent.match(/MicroMessenger/i)[0].toLowerCase()) !== 'MicroMessenger'.toLowerCase()) {
    // 这里警告框会阻塞当前页面继续加载
    document.body.innerHTML = ''
    window.alert('已禁止本次访问：您必须使用微信内置浏览器访问本页面！')
    // 以下代码是用javascript强行关闭当前页面
    var opened = window.open('about:blank', '_self')
    opened.opener = null
    opened.close()
    // typeof fn == 'function' && fn();
  }
}
// 隐藏微信分享等功能
export function hideWxMenu () {
  function onBridgeReady () {
    window.WeixinJSBridge.call('hideOptionMenu')
  }

  if (typeof WeixinJSBridge === 'undefined') {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
    } else if (document.attachEvent) {
      document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
      document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
    }
  } else {
    onBridgeReady()
  }
}
// 与原生交互
export function interactWithApp (name, data) {
  // alert(name+'___'+JSON.stringify(data))
  !data && (data = {})
  if (isPlatform('microMessenger')) return
  let resultFn = function (info) {
    info = typeof info !== 'object' ? JSON.parse(info) : info
    data.callBack && typeof data.callBack === 'function' ? data.callBack(info) : data.callBack = function (e) { console.log(e, 'this mean there is no callback function specified') }
  }
  if (!window.ISALES) {
    window.ISALES = {}
    window.ISALES.ready = function () {}
    let cbName = `${name}CallBack`
    window.ISALES[cbName] = resultFn
    data.callBackName = `ISALES.${cbName}`
  } else {
    let cbName = `${name}CallBack`
    window.ISALES[cbName] = resultFn
    data.callBackName = `ISALES.${cbName}`
  }
  if (isPlatform('ios')) {
    try { // ios
      window.webkit.messageHandlers[name].postMessage(name === 'closeByNative' ? '' : JSON.stringify(data))
    } catch (e) {
      // alert(JSON.stringify(e))
    }
  } else if (isPlatform('android')) {
    try { // android
      window.android[name](name === 'closeByNative' ? '' : JSON.stringify(data))
    } catch (e) {
      // console.log(e)
    }
  }
}
// interactWidthApp('shareFromNative', {
//   secret: '',
//   // 16位以内秘钥 字母或数字
//   shareType: ['onShareMenuFriend', 'onShareMenuTimeline'], // onShareMenuFriend表示微信，onShareMenuTimeline表示朋友圈
//   shareUrl: finalShareLink, // 分享地址
//   shareTitle: baseOpt.shareTitle, // 分享标题,
//   shareTimelineTitle: '',
//   // 分享朋友圈标题或描述
//   shareBitmap: baseOpt.configPath.replace(
//     /\/planbook\//,
//     '/planbookv2/'
//   ) + baseOpt.shareImageUrl,
//   // 分享图片的URL
//   shareIntroduce: baseOpt.shareDesc, // 分享简介
//   callBackName: sendSsidAfterShare
// })
export function base64 () {
  return {
    decode: window.atob.bind(window),
    encode: window.btoa.bind(window)
  }
}
export function usfBase64 (buffer) {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, '') // Remove ending '='
}
export function urlsafeB64decode ($string, base64) {
  var $data = $string.replace('-', '+').replace('_', '/')
  var $mod4 = ($data).length % 4
  if ($mod4) {
    $data += '===='.substr($mod4)
  }
  return base64 ? base64.decode($data) : ''
}
// once 函数，只执行一次
export function once (fn, context) {
  let res
  return function () {
    if (fn) {
      res = fn.apply(context || this, arguments)
      fn = null
    }
    return res
  }
}
// 防止抖动
export function debounce (fn, wait, immediate) {
  let timeout
  let immediates = immediate || false
  return function () {
    let context = this
    let args = arguments
    let later = function () {
      timeout = null
      if (!immediates) fn.apply(context, args)
    }
    let call = immediates && !timeout
    clearTimeout(timeout)
    if (call) return fn.apply(context, args)
    timeout = setTimeout(later, wait)
  }
}

// 防止抖动less版
export function debounceLess (fn, wait) {
  let timeout
  return function () {
    let context = this
    let args = arguments
    clearTimeout(timeout)
    timeout = setTimeout(function () {
      fn.apply(context, args)
    }, wait)
  }
}

// 防止重复执行
export function throttle (fn, wait) {
  let timeout
  return function () {
    let context = this
    let args = arguments
    if (timeout) return
    timeout = setTimeout(function () {
      fn.apply(context, args)
      timeout = null
    }, wait)
  }
}

export function copymsg (el, fn) {
  var Url2 = el// 要复制文字的节点
  // if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) { // 区分iPhone设备
  //   window.getSelection().removeAllRanges()// 这段代码必须放在前面否则无效
  //   var range = document.createRange()
  //   // 选中需要复制的节点
  //   range.selectNode(Url2)
  //   // 执行选中元素
  //   window.getSelection().addRange(range)
  //   // 执行 copy 操作
  //   var successful = document.execCommand('copy')
  //   console.log(successful)
  //   // 移除选中的元素
  //   window.getSelection().removeAllRanges()
  // } else {
  Url2.select() // 选择对象
  document.execCommand('Copy') // 执行浏览器复制命令
  typeof fn === 'function' && fn()
  // }
}
