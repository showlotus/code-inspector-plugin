import Button from './components/CalcSum'
import Circle from './components/Circle'
import SuperBlock from './components/SuperBlock'
import usePage from './modules/page'
import useDetail from './modules/detail'
import Form from './components/Form'

usePage()
useDetail('', {
  useSync: '',
})

export default {
  data() {
    return {}
  },
  computed: {},
  create() {},
  mounted() {
    console.log(this.$options.__file)

    // window.addEventListener('blur', () => {
    //   console.log('window blur')
    // })

    // window.addEventListener('focus', () => {
    //   console.log('window focus')
    // })
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
        h(Form, {
          attrs: {
            __file: 'src/components/Form.ts',
          },
        }),
        h(
          'div',
          {
            style: {
              width: '400px',
              display: 'flex',
              flexWrap: 'nowrap',
              gap: '20px',
              overflow: 'auto',
            },
          },
          [
            h(Circle, {
              attrs: {
                __file: 'src/components/Circle.ts',
              },
            }),
            h(Circle, {
              attrs: {
                __file: 'src/components/Circle.ts',
              },
            }),
            h(Circle, {
              attrs: {
                __file: 'src/components/Circle.ts',
              },
            }),
          ]
        ),
        h({
          render(h: any) {
            return h('span', { style: { padding: '10px', border: '1px solid' } }, 'render span')
          },
        }),
        h(SuperBlock, {
          attrs: {
            __file: 'src/components/SuperBlock.ts',
          },
        }),
      ]
    )
  },
}
