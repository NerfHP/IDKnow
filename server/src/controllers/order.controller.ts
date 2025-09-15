import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
// 1. Import the new email functions from the service you just created
import { sendOrderConfirmationEmail, sendNewOrderNotificationEmail } from '../services/email.service';

const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response) => {
    // This function will expect an email, shipping details, cart items, and total from the checkout page
    const { shippingDetails, cartItems, total, customerEmail } = req.body;
    
    // Basic validation to ensure we have the necessary data
    if (!shippingDetails || !cartItems || !total || !customerEmail) {
        return res.status(400).json({ message: 'Missing required order information.' });
    }

    try {
        // Create the new order in the database
        const newOrder = await prisma.order.create({
            data: {
                total,
                customerName: shippingDetails.fullName,
                customerPhone: shippingDetails.phone,
                shippingAddress: `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.state} ${shippingDetails.zipCode}`,
                // Create the individual order items and link them to this order
                items: {
                    create: cartItems.map((item: any) => ({
                        product: { connect: { id: item.id } },
                        quantity: item.quantity,
                        price: item.salePrice ?? item.price ?? 0, // Use sale price if available
                    })),
                },
            },
            include: {
                items: { include: { product: true } }, // Include product details for the email templates
            },
        });
        
        // --- TRIGGER EMAILS ---
        // After successfully creating the order, send the emails.
        await sendOrderConfirmationEmail(newOrder, customerEmail);
        await sendNewOrderNotificationEmail(newOrder);

        // In a real application, you would also clear the user's cart here.
        
        // Send a success response back to the website
        res.status(201).json(newOrder);
    } catch (error) {
        console.error("Order creation failed:", error);
        res.status(500).json({ message: 'Failed to create order.' });
    }
};

