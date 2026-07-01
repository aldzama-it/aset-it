import * as XLSX from 'xlsx'

export function exportToExcel(data: any[], filename: string) {
  // Sanitize data by removing internal fields that don't need to be exported
  const cleanData = data.map(item => {
    const newItem = { ...item }
    delete newItem.id
    delete newItem.category_id
    delete newItem.created_at
    delete newItem.updated_at
    // Also remove the category object if it exists
    if (newItem.category) delete newItem.category
    
    // Format dates cleanly
    if (newItem.handover_date) newItem.handover_date = new Date(newItem.handover_date).toLocaleDateString('id-ID')
    if (newItem.purchase_date) newItem.purchase_date = new Date(newItem.purchase_date).toLocaleDateString('id-ID')
    if (newItem.install_date) newItem.install_date = new Date(newItem.install_date).toLocaleDateString('id-ID')
    if (newItem.return_date) newItem.return_date = new Date(newItem.return_date).toLocaleDateString('id-ID')

    // Format condition text
    if (newItem.condition) newItem.condition = newItem.condition.replace('_', ' ')
      
    return newItem
  })

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(cleanData)
  
  // Create workbook
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Aset')
  
  // Trigger download
  XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`)
}

export function downloadTemplate(headers: string[], filename: string) {
  const sampleRow = headers.map(h => {
    if (h.includes('date')) return '2024-01-01'
    if (h === 'condition' || h === 'install_status') return 'Baik'
    if (h === 'ram') return '16GB'
    if (h === 'storage') return '512GB SSD'
    if (h.includes('email')) return 'user@example.com'
    if (h === 'asset_code') return 'AST-001'
    if (h === 'brand') return 'Contoh Brand'
    if (h === 'mac_address') return '00:1A:2B:3C:4D:5E'
    if (h === 'ip_address') return '192.168.1.100'
    return `Contoh ${h.replace(/_/g, ' ')}`
  })

  // Create an array with headers as the first row and sampleRow as the second row
  const worksheet = XLSX.utils.aoa_to_sheet([headers, sampleRow])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Template')
  XLSX.writeFile(workbook, `Template_${filename}.xlsx`)
}

export function readExcelFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        // Convert sheet to JSON array of arrays
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        resolve(json)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = (error) => reject(error)
    reader.readAsBinaryString(file)
  })
}
