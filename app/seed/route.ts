// import bcrypt from 'bcrypt';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongoose';
import User from '@/app/models/User';
import Customer from '@/app/models/Customer';
import Invoice from '@/app/models/Invoice';
import Revenue from '../models/Revenue';
import { users,customers,invoices,revenue } from '../lib/placeholder-data';



async function seedUsers() {
  // Clear existing data
  await User.deleteMany({});

  // Insert seed data
  const updatedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return { ...user, password: hashedPassword };
    })
  );

  const usersList = await User.insertMany(updatedUsers);;

  console.log('User collection truncated and seeded successfully.');
  return usersList;
}

async function seedCustomers() {
  // Clear existing data
  await Customer.deleteMany({});

  // Insert seed data
  const updatedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return { ...user, password: hashedPassword };
    })
  );

  const insertedCustomers = await Customer.insertMany(customers);

  console.log('Customer collection truncated and seeded successfully.');
  return insertedCustomers;
}

async function seedInvoices() {
  // Clear existing data
  await Invoice.deleteMany({});

  // Insert seed data
  const insertedInvoices = await Invoice.insertMany(invoices);
  console.log('Invoice collection truncated and seeded successfully.');
  return insertedInvoices;
}



async function seedRevenue() {
  // Clear existing data
  await Revenue.deleteMany({});
  // Insert seed data
  const insertedRevenue = await Revenue.insertMany(revenue);
  console.log('Revenue collection truncated and seeded successfully.');  
  return insertedRevenue;
}

export async function GET() {
  await dbConnect();
  try {
    await seedUsers();
    await seedCustomers();
    await seedInvoices();
    await seedRevenue();

    return new Response('Seeded successfully', { status: 200 });
  } catch (error) {
    return new Response('Error seeding data', { status: 500 });
  }
}
