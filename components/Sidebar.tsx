'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.scss';

interface MenuItem {
  label: string;
  href: string;
  icon?: string;
}

interface SidebarProps {
  items: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Link href="/dashboard">TIM</Link>
      </div>
      <ul className={styles.menu}>
        {items.map((item) => (
          <li key={item.href} className={styles.menuItem}>
            <Link href={item.href} className={`${styles.menuLink} ${pathname === item.href ? styles.active : ''}`}>
              {item.icon && <span className={styles.icon}>{item.icon}</span>}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
