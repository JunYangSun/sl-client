'use client'

import * as React from 'react'

export function MarqueeController({
  targetId,
  toggleOnClick = true,
}: {
  targetId: string
  toggleOnClick?: boolean
}) {
  React.useEffect(() => {
    const root = document.getElementById(targetId)
    if (!root) {
      console.warn('[MarqueeController] root not found:', targetId)
      return
    }

    let pressing = false
    let toggled = root.getAttribute('data-toggled') === 'true'
    let moved = false
    let startX = 0
    let startY = 0

    const setAttr = (k: string, v: boolean) => root.setAttribute(k, v ? 'true' : 'false')
    const setPressing = (v: boolean) => {
      pressing = v
      setAttr('data-pressing', v)
    }
    const setToggled = (v: boolean) => {
      toggled = v
      setAttr('data-toggled', v)
    }
    const setIgnoreHover = (v: boolean) => setAttr('data-ignore-hover', v)

    const inside = (t: EventTarget | null) => !!t && root.contains(t as Node)

    // 当用户“点击恢复”时，鼠标还悬停会被 hover 再次暂停，所以恢复时临时忽略 hover
    const enableIgnoreHoverIfStillHover = () => {
      // 只有鼠标指针才需要
      // root.matches(':hover') 在现代浏览器可用
      try {
        if (root.matches(':hover')) setIgnoreHover(true)
      } catch {}
    }

    const onMouseLeave = () => {
      // 鼠标移开后，允许 hover 再次生效
      setIgnoreHover(false)
      setPressing(false)
    }

    // 统一在 document capture 抓事件（防止子元素阻止冒泡）
    const onPointerDownDoc = (e: PointerEvent) => {
      if (!inside(e.target)) return

      // 暂停状态下：任意按下立即恢复（最稳，不依赖 click/pointerup）
      if (toggleOnClick && toggled) {
        setToggled(false)
        setPressing(false)
        enableIgnoreHoverIfStillHover()
        return
      }

      // 非锁定暂停：按下进入 pressing（临时暂停）
      moved = false
      startX = e.clientX
      startY = e.clientY
      setPressing(true)
    }

    const onPointerMoveDoc = (e: PointerEvent) => {
      if (!inside(e.target)) return
      if (!pressing) return
      const dx = Math.abs(e.clientX - startX)
      const dy = Math.abs(e.clientY - startY)
      if (dx + dy > 8) moved = true
    }

    const onPointerUpDoc = (e: PointerEvent) => {
      if (!inside(e.target)) return
      if (!pressing) return

      setPressing(false)

      // 非滑动且开启 toggle：一次 tap 锁定暂停
      if (toggleOnClick && !moved) {
        setToggled(true)
        // 锁定暂停时不需要 ignore-hover
        setIgnoreHover(false)
      }
    }

    const onPointerCancelDoc = (e: PointerEvent) => {
      if (!inside(e.target)) return
      setPressing(false)
    }

    // 绑定（capture=true）
    document.addEventListener('pointerdown', onPointerDownDoc, true)
    document.addEventListener('pointermove', onPointerMoveDoc, true)
    document.addEventListener('pointerup', onPointerUpDoc, true)
    document.addEventListener('pointercancel', onPointerCancelDoc, true)

    // mouseleave 用 root 监听即可
    root.addEventListener('mouseleave', onMouseLeave)

    return () => {
      document.removeEventListener('pointerdown', onPointerDownDoc, true)
      document.removeEventListener('pointermove', onPointerMoveDoc, true)
      document.removeEventListener('pointerup', onPointerUpDoc, true)
      document.removeEventListener('pointercancel', onPointerCancelDoc, true)
      root.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [targetId, toggleOnClick])

  return null
}
