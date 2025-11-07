import { Truck, Shield, RefreshCw, Headphones } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over R1000',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: 'PayFast, Ozow & PayPal',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      description: '30-day return policy',
      color: 'from-amber-500 to-amber-600'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Dedicated customer service',
      color: 'from-orange-600 to-red-600'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
