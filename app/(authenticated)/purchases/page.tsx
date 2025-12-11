'use client';

import { useEffect, useState, FormEvent } from 'react';
import { createPurchase, getPurchases } from '@/lib/actions';
import Table from '@/components/Table';
import Button from '@/components/Button';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import styles from './page.module.scss';

interface Purchase {
  _id: string;
  supplier: string;
  date: string;
  quantity: number;
  rate: number;
  amount: number;
  gst: number;
  totalAmount: number;
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    supplier: '',
    date: new Date().toISOString().split('T')[0],
    quantity: '',
    rate: '',
    amount: '',
    gst: '',
    totalAmount: '',
  });

  async function loadPurchases() {
    setLoading(true);
    try {
    const response = await fetch('/api/purchases', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      // console.log(data);
      if (data) {
        console.log('Login successful:', data);
        setPurchases(data);
        setLoading(false);
      }
  } catch (error) {
    console.error('purchease Loading error:', error);
    setError('An error occurred. Please try again.');
    setLoading(false);
  }
  }

  useEffect(() => {
    (async () => {
      await loadPurchases();
    })();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    const totalToSend = formData.totalAmount ? Number(formData.totalAmount) : Number(formData.amount);

    try {
    const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supplier: formData.supplier,
          date: formData.date,
          quantity: Number(formData.quantity),
          rate: Number(formData.rate),
          amount: totalToSend,
          gst:  Number(formData.gst),
          totalAmount: Number(formData.totalAmount),
        }),
      });
      const data = await response.json();
      console.log(data);
      if (data) {
        setSuccess('pruchases order created');
        loadPurchases();
        setLoading(false);
      }
  } catch (error) {
    console.error('Login error:', error);
    setError('An error occurred. Please try again.');
    setLoading(false);
  }
    setSubmitting(false);
  }

  const columns = [
    {
      key: 'supplier',
      label: 'Supplier',
      render: (value: string) => value,
    },
    {
      key: 'date',
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'quantity',
      label: 'Quantity',
      render: (value: number) => `${value} units`,
    },
    {
      key: 'rate',
      label: 'Rate',
      render: (value: number) => `Rs. ${value.toFixed(2)}`,
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value: number) => `Rs. ${value.toFixed(2)}`,
    },
  ];

  return (
    <div className={styles.container}>
      <PageHeader
        title="Purchases"
        actions={
          <Button
            variant="primary"
            onClick={() => {
              /* Scroll to form */
            }}
          >
            Add Purchase
          </Button>
        }
      />

      {error && <div className={styles.errorState}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}

      <Card>
        <h3>New Purchase</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Company Name</label>
              <input
                type="text"
                className={styles.input}
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Date</label>
              <input
                type="date"
                className={styles.input}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Quantity</label>
              <input
                type="number"
                className={styles.input}
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Rate</label>
              <input
                type="number"
                step="0.01"
                className={styles.input}
                value={formData.rate}
                onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Amount (Base)</label>
              <input
                type="number"
                step="0.01"
                className={styles.input}
                value={formData.amount}
                onChange={(e) => {
                  const amount = e.target.value;
                  const gst = formData.gst;
                  // compute total if gst present
                  const amtNum = parseFloat(amount || '0');
                  const gstNum = parseFloat(gst || '0');
                  const total = !isNaN(amtNum) && !isNaN(gstNum) ? (amtNum + (amtNum * gstNum) / 100) : '';
                  setFormData({ ...formData, amount, totalAmount: total === '' ? '' : String(Number(total.toFixed(2))) });
                }}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>GST %</label>
              <input
                type="number"
                step="0.01"
                className={styles.input}
                value={formData.gst}
                onChange={(e) => {
                  const gst = e.target.value;
                  const amount = formData.amount;
                  const amtNum = parseFloat(amount || '0');
                  const gstNum = parseFloat(gst || '0');
                  const total = !isNaN(amtNum) && !isNaN(gstNum) ? (amtNum + (amtNum * gstNum) / 100) : '';
                  setFormData({ ...formData, gst, totalAmount: total === '' ? '' : String(Number(total.toFixed(2))) });
                }}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Total Amount (Incl. GST)</label>
              <input
                type="number"
                step="0.01"
                className={styles.input}
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                readOnly
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Purchase'}
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <h3>Purchases List</h3>
        {loading ? (
          <div className={styles.loadingState}>Loading purchases...</div>
        ) : (
          purchases?.length !== 0 && <div className={styles.tableWrapper}>
            <Table columns={columns} data={purchases} />
          </div>
        )}
      </Card>
    </div>
  );
}
