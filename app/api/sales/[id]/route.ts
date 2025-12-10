import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Sale from '@/lib/models/Sale';
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { paymentReceived } = await req.json();
    const { id } = await context.params;

    if (paymentReceived === undefined) {
      return NextResponse.json(
        { error: 'Please provide paymentReceived' },
        { status: 400 }
      );
    }

    await dbConnect();

    const sale = await Sale.findByIdAndUpdate(
      id,
      {
        paymentReceived: Number(paymentReceived),
      },
      { new: true }
    );

    if (!sale) {
      return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
    }

    return NextResponse.json(sale);
  } catch (error) {
    console.error('Update sale error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update sale' },
      { status: 500 }
    );
  }
}
