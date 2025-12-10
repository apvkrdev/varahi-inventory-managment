import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Sale from '@/lib/models/Sale';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const sales = await Sale.find().sort({ date: -1 });

    return NextResponse.json(sales);
  } catch (error) {
    console.error('Get sales error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch sales' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { customer, date, quantity, rate, amount, paymentReceived } = await req.json();

    if (!customer || !date || !quantity || !rate || !amount) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    const sale = await Sale.create({
      customer,
      date: new Date(date),
      quantity: Number(quantity),
      rate: Number(rate),
      amount: Number(amount),
      paymentReceived: Number(paymentReceived) || 0,
    });

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error('Create sale error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create sale' },
      { status: 500 }
    );
  }
}
