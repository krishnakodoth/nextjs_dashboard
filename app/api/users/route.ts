import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../lib/mongoose';
import User from '../../models/User';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { name, email, password } = body;

    const user = await User.create({ name, email, password });

    return NextResponse.json({
      success: true,
      message: 'User added successfully',
      data: user,
    },
    { status: 201 });
  } catch (error: any) {
    return NextResponse.json( {
      success: false,
      message: 'Failed to add user',
      error: error.message,
    },{ status: 500 });
  }
}

export async function GET() {
  await dbConnect();

  try {
    const users = await User.find();
    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error fetching users', error: error.message }, { status: 500 });
  }
}
