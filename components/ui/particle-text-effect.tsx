"use client"

import { useEffect, useRef } from "react"

/* ─── types ──────────────────────────────────────────────────────────────── */
interface Vector2D { x: number; y: number }
interface RGB { r: number; g: number; b: number }

/* Terminal-green palette — one per word, cycles */
const GREEN_PALETTE: RGB[] = [
  { r: 0,   g: 255, b: 65  }, // #00ff41  matrix bright
  { r: 0,   g: 204, b: 51  }, // #00cc33  mid green
  { r: 0,   g: 230, b: 110 }, // aqua-green
  { r: 60,  g: 255, b: 80  }, // lime-green
  { r: 0,   g: 180, b: 60  }, // darker green
  { r: 0,   g: 255, b: 160 }, // cyan-green
]

/* ─── Particle class ─────────────────────────────────────────────────────── */
class Particle {
  pos: Vector2D = { x: 0, y: 0 }
  vel: Vector2D = { x: 0, y: 0 }
  acc: Vector2D = { x: 0, y: 0 }
  target: Vector2D = { x: 0, y: 0 }

  closeEnoughTarget = 100
  maxSpeed  = 1.0
  maxForce  = 0.1
  particleSize = 10
  isKilled  = false

  startColor: RGB  = { r: 0, g: 0, b: 0 }
  targetColor: RGB = { r: 0, g: 0, b: 0 }
  colorWeight    = 0
  colorBlendRate = 0.01

