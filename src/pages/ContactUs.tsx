import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { Instagram, Phone, Mail, MapPin } from 'lucide-react';
import { setCanonicalTag } from '../utils/seo';

const ContactUs = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setCanonicalTag('/contact-us');
  }, []);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate form submission (you can integrate with your backend API here)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    }, 1000);

    // TODO: Integrate with your backend API
    // try {
    //   await api.contactUs(formData);
    //   setSubmitStatus('success');
    // } catch (error) {
    //   setSubmitStatus('error');
    // }
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#FAF9F6' }}>
      <Navigation />
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-black mb-4">
              Contact Us
            </h1>
            <div className="mx-auto mb-4 w-40 h-1 rounded-full bg-black"></div>
            <p className="text-black text-lg max-w-2xl mx-auto">
              Have a question, feedback, or need assistance? We're here to help! Reach out to us through any of the channels below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 space-y-6">
              <h2 className="text-2xl font-bold text-black mb-6">Get in Touch</h2>
              
              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="bg-gray-200 rounded-full p-3">
                  <Mail className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-1">Email</h3>
                  <a 
                    href="mailto:knowhowcafe2025@gmail.com" 
                    className="text-black hover:underline"
                  >
                    knowhowcafe2025@gmail.com
                  </a>
                  <p className="text-sm text-black mt-1">
                    We typically respond within 24-48 hours
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="bg-gray-200 rounded-full p-3">
                  <Phone className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-1">Phone</h3>
                  <a 
                    href="tel:9591032562" 
                    className="text-black hover:underline"
                  >
                    95910 32562
                  </a>
                  <p className="text-sm text-black mt-1">
                    Available during business hours
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-4">
                <div className="bg-gray-200 rounded-full p-3">
                  <MapPin className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-1">Location</h3>
                  <p className="text-black">
                    Know How Café
                  </p>
                  <p className="text-sm text-black mt-1">
                    Visit us for workshops and events
                  </p>
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-black mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a 
                    href="https://instagram.com/know.howindia" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-full p-3 hover:scale-110 transition-transform"
                  >
                    <Instagram className="w-6 h-6 text-white" />
                  </a>
                  <a 
                    href="https://wa.me/message/LQ4KN3PDDPJKO1" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-green-500 rounded-full p-3 hover:scale-110 transition-transform"
                  >
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-black mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                    Name <span className="text-black">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                    Email <span className="text-black">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-black mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="+91 12345 67890"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-black mb-2">
                    Subject <span className="text-black">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="booking">Booking Question</option>
                    <option value="refund">Refund/Cancellation</option>
                    <option value="product">Product Inquiry</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
                    Message <span className="text-black">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                    <p className="text-black">
                      Thank you! Your message has been sent successfully. We'll get back to you soon.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <p className="text-black">
                      Something went wrong. Please try again or contact us directly via email or phone.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          {/* Business Hours */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-black mb-6 text-center">Business Hours</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <h3 className="font-semibold text-black mb-2">Monday - Friday</h3>
                <p className="text-black">10:00 AM - 7:00 PM</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-black mb-2">Saturday - Sunday</h3>
                <p className="text-black">9:00 AM - 8:00 PM</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100);
              }}
              className="inline-block bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors duration-300"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

