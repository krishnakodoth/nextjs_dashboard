import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongoose';
import Invoice from '@/app/models/Invoice';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const invoices = await req.json();

    if (!Array.isArray(invoices)) {
      return NextResponse.json({ message: 'Payload must be an array' }, { status: 400 });
    }

    const result = await Invoice.insertMany(invoices, { ordered: false });

    return NextResponse.json({
      success: true,
      message: 'Invoices added successfully',
      insertedCount: result.length,
      data: result,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to add invoice', error: error.message }, { status: 500 });
  }
}
