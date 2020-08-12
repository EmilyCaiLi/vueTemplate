import axios from 'axios'

//  获取详情
export function getDetail (self, url, callback) {
  self.$api
    .get(url, {
      token: self.$token,
      policyId: self.$policyId
    })
    .then(
      function (res) {
        window.console.log('详情res：')
        window.console.log(res)
        callback(res.info)
      },
      function (res) {
        self.$toast.show({
          text: res.rspDesc
        })
      }
    )
}

// 截屏
export function getScreenInfo () {
  return new Promise(function (resolve, reject) {
    const params = {
      callback: function (res) {
        window.console.log('截屏回调：')
        window.console.log(res)
        if (res.code === '0') {
          resolve({
            fileName: res.msg.fileName
          })
        } else {
          reject(new Error({
            fileName: ''
          }))
        }
      }
    }
    // 截屏方法
    ISALES.callApp('getScreenSnapshot', params)
  })
}

// 删除图片
export function deletePic (infoObject) {
  window.console.log('Promise删除：')
  window.console.log(infoObject)
  return new Promise(function (resolve, reject) {
    const params = {
      fileNames: [infoObject.deleFileName],
      callback: function (res) {
        window.console.log(res)
        if (res.code === '0') {
          window.console.log('删除成功')
        } else {
          window.console.log('删除失败')
        }
        resolve(res.desc)
      }
    }
    ISALES.deletePicturesByNative('deletePicturesByNative', params)
  })
}

// 身份证ocr识别
export function idOCR (data) {
  return new Promise(function (resolve, reject) {
    const params = {
      keyType: '1', // 0：公有 1：私有云
      days: '3', // 0：永久 默认3天 非0定期删除
      cardtype: data.cardtype, // 0：反面(人像) 1：正面(国徽)
      upload: '0', // 0:不上传 1:上传 默认不上传
      picType: '1', // 0: 相册、相机；1：相机
      callback: function (info) {
        window.console.log('身份证ocr识别', data.cardtype)
        window.console.log(info)
        if (info.code === '0') {
          resolve(info.msg)
        } else {
          reject(info.desc)
        }
      }
    }
    ISALES.ocrIdCard('ocrIdCard', params)
  })
}

// 人脸识别方法
export function faceOcr (data) {
  return new Promise(function (resolve, reject) {
    ISALES.callApp('showFaceCammerWith', {
      operationStr: data.operationStr, // 字符串 动作(0:眨眼1:张嘴2:右摇头3:左摇头4:向上抬头5:向下低头)
      callback: function (info) {
        window.console.log('人脸识别返回结果', info)
        if (info.code === '0') {
          resolve(info.msg)
        } else {
          reject(info)
        }
      }
    })
  })
}

// 公安部识别
export function faceRecogniteOcr (data) {
  return new Promise(function (resolve, reject) {
    ISALES.callApp('TKNewSafeVertifyPeopleWithInfoWith', {
      param: JSON.stringify({
        cownName: data.cownName, // 姓名
        processCode: data.processCode,
        policyId: data.policyId,
        buid: data.buid,
        faceImage: data.faceImage,
        secuityNo: data.secuityNo, // 身份证号
        // businessCode: data.businessCode,
        // SecretKey: data.SecretKey,
        isLiveCheck: 'true' // 后台接口是否活体检测
      }),
      callback: function (info) {
        window.console.log('公安部识别结果', info)
        window.console.log(info)
        if (info.code === '0') {
          resolve(info.msg)
        } else {
          reject(info.desc)
        }
      }
    })
  })
}

// 人脸识别活体检测6动作选2
export function getRandomArray () {
  const items = ['0', '1', '2', '3', '4', '5']
  const count = 2
  const shuffled = items.slice(0)
  let i = items.length
  const min = i - count
  let temp
  let index
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random())
    temp = shuffled[index]
    shuffled[index] = shuffled[i]
    shuffled[i] = temp
  }
  window.console.log('人脸识别参数：' + shuffled.slice(min).join(','))
  return shuffled.slice(min).join(',')
}

// 银行卡ocr识别
export function bankOCR () {
  return new Promise(function (resolve, reject) {
    const params = {
      keyType: '1', // 0 公有 1 私有 云
      days: '3', // 不传此字段默认三日后自动清理0是永久
      upload: '0', // 不传此字段默认不上传 0:不上传 1:上传
      picType: '1', // 0: 相册、相机；1：相机
      callback: function (info) {
        window.console.log('银行卡识别信息：')
        window.console.log(info)
        if (info.code === '0') {
          resolve(info.msg)
        } else {
          reject(info.desc)
        }
      }
    }
    ISALES.ocrBankCard('ocrBankCard', params)
  })
}

