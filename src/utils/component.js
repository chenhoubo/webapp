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
