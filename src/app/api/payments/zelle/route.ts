import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ZellePaymentModel from '@/lib/models/ZellePayment';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { name, phone, reference, imageUrl, courseName, amount } = await request.json();

    if (!name || !phone || !reference || !courseName || !amount) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    await connectDB();

    const payment = await ZellePaymentModel.create({
      name,
      phone,
      reference,
      imageUrl,
      courseName,
      amount,
      status: 'pending',
      submittedAt: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      paymentId: payment._id 
    });
  } catch (error) {
    console.error('Zelle payment submission error:', error);
    return NextResponse.json({ error: 'Failed to submit payment.' }, { status: 500 });
  }
}

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