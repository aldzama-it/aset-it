const fs = require('fs')
const path = require('path')

const chartsDir = path.join(__dirname, 'components/dashboard')
const files = fs.readdirSync(chartsDir).filter(f => f.endsWith('Chart.tsx'))

files.forEach(file => {
  const filePath = path.join(chartsDir, file)
  let content = fs.readFileSync(filePath, 'utf-8')
  
  if (content.includes('minWidth={1}')) return

  content = content.replace(/<ResponsiveContainer width="100%" height="100%">/g, '<ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>')

  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`Saved ${file}`)
})
