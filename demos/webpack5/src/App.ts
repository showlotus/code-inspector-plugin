import Button from './components/CalcSum'
import Circle from './components/Circle'
import usePage from './modules/page'
import useDetail from './modules/detail'

usePage()
useDetail()

export default {
  data() {
    return {}
  },
  computed: {},
  create() {},
  mounted() {
    console.log(this.$options.__file)
  },
  methods: {},
  render(h: any) {
    return h(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        },
        attrs: {
          __file: 'src/App.ts',
        },
      },
      [
        h(Button, {
          attrs: {
            __file: 'src/components/CalcSum.ts',
          },
        }),
        h(Circle, {
          attrs: {
            __file: 'src/components/Circle.ts',
          },
        }),
        h({
          render(h: any) {
            return h('span', { style: { padding: '10px', border: '1px solid' } }, 'render span')
          },
        }),
      ]
    )
  },
}
