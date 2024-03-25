import useDialog from './use-dialog'
import useForm from './use-form'
import useGrid from './use-grid'
import { createComposable, reactive } from './utils'

function useFn(props: any, { useSync }: any) {
  console.log('detail', useSync)
  const loading = reactive({})
  const op = reactive({
    props: {
      data: [{} as any],
      orderHeaderId: '' as string | (string | null)[],
      callback() {
        const a = 1
        loading?.close()
      },
    },
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
