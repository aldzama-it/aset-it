import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X, Plus } from 'lucide-react'

export function AccessoriesInput({ value = [], onChange }: { value: string[], onChange: (v: string[]) => void }) {
  const [text, setText] = useState('')
  
  const add = () => {
    if (text.trim()) {
      onChange([...value, text.trim()])
      setText('')
    }
  }

  const remove = (index: number) => {
    const next = [...value]
    next.splice(index, 1)
    onChange(next)
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input 
          value={text} 
          onChange={e => setText(e.target.value)} 
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            }
          }} 
          placeholder="Tambah aksesoris..." 
        />
        <Button type="button" variant="secondary" onClick={add}><Plus className="w-4 h-4" /></Button>
      </div>
      {value.length > 0 && (
        <ul className="space-y-1">
          {value.map((v, i) => (
            <li key={i} className="flex items-center justify-between bg-muted px-3 py-1 text-sm rounded-md">
              {v}
              <button type="button" onClick={() => remove(i)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
