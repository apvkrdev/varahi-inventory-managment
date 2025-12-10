'use client';

import { useEffect, useState } from 'react';
import { getDashboardStats } from '@/lib/actions';
import Card from '@/components/Card';
import styles from './page.module.scss';

interface DashboardStats {
  totalPurchasedQty: number;
  totalSoldQty: number;
  remainingStock: number;
  totalPurchaseAmount: number;
  totalAmountReceived: number;
  totalPendingAmount: number;
  recentPurchases: any[];
  recentSales: any[];
  recentPayments: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const result = await getDashboardStats();
      if (result.success) {
        setStats(result.data);
      }
      setLoading(false);
    }

    loadStats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!stats) {
    return <div>Failed to load stats</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Purchased</span>
          <div>
            <span className={styles.statValue}>{stats.totalPurchasedQty}</span>
            <span className={styles.statUnit}>Tons</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Sold</span>
          <div>
            <span className={styles.statValue}>{stats.totalSoldQty}</span>
            <span className={styles.statUnit}>Tons</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Remaining Stock</span>
          <div>
            <span className={styles.statValue}>{stats.remainingStock}</span>
            <span className={styles.statUnit}>Tons</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Purchase Amount</span>
          <div>
            <span className={styles.statValue}>Rs. {stats.totalPurchaseAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Amount Received</span>
          <div>
            <span className={styles.statValue}>Rs. {stats.totalAmountReceived.toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Pending Amount</span>
          <div>
            <span className={styles.statValue}>Rs. {stats.totalPendingAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className={styles.sectionsGrid}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Recent Purchases</h3>
          </div>
          <div className={styles.sectionBody}>
            {stats.recentPurchases.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No purchases yet</p>
              </div>
            ) : (
              stats.recentPurchases.map((purchase: any, idx: number) => (
                <div key={idx} className={styles.itemRow}>
                  <div>
                    <div className={styles.itemLabel}>{purchase.supplier}</div>
                    <div className={styles.itemValue}>{purchase.quantity} units</div>
                  </div>
                  <div className={styles.itemAmount}>Rs. {purchase.amount.toFixed(2)}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Recent Sales</h3>
          </div>
          <div className={styles.sectionBody}>
            {stats.recentSales.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No sales yet</p>
              </div>
            ) : (
              stats.recentSales.map((sale: any, idx: number) => (
                <div key={idx} className={styles.itemRow}>
                  <div>
                    <div className={styles.itemLabel}>{sale.customer}</div>
                    <div className={styles.itemValue}>{sale.quantity} units</div>
                  </div>
                  <div className={styles.itemAmount}>Rs. {sale.amount.toFixed(2)}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Recent Payments</h3>
          </div>
          <div className={styles.sectionBody}>
            {stats.recentPayments.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No payments yet</p>
              </div>
            ) : (
              stats.recentPayments.map((payment: any, idx: number) => (
                <div key={idx} className={styles.itemRow}>
                  <div className={styles.itemLabel}>
                    {new Date(payment.date).toLocaleDateString()}
                  </div>
                  <div className={styles.itemAmount}>Rs. {payment.amount.toFixed(2)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
