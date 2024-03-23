import useDialog from './dialog'
import useForm from './form'
import useGrid from './grid'
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
