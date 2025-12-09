import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Container from '../ui/Container';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  quote: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Founder",
    company: "Crafty Creations",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    quote: "Since joining this platform, my handmade jewelry business has grown by 300%. The seller tools are intuitive, and the support team is always there when I need them.",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "CEO",
    company: "Tech Gadgets Inc.",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    quote: "I've tried several eCommerce platforms, but this one stands out. The commission rates are fair, and the exposure my products get is unmatched. Highly recommend!",
    rating: 5
  },
  {
    id: 3,
    name: "Emily Chen",
    role: "Owner",
    company: "Organic Wellness",
    image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    quote: "The analytics dashboard helps me understand my customer base better. I've been able to tailor my organic skincare products to meet demand, resulting in a 75% increase in sales.",
    rating: 4
  },
  {
    id: 4,
    name: "David Wilson",
    role: "Director",
    company: "Vintage Finds",
    image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    quote: "The international shipping integration makes it easy to sell my vintage collectibles worldwide. The platform has helped me turn my passion into a full-time business.",
    rating: 5
  }
];

const TestimonialsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-gray-50">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Thousands of Vendors
          </h2>
          <p className="text-xl text-gray-600">
            Hear what successful sellers have to say about our platform
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Mobile version - stacked cards */}
          <div className="md:hidden space-y-6">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>

          {/* Desktop version - carousel */}
          <div className="hidden md:block">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700"></div>
                  <img 
                    src={testimonials[activeIndex].image} 
                    alt={testimonials[activeIndex].name} 
                    className="w-full h-full object-cover mix-blend-overlay opacity-75"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                    <h4 className="text-xl font-bold">{testimonials[activeIndex].name}</h4>
                    <p className="opacity-90">
                      {testimonials[activeIndex].role}, {testimonials[activeIndex].company}
                    </p>
                    <div className="flex mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < testimonials[activeIndex].rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
                  <div className="text-3xl text-gray-400 mb-4">"</div>
                  <p className="text-xl italic text-gray-700 mb-8">
                    {testimonials[activeIndex].quote}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {testimonials.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveIndex(index)}
                          className={`w-2.5 h-2.5 rounded-full ${
                            index === activeIndex ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={prevTestimonial}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        aria-label="Previous testimonial"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={nextTestimonial}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        aria-label="Next testimonial"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default TestimonialsSection;