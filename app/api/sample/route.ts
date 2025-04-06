import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongoose';
import Sample from '@/app/models/Sample';
import Revenue from '@/app/models/Revenue';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const sample = await req.json();

    if (!Array.isArray(sample)) {
      return NextResponse.json({ message: 'Payload must be an array of customers' }, { status: 400 });
    }

    // const result = await Sample.insertMany(sample, {
    //   ordered: false, // continue even if some documents fail (e.g., duplicates)
    // });

    // Reveniew schema
    const result = await Revenue.insertMany(sample, {
      ordered: false, // continue even if some documents fail (e.g., duplicates)
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Sample added successfully',
        insertedCount: result.length,
        data: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to insert some or all sample',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
