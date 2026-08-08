import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { api } from '../lib/api';
import { setMetaTags } from '../utils/seo';

type CookieConsentChoice = 'accepted' | 'declined' | null;

const POLICY_UPDATED_AT = 'August 8, 2026';
const CONTACT_EMAIL = 'knowhowcafe2025@gmail.com';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cookieConsent, setCookieConsent] = useState<CookieConsentChoice>(null);
  const [isLoadingConsent, setIsLoadingConsent] = useState(true);

  useEffect(() => {
    setMetaTags(
      'Privacy & Cookie Policy | Know How Café',
      'Learn how Know How Café handles account, booking and purchase information, and how browser storage is used on our website.',
      '/privacy-policy'
    );

    const loadConsentPreference = async () => {
      const storedUser = localStorage.getItem('userName');
      const localChoice = localStorage.getItem('cookieConsent');
      const savedChoice: CookieConsentChoice =
        localChoice === 'accepted' || localChoice === 'declined' ? localChoice : null;

      setIsLoggedIn(Boolean(storedUser));
      setCookieConsent(savedChoice);

      if (!storedUser) {
        setIsLoadingConsent(false);
        return;
      }

      try {
        const response = await api.getCookieConsent();
        if (response.success) {
          const serverChoice = response.data?.cookieConsent || response.cookieConsent;
          if (serverChoice === 'accepted' || serverChoice === 'declined') {
            setCookieConsent(serverChoice);
          }
        }
      } catch {
        // The saved browser preference remains available if the request cannot complete.
      } finally {
        setIsLoadingConsent(false);
      }
    };

    loadConsentPreference();
  }, []);

  const updateConsent = async (choice: Exclude<CookieConsentChoice, null>) => {
    try {
      await api.updateCookieConsent(choice);
    } catch {
      // Keep the preference on this device even if the account update is temporarily unavailable.
    }

    localStorage.setItem('cookieConsent', choice);
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    window.cookieConsentGiven = choice === 'accepted';
    setCookieConsent(choice);
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: { accepted: choice === 'accepted' } }));
  };

  return (
    <div className="min-h-screen bg-teal-50 dark:bg-teal-100 transition-colors duration-300">
      <Navigation />
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
              Privacy &amp; Cookie Policy
            </h1>
            <div className="mx-auto mb-4 w-40 h-1 rounded-full bg-gradient-to-r from-pink-400 via-orange-300 via-yellow-300 via-green-400 to-blue-400" />
            <p className="text-gray-600 text-lg">Last updated: {POLICY_UPDATED_AT}</p>
          </header>

          <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 sm:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Who we are</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Know How Café operates <strong>knowhowindia.in</strong> and offers creative workshops, events and DIY kits. This policy explains the information we collect when you use our website, make a booking or purchase a kit, and how we use browser storage.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                For questions about this policy or your information, email us at{' '}
                <a className="text-teal-700 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Information we collect</h2>
              <div className="space-y-5 text-gray-700 dark:text-gray-300 leading-relaxed">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Account information</h3>
                  <p>When you create an account or sign in, we process your name, email address and the information needed to authenticate your account. If you choose Google sign-in, Google provides the account information you authorize it to share.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Booking and order information</h3>
                  <p>When you make a workshop booking or buy a DIY kit, we process the details needed to fulfil it, such as your selected activity or items, date and time where applicable, participant details, name, email address, phone number, delivery address and any notes you provide.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Payment information</h3>
                  <p>Payments are handled through Cashfree. We receive and retain transaction information needed to confirm, support and reconcile an order or booking. We do not collect or store your full card details on this website.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Technical information</h3>
                  <p>Like most websites, our hosting and service providers may process limited technical information needed to deliver and secure the service, such as device or browser information, IP address and request logs.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. How we use information</h2>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li>To create and secure accounts and provide customer support.</li>
                <li>To process workshop bookings, kit orders, payments, confirmations and refunds where applicable.</li>
                <li>To communicate about a booking, order or request you have made.</li>
                <li>To maintain the website, prevent fraud or misuse and comply with applicable legal obligations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Service providers</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We use specialist providers to operate the website and fulfil services. They process information only as needed for their services and under their own applicable terms and privacy notices.
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 ml-4">
                <li><strong>Supabase</strong> for application database services.</li>
                <li><strong>Cashfree</strong> for payment processing.</li>
                <li><strong>Brevo</strong> for transactional emails, such as verification codes and confirmations.</li>
                <li><strong>Google</strong> when you choose Google sign-in, and for the font resource used by the website.</li>
                <li><strong>Vercel</strong> and <strong>Render</strong> for website and API hosting.</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                We do not sell personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Cookies and browser storage</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                This website uses essential browser storage and authentication cookies to keep signed-in sessions working and to remember a cookie preference. Browser storage is not the same as a tracking cookie, but it can store information on your device.
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 space-y-3 text-gray-700 dark:text-gray-300">
                <p><strong className="text-gray-900 dark:text-white">Authentication cookies:</strong> set after sign-in to maintain a secure session.</p>
                <p><strong className="text-gray-900 dark:text-white">Local browser storage:</strong> may hold your display name, light-mode preference and cookie choice so the interface works consistently.</p>
                <p><strong className="text-gray-900 dark:text-white">Optional tracking:</strong> the current website code does not load a third-party advertising or analytics script. If that changes, this policy and the consent experience will be updated before the change is used.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Manage your cookie preference</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You can change the preference saved for your account and browser below. Essential session cookies are necessary for signed-in features and are cleared when you sign out or when their session expires.
              </p>
              {isLoadingConsent ? (
                <p className="text-gray-700 dark:text-gray-300">Loading your preference…</p>
              ) : isLoggedIn ? (
                <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Current preference: <strong>{cookieConsent === 'accepted' ? 'Accepted' : cookieConsent === 'declined' ? 'Declined' : 'Not yet chosen'}</strong>
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => updateConsent('accepted')} className="bg-teal-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-teal-700 transition-colors">
                      Accept optional cookies
                    </button>
                    <button onClick={() => updateConsent('declined')} className="bg-gray-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                      Decline optional cookies
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 dark:text-gray-300">Cookie choices are available after you sign in. You can also clear browser storage in your browser settings.</p>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Retention and security</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We retain information for as long as needed to provide the service, resolve support matters, maintain records and meet legal obligations. We use reasonable technical and organisational measures to protect information, but no online service can guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Your choices and requests</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                You may contact us to request access to, correction of or deletion of information we hold about you, subject to legal and operational requirements. Email{' '}
                <a className="text-teal-700 hover:underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and include the email address associated with your account or order so we can locate the correct record.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Children’s privacy</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Our services may include creative activities for younger participants. Account creation, bookings and purchases should be completed by a parent or legal guardian where required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Changes to this policy</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We may update this policy when our practices or legal requirements change. The latest version will be posted on this page with a revised “Last updated” date.
              </p>
            </section>

            <div className="pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
              <button
                onClick={() => navigate('/')}
                className="inline-block bg-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors duration-300"
              >
                Back to Home
              </button>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
