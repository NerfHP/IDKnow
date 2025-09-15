import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { Lock, Truck, CheckCircle, Wallet } from 'lucide-react';
import SEO from '@/components/shared/SEO';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart'; // Using your existing cart hook
import { CartItem } from '@/types';

// --- CONFIGURATION FOR YOUR STORE ---
const SHIPPING_COST = 50.00;
const FREE_SHIPPING_THRESHOLD = 1000; // Free delivery for orders over ₹1000
const TAX_RATE = 0.05; // 5% tax
// ------------------------------------

const shippingSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  address: z.string().min(5, "A valid address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().regex(/^\d{6}$/, "Must be a 6-digit zip code"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Must be a valid 10-digit mobile number"),
});
type ShippingFormData = z.infer<typeof shippingSchema>;

const ProgressIndicator = ({ step }: { step: number }) => {
  const steps = ['Shipping', 'Payment', 'Review'];
  return (
    <div className="flex items-center justify-center space-x-4 mb-12">
      {steps.map((label, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${step > index ? 'bg-green-500 text-white' : step === index ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > index ? <CheckCircle size={20} /> : index + 1}
            </div>
            <p className={`mt-2 text-xs font-semibold ${step >= index ? 'text-gray-800' : 'text-gray-400'}`}>{label}</p>
          </div>
          {index < steps.length - 1 && <div className={`flex-1 h-1 ${step > index ? 'bg-green-500' : 'bg-gray-200'}`} />}
        </React.Fragment>
      ))}
    </div>
  );
};

