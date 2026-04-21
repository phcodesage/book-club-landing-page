import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ZellePaymentModel from '@/lib/models/ZellePayment';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await connectDB();
    
    const payments = await ZellePaymentModel.find()
      .sort({ submittedAt: -1 })
      .lean();

    return NextResponse.json({ payments });
  } catch (error) {
    console.error('Failed to fetch payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payments.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { paymentId, status, notes } = await request.json();

    if (!paymentId || !status) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    await connectDB();

    const updateData: Record<string, string | Date | undefined> = { 
      status,
      notes: notes || undefined
    };

    if (status === 'verified') {
      updateData.verifiedAt = new Date();
    }

    const payment = await ZellePaymentModel.findByIdAndUpdate(
      paymentId,
      updateData,
      { new: true }
    );

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error('Failed to update payment:', error);
    return NextResponse.json({ error: 'Failed to update payment.' }, { status: 500 });
  }
}