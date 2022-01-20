import $axios from './index'

export function page(params) {
  const url = '/info/page'
  return $axios.post(url, params)
}
export function save(params) {
  const url = '/info/save'
  return $axios.post(url, params)
}
export function getOne(params) {
  const url = '/info/getOne'
  return $axios.get(url, params)
}
export function available(params) {
  const url = '/info/available'
  return $axios.get(url, params)
}
