import $axios from './index'
export function getAllRolse() {
  const url = '/role/getRoles'
  return $axios.get(url)
}
export function updateRole(data) {
  const url = '/role/update'
  return $axios.post(url, data)
}
export function addRole(data) {
  const url = '/role/save'
  return $axios.post(url, data)
}
export function delRole(data) {
  const url = '/role/delete'
  return $axios.get(url, data)
}
