import { reactive } from './utils'

export default function useDialog() {
  const dialog = reactive({
    key: '',
    props: {},
    slots: {},
  })
  console.log('dialog init')
  return dialog
}
