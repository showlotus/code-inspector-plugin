export default {
  data() {
    return {
      num1: 0,
      num2: 0,
      sum: 0,
    }
  },
  computed: {
    // sum() {
    //   return this.num1 + this.num2
    // }
  },
  mounted() {
    console.log(this.$options.__file)
  },
  methods: {
    calcSum() {
      this.sum = this.num1 + this.num2
      console.log('calcSum')
    },
    open() {
      fetch('/__open-in-editor?file=src/App.ts:7:25').then(res => {
        console.log(res)
      })
    },
  },
  template: /* html */ `
    <div>
      <input v-model.number="num1" type="number" />
      <span>+</span>
      <input v-model.number="num2" type="number" />
      <button @click="calcSum">=</button>
      <span>{{ sum }}</span>

      <button @click="open">open</button>
    </div>
  `,
}
