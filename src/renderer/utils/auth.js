export function getStorage (key) {
  try {
    const data = window.localStorage ? window.localStorage.getItem(key) : ''
    if (data) {
      const dataObj = JSON.parse(data)
      if (dataObj.expire) {
        // 有过期时间
        if (new Date().getTime() - dataObj.saveTime > dataObj.expire) {
          removeStorage(key)
          return null
        } else {
          return dataObj.data
        }
      } else {
        // 没有过期时间直接返回
        return dataObj.data
      }
    } else {
      return null
    }
  } catch (error) {
    console.log(error)
  }
  // return window.localStorage ? window.localStorage.getItem(key) : ''
}

export function setStorage (key, val, expire) {
  try {
    let data = ''
    let dataObj = ''
    // eslint-disable-next-line no-cond-assign
    if (data = window.localStorage.getItem(key)) {
      dataObj = JSON.parse(data)
    }
    let curTime = data ? dataObj.saveTime : new Date().getTime()
    expire = expire ? (data ? dataObj.expire : (1000 * expire)) : null // 按秒计算
    window.localStorage.setItem(key, JSON.stringify({data: val, saveTime: curTime, expire}))
  } catch (error) {
    console.log(error)
  }
  // return window.localStorage ? window.localStorage.setItem(key, val) : ''
}

export function removeStorage (key) {
  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.log(error)
  }
}
