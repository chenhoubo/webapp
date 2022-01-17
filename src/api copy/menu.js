import $axios from './index'
import { translateDataToTree } from '@/utils/component'

export function getAll(params) {
  const url = '/menu/getAll'
  return new Promise((resolve, reject) => {
    $axios
      .post(url, params)
      .then(res => {
        res.data = translateDataToTree(res.data)
        // console.log('data:', res)
        // eslint-disable-next-line no-undef
        resolve(res)
      })
      .catch(err => {
        // eslint-disable-next-line no-undef
        reject(err)
      })
  })
}

export function update(params) {
  const url = '/menu/update'
  return $axios.post(url, params)
}

export function save(params) {
  const url = '/menu/save'
  return $axios.post(url, params)
}

export function del(params) {
  const url = '/menu/delete'
  return $axios.get(url, params)
}
