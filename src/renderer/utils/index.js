
export const strToObj = (str) => {
  // 字符串转对象
  const msgLC = str.toLowerCase()
  var arr = msgLC.split('\r\n')
  arr = arr.filter(word => word.length > 1)
  const obj = {}
  arr.forEach(item => {
    var [key, val] = item.split(':')
    key = key.replace(/^\s|\s+$/g, '')
    val = val.replace(/^\s|\s+$/g, '')
    obj[key] = val
  })
  return obj
}

export const getQueryString = (name, str) => {
  var searchStr = str.substring(str.indexOf('?'), str.length) || window.location.search
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = searchStr.substr(1).match(reg)
  if (r != null) {
    return unescape(r[2])
  };
  return null
}
