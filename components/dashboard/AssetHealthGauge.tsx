'use client'

import { useEffect, useRef } from 'react'

interface AssetHealthGaugeProps {
  score: number // 0-100
  size?: number
}

function getScoreConfig(score: number) {
  if (score >= 80) return { label: 'Sangat Sehat', color: '#10B981', bg: 'from-emerald-500/20 to-emerald-500/5', text: 'text-emerald-400', ring: '#10B981' }
  if (score >= 60) return { label: 'Baik', color: '#3B82F6', bg: 'from-blue-500/20 to-blue-500/5', text: 'text-blue-400', ring: '#3B82F6' }
  if (score >= 40) return { label: 'Perlu Perhatian', color: '#F59E0B', bg: 'from-amber-500/20 to-amber-500/5', text: 'text-amber-400', ring: '#F59E0B' }
  return { label: 'Kritis', color: '#EF4444', bg: 'from-red-500/20 to-red-500/5', text: 'text-red-400', ring: '#EF4444' }
}

export function AssetHealthGauge({ score, size = 160 }: AssetHealthGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const config = getScoreConfig(score)
  const animRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const radius = size / 2 - 14
    const startAngle = Math.PI * 0.75     // 135°
    const totalAngle = Math.PI * 1.5      // 270° sweep
    const lineWidth = 14

    let animScore = 0
    const targetScore = score

    const draw = (current: number) => {
      ctx.clearRect(0, 0, size, size)

      // Track background
      ctx.beginPath()
      ctx.arc(cx, cy, radius, startAngle, startAngle + totalAngle)
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'
      ctx.lineWidth = lineWidth
      ctx.lineCap = 'round'
      ctx.stroke()

      // Colored progress arc
      if (current > 0) {
        const endAngle = startAngle + (totalAngle * current) / 100
        const gradient = ctx.createLinearGradient(0, 0, size, size)
        gradient.addColorStop(0, config.color + 'CC')
        gradient.addColorStop(1, config.color)

        ctx.beginPath()
        ctx.arc(cx, cy, radius, startAngle, endAngle)
        ctx.strokeStyle = gradient
        ctx.lineWidth = lineWidth
        ctx.lineCap = 'round'
        ctx.stroke()

        // Glow effect at tip
        const tipAngle = endAngle
        const tipX = cx + Math.cos(tipAngle) * radius
        const tipY = cy + Math.sin(tipAngle) * radius
        const glow = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 16)
        glow.addColorStop(0, config.color + '80')
        glow.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(tipX, tipY, 16, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()
      }
    }

    const animate = () => {
      if (animScore < targetScore) {
        animScore = Math.min(animScore + 1.5, targetScore)
        draw(animScore)
        animRef.current = requestAnimationFrame(animate)
      } else {
        draw(targetScore)
      }
    }

    animRef.current = requestAnimationFrame(animate)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [score, size, config.color])

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <canvas ref={canvasRef} style={{ width: size, height: size }} />
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold font-poppins ${config.text}`}>
            {score}
          </span>
          <span className="text-slate-400 text-[10px] font-medium tracking-widest uppercase mt-0.5">
            / 100
          </span>
        </div>
      </div>
      <div className={`text-xs font-semibold tracking-wide ${config.text}`}>
        {config.label}
      </div>
    </div>
  )
}
