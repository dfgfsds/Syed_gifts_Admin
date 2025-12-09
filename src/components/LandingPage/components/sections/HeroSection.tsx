import React from 'react';
import Container from '../ui/Container';
import Button from '../ui/Button';

const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 pt-16 md:pt-[72px]">
      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center py-12 md:py-24">
          {/* Hero Content */}
          <div className="flex-1 text-center lg:text-left mb-10 lg:mb-0 lg:pr-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Grow Your Business with Our <span className="text-blue-600">eCommerce Platform</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
              Join thousands of successful vendors who have expanded their reach and boosted their sales with our cutting-edge marketplace solution.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg">
                Start Selling Today
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-4 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-gradient-to-r ${
                    i % 4 === 1 ? 'from-blue-400 to-blue-500' : 
                    i % 4 === 2 ? 'from-teal-400 to-teal-500' : 
                    i % 4 === 3 ? 'from-indigo-400 to-indigo-500' : 
                    'from-purple-400 to-purple-500'
                  }`}></div>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">2,500+</span> vendors already joined
              </p>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="flex-1 lg:pl-8">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.pexels.com/photos/6214476/pexels-photo-6214476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                alt="Vendor dashboard showcase" 
                className="w-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-gray-200">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600">$120M+</div>
            <p className="mt-2 text-sm md:text-base text-gray-600">Revenue Generated</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600">15K+</div>
            <p className="mt-2 text-sm md:text-base text-gray-600">Products Sold</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600">2.5K+</div>
            <p className="mt-2 text-sm md:text-base text-gray-600">Active Vendors</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600">98%</div>
            <p className="mt-2 text-sm md:text-base text-gray-600">Vendor Satisfaction</p>
          </div>
        </div>
      </Container>
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 md:mr-0 md:mt-0 w-64 h-64 md:w-96 md:h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 md:ml-24 md:mb-24 w-64 h-64 md:w-96 md:h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
    </div>
  );
};

export default HeroSection;