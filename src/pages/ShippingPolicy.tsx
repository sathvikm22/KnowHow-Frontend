import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { setMetaTags } from '../utils/seo';

const CONTACT_EMAIL = 'knowhowcafe2025@gmail.com';
const CONTACT_PHONE = '95910 32562';
const POLICY_UPDATED_AT = 'August 15, 2026';

const ShippingPolicy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setMetaTags(
      'Shipping Policy | Know How Café',
      'Read Know How Café’s DIY kit delivery, address, shipping-charge and order-status policy.',
      '/shipping-policy'
    );
  }, []);

  return (
    <div className="min-h-screen bg-teal-50 dark:bg-teal-100 transition-colors duration-300">
      <Navigation />
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">Shipping Policy</h1>
            <div className="mx-auto mb-4 w-40 h-1 rounded-full bg-gradient-to-r from-pink-400 via-orange-300 via-yellow-300 via-green-400 to-blue-400" />
            <p className="text-gray-600 text-lg">Last updated: {POLICY_UPDATED_AT}</p>
          </header>

          <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 sm:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. What this policy covers</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                This policy applies only to physical DIY kit orders. Workshop bookings are experiences held at the selected venue or date and do not involve shipping.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Delivery address and availability</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                A complete delivery address, email address and phone number are required to place a DIY kit order. Delivery is subject to serviceability of the supplied address. Please check your address carefully before payment and contact us promptly if it needs correction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Charges and delivery estimates</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                The amount payable is displayed before payment. The current checkout does not add a separate shipping charge to the displayed total. Estimated delivery information, where available, is provided in your order confirmation or order-status updates. Delivery dates are estimates and may vary due to location, courier availability, weather or other factors outside our reasonable control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Order updates</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                After a successful payment, we confirm the order using the email address provided at checkout. You can use the order history after signing in to view available order-status updates. If you have checked out as a guest, contact us with the email address and order reference used for the purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Contact</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                For delivery help, email{' '}
                <a className="text-teal-700 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>{' '}
                or call {CONTACT_PHONE}. Include your order reference and delivery address so we can assist.
              </p>
            </section>

            <div className="pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
              <button onClick={() => navigate('/')} className="bg-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors">
                Back to Home
              </button>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
};

export default ShippingPolicy;
