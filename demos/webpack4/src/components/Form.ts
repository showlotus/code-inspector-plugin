export default {
  template: /* html */ `
    <div>
      <fieldset>
        <legend>复选框</legend>
        <p>
          <label> <input type="checkbox" name="chbox" value="regular" /> 普通 </label>
        </p>
        <p>
          <label>
            <input type="checkbox" name="chbox" value="disabled" disabled /> 禁用
          </label>
        </p>
      </fieldset>

      <fieldset>
        <legend>单选按钮</legend>
        <p>
          <label> <input type="radio" name="radio" value="regular" /> 普通 </label>
        </p>
        <p>
          <label>
            <input type="radio" name="radio" value="disabled" disabled /> 禁用
          </label>
        </p>
      </fieldset>

      <p>
        <label
          >选择一个选项：
          <select>
            <optgroup label="第一组">
              <option>选项 1.1</option>
            </optgroup>
            <optgroup label="第二组">
              <option>选项 2.1</option>
              <option disabled>选项 2.2</option>
              <option>选项 2.3</option>
            </optgroup>
            <optgroup label="第三组" disabled>
              <option>禁用的 3.1</option>
              <option>禁用的 3.2</option>
              <option>禁用的 3.3</option>
            </optgroup>
          </select>
        </label>
      </p>

      <fieldset disabled>
        <legend>禁用的 fieldset</legend>
        <p>
          <label> 名字：<input type="name" name="radio" value="普通" /> </label>
        </p>
        <p>
          <label>数字：<input type="number" /></label>
        </p>
      </fieldset>
    </div>
  `,
  created() {},
  // render(h: any) {
  //   return h(
  //     'div',
  //     {
  //       style: {
  //         display: 'flex',
  //         gap: '20px',
  //       },
  //     },
  //     [
  //       h('input', { attrs: { disabled: true } }),
  //       h('button', { attrs: { disabled: true } }, 'disabled'),
  //     ]
  //   )
  // },
}
