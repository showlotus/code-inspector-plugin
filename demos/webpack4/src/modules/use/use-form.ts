import { reactive } from '../utils'

export default function (...args: any[]) {
  const op = reactive({
    props: {},
    slots: {},
  })
  console.log('use-form init', args)

  function a() {}
  return op
}
