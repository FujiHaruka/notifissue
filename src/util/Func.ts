import { PlainObject } from '../types/General'
import moment from 'moment'

export const mapObjKey = (callbackfn: (key: string) => string) => (
  obj: PlainObject,
): PlainObject =>
  Object.entries(obj)
    .map(([key, value]) => [callbackfn(key), value])
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})

export const mapObjValue = (callbackfn: (value: any) => any) => (
  obj: PlainObject,
): PlainObject =>
  Object.entries(obj)
    .map(([key, value]) => [key, callbackfn(value)])
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})

export const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time))

export const formatDate = (date: Date | string) =>
  moment(date).format('YYYY/MM/DD HH:mm')

const DATE = 'Date'
const replacer = function(key: string, value: any): any {
  const rawValue = this[key]
  if (rawValue instanceof Date) {
    return {
      $type: DATE,
      $value: rawValue.getTime(),
    }
  }
  return value
}
const reviver = function(key: string, value: any) {
  if (value && value.$type === DATE) {
    return new Date(value.$value)
  }
  return value
}
export const TypedJSON = {
  stringify: (value: any) => JSON.stringify(value, replacer),
  parse: (text: string) => JSON.parse(text, reviver),
}
