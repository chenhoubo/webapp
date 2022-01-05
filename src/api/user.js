import $axios from './index'

export function page(params) {
  const url = '/user/page'
  return $axios.post(url, params)
}

export function update(params) {
  const url = '/user/update'
  return $axios.post(url, params)
}

export function save(params) {
  const url = '/user/save'
  return $axios.post(url, params)
}

export function del(params) {
  const url = '/user/delete'
  return $axios.get(url, params)
}
