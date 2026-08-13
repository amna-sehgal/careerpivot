import { useState, KeyboardEvent } from 'react'
import { X } from 'lucide-react'

interface Props {
  label: string; placeholder: string; tags: string[]
  onChange: (tags: string[]) => void; suggestions?: string[]
}

export default function TagInput({ label, placeholder, tags, onChange, suggestions = [] }: Props) {
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)

  const filtered = suggestions.filter(s => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s))

  const add = (tag: string) => {
    const t = tag.trim()
    if (t && !tags.includes(t)) onChange([...tags, t])
    setInput(''); setOpen(false)
  }
  const remove = (tag: string) => onChange(tags.filter(t => t !== tag))

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(input) }
    if (e.key === 'Backspace' && !input && tags.length) remove(tags[tags.length - 1])
  }

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-charcoal mb-2">{label}</label>
      <div
        className="min-h-[52px] w-full rounded-2xl border border-violet-100 bg-white px-3 py-2.5 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-violet-400 focus-within:border-transparent transition-all cursor-text"
        onClick={() => document.getElementById(`ti-${label}`)?.focus()}
      >
        {tags.map(tag => (
          <span key={tag} className="badge bg-violet-100 text-violet-700 border border-violet-200">
            {tag}
            <button onClick={() => remove(tag)} className="hover:text-red-500 transition-colors ml-0.5"><X size={11}/></button>
          </span>
        ))}
        <input
          id={`ti-${label}`}
          value={input}
          onChange={e => { setInput(e.target.value); setOpen(true) }}
          onKeyDown={onKey}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[130px] border-none outline-none text-sm bg-transparent text-charcoal placeholder:text-gray-400"
        />
      </div>
      {open && filtered.length > 0 && input && (
        <div className="absolute z-20 mt-1 w-full glass-card rounded-2xl py-2 shadow-float border border-violet-100">
          {filtered.slice(0, 7).map(s => (
            <button key={s} onMouseDown={() => add(s)}
              className="w-full text-left px-4 py-2 text-sm font-medium text-charcoal hover:bg-violet-50 transition-colors">
              {s}
            </button>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400 mt-1.5">Press Enter or comma to add a tag</p>
    </div>
  )
}
