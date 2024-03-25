import { reactive } from './utils'

export default function useGrid() {
  const op = reactive({
    props: {},
    slots: {},
  })
  console.log('grid init')
  return op
}
