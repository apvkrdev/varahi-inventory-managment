'use client';

import { useEffect, useState, FormEvent } from 'react';
import { createSale, getSales, updateSalePayment } from '@/lib/actions';
import Table from '@/components/Table';
import Button from '@/components/Button';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import Modal from '@/components/Modal';
import styles from './page.module.scss';

interface Sale {
  _id: string;
  customer: string;
  date: string;
  quantity: number;
  rate: number;
  amount: number;
  paymentReceived: number;
  pendingAmount: number;
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [formData, setFormData] = useState({
    customer: '',
    date: new Date().toISOString().split('T')[0],
    quantity: '',
    rate: '',
    amount: '',
    paymentReceived: '',
  });

  useEffect(() => {
    loadSales();
  }, []);

  async function loadSales() {
    setLoading(true);
    const result = await getSales();
    if (result.success) {
      setSales(result.data);
    }
    setLoading(false);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    const result = await createSale({
      customer: formData.customer,
      date: formData.date,
      quantity: Number(formData.quantity),
      rate: Number(formData.rate),
      amount: Number(formData.amount),
      paymentReceived: formData.paymentReceived ? Number(formData.paymentReceived) : 0,
    });

    console.log(result);

    if (result.success) {
      setSuccess('Sale created successfully!');
      setFormData({
        customer: '',
        date: new Date().toISOString().split('T')[0],
        quantity: '',
        rate: '',
        amount: '',
        paymentReceived: '',
      });
      loadSales();
    } else {
      setError(result.error);
    }
    setSubmitting(false);
  }

  async function handlePaymentSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedSale) return;

    const result = await updateSalePayment(selectedSale._id, Number(paymentAmount));
    if (result.success) {
      setSuccess('Payment updated successfully!');
      setModalOpen(false);
      setPaymentAmount('');
      loadSales();
    } else {
      setError(result.error);
    }
  }

  const columns = [
    {
      key: 'customer',
      label: 'Customer',
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
      label: 'Total Amount',
      render: (value: number) => `Rs. ${value.toFixed(2)}`,
    },
    {
      key: 'paymentReceived',
      label: 'Received',
      render: (value: number) => `Rs. ${value.toFixed(2)}`,
    },
    {
      key: 'pendingAmount',
      label: 'Pending',
      render: (value: number) => `Rs. ${value.toFixed(2)}`,
    },
    {
      key: '_id',
      label: 'Action',
      render: (value: string, row: Sale) => (
        <Button
          variant="secondary"
          size="small"
          onClick={() => {
            setSelectedSale(row);
            setModalOpen(true);
          }}
        >
          Add Payment
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <PageHeader
        title="Sales"
        actions={
          <Button
            variant="primary"
            onClick={() => {
              /* Scroll to form */
            }}
          >
            Add Sale
          </Button>
        }
      />

      {error && <div className={styles.errorState}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}

      <Card>
        <h3>New Sale</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Customer</label>
              <input
                type="text"
                className={styles.input}
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
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

            <div className={styles.formGroup}>
              <label className={styles.label}>Payment Received (Optional)</label>
              <input
                type="number"
                step="0.01"
                className={styles.input}
                value={formData.paymentReceived}
                onChange={(e) => setFormData({ ...formData, paymentReceived: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Sale'}
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <h3>Sales List</h3>
        {loading ? (
          <div className={styles.loadingState}>Loading sales...</div>
        ) : (
          <div className={styles.tableWrapper}>
            <Table columns={columns} data={sales} />
          </div>
        )}
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Payment"
        footer={
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={(e) => {
                handlePaymentSubmit(e as unknown as FormEvent<HTMLFormElement>);
              }}
            >
              Add Payment
            </Button>
          </div>
        }
      >
        {selectedSale && (
          <form onSubmit={handlePaymentSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Customer</label>
              <p>{selectedSale.customer}</p>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Total Amount</label>
              <p>Rs. {selectedSale.amount.toFixed(2)}</p>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Already Received</label>
              <p>Rs. {selectedSale.paymentReceived.toFixed(2)}</p>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Pending Amount</label>
              <p>Rs. {selectedSale.pendingAmount.toFixed(2)}</p>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Payment Amount</label>
              <input
                type="number"
                step="0.01"
                className={styles.input}
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                required
              />
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
