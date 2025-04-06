import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongoose';
import Customer from '@/app/models/Customer';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const customers = await req.json();

    if (!Array.isArray(customers)) {
      return NextResponse.json({ message: 'Payload must be an array of customers' }, { status: 400 });
    }

    const result = await Customer.insertMany(customers, {
      ordered: false, // continue even if some documents fail (e.g., duplicates)
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Customers added successfully',
        insertedCount: result.length,
        data: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to insert some or all customers',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
