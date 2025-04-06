## Next.js App Router Course - Starter

This is the starter template for the Next.js App Router Course. It contains the starting code for the dashboard application.

For more information, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.


### 1. Setting up MongoDB

- Make sure MongoDB is installed and running locally or use MongoDB Atlas.
- Create a `.env.local` file and add your MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/sampledb
```

### 2. Collections Used

The following collections (tables) are required:

### users

     id: string (UUID)
     name: string
     email: string
     password: string (hashed)

### customer
    id: string (UUID)
     name: string
     email: string
     image_url:string

### invoices

    id: string (UUID)
    customer_id: string (references customers.id)
    amount: number
    status: string (pending, paid, etc.)
    date: string
    createdAt and updatedAt (auto timestamps)

### revenue

    month: string
    revenue: number
    createdAt and updatedAt (auto timestamps)
    

### 3. Seed Sample Data
To populate the database with sample data:
* Run the dev server:
``` 
npm run dev Or pnpm run dev
```
* Visit

    `http://localhost:3000/seed`
    
    This will truncate existing data and insert new random customer and invoice entries.

