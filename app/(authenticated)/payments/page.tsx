'use client';

import { useEffect, useState, FormEvent } from 'react';
import { createPayment, getPayments, getSales } from '@/lib/actions';
import Table from '@/components/Table';
import Button from '@/components/Button';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import styles from './page.module.scss';

interface Sale {
  _id: string;
  customer: string;
  amount: number;
  paymentReceived: number;
  pendingAmount: number;
}

interface Payment {
  _id: string;
  saleId: Sale | string;
  date: string;
  amount: number;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    saleId: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const paymentsResult = await getPayments();
      const salesResult = await getSales();
      
      if (paymentsResult.success) {
        setPayments(paymentsResult.data);
      }
      if (salesResult.success) {
        setSales(salesResult.data);
      }
      setLoading(false);
    }

    loadData();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    const result = await createPayment({
      saleId: formData.saleId,
      date: formData.date,
      amount: Number(formData.amount),
    });

    if (result.success) {
      setSuccess('Payment recorded successfully!');
      setFormData({
        saleId: '',
        date: new Date().toISOString().split('T')[0],
        amount: '',
      });
      
      // Reload payments
      const paymentsResult = await getPayments();
      if (paymentsResult.success) {
        setPayments(paymentsResult.data);
      }
    } else {
      setError(result.error);
    }
    setSubmitting(false);
  }

  const columns = [
    {
      key: 'saleId',
      label: 'Customer',
      render: (value: any) => {
        if (typeof value === 'object' && value.customer) {
          return value.customer;
        }
        return 'Unknown';
      },
    },
    {
      key: 'date',
      label: 'Payment Date',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value: number) => `Rs. ${value.toFixed(2)}`,
    },
  ];

  // Filter sales with pending amount
  const salesWithPending = sales.filter((s) => s.pendingAmount > 0);

  return (
    <div className={styles.container}>
      <PageHeader title="Payments" />

      {error && <div className={styles.errorState}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}

      <Card>
        <h3>Record Payment</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Sale / Customer</label>
              <select
                className={styles.input}
                value={formData.saleId}
                onChange={(e) => setFormData({ ...formData, saleId: e.target.value })}
                required
              >
                <option value="">Select a sale...</option>
                {salesWithPending.map((sale) => (
                  <option key={sale._id} value={sale._id}>
                    {sale.customer} - Pending: Rs. {sale.pendingAmount.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Payment Date</label>
              <input
                type="date"
                className={styles.input}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Amount</label>
              <input
                type="number"
                step="0.01"
                className={styles.input}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Recording...' : 'Record Payment'}
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <h3>Payment History</h3>
        {loading ? (
          <div className={styles.loadingState}>Loading payments...</div>
        ) : (
          <div className={styles.tableWrapper}>
            <Table columns={columns} data={payments} />
          </div>
        )}
      </Card>
    </div>
  );
}
