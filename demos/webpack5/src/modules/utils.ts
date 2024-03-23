export function reactive(obj: any) {
  return obj
}

export function createComposable(...args: any[]) {
  return () => {
    const { slots, __file } = args[0].use()
    console.log('createComposable', __file)
    Object.keys(slots).forEach(key => {
      console.log(key, slots[key].use('props', 'slots'))
    })
  }
}
