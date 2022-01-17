import $axios from './index'

export function getPageTab1(params) {
  const url = '/analog/getPageData1'
  return $axios.post(url, params)
}
export function getPageTab2() {
  const url = '/analog/getPageData2'
  return $axios.get(url)
}
