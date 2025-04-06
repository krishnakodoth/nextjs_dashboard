// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
// const users = [
//   {
//     id: '410544b2-4001-4271-9855-fec4b6a6442a',
//     name: 'User',
//     email: 'user@nextmail.com',
//     password: '123456',
//   },
// ];
const users = [
  { id: 'u1a2c3', name: 'Alice Morgan', email: 'alice.morgan@example.com', password: 'fK7dP2xM' },
  { id: 'v4b5d6', name: 'Brian Hart', email: 'brian.hart@example.com', password: 'M8rZ2tW9' },
  { id: 'w7e8g9', name: 'Chloe Diaz', email: 'chloe.diaz@example.com', password: 'aL3pV9qR' },
  { id: 'x1h2j3', name: 'David Chen', email: 'david.chen@example.com', password: 'sY7uK5mQ' },
  { id: 'y4k5m6', name: 'Ella Patel', email: 'ella.patel@example.com', password: 'nD4eC2fS' },
  { id: 'z7n8p9', name: 'Felix Zhang', email: 'felix.zhang@example.com', password: 'rG2tX8vN' },
  { id: 'a1q2s3', name: 'Grace Lee', email: 'grace.lee@example.com', password: 'jP5nB7wM' },
  { id: 'b4t5v6', name: 'Henry Kim', email: 'henry.kim@example.com', password: 'kE9mH6aZ' },
  { id: 'c7w8y9', name: 'Isla Thompson', email: 'isla.thompson@example.com', password: 'zL1fQ4cX' },
  { id: 'd1z2a3', name: 'Jack Wilson', email: 'jack.wilson@example.com', password: 'tM6rD8yK' },
];

const customers = [
  {
    id: '1a2b3c4d-1111-aaaa-bbbb-000000000001',
    name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    image_url: 'https://picsum.photos/200?random=1',
  },
  {
    id: '1a2b3c4d-2222-aaaa-bbbb-000000000002',
    name: 'Sunny Fox',
    email: 'sunny@fox.com',
    image_url: 'https://picsum.photos/200?random=2',
  },
  {
    id: '1a2b3c4d-3333-aaaa-bbbb-000000000003',
    name: 'Magic Panda',
    email: 'magic@panda.com',
    image_url: 'https://picsum.photos/200?random=3',
  },
  {
    id: '1a2b3c4d-4444-aaaa-bbbb-000000000004',
    name: 'Ghost Falcon',
    email: 'ghost@falcon.com',
    image_url: 'https://picsum.photos/200?random=4',
  },
  {
    id: '1a2b3c4d-5555-aaaa-bbbb-000000000005',
    name: 'Witty Owl',
    email: 'witty@owl.com',
    image_url: 'https://picsum.photos/200?random=5',
  },
  {
    id: '1a2b3c4d-6666-aaaa-bbbb-000000000006',
    name: 'Brave Tiger',
    email: 'brave@tiger.com',
    image_url: 'https://picsum.photos/200?random=6',
  },
  {
    id: '1a2b3c4d-7777-aaaa-bbbb-000000000007',
    name: 'Happy Koala',
    email: 'happy@koala.com',
    image_url: 'https://picsum.photos/200?random=7',
  },
  {
    id: '1a2b3c4d-8888-aaaa-bbbb-000000000008',
    name: 'Curious Bear',
    email: 'curious@bear.com',
    image_url: 'https://picsum.photos/200?random=8',
  },
  {
    id: '1a2b3c4d-9999-aaaa-bbbb-000000000009',
    name: 'Smart Deer',
    email: 'smart@deer.com',
    image_url: 'https://picsum.photos/200?random=9',
  },
  {
    id: '1a2b3c4d-aaaa-aaaa-bbbb-000000000010',
    name: 'Chill Llama',
    email: 'chill@llama.com',
    image_url: 'https://picsum.photos/200?random=10',
  },
];

const invoices = [
  {
    customer_id: customers[0].id,
    amount: 15795,
    status: 'pending',
    date: '2022-12-06',
  },
  {
    customer_id: customers[1].id,
    amount: 20348,
    status: 'pending',
    date: '2022-11-14',
  },
  {
    customer_id: customers[4].id,
    amount: 3040,
    status: 'paid',
    date: '2022-10-29',
  },
  {
    customer_id: customers[3].id,
    amount: 44800,
    status: 'paid',
    date: '2023-09-10',
  },
  {
    customer_id: customers[5].id,
    amount: 34577,
    status: 'pending',
    date: '2023-08-05',
  },
  {
    customer_id: customers[2].id,
    amount: 54246,
    status: 'pending',
    date: '2023-07-16',
  },
  {
    customer_id: customers[0].id,
    amount: 666,
    status: 'pending',
    date: '2023-06-27',
  },
  {
    customer_id: customers[3].id,
    amount: 32545,
    status: 'paid',
    date: '2023-06-09',
  },
  {
    customer_id: customers[4].id,
    amount: 1250,
    status: 'paid',
    date: '2023-06-17',
  },
  {
    customer_id: customers[5].id,
    amount: 8546,
    status: 'paid',
    date: '2023-06-07',
  },
  {
    customer_id: customers[1].id,
    amount: 500,
    status: 'paid',
    date: '2023-08-19',
  },
  {
    customer_id: customers[5].id,
    amount: 8945,
    status: 'paid',
    date: '2023-06-03',
  },
  {
    customer_id: customers[2].id,
    amount: 1000,
    status: 'paid',
    date: '2022-06-05',
  },
];

const revenue = [
  { month: 'Jan', revenue: 2000 },
  { month: 'Feb', revenue: 1800 },
  { month: 'Mar', revenue: 2200 },
  { month: 'Apr', revenue: 2500 },
  { month: 'May', revenue: 2300 },
  { month: 'Jun', revenue: 3200 },
  { month: 'Jul', revenue: 3500 },
  { month: 'Aug', revenue: 3700 },
  { month: 'Sep', revenue: 2500 },
  { month: 'Oct', revenue: 2800 },
  { month: 'Nov', revenue: 3000 },
  { month: 'Dec', revenue: 4800 },
];

export { users, customers, invoices, revenue };