// uuid获取buid字段唯一流水号
export function uuid () {
  const s = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-'

  const uuid = s.join('')
  // this.text = uuid
  window.console.log(uuid)
  return uuid
}

// 加签
export function getSign (infoObject, callbackFun) {
  const params = {
    params: infoObject,
    hasToken: 'y',
    callback: function (info) {
      if (info.code === '0') {
        callbackFun(info.msg.txxSign)
      } else {
        window.console.log('加签失败了~~~~')
      }
    }
  }
  ISALES.callApp('getSign', params)
}

// 加密
export function encrypt (infoObject, callbackFun) {
  const params = {
    data: infoObject,
    callback: function (info) {
      if (info.code === '0') {
        callbackFun(info.msg)
      } else {
        window.console.log('加密失败了~~~~')
      }
    }
  }
  ISALES.callApp('encrypt', params)
}

// 解密
export function decrypt (infoObject, callbackFun) {
  const params = {
    data: infoObject,
    callback: function (info) {
      if (info.code === '0') {
        callbackFun(info.msg)
      } else {
        window.console.log('解密失败了~~~~')
      }
    }
  }
  ISALES.callApp('decrypt', params)
}

// 加签新方法
export function getSignNew (params) {
  return new Promise((resolve, reject) => {
    const param = {
      params, // 数据
      hasToken: 'y',
      callback: info => {
        if (info.code === '0') {
          // 0时成功
          resolve(info.msg.txxSign)
        } else {
          window.console.log('加签失败了~~~~')
        }
      }
    }
    window.ISALES.callApp('getSign', param)
  })
}

export function decryptNew (data) {
  return new Promise((resolve, reject) => {
    const params = {
      data, // 密文
      callback: (info) => {
        if (info.code === '0') {
          // 0时成功
          resolve(info.msg)
        } else {
          window.console.log('解密失败了')
        }
      }
    }
    window.ISALES.callApp('decrypt', params)
  })
}

// 获取登录信息
export function getUserInfo () {
  return new Promise((resolve, reject) => {
    if (window.ISALES) {
      window.ISALES.messageWidthApp(
        'getUserInfoByNative',
        JSON.stringify({
          callBackName: 'getuserinfo'
        })
      )
    } else {
      window.console.log('找不到ISALES')
    }
    // 获取代理人信息的回调函数
    window.getuserinfo = function (res) {
      const userInfo = JSON.parse(res)
      window.console.log('userInfo回调:', userInfo)
      if (userInfo.code === '0') {
        sessionStorage.setItem('userName', userInfo.msg.userName)
        sessionStorage.setItem('phone', userInfo.msg.phone)
        sessionStorage.setItem('channel', userInfo.msg.channel)
        sessionStorage.setItem('companyCode', userInfo.msg.companyCode)
        sessionStorage.setItem('userCode', userInfo.msg.userCode)
        sessionStorage.setItem('staffNumber', userInfo.msg.staffNumber)
        sessionStorage.setItem('token', userInfo.msg.token)
        resolve(userInfo.msg)
      }
    }
  })
}

// 判断平台
export function isPlatform (str) {
  // 判断安卓还是ios终端
  const u = navigator.userAgent
  const browser = {
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

// 请求数据
/**
 * [提交请求]
 * @param {Object} options [请求配置]
 *   @param {String} options.url [请求地址]
 *   @param {Object} options.header [请求头]
 *   @param {Object} options.params [请求数据]
 *   @param {String} options.method [请求方法]
 * @return {Object} Promise [返回promise]
 */
export async function getData (options) {
  if (options.header) {
    let sign = '' // 用于万能数据加签
    if (isPlatform('isales')) {
      sign = await getSignNew(options.params)
      window.console.log('getsignOptions')
      window.console.log(options.params)

      window.console.log('已取到sign', sign)
      axios.defaults.headers.common.txxSign = sign
      axios.defaults.headers.common.token = localStorage.getItem('token')
    } else {
      axios.defaults.headers.common.reqSource = 'weixin'
    }
    let params
    if (options.method === 'get') {
      params = {
        params: options.params
      }
    } else {
      params = options.params
    }
    const data = await axios[options.method](options.url, params)
    return data
  }
}
