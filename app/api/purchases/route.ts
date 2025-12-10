import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Purchase from '@/lib/models/Purchase';
export async function GET() {
  try {
    await dbConnect();
    const purchases = await Purchase.find().sort({ date: -1 });

    return NextResponse.json(purchases);
  } catch (error) {
    console.error('Get purchases error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch purchases' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { supplier, date, quantity, rate, amount } = await req.json();

    if (!supplier || !date || !quantity || !rate || !amount) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    const purchase = await Purchase.create({
      supplier,
      date: new Date(date),
      quantity: Number(quantity),
      rate: Number(rate),
      amount: Number(amount),
    });

    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    console.error('Create purchase error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create purchase' },
      { status: 500 }
    );
  }
}
