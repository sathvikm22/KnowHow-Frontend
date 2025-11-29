import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

const ShippingPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-purple-50 dark:bg-purple-100 transition-colors duration-300">
      <Navigation />
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
              Shipping Policy
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
                Welcome to <strong>Know How Café</strong>. This Shipping Policy outlines our policies and procedures regarding the delivery of physical products, DIY kits, and merchandise purchased through our website.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                Please read this policy carefully before making a purchase. By placing an order with us, you agree to the terms outlined in this Shipping Policy.
              </p>
            </section>

            {/* Shipping Areas */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Shipping Areas</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We currently ship to the following locations:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li><strong>Domestic Shipping:</strong> All major cities and towns across India</li>
                <li><strong>International Shipping:</strong> Currently not available. We are working on expanding our shipping services.</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                If you are located outside our shipping areas, please contact us at <strong>knowhowcafe2025@gmail.com</strong> to discuss alternative arrangements.
              </p>
            </section>

            {/* Shipping Methods and Timeframes */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Shipping Methods and Timeframes</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">3.1 Standard Shipping</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li><strong>Delivery Time:</strong> 5-7 business days</li>
                <li><strong>Cost:</strong> Calculated at checkout based on weight and destination</li>
                <li><strong>Tracking:</strong> Tracking information will be provided via email once your order ships</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">3.2 Express Shipping</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li><strong>Delivery Time:</strong> 2-3 business days</li>
                <li><strong>Cost:</strong> Additional charges apply (shown at checkout)</li>
                <li><strong>Availability:</strong> Available for select locations</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">3.3 Processing Time</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                All orders are processed within 1-2 business days (excluding weekends and public holidays) after payment confirmation. You will receive an email notification once your order has been processed and shipped.
              </p>
            </section>

            {/* Shipping Costs */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Shipping Costs</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Shipping costs are calculated based on the following factors:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Product weight and dimensions</li>
                <li>Shipping destination</li>
                <li>Selected shipping method (Standard or Express)</li>
                <li>Special handling requirements (if applicable)</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                Shipping costs will be displayed at checkout before you complete your purchase. Free shipping may be available for orders above a certain value - please check our website for current promotions.
              </p>
            </section>

            {/* Order Tracking */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Order Tracking</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Once your order has been shipped, you will receive:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>An email confirmation with your tracking number</li>
                <li>A link to track your shipment online</li>
                <li>Estimated delivery date</li>
                <li>Contact information for the shipping carrier</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                If you have not received tracking information within 3 business days of placing your order, please contact us at <strong>knowhowcafe2025@gmail.com</strong>.
              </p>
            </section>

            {/* Delivery Issues */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Delivery Issues</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">6.1 Failed Delivery Attempts</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                If delivery is attempted but unsuccessful due to incorrect address, recipient unavailable, or other reasons, the shipping carrier will typically make multiple attempts. After failed attempts, the package may be returned to us, and additional shipping charges may apply for re-delivery.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">6.2 Lost or Damaged Packages</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                In the rare event that your package is lost or damaged during shipping:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Contact us immediately at <strong>knowhowcafe2025@gmail.com</strong> with your order number</li>
                <li>We will investigate the issue with the shipping carrier</li>
                <li>We will replace or refund your order as appropriate</li>
                <li>Please retain all packaging materials for inspection if damage is reported</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">6.3 Delayed Deliveries</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                While we strive to deliver within the estimated timeframes, delays may occur due to weather conditions, carrier issues, or other circumstances beyond our control. We will keep you informed of any significant delays and work to resolve them promptly.
              </p>
            </section>

            {/* Address Accuracy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Address Accuracy</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                It is your responsibility to provide accurate shipping information. Please ensure that:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Your shipping address is complete and correct</li>
                <li>Your contact phone number is accurate</li>
                <li>Any special delivery instructions are clearly stated</li>
                <li>You notify us immediately if you need to change your shipping address after placing an order</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                We are not responsible for delays or additional costs resulting from incorrect or incomplete shipping information. If you need to update your shipping address, contact us as soon as possible at <strong>knowhowcafe2025@gmail.com</strong>.
              </p>
            </section>

            {/* Non-Shippable Items */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Non-Shippable Items</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Please note that some items may not be available for shipping:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Workshop bookings and experiences (these are location-based services)</li>
                <li>Certain fragile or oversized items (contact us for special arrangements)</li>
                <li>Items restricted by local regulations</li>
              </ul>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Contact Us</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                If you have any questions or concerns about shipping, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Email:</strong> knowhowcafe2025@gmail.com
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Phone:</strong> 95910 32562
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Subject Line:</strong> "Shipping Inquiry - [Your Order Number]"
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
                We reserve the right to update this Shipping Policy at any time. Changes will be posted on this page with an updated "Last updated" date. Your continued use of our services after changes are posted constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                This Shipping Policy is effective as of the date listed above and applies to all orders placed through Know How Café.
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

export default ShippingPolicy;

