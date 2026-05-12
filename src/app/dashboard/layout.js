import { Lato } from 'next/font/google';
import './tailwind.css';
import DashboardShell from './components/DashboardShell';
import { AuthProvider } from './components/AuthContext';
import { ToastProvider } from './components/ToastContext';

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
});

export default function DashboardLayout({ children }) {
  return (
    <div className={lato.className}>
      <AuthProvider>
        <ToastProvider>
          <DashboardShell>{children}</DashboardShell>
        </ToastProvider>
      </AuthProvider>
    </div>
  );
}
