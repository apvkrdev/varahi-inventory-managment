'use server';

import dbConnect from '@/lib/db/mongodb';
import Purchase from '@/lib/models/Purchase';
import Sale from '@/lib/models/Sale';
import Payment from '@/lib/models/Payment';

// Purchase Actions
export async function createPurchase(data: {
  supplier: string;
  date: string;
  quantity: number;
  rate: number;
  amount: number;
}) {
  try {
    await dbConnect();
    const purchase = await Purchase.create({
      ...data,
      date: new Date(data.date),
    });
    return { success: true, data: JSON.parse(JSON.stringify(purchase)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create purchase' };
  }
}

export async function getPurchases() {
  try {
    await dbConnect();
    const purchases = await Purchase.find().sort({ date: -1 });
    return { success: true, data: JSON.parse(JSON.stringify(purchases)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch purchases' };
  }
}

// Sale Actions
export async function createSale(data: {
  customer: string;
  date: string;
  quantity: number;
  rate: number;
  amount: number;
  paymentReceived?: number;
}) {
  try {
    await dbConnect();
    console.log('Creating sale with data:', data);
    const sale = await Sale.create({
      ...data,
      date: new Date(data.date),
      paymentReceived: data.paymentReceived || 0,
    });
    return { success: true, data: JSON.parse(JSON.stringify(sale)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create sale' };
  }
}

export async function getSales() {
  try {
    await dbConnect();
    const sales = await Sale.find().sort({ date: -1 });
    return { success: true, data: JSON.parse(JSON.stringify(sales)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch sales' };
  }
}

export async function updateSalePayment(saleId: string, paymentReceived: number) {
  try {
    await dbConnect();
    const sale = await Sale.findByIdAndUpdate(
      saleId,
      { paymentReceived },
      { new: true }
    );
    return { success: true, data: JSON.parse(JSON.stringify(sale)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update sale' };
  }
}

// Payment Actions
export async function createPayment(data: {
  saleId: string;
  date: string;
  amount: number;
}) {
  try {
    await dbConnect();

    // Create payment
    const payment = await Payment.create({
      saleId: data.saleId,
      date: new Date(data.date),
      amount: data.amount,
    });

    // Update sale's payment received
    const sale = await Sale.findById(data.saleId);
    if (sale) {
      sale.paymentReceived = (sale.paymentReceived || 0) + data.amount;
      await sale.save();
    }

    return { success: true, data: JSON.parse(JSON.stringify(payment)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create payment' };
  }
}

export async function getPayments() {
  try {
    await dbConnect();
    const payments = await Payment.find().populate('saleId').sort({ date: -1 });
    return { success: true, data: JSON.parse(JSON.stringify(payments)) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch payments' };
  }
}

// Dashboard Actions
export async function getDashboardStats() {
  try {
    await dbConnect();

    const purchases = await Purchase.find();
    const sales = await Sale.find();
    const payments = await Payment.find();

    const totalPurchasedQty = purchases.reduce((sum, p) => sum + (p.quantity || 0), 0);
    const totalSoldQty = sales.reduce((sum, s) => sum + (s.quantity || 0), 0);
    const totalPurchaseAmount = purchases.reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalAmountReceived = sales.reduce((sum, s) => sum + (s.paymentReceived || 0), 0);
    const totalPendingAmount = sales.reduce((sum, s) => sum + (s.pendingAmount || 0), 0);

    return {
      success: true,
      data: {
        totalPurchasedQty,
        totalSoldQty,
        remainingStock: totalPurchasedQty - totalSoldQty,
        totalPurchaseAmount,
        totalAmountReceived,
        totalPendingAmount,
        recentPurchases: JSON.parse(JSON.stringify(purchases.slice(0, 5))),
        recentSales: JSON.parse(JSON.stringify(sales.slice(0, 5))),
        recentPayments: JSON.parse(JSON.stringify(payments.slice(0, 5))),
      },
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch stats' };
  }
}
