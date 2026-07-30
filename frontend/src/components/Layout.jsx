import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-line">
        <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
          <Link to="/" className="font-display font-bold tracking-tight text-ink">
            Articulate
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link
              to="/"
              className={pathname === '/' ? 'text-ink font-medium' : 'text-muted'}
            >
              Sounds
            </Link>
            <Link
              to="/progress"
              className={pathname === '/progress' ? 'text-ink font-medium' : 'text-muted'}
            >
              Progress
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
