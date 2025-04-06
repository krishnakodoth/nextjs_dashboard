'use server';

import { z } from 'zod';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import Invoice from '@/app/models/Invoice';

const FormSchema = z.object({
    id: z.string(),
    //customerId: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    //amount: z.coerce.number(),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    //status: z.enum(['pending', 'paid']),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
});

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};


export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        console.log('FormData:', formData);
        const resp = await signIn('credentials', formData);
        console.log('Response:', resp);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

const CreateInvoice = FormSchema.omit({ id: true, date: true });
// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(prevState: State, formData: FormData) {
    //const { customerId, amount, status } = CreateInvoice.parse({
    // Validate form fields using Zod
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }
    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    const newInvoice = await Invoice.create({
        customer_id: customerId,
        amount: amountInCents,
        status: status,
        date: new Date(date),
    });
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100;

    // await sql`
    //   UPDATE invoices
    //   SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    //   WHERE id = ${id}
    // `;


    await Invoice.updateOne(
        { _id: id }, // use your dynamic ID here
        {
            customer_id: customerId,
            amount: amountInCents,
            status: status,
        }
    );

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    throw new Error('Failed to Delete Invoice'); // For testing error handling
    await Invoice.deleteOne({ _id: id });
    revalidatePath('/dashboard/invoices');
}