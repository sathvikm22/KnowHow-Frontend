import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { setMetaTags } from '../utils/seo';

const CONTACT_EMAIL = 'knowhowcafe2025@gmail.com';
const CONTACT_PHONE = '95910 32562';
const POLICY_UPDATED_AT = 'August 15, 2026';

const CancellationRefundPolicy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setMetaTags(
      'Cancellation and Refund Policy | Know How Café',
      'Read Know How Café’s policy for workshop cancellation requests, approved refunds, duplicate payments and DIY kit returns.',
      '/cancellations-refunds'
    );
  }, []);

  return (
    <div className="min-h-screen bg-purple-50 dark:bg-purple-100 transition-colors duration-300">
      <Navigation />
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">Cancellation &amp; Refund Policy</h1>
            <div className="mx-auto mb-4 w-40 h-1 rounded-full bg-gradient-to-r from-pink-400 via-orange-300 via-yellow-300 via-green-400 to-blue-400" />
            <p className="text-gray-600 text-lg">Last updated: {POLICY_UPDATED_AT}</p>
          </header>

          <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 sm:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Scope</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                This policy applies to paid workshop bookings and DIY kit orders placed through Know How Café. It should be read together with our Terms and Conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Workshop cancellations</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                If you need to cancel a workshop booking, use the cancellation option in your order history where it is available, or contact us with your booking reference, registered email address and reason for cancellation. We will review the request against the selected workshop, booking date and any applicable operational requirements, then confirm the outcome by email.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Approved refunds</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Where a workshop cancellation or other refund is approved, the refund is initiated to the original payment source. Banks and payment providers may take approximately 5–7 business days to reflect the amount after initiation. A booking is not treated as cancelled until we confirm it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. DIY kits: no returns or exchanges</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                DIY kit orders are final sale and are not eligible for return or exchange. This does not limit any rights that cannot be excluded under applicable law. If your order is incorrect, incomplete or arrives damaged, please contact us promptly with your order reference and clear photographs so that we can review and assist.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Failed, duplicate or unauthorised payments</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Do not make a second payment if the payment page shows an error or you are unsure whether a payment succeeded. Contact us with the order reference, transaction reference, amount and payment date. We will verify the transaction with our payment provider and resolve a duplicate or unsuccessful payment where applicable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Contact</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                For a cancellation, refund or order query, email{' '}
                <a className="text-purple-700 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>{' '}
                or call {CONTACT_PHONE}. Please include your order or booking reference so we can locate the correct record.
              </p>
            </section>

            <div className="pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
              <button onClick={() => navigate('/')} className="bg-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                Back to Home
              </button>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
};

export default CancellationRefundPolicy;