  move() {
    let proximityMult = 1
    const dx = this.pos.x - this.target.x
    const dy = this.pos.y - this.target.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    if (distance < this.closeEnoughTarget) proximityMult = distance / this.closeEnoughTarget

    const toTarget = { x: this.target.x - this.pos.x, y: this.target.y - this.pos.y }
    const mag = Math.sqrt(toTarget.x ** 2 + toTarget.y ** 2)
    if (mag > 0) {
      toTarget.x = (toTarget.x / mag) * this.maxSpeed * proximityMult
      toTarget.y = (toTarget.y / mag) * this.maxSpeed * proximityMult
    }

    const steer = { x: toTarget.x - this.vel.x, y: toTarget.y - this.vel.y }
    const steerMag = Math.sqrt(steer.x ** 2 + steer.y ** 2)
    if (steerMag > 0) {
      steer.x = (steer.x / steerMag) * this.maxForce
      steer.y = (steer.y / steerMag) * this.maxForce
    }

    this.acc.x += steer.x; this.acc.y += steer.y
    this.vel.x += this.acc.x; this.vel.y += this.acc.y
    this.pos.x += this.vel.x; this.pos.y += this.vel.y
    this.acc.x = 0; this.acc.y = 0
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.colorWeight < 1.0) this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0)
    const c = {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
    }
    ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`
    ctx.fillRect(this.pos.x, this.pos.y, 2, 2)
  }

  kill(width: number, height: number) {
    if (!this.isKilled) {
      const rp = randomOffscreen(width / 2, height / 2, (width + height) / 2)
      this.target.x = rp.x; this.target.y = rp.y
      this.startColor = blendColor(this.startColor, this.targetColor, this.colorWeight)
      this.targetColor = { r: 0, g: 0, b: 0 }
      this.colorWeight = 0
      this.isKilled = true
    }
  }
}

/* ─── helpers ────────────────────────────────────────────────────────────── */
function randomOffscreen(cx: number, cy: number, mag: number): Vector2D {
  const dir = { x: Math.random() * 1000 - cx, y: Math.random() * 500 - cy }
  const m = Math.sqrt(dir.x ** 2 + dir.y ** 2)
  if (m > 0) { dir.x = (dir.x / m) * mag; dir.y = (dir.y / m) * mag }
  return { x: cx + dir.x, y: cy + dir.y }
}

function blendColor(a: RGB, b: RGB, w: number): RGB {
  return {
    r: Math.round(a.r + (b.r - a.r) * w),
    g: Math.round(a.g + (b.g - a.g) * w),
    b: Math.round(a.b + (b.b - a.b) * w),
  }
}

/* ─── Component ─────────────────────────────────────────────────────────── */
interface ParticleTextEffectProps {
  words?: string[]
  /** ms between word transitions (default 3500) */
  interval?: number
}

const DEFAULT_WORDS = ["ATLAS", "AI SYSTEMS", "C++ 20", "ENGINEER", "FULL STACK"]

export function ParticleTextEffect({
  words    = DEFAULT_WORDS,
  interval = 3500,
}: ParticleTextEffectProps) {
  const canvasRef       = useRef<HTMLCanvasElement>(null)
  const animationRef    = useRef<number>()
  const particlesRef    = useRef<Particle[]>([])
  const frameCountRef   = useRef(0)
  const wordIndexRef    = useRef(0)
  const lastWordTimeRef = useRef(0)
  const mouseRef        = useRef({ x: 0, y: 0, isPressed: false, rightClick: false })

  /* Interval expressed in frames at ~60 fps */
  const intervalFrames = Math.round((interval / 1000) * 60)

  function spawnWord(word: string, canvas: HTMLCanvasElement, colorIndex: number) {
    const off    = document.createElement("canvas")
    off.width    = canvas.width
    off.height   = canvas.height
    const offCtx = off.getContext("2d")!

    offCtx.fillStyle    = "white"
    offCtx.font         = `bold ${Math.floor(canvas.height * 0.22)}px "JetBrains Mono", monospace`
    offCtx.textAlign    = "center"
    offCtx.textBaseline = "middle"
    offCtx.fillText(word, canvas.width / 2, canvas.height / 2)

    const pixels = offCtx.getImageData(0, 0, canvas.width, canvas.height).data
    const color  = GREEN_PALETTE[colorIndex % GREEN_PALETTE.length]

    const particles = particlesRef.current
    let   pIdx      = 0

    /* collect lit pixel indices and shuffle for fluid formation */
    const litIndices: number[] = []
    for (let i = 0; i < pixels.length; i += 6 * 4) if (pixels[i + 3] > 0) litIndices.push(i)
    for (let i = litIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [litIndices[i], litIndices[j]] = [litIndices[j], litIndices[i]]
    }

    for (const idx of litIndices) {
      const x = (idx / 4) % canvas.width
      const y = Math.floor(idx / 4 / canvas.width)
      let p: Particle

      if (pIdx < particles.length) {
        p = particles[pIdx]
        p.isKilled = false
        pIdx++
      } else {
        p = new Particle()
        const rp = randomOffscreen(canvas.width / 2, canvas.height / 2, (canvas.width + canvas.height) / 2)
        p.pos.x       = rp.x; p.pos.y = rp.y
        p.maxSpeed    = Math.random() * 6 + 4
        p.maxForce    = p.maxSpeed * 0.05
        p.particleSize   = Math.random() * 6 + 6
        p.colorBlendRate = Math.random() * 0.027 + 0.003
        particles.push(p)
      }

      p.startColor  = blendColor(p.startColor, p.targetColor, p.colorWeight)
      p.targetColor = color
      p.colorWeight = 0
      p.target.x = x; p.target.y = y
    }

    /* kill surplus particles */
    for (let i = pIdx; i < particles.length; i++) particles[i].kill(canvas.width, canvas.height)
  }

  function animate() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx       = canvas.getContext("2d")!
    const particles = particlesRef.current

    /* trail fade — very dark, so the glow lingers */
    ctx.fillStyle = "rgba(0,0,0,0.12)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.move(); p.draw(ctx)
      if (p.isKilled && (p.pos.x < 0 || p.pos.x > canvas.width || p.pos.y < 0 || p.pos.y > canvas.height)) {
        particles.splice(i, 1)
      }
    }

    /* right-click destroy */
    if (mouseRef.current.isPressed && mouseRef.current.rightClick) {
      particles.forEach((p) => {
        const d = Math.hypot(p.pos.x - mouseRef.current.x, p.pos.y - mouseRef.current.y)
        if (d < 60) p.kill(canvas.width, canvas.height)
      })
    }

    /* advance words on interval */
    frameCountRef.current++
    if (frameCountRef.current - lastWordTimeRef.current >= intervalFrames) {
      lastWordTimeRef.current = frameCountRef.current
      wordIndexRef.current    = (wordIndexRef.current + 1) % words.length
      spawnWord(words[wordIndexRef.current], canvas, wordIndexRef.current)
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width  = 1000
    canvas.height = 400

    spawnWord(words[0], canvas, 0)
    animate()

    const getPos = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      const scaleX = canvas.width  / r.width
      const scaleY = canvas.height / r.height
      return { x: (e.clientX - r.left) * scaleX, y: (e.clientY - r.top) * scaleY }
    }

    const onDown  = (e: MouseEvent) => {
      const p = getPos(e)
      mouseRef.current = { ...p, isPressed: true, rightClick: e.button === 2 }
    }
    const onUp    = () => { mouseRef.current.isPressed = false; mouseRef.current.rightClick = false }
    const onMove  = (e: MouseEvent) => { const p = getPos(e); mouseRef.current.x = p.x; mouseRef.current.y = p.y }
    const onCtx   = (e: MouseEvent) => e.preventDefault()

    canvas.addEventListener("mousedown",    onDown)
    canvas.addEventListener("mouseup",      onUp)
    canvas.addEventListener("mousemove",    onMove)
    canvas.addEventListener("contextmenu",  onCtx)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      canvas.removeEventListener("mousedown",   onDown)
      canvas.removeEventListener("mouseup",     onUp)
      canvas.removeEventListener("mousemove",   onMove)
      canvas.removeEventListener("contextmenu", onCtx)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: "auto", display: "block" }}
      aria-label={`Animated particle text cycling: ${words.join(", ")}`}
    />
  )
}
