import { useCart } from "@/hooks/useCart";
import SEO from "@/components/shared/SEO";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { formatCurrency } from "@/lib/utils";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartCount } = useCart();
  const { isAuthenticated, user } = useAuth();

  if (cartCount === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-600">Your cart is empty.</p>
        <p className="mt-2">You cannot proceed to checkout without items.</p>
        <Button asChild className="mt-4">
            <Link to="/shop">Go Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <SEO title="Checkout" description="Complete your purchase securely." />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />
        <h1 className="mt-4 font-sans text-4xl font-bold">Checkout</h1>
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              {isAuthenticated ? (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <Input defaultValue={user?.name} />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <Input type="email" defaultValue={user?.email} />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <Input placeholder="123 Main St" />
                    </div>
                </div>
              ) : (
                <p>Please <Link to="/login?redirect=/checkout" className="text-primary underline">log in</Link> to continue.</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow mt-8">
                <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                <p className="text-gray-600">(Payment integration is a TODO. This is a placeholder.)</p>
                <div className="mt-4 p-4 border-dashed border-2 border-gray-300 rounded-md">
                    <p className="text-center text-gray-500">Stripe Payment Element would be here.</p>
                </div>
            </div>

          </div>
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow sticky top-24">
              <h2 className="text-lg font-medium text-gray-900">Your Order</h2>
              <ul className="mt-4 divide-y divide-gray-200">
                {cartItems.map(item => (
                    <li key={item.id} className="flex items-center justify-between py-2">
                        <span className="text-sm">{item.name} x {item.quantity}</span>
                        <span className="text-sm font-medium">{formatCurrency((item.price || 0) * item.quantity)}</span>
                    </li>
                ))}
              </ul>
              <div className="mt-6 border-t pt-4">
                <div className="flex items-center justify-between text-base font-medium text-gray-900">
                  <p>Total</p>
                  <p>{formatCurrency(cartTotal)}</p>
                </div>
              </div>
               <Button className="w-full mt-6" disabled={!isAuthenticated}>Place Order</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}