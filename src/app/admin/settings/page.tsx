// ============================================================
// MintPrompt — /admin/settings (DEMO MODE)
// ============================================================

import type { Metadata } from 'next'
import { AdminTopbar } from '@/components/admin/AdminTopbar'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  return (
    <>
      <AdminTopbar title="Settings" />
      <div className="admin-content">

        {/* Demo banner */}
        <div className="form-feedback" style={{
          background: 'rgba(200,255,87,0.08)',
          border: '1px solid rgba(200,255,87,0.3)',
          color: '#c8ff57',
          borderRadius: 8,
          padding: '10px 14px',
          fontSize: 13,
          marginBottom: 20,
        }}>
          🎭 <strong>Demo Mode</strong> — Settings are read-only in the public showcase.
          Connect a real Supabase project to enable full admin features.
        </div>

        {/* Account info */}
        <div className="form-section">
          <div className="form-section-title">Account</div>
          <div className="form-row form-row-2">
            <div className="field">
              <label className="field-label">Email</label>
              <input className="field-input" value="demo@mintprompt.com" disabled
                style={{ opacity:0.6, cursor:'not-allowed' }} readOnly />
              <span className="field-hint">Demo mode — connect Supabase Auth to manage real admin users.</span>
            </div>
            <div className="field">
              <label className="field-label">Role</label>
              <input className="field-input" value="Demo Admin" disabled style={{ opacity:0.6, cursor:'not-allowed' }} readOnly />
            </div>
          </div>
        </div>

        {/* Site config */}
        <div className="form-section">
          <div className="form-section-title">Site Configuration</div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[
              { label:'Mode',               val: '🎭 Demo / Showcase',                           ok: true },
              { label:'App URL',            val: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000', ok: true },
              { label:'Supabase URL',       val: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Connected' : '✗ Not configured (demo mode)', ok: !!process.env.NEXT_PUBLIC_SUPABASE_URL },
              { label:'Supabase Anon Key',  val: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Not set (demo mode)', ok: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
              { label:'Service Role Key',   val: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓ Set' : '✗ Not set (demo mode)', ok: !!process.env.SUPABASE_SERVICE_ROLE_KEY },
            ].map(item => (
              <div key={item.label} style={{ display:'flex', justifyContent:'space-between',
                alignItems:'center', padding:'10px 14px', background:'var(--bg3)',
                border:'1px solid var(--border2)', borderRadius:'var(--r2)' }}>
                <span style={{ fontSize:13, color:'var(--muted)' }}>{item.label}</span>
                <span style={{ fontSize:12, fontFamily:'monospace',
                  color: item.ok ? 'var(--accent)' : '#ff6b6b' }}>
                  {item.val}
                </span>
              </div>
            ))}
          </div>
          <p style={{ fontSize:11, color:'var(--muted2)', marginTop:12, lineHeight:1.6 }}>
            Copy <code>.env.example</code> → <code>.env.local</code> and fill in your Supabase credentials
            to switch from demo mode to a live database.
          </p>
        </div>

        {/* Quick links */}
        <div className="form-section">
          <div className="form-section-title">Quick Links</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
            {[
              { label:'Supabase Dashboard', url:'https://supabase.com/dashboard' },
              { label:'View Public Site',   url:'/' },
              { label:'GitHub Repo',        url:'https://github.com' },
            ].map(l => (
              <a key={l.label} href={l.url}
                target={l.url.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                {l.label} ↗
              </a>
            ))}
          </div>
        </div>

        {/* Setup guide */}
        <div className="form-section">
          <div className="form-section-title">Connecting a Real Backend</div>
          <div style={{ fontSize:13, color:'var(--muted)', lineHeight:1.8 }}>
            <p>To connect MintPrompt to a real Supabase project:</p>
            <ol style={{ paddingLeft:20, marginTop:10, display:'flex', flexDirection:'column', gap:6 }}>
              <li>Create a project at <strong>supabase.com</strong></li>
              <li>Run <code>supabase/schema.sql</code> in the SQL editor</li>
              <li>Apply migrations from <code>supabase/migrations/</code></li>
              <li>Copy <code>.env.example</code> → <code>.env.local</code> and fill in credentials</li>
              <li>Restart the dev server — the app will automatically use live data</li>
            </ol>
          </div>
        </div>
      </div>
    </>
  )
}
