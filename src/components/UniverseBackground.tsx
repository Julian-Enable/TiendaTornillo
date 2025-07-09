import { useRef, useEffect } from 'react'

const STAR_COLOR = 'rgba(255,255,255,0.95)'
const STAR_COLOR_BLUE = 'rgba(120,180,255,0.85)'
const BG_COLOR = '#0a1026' // Azul muy oscuro
const STAR_COUNT = 140
const STAR_MIN_RADIUS = 0.8
const STAR_MAX_RADIUS = 1.8
const STAR_MIN_SPEED = 0.03
const STAR_MAX_SPEED = 0.10

const SHOOTING_STAR_COLOR = 'rgba(255,255,255,0.85)'
const SHOOTING_STAR_MIN_LENGTH = 120
const SHOOTING_STAR_MAX_LENGTH = 220
const SHOOTING_STAR_MIN_SPEED = 8
const SHOOTING_STAR_MAX_SPEED = 16
const SHOOTING_STAR_CHANCE = 0.012 // Probabilidad por frame

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a)
}

function createStar(width: number, height: number) {
  const color = Math.random() > 0.8 ? STAR_COLOR_BLUE : STAR_COLOR
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    r: randomBetween(STAR_MIN_RADIUS, STAR_MAX_RADIUS),
    speed: randomBetween(STAR_MIN_SPEED, STAR_MAX_SPEED),
    alpha: randomBetween(0.7, 1),
    alphaDir: Math.random() > 0.5 ? 1 : -1,
    color,
  }
}

function createShootingStar(width: number, height: number) {
  // Aparecen desde la parte superior o superior izquierda
  const fromLeft = Math.random() < 0.5
  const x = fromLeft ? -randomBetween(40, 100) : randomBetween(0, width)
  const y = fromLeft ? randomBetween(0, height * 0.3) : -randomBetween(40, 100)
  const angle = fromLeft ? randomBetween(Math.PI / 6, Math.PI / 3) : randomBetween(Math.PI / 4, Math.PI / 2.5)
  const length = randomBetween(SHOOTING_STAR_MIN_LENGTH, SHOOTING_STAR_MAX_LENGTH)
  const speed = randomBetween(SHOOTING_STAR_MIN_SPEED, SHOOTING_STAR_MAX_SPEED)
  return {
    x,
    y,
    angle,
    length,
    speed,
    progress: 0,
    alpha: 1
  }
}

const UniverseBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<any[]>([])
  const shootingStarsRef = useRef<any[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height

    // Crear estrellas
    starsRef.current = Array.from({ length: STAR_COUNT }, () => createStar(width, height))
    shootingStarsRef.current = []

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      // Reposicionar estrellas
      starsRef.current = starsRef.current.map(() => createStar(width, height))
    }
    window.addEventListener('resize', resize)

    function animate() {
      ctx.fillStyle = BG_COLOR
      ctx.fillRect(0, 0, width, height)
      // Estrellas normales
      for (const star of starsRef.current) {
        // Parpadeo
        star.alpha += 0.008 * star.alphaDir
        if (star.alpha > 1) { star.alpha = 1; star.alphaDir = -1 }
        if (star.alpha < 0.7) { star.alpha = 0.7; star.alphaDir = 1 }
        // Movimiento lento hacia abajo
        star.y += star.speed
        if (star.y > height) {
          star.x = Math.random() * width
          star.y = 0
        }
        ctx.save()
        ctx.globalAlpha = star.alpha
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI)
        ctx.fillStyle = star.color
        ctx.shadowColor = star.color
        ctx.shadowBlur = 12
        ctx.fill()
        ctx.restore()
      }
      // Estrellas fugaces
      // Probabilidad de aparición
      if (Math.random() < SHOOTING_STAR_CHANCE) {
        shootingStarsRef.current.push(createShootingStar(width, height))
      }
      // Dibujar y actualizar estrellas fugaces
      for (let i = shootingStarsRef.current.length - 1; i >= 0; i--) {
        const s = shootingStarsRef.current[i]
        const dx = Math.cos(s.angle) * s.speed
        const dy = Math.sin(s.angle) * s.speed
        s.x += dx
        s.y += dy
        s.progress += s.speed
        s.alpha -= 0.012
        ctx.save()
        ctx.globalAlpha = Math.max(0, s.alpha)
        ctx.strokeStyle = SHOOTING_STAR_COLOR
        ctx.lineWidth = 2.2
        ctx.shadowColor = SHOOTING_STAR_COLOR
        ctx.shadowBlur = 16
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x - Math.cos(s.angle) * s.length, s.y - Math.sin(s.angle) * s.length)
        ctx.stroke()
        ctx.restore()
        // Eliminar si sale de pantalla o se desvanece
        if (s.x > width + 100 || s.y > height + 100 || s.alpha <= 0) {
          shootingStarsRef.current.splice(i, 1)
        }
      }
      requestAnimationFrame(animate)
    }
    animate()
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        background: BG_COLOR,
      }}
      aria-hidden="true"
    />
  )
}

export default UniverseBackground 