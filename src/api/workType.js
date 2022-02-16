import $axios from './index'

export function page(params) {
  const url = '/work/type/page'
  return $axios.post(url, params)
}

export function update(params) {
  const url = '/work/type/update'
  return $axios.post(url, params)
}

export function save(params) {
  const url = '/work/type/save'
  return $axios.post(url, params)
}

export function del(params) {
  const url = '/work/type/delete'
  return $axios.get(url, params)
}
