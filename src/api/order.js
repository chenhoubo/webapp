import $axios from './index'

export function update(params) {
  const url = '/order/update'
  return $axios.post(url, params)
}

export function save(params) {
  const url = '/order/save'
  return $axios.post(url, params)
}

export function del(params) {
  const url = '/order/delete'
  return $axios.get(url, params)
}
