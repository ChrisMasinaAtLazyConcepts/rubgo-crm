import { Mail } from 'lucide-react';
import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <section className="py-16 bg-[#B84037]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto">
              <Mail className="text-white" size={32} />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Stay Connected
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Subscribe to our newsletter for exclusive offers, new arrivals, and style inspiration
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30"
            />
            <button
              type="submit"
              className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Subscribe
            </button>
          </form>

          <p className="text-white/70 text-sm mt-6">
            By subscribing, you agree to receive marketing emails from Venture Couture
          </p>
        </div>
      </div>
    </section>
  );
}
