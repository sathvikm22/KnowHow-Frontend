import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { setCanonicalTag } from '../utils/seo';

const TermsAndConditions = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setCanonicalTag('/terms-and-conditions');
  }, []);

  return (
    <div className="min-h-screen bg-purple-50 dark:bg-purple-100 transition-colors duration-300">
      <Navigation />
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
              Terms and Conditions
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
                Welcome to <strong>Know How Café</strong> (the "Website", "Service", "we", "us", or "our"). These Terms and Conditions ("Terms") govern your access to and use of our website, services, and products.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                By accessing or using our website, creating an account, making a booking, or purchasing products, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
              </p>
            </section>

            {/* Acceptance of Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Acceptance of Terms</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                By using our website and services, you acknowledge that:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>You have read, understood, and agree to be bound by these Terms</li>
                <li>You are at least 18 years of age, or if under 18, you have parental or guardian consent</li>
                <li>You have the legal capacity to enter into these Terms</li>
                <li>You will comply with all applicable laws and regulations</li>
              </ul>
            </section>

            {/* Services Description */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Services Description</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Know How Café provides the following services:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li><strong>Workshop Bookings:</strong> Creative workshops, activities, and experiences</li>
                <li><strong>DIY Kits:</strong> Physical products and craft kits for purchase</li>
                <li><strong>Events:</strong> Special events and activities</li>
                <li><strong>Educational Content:</strong> Information and resources related to our services</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                We reserve the right to modify, suspend, or discontinue any service at any time without prior notice.
              </p>
            </section>

            {/* User Accounts */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. User Accounts</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">4.1 Account Creation</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                To access certain features, you must create an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4 mt-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information to keep it accurate</li>
                <li>Maintain the security of your password</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">4.2 Account Termination</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We reserve the right to suspend or terminate your account at any time for violation of these Terms, fraudulent activity, or any other reason we deem necessary.
              </p>
            </section>

            {/* Bookings and Reservations */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Bookings and Reservations</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">5.1 Booking Process</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Bookings are subject to availability</li>
                <li>All bookings must be confirmed through our website</li>
                <li>You will receive a confirmation email upon successful booking</li>
                <li>Bookings are non-transferable without our written consent</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">5.2 Payment</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Payment must be made in full at the time of booking unless otherwise specified</li>
                <li>We accept payment through secure payment gateways (UPI, credit/debit cards)</li>
                <li>All prices are in Indian Rupees (INR) unless otherwise stated</li>
                <li>Prices are subject to change without notice</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">5.3 Cancellation Policy</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Cancellation terms and refund procedures are subject to our booking policies. For specific cancellation requests, please contact us directly at knowhowcafe2025@gmail.com or call 95910 32562.
              </p>
            </section>

            {/* Products and Purchases */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Products and Purchases</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">6.1 Product Information</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions, images, or other content are accurate, complete, or error-free.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">6.2 Pricing</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>All prices are subject to change without notice</li>
                <li>Prices displayed are in Indian Rupees (INR)</li>
                <li>Shipping costs are additional unless otherwise stated</li>
                <li>We reserve the right to correct pricing errors</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">6.3 Order Acceptance</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Your order is an offer to purchase. We reserve the right to accept or reject any order for any reason, including product availability, pricing errors, or suspected fraudulent activity.
              </p>
            </section>

            {/* User Conduct */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. User Conduct</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Use our services for any illegal or unauthorized purpose</li>
                <li>Violate any laws in your jurisdiction</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit any viruses, malware, or harmful code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt our services</li>
                <li>Use automated systems to access our website without permission</li>
                <li>Impersonate any person or entity</li>
                <li>Harass, abuse, or harm other users</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Intellectual Property</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                All content on our website, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Text, graphics, logos, images, and software</li>
                <li>Workshop designs, instructions, and content</li>
                <li>Website design and layout</li>
                <li>Trademarks and service marks</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                Are the property of Know How Café or its licensors and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our written permission.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                To the maximum extent permitted by law:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Know How Café shall not be liable for any indirect, incidental, special, consequential, or punitive damages</li>
                <li>Our total liability shall not exceed the amount you paid for the specific service or product</li>
                <li>We are not responsible for any loss or damage resulting from your use of our services</li>
                <li>We do not guarantee that our services will be uninterrupted, secure, or error-free</li>
              </ul>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Indemnification</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                You agree to indemnify, defend, and hold harmless Know How Café, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of our services, violation of these Terms, or infringement of any rights of another.
              </p>
            </section>

            {/* Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">11. Privacy</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Your use of our services is also governed by our <button onClick={() => navigate('/privacy-policy')} className="text-blue-600 hover:underline">Privacy Policy</button>. Please review our Privacy Policy to understand how we collect, use, and protect your information.
              </p>
            </section>

            {/* Modifications to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">12. Modifications to Terms</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated "Last updated" date. Your continued use of our services after changes are posted constitutes acceptance of the modified Terms. We encourage you to review these Terms periodically.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">13. Governing Law</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of our services shall be subject to the exclusive jurisdiction of the courts in [Your City/State], India.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">14. Contact Us</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Email:</strong> knowhowcafe2025@gmail.com
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Phone:</strong> 95910 32562
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Response Time:</strong> We aim to respond within 24-48 hours.
                </p>
              </div>
            </section>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                These Terms and Conditions are effective as of the date listed above and apply to all users of Know How Café services.
              </p>
              <button
                onClick={() => {
                  navigate('/');
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

export default TermsAndConditions;

