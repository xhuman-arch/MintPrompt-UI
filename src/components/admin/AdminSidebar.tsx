'use client'

// ============================================================
// MintPrompt — AdminSidebar (Client Component)
// Sidebar nav with active link detection and sign-out.
// ============================================================

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'


interface Props { userEmail: string; userInitial: string }

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard',      icon: GridIcon },
  { href: '/admin/prompts',   label: 'Prompts',        icon: PhotoIcon },
  { href: '/admin/prompts/new', label: 'Upload New',   icon: PlusIcon },
  { href: '/admin/categories',  label: 'Categories',   icon: TagIcon },
  { href: '/admin/affiliate',   label: 'Affiliate Links', icon: LinkIcon },
  { href: '/admin/analytics',   label: 'Analytics',    icon: ChartIcon },
  { href: '/admin/settings',    label: 'Settings',     icon: CogIcon },
]

export function AdminSidebar({ userEmail, userInitial }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  function handleSignOut() {
    // Demo mode: no real auth session to clear
    router.push('/admin/login')
  }

  return (
    <aside className="admin-sidebar">
      <Link href="/admin/dashboard" className="sidebar-logo">
        <LogoDot />
        MintPrompt
        <span className="sidebar-badge">Admin</span>
      </Link>

      <div className="sidebar-section">
        <div className="sidebar-section-label">Navigation</div>
        {NAV.map(({ href, label, icon: Icon }) => {
          // Match exact for dashboard, prefix for others
          const active = href === '/admin/dashboard'
            ? pathname === href
            : pathname.startsWith(href) && href !== '/admin/prompts/new'
              ? pathname !== '/admin/prompts/new'
              : pathname === href
          return (
            <Link key={href} href={href}
              className={`sidebar-link ${active ? 'active' : ''}`}>
              <Icon />
              {label}
            </Link>
          )
        })}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{userInitial}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-email">{userEmail}</div>
          </div>
        </div>
        <button className="sidebar-link" style={{ marginTop: 4 }} onClick={handleSignOut}>
          <SignOutIcon /> Sign out
        </button>
        <Link href="/" className="sidebar-link" style={{ marginTop: 2 }}>
          <ExternalIcon /> View Site
        </Link>
      </div>
    </aside>
  )
}

function LogoDot() {
  return <span style={{ width:8,height:8,borderRadius:'50%',background:'#c8ff57',
    boxShadow:'0 0 8px #c8ff57',display:'inline-block',flexShrink:0 }} />
}
function GridIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
}
function PhotoIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <path d="M21 15l-5-5L5 21"/>
  </svg>
}
function PlusIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>
  </svg>
}
function TagIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
    <circle cx="7" cy="7" r="1"/>
  </svg>
}
function LinkIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
  </svg>
}
function ChartIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 20V10M12 20V4M6 20v-6"/>
  </svg>
}
function CogIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
}
function SignOutIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
}
function ExternalIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
}
