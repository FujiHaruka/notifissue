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
