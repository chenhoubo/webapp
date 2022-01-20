export function translateDataToTree(data) {
  let parents = data.filter(value => {
    return value.pid == '0' || value.pid == 'null'
  })
  let children = data.filter(value => {
    return value.pid != '0' && value.pid != 'null'
  })
  let translator = (parents, children) => {
    parents.forEach(parent => {
      parent['children'] = []
      children.forEach((current, index) => {
        if (current.pid == parent.id) {
          let temp = JSON.parse(JSON.stringify(children))
          temp.splice(index, 1)
          translator([current], temp)
          typeof parent.children !== 'undefined'
            ? parent.children.push(current)
            : (parent.children = [current])
        }
      })
    })
  }
  translator(parents, children)
  return parents
}

function add0(m) {
  return m < 10 ? '0' + m : m
}
export function format(shijianchuo) {
  //shijianchuo是整数，否则要parseInt转换
  let time = new Date(shijianchuo)
  let y = time.getFullYear()
  let m = time.getMonth() + 1
  let d = time.getDate()
  let h = time.getHours()
  let mm = time.getMinutes()
  let s = time.getSeconds()
  return (
    y +
    '-' +
    add0(m) +
    '-' +
    add0(d) +
    ' ' +
    add0(h) +
    ':' +
    add0(mm) +
    ':' +
    add0(s)
  )
}
/**
 * 创建并下载文件
 * @param  {String} fileName 文件名
 * @param  {String} content  文件内容
 */
export function createAndDownloadFile(fileName, content) {
  var aTag = document.createElement('a')
  var blob = new Blob([content])
  aTag.download = fileName
  aTag.href = URL.createObjectURL(blob)
  aTag.click()
  URL.revokeObjectURL(blob)
}
