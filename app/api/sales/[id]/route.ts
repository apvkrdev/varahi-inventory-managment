import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Sale from '@/lib/models/Sale';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { paymentReceived } = await req.json();

    if (paymentReceived === undefined) {
      return NextResponse.json(
        { error: 'Please provide paymentReceived' },
        { status: 400 }
      );
    }

    await dbConnect();

    const sale = await Sale.findByIdAndUpdate(
      params.id,
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
