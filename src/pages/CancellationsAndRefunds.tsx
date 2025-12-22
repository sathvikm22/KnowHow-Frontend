import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

const CancellationsAndRefunds = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-purple-50 dark:bg-purple-100 transition-colors duration-300">
      <Navigation />
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
              Cancellations and Refunds Policy
            </h1>
            <div className="mx-auto mb-4 w-40 h-1 rounded-full bg-gradient-to-r from-pink-400 via-orange-300 via-yellow-300 via-green-400 to-blue-400"></div>
            <p className="text-gray-600 text-lg">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 sm:p-12 space-y-8">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Welcome to <strong>Know How Café</strong>. This Cancellations and Refunds Policy outlines our policies regarding cancellations, refunds, and returns for bookings, products, and services purchased through our website.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                Please read this policy carefully before making a purchase or booking. By placing an order or making a booking, you agree to the terms outlined in this policy.
              </p>
            </section>

            {/* Workshop Bookings Cancellation */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Workshop Bookings Cancellation</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">2.1 Cancellation by Customer</h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mt-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Cancellation Timeframes and Refunds:</h4>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                  <li><strong>More than 48 hours before the workshop:</strong> Full refund (100% of the booking amount)</li>
                  <li><strong>24-48 hours before the workshop:</strong> 50% refund of the booking amount</li>
                  <li><strong>Less than 24 hours before the workshop:</strong> No refund (0%)</li>
                  <li><strong>No-show (failure to attend without cancellation):</strong> No refund</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">2.2 How to Cancel a Booking</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                To cancel your workshop booking:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Log into your account on our website</li>
                <li>Navigate to your bookings section</li>
                <li>Select the booking you wish to cancel</li>
                <li>Click "Cancel Booking" and confirm</li>
                <li>Alternatively, contact us at <strong>knowhowcafe2025@gmail.com</strong> or call <strong>95910 32562</strong></li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">2.3 Cancellation by Know How Café</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                In the event that we need to cancel a workshop due to unforeseen circumstances (e.g., instructor unavailability, weather conditions, insufficient participants, or other reasons), you will be entitled to:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4 mt-2">
                <li>A full refund of the booking amount, OR</li>
                <li>Rescheduling to another available date/time (subject to availability)</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                We will notify you as soon as possible via email or phone if we need to cancel a workshop.
              </p>
            </section>

            {/* Product Returns and Refunds */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Product Returns and Refunds</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">3.1 Return Eligibility</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You may return products within <strong>7 days</strong> of delivery if:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>The product is defective or damaged upon arrival</li>
                <li>The product received is different from what was ordered</li>
                <li>The product is in its original, unopened, and unused condition</li>
                <li>All original packaging and accessories are included</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">3.2 Non-Returnable Items</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                The following items are not eligible for return:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Personalized or customized products</li>
                <li>Perishable items</li>
                <li>Items that have been used, opened, or damaged by the customer</li>
                <li>Digital products or downloadable content</li>
                <li>Items returned after the 7-day return period</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">3.3 Return Process</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                To initiate a return:
              </p>
              <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Contact us at <strong>knowhowcafe2025@gmail.com</strong> within 7 days of delivery</li>
                <li>Provide your order number and reason for return</li>
                <li>We will review your request and provide return instructions</li>
                <li>Package the item securely in its original packaging</li>
                <li>Ship the item back to the address provided (return shipping costs may apply)</li>
                <li>Once we receive and inspect the returned item, we will process your refund</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">3.4 Refund Processing</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Refunds will be processed as follows:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li><strong>Refund Method:</strong> Refunds will be issued to the original payment method used for the purchase</li>
                <li><strong>Processing Time:</strong> 5-10 business days after we receive and inspect the returned item</li>
                <li><strong>Refund Amount:</strong> Full purchase price (excluding original shipping costs, unless the item was defective or incorrect)</li>
                <li><strong>Return Shipping:</strong> Return shipping costs are the customer's responsibility unless the item was defective or incorrect</li>
              </ul>
            </section>

            {/* Refund Processing Time */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Refund Processing Time</h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  <strong>Important:</strong> Refund processing times vary by payment method:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                  <li><strong>Credit/Debit Cards:</strong> 5-10 business days</li>
                  <li><strong>UPI:</strong> 3-5 business days</li>
                  <li><strong>Bank Transfer:</strong> 5-7 business days</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 mt-4">
                  Please note that it may take additional time for the refund to appear in your account depending on your bank or payment provider.
                </p>
              </div>
            </section>

            {/* Partial Refunds */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Partial Refunds</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We may issue partial refunds in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>If only part of your order is returned</li>
                <li>If the returned item shows signs of use or damage not present at the time of delivery</li>
                <li>If original packaging or accessories are missing</li>
                <li>For late cancellations of workshop bookings (as per cancellation policy above)</li>
              </ul>
            </section>

            {/* Exchange Policy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Exchange Policy</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We currently do not offer direct exchanges. If you wish to exchange a product:
              </p>
              <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Return the original item following our return process</li>
                <li>Place a new order for the desired item</li>
                <li>Once your return is processed, the refund will be issued to your original payment method</li>
              </ol>
            </section>

            {/* Dispute Resolution */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Dispute Resolution</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                If you are not satisfied with a refund decision or have concerns about our cancellation/refund process:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Contact us at <strong>knowhowcafe2025@gmail.com</strong> with your order/booking number</li>
                <li>Provide detailed information about your concern</li>
                <li>We will review your case and respond within 5-7 business days</li>
                <li>We are committed to resolving disputes fairly and promptly</li>
              </ul>
            </section>

            {/* Special Circumstances */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Special Circumstances</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">8.1 Force Majeure</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We are not liable for cancellations or delays due to circumstances beyond our control, including but not limited to natural disasters, pandemics, government restrictions, or other force majeure events. In such cases, we will work with you to find a suitable resolution, which may include rescheduling or credit for future use.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">8.2 Medical Emergencies</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                In case of medical emergencies or other extenuating circumstances, please contact us as soon as possible. We will review each case individually and may offer exceptions to our standard cancellation policy.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Contact Us</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                For questions, cancellations, or refund requests, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Email:</strong> knowhowcafe2025@gmail.com
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Phone:</strong> 95910 32562
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Subject Line:</strong> "Cancellation Request - [Order/Booking Number]" or "Refund Request - [Order/Booking Number]"
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Response Time:</strong> We aim to respond within 24-48 hours.
                </p>
              </div>
            </section>

            {/* Changes to This Policy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Changes to This Policy</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We reserve the right to update this Cancellations and Refunds Policy at any time. Changes will be posted on this page with an updated "Last updated" date. Your continued use of our services after changes are posted constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                This Cancellations and Refunds Policy is effective as of the date listed above and applies to all bookings and purchases made through Know How Café.
              </p>
              <button
                onClick={() => {
                  navigate('/home');
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 100);
                }}
                className="inline-block mt-6 bg-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors duration-300"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationsAndRefunds;

