import $axios from './index'

export function login(data) {
  const url = '/user/login'
  return $axios.post(url, data)
}
export function getInfo() {
  const url = '/user/getInfo'
  return $axios.get(url)
}
