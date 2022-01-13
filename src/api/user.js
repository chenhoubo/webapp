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

export function resetPas(params) {
  const url = '/user/resetPas'
  return $axios.get(url, params)
}

export function getUserByRole(params) {
  const url = '/user/getUserByRole'
  return $axios.get(url, params)
}

export function getMsgList() {
  const url = '/user/getMsgList'
  return $axios.get(url)
}
