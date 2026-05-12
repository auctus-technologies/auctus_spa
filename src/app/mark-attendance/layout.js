import { Lato } from 'next/font/google';
import '../dashboard/tailwind.css';

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
});

export const metadata = {
  title: 'Mark Attendance – Auctus',
};

export default function MarkAttendanceLayout({ children }) {
  return <div className={lato.className}>{children}</div>;
}
