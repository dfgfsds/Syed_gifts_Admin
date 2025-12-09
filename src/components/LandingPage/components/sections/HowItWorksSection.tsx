import React from 'react';
import { ShoppingCart, Package, Users, CreditCard, Store, BarChart } from 'lucide-react';
import Container from '../ui/Container';

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  stepNumber: number;
}

const Step: React.FC<StepProps> = ({ icon, title, description, stepNumber }) => {
  return (
    <div className="relative flex flex-col items-center text-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 text-xs font-bold text-blue-600 bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center">
        {stepNumber}
      </div>
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Our Platform Works
          </h2>
          <p className="text-xl text-gray-600">
            A seamless experience for both vendors and customers
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 mb-16">
          {/* Vendor Side */}
          <div className="space-y-12">
            <div className="text-center mb-8">
              <h3 className="inline-block text-2xl font-bold text-blue-600 border-b-2 border-blue-600 pb-1">
                For Vendors
              </h3>
            </div>
            <div className="grid gap-10 relative">
              <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-0.5 h-[calc(100%-160px)] bg-blue-100"></div>
              <Step
                icon={<Store size={32} />}
                title="Create Your Account"
                description="Sign up in minutes and set up your vendor profile with your business details."
                stepNumber={1}
              />
              <Step
                icon={<Package size={32} />}
                title="List Your Products"
                description="Upload your product catalog with descriptions, images, prices, and inventory."
                stepNumber={2}
              />
              <Step
                icon={<CreditCard size={32} />}
                title="Receive Orders"
                description="Get notified instantly when customers place orders for your products."
                stepNumber={3}
              />
              <Step
                icon={<BarChart size={32} />}
                title="Grow Your Business"
                description="Access analytics and insights to optimize your sales and expand your reach."
                stepNumber={4}
              />
            </div>
          </div>

          {/* Customer Side */}
          <div className="space-y-12">
            <div className="text-center mb-8">
              <h3 className="inline-block text-2xl font-bold text-teal-600 border-b-2 border-teal-600 pb-1">
                For Customers
              </h3>
            </div>
            <div className="grid gap-10 relative">
              <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-0.5 h-[calc(100%-160px)] bg-teal-100"></div>
              <Step
                icon={<Users size={32} className="text-teal-600" />}
                title="Discover Vendors"
                description="Browse through our marketplace to find unique products from various vendors."
                stepNumber={1}
              />
              <Step
                icon={<ShoppingCart size={32} className="text-teal-600" />}
                title="Add to Cart"
                description="Select products from different vendors and add them to your shopping cart."
                stepNumber={2}
              />
              <Step
                icon={<CreditCard size={32} className="text-teal-600" />}
                title="Secure Checkout"
                description="Complete your purchase with our secure and streamlined checkout process."
                stepNumber={3}
              />
              <Step
                icon={<Package size={32} className="text-teal-600" />}
                title="Receive Products"
                description="Get your products delivered to your doorstep and enjoy your purchase."
                stepNumber={4}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 mt-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Selling?</h3>
            <p className="text-gray-600 mb-6">
              Join our platform today and start reaching thousands of potential customers.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors">
              Become a Vendor
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HowItWorksSection;