const OrderSummary = ({ items, totals }: { items: CartItem[], totals: { subtotal: number, shipping: number, tax: number, total: number } }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border">
        <h3 className="text-lg font-semibold mb-4 border-b pb-3">Order Summary</h3>
        {items.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Your cart is empty.</p>
        ) : (
        <>
            <div className="space-y-3">
                {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                             <img src={JSON.parse(item.images as string)[0] || ''} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                            <div>
                                <p className="font-medium text-sm">{item.name}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                        </div>
                        <p className="text-sm font-semibold">₹{(item.salePrice || item.price || 0).toLocaleString('en-IN')}</p>
                    </div>
                ))}
            </div>
            {totals.subtotal < FREE_SHIPPING_THRESHOLD && totals.subtotal > 0 && (
              <div className="text-center text-xs text-green-700 bg-green-50 p-3 rounded-md my-4 border border-green-200">
                Add <strong>₹{(FREE_SHIPPING_THRESHOLD - totals.subtotal).toLocaleString('en-IN')}</strong> more for <strong>FREE delivery!</strong>
              </div>
            )}
            <div className="border-t mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>₹{totals.subtotal.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className={totals.shipping === 0 ? 'text-green-600 font-semibold' : ''}>{totals.shipping === 0 ? 'FREE' : `₹${totals.shipping.toLocaleString('en-IN')}`}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Taxes (5%)</span><span>₹{totals.tax.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t"><span >Total</span><span>₹{totals.total.toLocaleString('en-IN')}</span></div>
            </div>
        </>
        )}
    </div>
);

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [shippingDetails, setShippingDetails] = useState<ShippingFormData | null>(null);

  // --- REAL-TIME DATA from your existing useCart hook ---
  const { cartItems, subtotal } = useCart();

  // --- DYNAMIC TOTALS CALCULATION ---
  const totals = useMemo(() => {
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  }, [subtotal]);

  const { register: registerShipping, handleSubmit: handleShippingSubmit, formState: { errors: shippingErrors } } = useForm<ShippingFormData>({ resolver: zodResolver(shippingSchema) });

  const onShippingSubmit = (data: ShippingFormData) => {
    setShippingDetails(data);
    setStep(2);
  };
  
  const handleProceedToPayment = () => {
    // This will take the user to the payment gateway in a real app
    console.log("Proceeding to payment gateway...");
    setStep(3); // Go to the review step for now
  };

  const handlePlaceOrder = () => {
    alert("Order placed successfully! (This is a placeholder)");
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2"><Truck size={24} /> Shipping Details</h2>
            <form onSubmit={handleShippingSubmit(onShippingSubmit)} className="space-y-4">
              <div><input {...registerShipping('fullName')} placeholder="Full Name" className="w-full p-3 border rounded-md" /><p className="text-red-500 text-xs mt-1">{shippingErrors.fullName?.message}</p></div>
              <div><input {...registerShipping('address')} placeholder="Street Address" className="w-full p-3 border rounded-md" /><p className="text-red-500 text-xs mt-1">{shippingErrors.address?.message}</p></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><input {...registerShipping('city')} placeholder="City" className="w-full p-3 border rounded-md" /><p className="text-red-500 text-xs mt-1">{shippingErrors.city?.message}</p></div>
                <div><input {...registerShipping('state')} placeholder="State" className="w-full p-3 border rounded-md" /><p className="text-red-500 text-xs mt-1">{shippingErrors.state?.message}</p></div>
                <div><input {...registerShipping('zipCode')} placeholder="Zip Code" className="w-full p-3 border rounded-md" /><p className="text-red-500 text-xs mt-1">{shippingErrors.zipCode?.message}</p></div>
              </div>
              <div><input {...registerShipping('phone')} placeholder="Mobile Number" className="w-full p-3 border rounded-md" /><p className="text-red-500 text-xs mt-1">{shippingErrors.phone?.message}</p></div>
              <button type="submit" className="w-full bg-red-500 text-white font-bold py-3 rounded-md hover:bg-red-600 transition-colors">Continue to Payment</button>
            </form>
          </motion.div>
        );
      case 2:
        return (
          <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2"><Wallet size={24} /> Payment</h2>
            <div className="text-center p-6 bg-gray-50 rounded-lg border">
                <p className="font-medium">You will be redirected to our secure payment partner to complete your purchase.</p>
                <p className="text-sm text-gray-500 mt-2">We accept all major credit/debit cards, UPI, and wallets.</p>
            </div>
             <div className="flex items-center justify-between gap-4 mt-8">
                <button onClick={() => setStep(1)} type="button" className="text-sm font-semibold text-gray-600 hover:text-black">← Back to Shipping</button>
                <button onClick={handleProceedToPayment} className="w-1/2 bg-red-500 text-white font-bold py-3 rounded-md hover:bg-red-600 transition-colors">
                    Proceed to Payment
                </button>
              </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
             <h2 className="text-2xl font-semibold mb-6">Review Your Order</h2>
             <div className="space-y-4 bg-gray-50 p-4 rounded-md border">
               <div>
                  <h4 className="font-semibold text-sm">Shipping To:</h4>
                  <p className="text-sm text-gray-600">{shippingDetails?.fullName}</p>
                  <p className="text-sm text-gray-600">{shippingDetails?.address}, {shippingDetails?.city}, {shippingDetails?.state} {shippingDetails?.zipCode}</p>
               </div>
             </div>
             <div className="flex items-center justify-between gap-4 mt-8">
                <button onClick={() => setStep(2)} type="button" className="text-sm font-semibold text-gray-600 hover:text-black">← Back to Payment</button>
                <button onClick={handlePlaceOrder} className="w-1/2 bg-green-500 text-white font-bold py-3 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                    <Lock size={16}/> Place Order
                </button>
              </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <SEO title="Checkout" description="Complete your purchase securely." />
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <Link to="/" className="text-2xl font-bold font-sans mb-8 block text-center">Siddhi Divine Checkout</Link>
          <div className="max-w-4xl mx-auto">
            <ProgressIndicator step={step} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border">
                <AnimatePresence mode="wait">
                    {renderStep()}
                </AnimatePresence>
              </div>
              <div className="md:order-first">
                <OrderSummary items={cartItems} totals={totals} />
              </div>
            </div>
             <p className="text-xs text-gray-400 text-center mt-8 flex items-center justify-center gap-1"><Lock size={12}/> Secure Checkout Guaranteed</p>
          </div>
        </div>
      </div>
    </>
  );
}

