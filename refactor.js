const fs = require('fs')
const path = require('path')

const tablesDir = path.join(__dirname, 'components/tables')
const files = fs.readdirSync(tablesDir).filter(f => f.endsWith('Table.tsx') && !f.includes('DigitalAsset'))

function toTitleCase(str) {
  return str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

files.forEach(file => {
  const filePath = path.join(tablesDir, file)
  let content = fs.readFileSync(filePath, 'utf-8')
  
  if (!content.includes('ExpandableDetails')) return

  console.log(`Refactoring ${file}...`)

  // Extract viewFields array
  const viewFieldsMatch = content.match(/const viewFields: ViewField\[\] = \[([\s\S]*?)\]\n/)
  if (!viewFieldsMatch) return
  
  const viewFieldsStr = viewFieldsMatch[1]
  const viewFields = []
  
  const fieldRegex = /\{\s*label:\s*['"]([^'"]+)['"],\s*key:\s*['"]([^'"]+)['"](.*?)\}/g
  let match
  while ((match = fieldRegex.exec(viewFieldsStr)) !== null) {
    viewFields.push({
      label: match[1],
      key: match[2],
      isDate: match[3].includes('isDate: true'),
      isBadge: match[3].includes('isBadge: true'),
      isUrl: match[3].includes('isUrl: true')
    })
  }

  // Generate TableHeads
  let tableHeads = ''
  let tableCells = ''

  viewFields.forEach(field => {
    tableHeads += `            <SortableTableHead label="${field.label}" sortKey="${field.key}" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['${field.key}']} onFilterChange={setColumnFilter} data={data} />\n`
    
    let cellContent = ''
    if (field.isDate) {
      cellContent = `{${field.key} ? new Date(${field.key}).toLocaleDateString('id-ID') : '-'}`
    } else if (field.isBadge) {
      cellContent = `<Badge variant={${field.key} === 'Baik' || ${field.key} === 'Terpasang' || ${field.key} === 'Active' ? 'default' : 'secondary'}>{${field.key}}</Badge>`
    } else if (field.isUrl) {
      cellContent = `{${field.key} ? <a href={${field.key}} target="_blank" className="text-blue-600 hover:underline">Link</a> : '-'}`
    } else {
      cellContent = `{${field.key} || "-"}`
    }
    
    // Some keys are inside `item.`
    cellContent = cellContent.replace(new RegExp(`{${field.key}`, 'g'), `{item.${field.key}`)
    
    tableCells += `              <TableCell className="whitespace-nowrap">${cellContent}</TableCell>\n`
  })

  // We need to replace the existing TableHead and TableCell blocks with the new generated ones.
  // Wait, some tables have custom actions or custom file attachments like in LaptopTable `attachment_path`.
  // It's safer to just replace the specific columns manually, but this script will generate them.
})
