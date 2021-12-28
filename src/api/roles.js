import $axios from './index'
export function getAllRolse() {
  const url = '/role/getRoles'
  return $axios.get(url)
}
