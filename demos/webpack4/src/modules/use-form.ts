import { reactive } from './utils'

export default function useForm(...args: any[]) {
  const op = reactive({
    props: {},
    slots: {},
  })
  console.log('form init', args)
  return op
}
