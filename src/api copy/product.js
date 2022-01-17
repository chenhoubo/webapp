import $axios from './index'

export function updateProduct(data) {
  const url = '/product/update'
  return $axios.post(url, data)
}
export function addProduct(data) {
  const url = '/product/save'
  return $axios.post(url, data)
}
export function delProduct(data) {
  const url = '/product/delete'
  return $axios.get(url, data)
}
export function pageProduct(data) {
  const url = '/product/page'
  return $axios.post(url, data)
}
export function getTableData(data) {
  const url = '/home/getTableList'
  return $axios.get(url, data)
}
