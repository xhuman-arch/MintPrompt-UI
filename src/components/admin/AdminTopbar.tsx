'use client'

// ============================================================
// MintPrompt — AdminTopbar (Client Component)
// ============================================================

interface Props {
  title: string
  children?: React.ReactNode
}

export function AdminTopbar({ title, children }: Props) {
  return (
    <div className="admin-topbar">
      <h1 className="admin-topbar-title">{title}</h1>
      {children && <div className="admin-topbar-actions">{children}</div>}
    </div>
  )
}
