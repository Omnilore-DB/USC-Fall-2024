import Link from 'next/link';

export default function ReportsPage() {
  return (
    <div>
      <h1>Reports Dashboard</h1>
      <ul>
        <li><Link href="/reports/financial-report">Financial Report</Link></li>
        <li><Link href="/reports/membership-report">Membership Report</Link></li>
      </ul>
    </div>
  );
}