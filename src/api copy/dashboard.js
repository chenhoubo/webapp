import $axios from './index'

export function getCardsData() {
  const url = '/home/getCardsData'
  return $axios.get(url)
}
export function getLineData() {
  const url = '/home/getLineData'
  return $axios.get(url)
}
export function getTableData() {
  const url = '/home/getTableList'
  return $axios.get(url)
}
export function getBarData() {
  const url = '/home/getBarData'
  return $axios.get(url)
}
