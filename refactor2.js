const fs = require('fs')
const path = require('path')

const tablesDir = path.join(__dirname, 'components/tables')
const files = fs.readdirSync(tablesDir).filter(f => f.endsWith('Table.tsx') && !f.includes('DigitalAsset'))

files.forEach(file => {
  const filePath = path.join(tablesDir, file)
  let content = fs.readFileSync(filePath, 'utf-8')
  
  if (!content.includes('ExpandableDetails')) return
  console.log(`\n--- Refactoring ${file} ---`)

  const viewFieldsMatch = content.match(/const viewFields: ViewField\[\] = \[([\s\S]*?)\]\s*return/m)
  if (!viewFieldsMatch) {
    console.log('viewFields not found')
    return
  }
  const viewFieldsStr = viewFieldsMatch[1]
  
  const fieldRegex = /\{\s*label:\s*['"]([^'"]+)['"],\s*key:\s*['"]([^'"]+)['"](.*?)\}/g
  let match
  let heads = ''
  let cells = ''
  let count = 0

  while ((match = fieldRegex.exec(viewFieldsStr)) !== null) {
    const label = match[1]
    const key = match[2]
    const isDate = match[3].includes('isDate: true')
    const isBadge = match[3].includes('isBadge: true')
    const isUrl = match[3].includes('isUrl: true')
    
    heads += `            <SortableTableHead label="${label}" sortKey="${key}" currentSort={sortConfig} onRequestSort={requestSort} currentFilter={columnFilters['${key}']} onFilterChange={setColumnFilter} data={data} />\n`
    
    let cellContent = `{item.${key} || "-"}`
    if (isDate) {
      cellContent = `{item.${key} ? new Date(item.${key}).toLocaleDateString('id-ID') : '-'}`
    } else if (isBadge) {
      cellContent = `<Badge variant={item.${key} === 'Baik' || item.${key} === 'Terpasang' || item.${key} === 'Active' ? 'default' : 'secondary'} className={item.${key} === 'Baik' || item.${key} === 'Terpasang' ? 'bg-green-600 hover:bg-green-700' : ''}>{item.${key}}</Badge>`
    } else if (isUrl) {
      cellContent = `{item.${key} ? <a href={item.${key}} target="_blank" className="text-blue-600 hover:underline">Link</a> : '-'}`
    }
    
    cells += `              <TableCell className="whitespace-nowrap">${cellContent}</TableCell>\n`
    count++
  }
  
  // Find the action buttons block to preserve it
  const actionMatch = content.match(/(<TableCell[\s\S]*?<div className="flex gap-1 justify-center">[\s\S]*?<\/TableCell>)/)
  const aksi = actionMatch ? actionMatch[1] : ''

  // Special columns like Form ST
  const formSTMatch = content.match(/(<TableCell>\{item\.attachment_path \?[\s\S]*?<\/TableCell>)/)
  const formST = formSTMatch ? formSTMatch[1] : ''

  // TableHead actions
  const aksiHeadMatch = content.match(/(<TableHead[^>]*>Aksi<\/TableHead>)/)
  const aksiHead = aksiHeadMatch ? aksiHeadMatch[1] : '<TableHead className="whitespace-nowrap w-24">Aksi</TableHead>'

  const formSTHeadMatch = content.match(/(<TableHead>Form ST<\/TableHead>)/)
  const formSTHead = formSTHeadMatch ? formSTHeadMatch[1] : ''

  // Generate new Table block
  const newTable = `<Table className="whitespace-nowrap">
        <TableHeader>
          <TableRow>
${heads}${formSTHead ? '            ' + formSTHead + '\n' : ''}            ${aksiHead}
          </TableRow>
        </TableHeader>
        <TableBody>
          {processedData.map((item: any) => (
            <React.Fragment key={item.id}>
              <TableRow className="hover:bg-slate-50 transition-colors">
${cells}${formST ? '  ' + formST + '\n' : ''}  ${aksi}
              </TableRow>
            </React.Fragment>
          ))}
          {data.length === 0 && (
            <TableRow><TableCell colSpan={${count + (formST ? 1 : 0) + 1}} className="text-center py-6 text-muted-foreground">Tidak ada data</TableCell></TableRow>
          )}
        </TableBody>
      </Table>`

  // Replace Table block
  content = content.replace(/<Table[\s\S]*?<\/Table>/, newTable)

  // Remove ExpandableDetails imports and logic
  content = content.replace(/import { ExpandableDetails } from '@\/components\/shared\/ExpandableDetails'\n/g, '')
  content = content.replace(/, ChevronDown, ChevronRight/g, '')
  content = content.replace(/(\s*)const viewFields: ViewField\[\] = \[[\s\S]*?\]\n/g, '')
  content = content.replace(/import { ViewField } from '@\/components\/shared\/ViewDetailsDialog'\n/g, '')
  content = content.replace(/(\s*)const \[expandedRow, setExpandedRow\] = useState<number \| null>\(null\)\n/g, '')

  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`Saved ${file}`)
})
