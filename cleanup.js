const fs = require('fs')
const path = require('path')

const tablesDir = path.join(__dirname, 'components/tables')
const files = fs.readdirSync(tablesDir).filter(f => f.endsWith('Table.tsx') && !f.includes('DigitalAsset'))

files.forEach(file => {
  const filePath = path.join(tablesDir, file)
  let content = fs.readFileSync(filePath, 'utf-8')
  
  if (!content.includes('ExpandableDetails')) return

  console.log(`Refactoring ${file}...`)

  // 1. Remove ExpandableDetails import
  content = content.replace(/import { ExpandableDetails } from '@\/components\/shared\/ExpandableDetails'\n/g, '')
  
  // 2. Remove Chevron icons from import
  content = content.replace(/, ChevronDown, ChevronRight/g, '')
  
  // 3. Remove viewFields array completely
  content = content.replace(/const viewFields: ViewField\[\] = \[[\s\S]*?\]\n/, '')
  content = content.replace(/import { ViewField } from '@\/components\/shared\/ViewDetailsDialog'\n/g, '')

  // 4. Remove expandedRow state
  content = content.replace(/const \[expandedRow, setExpandedRow\] = useState<number \| null>\(null\)\n/g, '')

  // 5. Remove onClick on TableRow
  content = content.replace(/<TableRow className="cursor-pointer hover:bg-slate-50 transition-colors" onClick=\{\(\) => setExpandedRow\(expandedRow === item\.id \? null : item\.id\)\}>/g, '<TableRow className="hover:bg-slate-50 transition-colors">')

  // 6. Remove Chevron toggle cell and unwrap the first column
  const firstColRegex = /<TableCell className="font-medium(?: whitespace-nowrap)?">\s*<div className="flex items-center gap-2">\s*\{expandedRow === item\.id \? <ChevronDown .*? \/> : <ChevronRight .*? \/>\}\s*<span>(.*?)<\/span>\s*<\/div>\s*<\/TableCell>/g
  content = content.replace(firstColRegex, '<TableCell className="font-medium whitespace-nowrap">$1</TableCell>')

  // 7. Remove ExpandableDetails rendering block
  const expandRenderRegex = /\{expandedRow === item\.id && \([\s\S]*?<\/TableRow>\s*\)\}\s*/g
  content = content.replace(expandRenderRegex, '')

  // We are NOT changing the actual columns yet, because some tables already have them, some have combined them.
  // Wait, if I just remove ExpandableDetails, the data will be HIDDEN because they were only shown in ExpandableDetails!
  // E.g., CameraTable had 8 columns in TableHead, but 12 fields in viewFields.
  // I need to generate the new columns and replace the old ones.

  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`Saved ${file}`)
})
