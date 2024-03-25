import { reactive } from '../../utils'

export default function (...args: any[]) {
  const op = reactive({
    props: {},
    slots: {},
  })
  console.log('use-grid init', args)
  return op
}
