'use client';

import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Button from '@/components/Button';
import styles from './layout.module.scss';

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Purchases', href: '/purchases', icon: '📦' },
  { label: 'Sales', href: '/sales', icon: '🛒' },
  { label: 'Payments', href: '/payments', icon: '💳' },
];

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <div className={styles.layout}>
      <Sidebar items={menuItems} />
      <div className={styles.content}>
        <header className={styles.header}>
          <h1>Varahi Inventory Manager</h1>
          <div className={styles.userMenu}>
            <span>{session?.user?.name}</span>
            <Button variant="secondary" size="small" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
