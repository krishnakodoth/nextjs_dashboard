import postgres from 'postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
} from './definitions';
import { formatCurrency } from './utils';
import { revenue, invoices } from './placeholder-data';

import Revenue from '../models/Revenue';
import dbConnect from './mongoose';
import Invoice from '../models/Invoice';
import Customer from '../models/Customer';
import mongoose from 'mongoose';


export async function fetchRevenue() {
  await dbConnect();
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    // -------- 
    // const data = await sql<Revenue[]>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');
    // const data = revenue;
    //-------------- DB connection -----------------

    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await Revenue.find({});
    console.log('Data fetch completed after 3 seconds.');
    return data;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    //-------------- DB connection -----------------
    // const data = await sql<LatestInvoiceRaw[]>`
    // SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
    // FROM invoices
    // JOIN customers ON invoices.customer_id = customers.id
    // ORDER BY invoices.date DESC
    // LIMIT 5`;

    // const latestInvoices = data.map((invoice) => ({
    //   ...invoice,
    //   amount: formatCurrency(invoice.amount),
    // }));


    // Mongo db query
    const data = await Invoice.aggregate([
      {
        $lookup: {
          from: 'customers', // collection name in MongoDB
          localField: 'customer_id',
          foreignField: 'id',
          as: 'customer'
        }
      },
      {
        $unwind: '$customer'
      },
      {
        $project: {
          _id: 0,
          id: 1,
          amount: 1,
          name: '$customer.name',
          email: '$customer.email',
          image_url: '$customer.image_url',
          // Below are the fields from the customer collection
          // 'customer.name': 1,
          // 'customer.email': 1,
          // 'customer.image_url': 1,
        }
      },
      {
        $sort: { date: -1 }
      },
      {
        $limit: 5
      }
    ]);


    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));

    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    // const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    // const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    // const invoiceStatusPromise = sql`SELECT
    //      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
    //      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
    //      FROM invoices`;

    // const data = await Promise.all([
    //   invoiceCountPromise,
    //   customerCountPromise,
    //   invoiceStatusPromise,
    // ]);

    // const numberOfInvoices = Number(data[0][0].count ?? '0');
    // const numberOfCustomers = Number(data[1][0].count ?? '0');
    // const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    // const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    // Find the number of customers
    const customerCount = await Customer.countDocuments();
    const numberOfCustomers = Number(customerCount ?? '0');
    // Find the number of invoices
    const invoiceCount = await Invoice.countDocuments();
    const numberOfInvoices = Number(invoiceCount ?? '0');
    // Find the total paid invoices
    const invoiceStatus = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          paid: {
            $sum: {
              $cond: [{ $eq: ['$status', 'paid'] }, '$amount', 0],
            },
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          paid: 1,
          pending: 1,
        },
      },
    ]);

    const totalPaidInvoices = formatCurrency(invoiceStatus[0]?.paid ?? '0');
    const totalPendingInvoices = formatCurrency(invoiceStatus[0]?.pending ?? '0');


    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // const invoices = await sql<InvoicesTable[]>`
    //   SELECT
    //     invoices.id,
    //     invoices.amount,
    //     invoices.date,
    //     invoices.status,
    //     customers.name,
    //     customers.email,
    //     customers.image_url
    //   FROM invoices
    //   JOIN customers ON invoices.customer_id = customers.id
    //   WHERE
    //     customers.name ILIKE ${`%${query}%`} OR
    //     customers.email ILIKE ${`%${query}%`} OR
    //     invoices.amount::text ILIKE ${`%${query}%`} OR
    //     invoices.date::text ILIKE ${`%${query}%`} OR
    //     invoices.status ILIKE ${`%${query}%`}
    //   ORDER BY invoices.date DESC
    //   LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    // `;

    const invoices = await Invoice.aggregate([
      {
        $lookup: {
          from: 'customers',
          localField: 'customer_id',
          foreignField: 'id',
          as: 'customer'
        }
      },
      { $unwind: '$customer' },
      {
        $match: {
          $or: [
            { 'customer.name': { $regex: query, $options: 'i' } },
            { 'customer.email': { $regex: query, $options: 'i' } },
            { amount: { $regex: query, $options: 'i' } }, // if amount is string
            { date: { $regex: query, $options: 'i' } },   // if date is string
            { status: { $regex: query, $options: 'i' } }
          ]
        }
      },
      { $sort: { date: -1 } },
      { $skip: offset },
      { $limit: ITEMS_PER_PAGE },
      {
        $project: {
          id: 1,
          amount: 1,
          date: 1,
          status: 1,
          name: '$customer.name',
          email: '$customer.email',
          image_url: '$customer.image_url'
        }
      }
    ]);

    return JSON.parse(JSON.stringify(invoices));
    //return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    //const data = []
    // const data = await sql`SELECT COUNT(*)
    // FROM invoices
    // JOIN customers ON invoices.customer_id = customers.id
    // WHERE
    //   customers.name ILIKE ${`%${query}%`} OR
    //   customers.email ILIKE ${`%${query}%`} OR
    //   invoices.amount::text ILIKE ${`%${query}%`} OR
    //   invoices.date::text ILIKE ${`%${query}%`} OR
    //   invoices.status ILIKE ${`%${query}%`}
    // `;

    // Mongo DB
    const data = await Invoice.aggregate([
      {
        $lookup: {
          from: 'customers',
          localField: 'customer_id',
          foreignField: 'id',
          as: 'customer'
        }
      },
      { $unwind: '$customer' },
      {
        $match: {
          $or: [
            { 'customer.name': { $regex: query, $options: 'i' } },
            { 'customer.email': { $regex: query, $options: 'i' } },
            { status: { $regex: query, $options: 'i' } },
            { date: { $regex: query, $options: 'i' } },
            {
              $expr: {
                $regexMatch: {
                  input: { $toString: '$amount' },
                  regex: query,
                  options: 'i'
                }
              }
            }
          ]
        }
      },
      {
        $count: 'total'
      }
    ]);

    const total = Number(data[0]?.total || 0);
    const totalPages = Math.ceil(Number(total) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    // const data = await sql<InvoiceForm[]>`
      // SELECT
      //   invoices.id,
      //   invoices.customer_id,
      //   invoices.amount,
      //   invoices.status
      // FROM invoices
      // WHERE invoices.id = ${id};
    // `;

    // const invoice = data.map((invoice) => ({
    //   ...invoice,
    //   // Convert amount from cents to dollars
    //   amount: invoice.amount / 100,
    // }));

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
  
    const invoice = await Invoice.findOne({ _id: id }).lean();
    if (!invoice) {
      return null;
    }
    // console.log('invoice', invoice);
    // console.log('invoice', JSON.parse(JSON.stringify(invoice)));
    return JSON.parse(JSON.stringify(invoice));
    //return invoice;
    // return 0;
  } catch (error) {
    console.error('Database Error:', error);
    //throw new Error('Failed to fetch invoice.');
    return null;
  }
}

export async function fetchCustomers() {
  try {
    // const customers = await sql<CustomerField[]>`
      // SELECT
      //   id,
      //   name
      // FROM customers
      // ORDER BY name ASC
    // `;

    const customers = await Customer.find({}, { _id: 0, id: 1, name: 1 }).sort({ name: 1 }).lean();
    //return customers;
    return JSON.parse(JSON.stringify(customers));

  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    // const data = await sql<CustomersTableType[]>`
    // SELECT
    //   customers.id,
    //   customers.name,
    //   customers.email,
    //   customers.image_url,
    //   COUNT(invoices.id) AS total_invoices,
    //   SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
    //   SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
    // FROM customers
    // LEFT JOIN invoices ON customers.id = invoices.customer_id
    // WHERE
    //   customers.name ILIKE ${`%${query}%`} OR
    //     customers.email ILIKE ${`%${query}%`}
    // GROUP BY customers.id, customers.name, customers.email, customers.image_url
    // ORDER BY customers.name ASC
    // `;

    // const customers = data.map((customer) => ({
    //   ...customer,
    //   total_pending: formatCurrency(customer.total_pending),
    //   total_paid: formatCurrency(customer.total_paid),
    // }));
    //const customers;;
    return;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
