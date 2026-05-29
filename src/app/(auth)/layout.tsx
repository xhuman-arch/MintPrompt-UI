// Auth group layout — renders children directly, no sidebar.
// Used for /admin/login.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
