import $axios from './index'

export function page(params) {
  const url = '/speak/page'
  return $axios.post(url, params)
}

export function all(params) {
  const url = '/speak/all'
  return $axios.get(url, params)
}

export function update(params) {
  const url = '/speak/update'
  return $axios.post(url, params)
}

export function del(params) {
  const url = '/speak/delete'
  return $axios.get(url, params)
}

export function save(params) {
  const url = '/speak/save'
  return $axios.post(url, params)
}
