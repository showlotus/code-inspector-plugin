import useDialog from './dialog'
import useForm from './form'
import useGrid from './grid'
import { createComposable, reactive } from './utils'

function useFn() {
  const op = reactive({
    props: {},
    slots: {
      form: {
        use: useForm,
      },
      grid: {
        use: useGrid,
      },
      dialog: {
        use: useDialog,
      },
    },
  }) as any
  return op
}

export default createComposable({
  manifest: '',
  use: useFn,
})
