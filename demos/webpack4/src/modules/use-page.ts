import useDialog from './use-dialog'
import useForm from './use-form'
import useGrid from './use-grid'
import { createComposable, reactive } from './utils'

function useFn(prop1 = 1, prop2 = 3) {
  console.log('useFn log:', prop1, prop2)
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
