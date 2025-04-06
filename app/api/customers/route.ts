import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongoose';
import Customer from '@/app/models/Customer';

// GET all customers
export async function GET() {
  await dbConnect();

  try {
    const customers = await Customer.find();
    return NextResponse.json(customers, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to fetch customers', error: error.message }, { status: 500 });
  }
}

// POST create a new customer
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { name, email, image_url } = await req.json();

    const result = await Customer.updateOne(
      { email }, // match by email
      { $setOnInsert: { name, image_url } },
      { upsert: true }
    );

    return NextResponse.json(
      { message: result.upsertedCount ? 'Customer added' : 'Customer already exists' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to add customer', error: error.message }, { status: 500 });
  }
}

// PUT update a customer by email
export async function PUT(req: NextRequest) {
  await dbConnect();

  try {
    const { email, name, image_url } = await req.json();

    const updated = await Customer.findOneAndUpdate(
      { email },
      { name, image_url },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to update customer', error: error.message }, { status: 500 });
  }
}

// DELETE customer by email
export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const { email } = await req.json();

    const deleted = await Customer.findOneAndDelete({ email });

    if (!deleted) {
      return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Customer deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to delete customer', error: error.message }, { status: 500 });
  }
}
