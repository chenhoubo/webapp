import $axios from './index'

export function upload(params) {
  const url = '/file/upload'
  return $axios.get(url, params)
}

export function remove(params) {
  const url = '/file/remove'
  return $axios.get(url, params)
}

export function update(params) {
  const url = '/file/update'
  return $axios.post(url, params)
}

export function save(params) {
  const url = '/file/save'
  return $axios.post(url, params)
}

export function del(params) {
  const url = '/file/delete'
  return $axios.get(url, params)
}

export function getOne(params) {
  const url = '/file/getOne'
  return $axios.get(url, params)
}

export function page(params) {
  const url = '/file/page'
  return $axios.post(url, params)
}
