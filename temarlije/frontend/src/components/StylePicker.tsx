import React from 'react'

type Style = 'visual' | 'reading' | 'kinesthetic' | 'audio'

export default function StylePicker({ value, onChange }: { value: Style, onChange: (s: Style) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Learning style picker">
      <Pill
        active={value === 'visual'}
        onClick={() => onChange('visual')}
        icon="#magnifier"
        label="Visual"
        title="Visual — Simplified first"
      />
      <Pill
        active={value === 'reading'}
        onClick={() => onChange('reading')}
        icon="#book"
        label="Reading/Writing"
        title="Reading/Writing — Elaborated first"
      />
      <Pill
        active={false}
        onClick={() => {}}
        icon="#puzzle"
        label="Kinesthetic"
        title="Kinesthetic — Coming soon"
        disabled
      />
      <Pill
        active={false}
        onClick={() => {}}
        icon="#audio"
        label="Audio"
        title="Audio — Coming soon"
        disabled
      />
    </div>
  )
}

function Pill({ active, onClick, icon, label, disabled, title }: { active: boolean; onClick: () => void; icon: string; label: string; disabled?: boolean; title?: string }) {
  return (
    <button
      className={`px-3 py-1.5 rounded-full border text-sm inline-flex items-center gap-2 ${active ? 'bg-brand/20 border-brand/40' : 'bg-white/5 border-white/10 hover:bg-white/10'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      title={title || label}
      aria-label={title || label}
    >
      <svg className="w-4 h-4"><use href={icon} /></svg>
      <span>{label}</span>
    </button>
  )
}
