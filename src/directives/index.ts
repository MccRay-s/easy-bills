import type { DirectiveBinding } from 'vue'
import { position } from '~/logic/index'
/**
 * 拖拽指令
 */
export const vDrag = {
  mounted: (el: HTMLElement, binding: DirectiveBinding<string>): any => {
    let offsetX: number; let offsetY: number, beginTime: number, endTime: number
    const value = binding.value || ''
    const isLT = value.toUpperCase() === 'LT'
    // 移动
    const move: { (this: Document, event: MouseEvent): void } = function(ev: MouseEvent) {
      const { clientX, clientY } = ev
      // 基于左上 固定
      let x: number, y: number
      if (isLT) {
        x = clientX - offsetX
        y = clientY - offsetY
        el.style.left = `${x}px`
        el.style.top = `${y}px`
      }
      // 基于 右下 固定
      else {
        // clientWidth， clientHeight 是去除滚动条后的宽高
        const { clientWidth } = window.document.body
        const { innerHeight } = window
        x = clientWidth - clientX - offsetX
        y = innerHeight - clientY - offsetY
        el.style.right = `${x}px`
        el.style.bottom = `${y}px`
      }
      position.value = { x, y }
    }
    // 松开
    const up: { (this: Document, event: MouseEvent): void } = function(/* ev: MouseEvent */) {
      endTime = new Date().getTime()
      if (endTime - beginTime > 200)
        el.setAttribute('action', 'darg')

      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
    }
    // 点击
    const down: { (this: HTMLElement, event: MouseEvent): void } = function(ev: MouseEvent) {
      beginTime = new Date().getTime()
      // 鼠标位置
      const { clientX, clientY } = ev
      const { offsetLeft, offsetTop } = el
      // 基于 左上 固定
      if (isLT) {
        offsetX = clientX - offsetLeft
        offsetY = clientY - offsetTop
      }
      // 基于 右下 固定
      else {
        const { offsetWidth, offsetHeight } = el
        offsetX = offsetLeft + offsetWidth - clientX
        offsetY = offsetTop + offsetHeight - clientY
      }
      // action 表示，以处理点击事件冲突
      el.setAttribute('action', 'open')
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    }
    el.addEventListener('mousedown', down)
  },
}
