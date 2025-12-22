import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { api } from '../lib/api';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: Check if user is logged in, but allow access to privacy policy
    // const storedUser = localStorage.getItem('userName');
    // if (!storedUser) {
    //   navigate('/');
    // }
  }, [navigate]);

  const handleWithdrawConsent = async () => {
    try {
      // Update consent to declined in Supabase
      await api.updateCookieConsent('declined');
      // Also clear localStorage
      localStorage.removeItem('cookieConsent');
      localStorage.removeItem('cookieConsentDate');
      window.cookieConsentGiven = false;
      alert('Your cookie consent has been withdrawn. Non-essential cookies will no longer be loaded. Please refresh the page for changes to take effect.');
    } catch (error) {
      console.error('Error withdrawing consent:', error);
      // Fallback: clear localStorage
      localStorage.removeItem('cookieConsent');
      localStorage.removeItem('cookieConsentDate');
      alert('Your cookie consent has been withdrawn locally. Please refresh the page for changes to take effect.');
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 dark:bg-purple-100 transition-colors duration-300">
      <Navigation />
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
              Privacy & Cookies Policy
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
                Welcome to <strong>Know How Café</strong> (the "Website"). We are committed to protecting your privacy and ensuring transparency about how we collect, use, and protect your personal information. This Privacy & Cookies Policy explains our practices regarding data collection, cookies, and your rights under the General Data Protection Regulation (GDPR) and ePrivacy Directive.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                By using our website, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
              </p>
            </section>

            {/* Data Controller */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Data Controller</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong>Know How Café</strong> is the data controller responsible for your personal data.
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-4 space-y-2 ml-4">
                <li><strong>Contact Email:</strong> knowhowcafe2025@gmail.com</li>
                <li><strong>Website Domain:</strong> [ENTER DOMAIN]</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                For privacy-related inquiries, data protection requests, or to exercise your rights, please contact us at the email address above.
              </p>
            </section>

            {/* Personal Data We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Personal Data We Collect</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We collect the following types of personal data:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">3.1 Account Registration & Authentication</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li><strong>Email Address:</strong> Required for account creation, login, and communication</li>
                <li><strong>Password:</strong> Encrypted and stored securely for authentication</li>
                <li><strong>Full Name:</strong> Collected during signup for personalization</li>
                <li><strong>Google OAuth Data:</strong> If you sign in with Google, we collect your Google account email and name (with your consent)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">3.2 Booking & Reservation Data</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li><strong>Booking Details:</strong> Date, time, number of participants, selected activities</li>
                <li><strong>Contact Information:</strong> Name, email, phone number (if provided)</li>
                <li><strong>Special Requests:</strong> Any additional information you provide during booking</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">3.3 Payment Information</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li><strong>Payment Method:</strong> UPI details or card information (processed securely by third-party payment gateways)</li>
                <li><strong>Transaction Records:</strong> Payment amount, date, transaction ID</li>
                <li><strong>Note:</strong> We do not store full credit card numbers or sensitive payment details on our servers</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">3.4 Contact Form Data</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li><strong>Name:</strong> Your name as provided in the contact form</li>
                <li><strong>Email:</strong> Your email address for response</li>
                <li><strong>Message:</strong> The content of your inquiry or feedback</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">3.5 Usage & Analytics Data</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li><strong>IP Address:</strong> Collected for security and analytics (only after consent)</li>
                <li><strong>Browser Type & Version:</strong> For compatibility and optimization</li>
                <li><strong>Pages Visited:</strong> To understand user behavior and improve our website</li>
                <li><strong>Login Logs:</strong> Timestamp and method of login (email or Google OAuth)</li>
              </ul>
            </section>

            {/* How We Use Your Data */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. How We Use Your Personal Data</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We use your personal data for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li><strong>Account Management:</strong> To create and manage your account, authenticate logins, and provide access to our services</li>
                <li><strong>Booking Processing:</strong> To process reservations, confirm bookings, send reminders, and manage cancellations</li>
                <li><strong>Payment Processing:</strong> To process payments securely through third-party payment gateways</li>
                <li><strong>Communication:</strong> To respond to your inquiries, send booking confirmations, and provide customer support</li>
                <li><strong>Website Improvement:</strong> To analyze usage patterns, fix bugs, and enhance user experience (with your consent)</li>
                <li><strong>Marketing:</strong> To send promotional emails about events, offers, and activities (only with your explicit consent)</li>
                <li><strong>Legal Compliance:</strong> To comply with legal obligations and protect our rights</li>
              </ul>
            </section>

            {/* Cookies & Tracking Technologies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Cookies & Tracking Technologies</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">5.1 What Are Cookies?</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and improve your browsing experience.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">5.2 Types of Cookies We Use</h3>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mt-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Essential Cookies (Always Active)</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  These cookies are necessary for the website to function properly. They cannot be disabled.
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                  <li><strong>Authentication Cookies:</strong> Remember your login session</li>
                  <li><strong>Security Cookies:</strong> Protect against fraud and unauthorized access</li>
                  <li><strong>Session Cookies:</strong> Maintain your session while browsing</li>
                  <li><strong>Cookie Consent Preference:</strong> Remember your cookie consent choice</li>
                </ul>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 mt-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Analytics Cookies (Require Consent)</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  These cookies help us understand how visitors use our website. They are only loaded after you click "I agree" on the cookie banner.
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                  <li><strong>Google Analytics:</strong> Tracks page views, user interactions, and website performance</li>
                  <li><strong>Purpose:</strong> To improve website functionality and user experience</li>
                  <li><strong>Retention:</strong> Up to 26 months (as per Google Analytics default)</li>
                </ul>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 mt-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Marketing Cookies (Require Consent)</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  These cookies are used to deliver personalized advertisements and track marketing campaign effectiveness. They are only loaded after you click "I agree".
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                  <li><strong>Advertising Cookies:</strong> Track your interests to show relevant ads</li>
                  <li><strong>Social Media Cookies:</strong> Enable social media sharing features</li>
                  <li><strong>Retargeting Cookies:</strong> Remember your visits to show relevant content</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mt-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Preference Cookies (Require Consent)</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  These cookies remember your preferences and settings to personalize your experience.
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                  <li><strong>Language Preferences:</strong> Remember your preferred language</li>
                  <li><strong>Theme Settings:</strong> Remember dark/light mode preference</li>
                  <li><strong>Display Preferences:</strong> Remember your UI customization choices</li>
                </ul>
              </div>
            </section>

            {/* Cookie Consent Implementation */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Cookie Consent & Script Loading (GDPR + ePrivacy Directive)</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                In compliance with GDPR and the ePrivacy Directive, we implement a strict cookie consent mechanism:
              </p>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 mt-4 border-2 border-purple-300 dark:border-purple-700">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">How Our Cookie Banner Works:</h4>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                  <li><strong>Non-Essential Scripts Blocked:</strong> All non-essential JavaScript scripts (including Google Analytics, marketing scripts, and third-party tracking scripts) are <strong>not loaded</strong> until you explicitly click "I agree" on the cookie consent banner.</li>
                  <li><strong>Tagged Scripts:</strong> Any JavaScript tagged for analytics, marketing, or tracking purposes will only execute after consent is given.</li>
                  <li><strong>Essential Scripts:</strong> Only essential scripts required for basic website functionality (authentication, security, session management) are loaded immediately.</li>
                  <li><strong>Consent Storage:</strong> Your consent choice is stored in your browser's localStorage and respected across sessions.</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">6.1 How to Withdraw Consent</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You can withdraw your consent at any time:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Click the button below to withdraw consent</li>
                <li>Contact us at <strong>knowhowcafe2025@gmail.com</strong> to request consent withdrawal</li>
                <li>Clear your browser's localStorage and cookies (this will also log you out)</li>
              </ul>
              <button
                onClick={handleWithdrawConsent}
                className="mt-4 bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors duration-300"
              >
                Withdraw Cookie Consent
              </button>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">6.2 How to Opt Out of Analytics</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                If you've previously consented but want to opt out of Google Analytics:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Use the "Withdraw Cookie Consent" button above</li>
                <li>Install the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Analytics Opt-out Browser Add-on</a></li>
                <li>Contact us to request manual opt-out</li>
              </ul>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Third-Party Services</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We use the following third-party services that may collect or process your data:
              </p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Google Analytics</h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Purpose:</strong> Website analytics and performance tracking
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Data Collected:</strong> IP address (anonymized), page views, user interactions, device information
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Cookies:</strong> Only set after you click "I agree" on the cookie banner
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Privacy Policy:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Privacy Policy</a>
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Google OAuth</h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Purpose:</strong> Authentication and account creation
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Data Collected:</strong> Email address, name, profile picture (if available)
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Privacy Policy:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Privacy Policy</a>
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Payment Gateway</h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Purpose:</strong> Secure payment processing (UPI or card payments)
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Data Collected:</strong> Payment method details, transaction amount, billing information
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Note:</strong> Payment data is processed by our secure payment provider. We do not store full card numbers or sensitive payment details.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Data Retention Periods</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We retain your personal data for the following periods:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li><strong>Account Data:</strong> Retained for as long as your account is active. Deleted within 30 days of account deletion request.</li>
                <li><strong>Booking Records:</strong> Retained for 3 years for accounting and legal purposes, then anonymized or deleted.</li>
                <li><strong>Payment Records:</strong> Retained for 7 years as required by financial regulations, then securely deleted.</li>
                <li><strong>Contact Form Submissions:</strong> Retained for 2 years, then deleted unless required for legal purposes.</li>
                <li><strong>Login Logs:</strong> Retained for 1 year for security purposes, then deleted.</li>
                <li><strong>Analytics Data:</strong> Retained according to Google Analytics retention settings (default: 26 months).</li>
                <li><strong>Cookie Consent Records:</strong> Retained until consent is withdrawn or account is deleted.</li>
              </ul>
            </section>

            {/* Your Rights Under GDPR */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Your Rights Under GDPR</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                As a data subject under GDPR, you have the following rights:
              </p>
              
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Right of Access</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    You can request a copy of all personal data we hold about you. Contact us at <strong>knowhowcafe2025@gmail.com</strong> to make a request.
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Right to Rectification</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    You can request correction of inaccurate or incomplete personal data. You can update your profile information in your account settings or contact us.
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Right to Erasure ("Right to be Forgotten")</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    You can request deletion of your personal data. We will delete your data unless we have a legal obligation to retain it (e.g., payment records for tax purposes).
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Right to Restrict Processing</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    You can request that we limit how we use your personal data in certain circumstances (e.g., while you contest the accuracy of data).
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Right to Data Portability</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    You can request a machine-readable copy of your personal data to transfer to another service provider.
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Right to Object</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    You can object to processing of your personal data for marketing purposes or based on legitimate interests.
                  </p>
                </div>

                <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Right to Withdraw Consent</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    You can withdraw consent for non-essential cookies and tracking at any time using the button above or by contacting us.
                  </p>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-6">
                To exercise any of these rights, please contact us at <strong>knowhowcafe2025@gmail.com</strong>. We will respond to your request within 30 days.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Data Security</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We implement appropriate technical and organizational measures to protect your personal data:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>Encryption of passwords using bcrypt hashing</li>
                <li>Secure HTTPS connections for all data transmission</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication for admin accounts</li>
                <li>Secure storage of data in encrypted databases</li>
                <li>Regular backups and disaster recovery procedures</li>
              </ul>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">11. Children's Privacy</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Our services are not directed to children under 16 years of age. We do not knowingly collect personal data from children. If you are a parent or guardian and believe your child has provided us with personal data, please contact us immediately, and we will delete such information.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">12. Changes to This Policy</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We may update this Privacy & Cookies Policy from time to time. We will notify you of any material changes by:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4 mt-4">
                <li>Posting the updated policy on this page with a new "Last updated" date</li>
                <li>Sending an email notification to registered users (if changes are significant)</li>
                <li>Displaying a notice on our website</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                Your continued use of our website after changes are posted constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">13. Contact Us</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                If you have questions, concerns, or requests regarding this Privacy & Cookies Policy or your personal data, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Email:</strong> knowhowcafe2025@gmail.com
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Subject Line:</strong> "Privacy Request" or "Data Protection Inquiry"
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Response Time:</strong> We aim to respond within 30 days of receiving your request.
                </p>
              </div>
            </section>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                This Privacy & Cookies Policy is effective as of the date listed above and applies to all users of Know How Café website.
              </p>
              <button
                onClick={() => {
                  navigate('/home');
                  // Scroll to top after navigation
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

export default PrivacyPolicy;

