class CodeInspectorSelector {
  server: string
  hotkeys: string[]
  pressKeys: Set<string>
  isTrigger: Boolean
  className: string
  attrs: string
  tooltip: HTMLElement
  el: HTMLElement
  styleId: string

  constructor(server: string) {
    this.server = (server || '').replace(/\/$/, '')
    this.hotkeys = ['Alt', 'Shift']
    this.pressKeys = new Set()
    this.isTrigger = false
    this.className = 'code-inspector-plugin-selector'
    this.attrs = '__file'
    this.tooltip = this.createTooltip()
    this.el = this.createElement()
    this.styleId = 'code-inspector-plugin-selector__style'

    this.init()
  }

  init() {
    this.render()
    this.addKeydownEvent()
    this.addKeyupEvent()
    this.addMousemoveEvent()
    this.addBlurEvent()
  }

  render() {
    this.createStyle()
    this.el.appendChild(this.tooltip)
    document.body.appendChild(this.el)
  }

  createStyle() {
    const style = document.createElement('style')
    style.innerHTML = /* css */ `
      .code-inspector-plugin-selector {
        position: fixed;
        display: none;
        border: 1px dashed rgb(117, 40, 202);
        background-color: rgba(127, 160, 224, 0.65);
        pointer-events: none;
        cursor: pointer;
        z-index: 99999;
      }

      .code-inspector-plugin-selector[show] {
        display: block !important;
      }

      .code-inspector-plugin-selector__tooltip {
        padding: 5px;
        position: absolute;
        left: 0;
        bottom: 0;
        transform: translate(0px, calc(100% + 8px));
        background-color: rgb(255, 255, 255);
        box-shadow: rgb(163, 162, 162) 0px 1px 3px 1px;
        border-radius: 4px;
        font-size: 16px;
      }      

      .code-inspector-plugin-selector__arrow {
        position: absolute;
        left: 10px;
        top: -3px;
        width: 10px;
        height: 10px;
        background-color: #fff;
        box-shadow: rgb(223, 223, 223) -2px -2px 3px 0px;
        transform: rotate(45deg);
      }

      .code-inspector-plugin-selector__tooltip[placement="top"] {
        left: 0;
        top: 0;
        bottom: unset;
        transform: translate(0px, calc(-1 * (100% + 8px)));;
      }

      .code-inspector-plugin-selector__tooltip[placement="top"] .code-inspector-plugin-selector__arrow {
        top: unset;
        bottom: -3px;
        box-shadow: rgb(196, 196, 196) -2px -2px 3px 0px;
        transform: rotate(-135deg);
      }

      .code-inspector-plugin-selector__tooltip[fixed] {
        position: fixed;
        left: 0;
        bottom: 0;
        transform: none;
      }

      .code-inspector-plugin-selector__tooltip[fixed] .code-inspector-plugin-selector__arrow {
        display: none;
      }
    `
    document.body.append(style)
  }

  createTooltip() {
    const tooltip = document.createElement('div')
    tooltip.className = `${this.className}__tooltip`
    tooltip.innerHTML = /* html */ `
      <div class="${this.className}__arrow"></div>
      <span class="${this.className}__content"></span>
    `
    return tooltip
  }

  updateTooltipContent(content: string) {
    this.tooltip.querySelector(`.${this.className}__content`)!.textContent = content
  }

  createElement() {
    const div = document.createElement('div')
    div.className = this.className
    return div
  }

  show() {
    this.addGlobalCursorStyle()

    this.el.setAttribute('show', '')

    window.addEventListener('click', this.handleClick, true)
    window.addEventListener('pointerdown', this.handlePointerdown, true)
  }

  hide() {
    this.removeGlobalCursorStyle()

    this.el.removeAttribute('show')

    window.removeEventListener('click', this.handleClick, true)
    window.removeEventListener('pointerdown', this.handlePointerdown, true)
  }

  addGlobalCursorStyle() {
    if (!document.getElementById(this.styleId)) {
      const style = document.createElement('style')
      style.setAttribute('id', this.styleId)
      style.innerText = /* css */ `body * {
        cursor: pointer !important;
      }`
      document.body.appendChild(style)
    }
  }

  removeGlobalCursorStyle() {
    const style = document.getElementById(this.styleId)
    style?.remove()
  }

  updatePosition(position: any) {
    const el = this.el as any
    ;['left', 'top', 'width', 'height'].forEach(key => {
      el.style[key] = position[key] + 'px'
    })

    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const { left, top, width, height } = this.tooltip.getBoundingClientRect()
    const offset = 8

    // TODO 待优化，水平方向无法完全显示的情况
    if (position.top + position.height + height + offset >= windowHeight) {
      if (position.top > height + offset) {
        this.tooltip.removeAttribute('fixed')
        this.tooltip.setAttribute('placement', 'top')
      } else {
        this.tooltip.removeAttribute('placement')
        this.tooltip.setAttribute('fixed', '')
      }
    } else {
      this.tooltip.removeAttribute('placement')
      this.tooltip.removeAttribute('fixed')
    }
  }

  isTriggerHotkeys() {
    for (const key of this.hotkeys) {
      if (!this.pressKeys.has(key)) {
        return false
      }
    }
    return true
  }

  addBlurEvent() {
    const handler = () => {
      this.pressKeys.clear()
      this.isTrigger = false
      this.hide()
    }
    window.addEventListener('blur', handler)
    document.addEventListener('visibilitychange', handler)
  }

  addKeydownEvent() {
    window.addEventListener('keydown', e => {
      this.pressKeys.add(e.key)
      if (this.isTriggerHotkeys()) {
        this.isTrigger = true
      }
    })
  }

  addKeyupEvent() {
    window.addEventListener('keyup', e => {
      this.pressKeys.delete(e.key)
      if (!this.isTriggerHotkeys()) {
        this.isTrigger = false
        this.hide()
      }
    })
  }

  addMousemoveEvent() {
    const handler = (e: Event) => {
      if (this.isTrigger) {
        const targetNode = this.findNode(e.target)
        if (!targetNode || targetNode === document.body) {
          this.hide()
          e.preventDefault()
          e.stopPropagation()
          return
        }

        const rect = targetNode.getBoundingClientRect() as any
        this.show()
        this.updateTooltipContent(targetNode.getAttribute(this.attrs)!)
        this.updatePosition(rect)
      } else {
        this.hide()
      }

      e.preventDefault()
      e.stopPropagation()
    }
    window.addEventListener('mousemove', handler)
  }

  handleClick = (e: Event) => {
    const targetNode = this.findNode(e.target)
    let __file = ''
    if ((__file = targetNode.getAttribute(this.attrs) || '')) {
      const url = `${this.server}/__open-in-editor?file=${__file}`
      console.log('open', __file)
      fetch(url)
    }
    e.preventDefault()
    e.stopPropagation()
  }

  handlePointerdown = (e: Event) => {
    const target = e.target as HTMLElement
    if (this.isFormNode(target) && target.getAttribute('disabled')) {
      this.handleClick(e)
      return
    }
    e.preventDefault()
    e.stopPropagation()
  }

  isFormNode(el: HTMLElement) {
    return ['button', 'fieldset', 'optgroup', 'option', 'select', 'textarea', 'input'].includes(
      el.nodeName.toLowerCase()
    )
  }

  findNode(el: any): Element {
    while (el && el !== document.body && !(el as any).getAttribute(this.attrs)) {
      el = el.parentElement
    }

    return el
  }
}

;(window as any).CodeInspectorSelector = CodeInspectorSelector
