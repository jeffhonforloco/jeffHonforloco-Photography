
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const About = () => {
  const [contentData, setContentData] = useState<any>(null);

  useEffect(() => {
    fetch('/data/jeff-content.json')
      .then(response => response.json())
      .then(data => setContentData(data))
      .catch(error => console.error('Error loading content:', error));
  }, []);

  if (!contentData) {
    return (
      <Layout>
        <div className="py-20 section-padding">
          <div className="text-center">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-40 md:py-48 pt-32 max-w-8xl mx-auto px-8 md:px-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in">
            <h1 className="font-playfair text-6xl md:text-7xl lg:text-8xl font-extralight tracking-wide text-white mb-12 leading-[0.9]">
              About Jeff
            </h1>
            <div className="w-32 h-px bg-gradient-to-r from-photo-red to-transparent mb-16"></div>
            <div className="space-y-6 text-gray-300 text-xl leading-relaxed">
              <p>{contentData.personal.bio}</p>
              <p>
                Based in {contentData.personal.location}, I specialize in {contentData.personal.specialization.toLowerCase()}.
                Every photograph is an opportunity to tell a story, to freeze a moment in time 
                that speaks to the viewer on an emotional level.
              </p>
              <p>
                My approach to photography is collaborative and intuitive. I work closely with 
                clients, models, and creative teams to ensure that every shoot produces authentic, 
                striking imagery that serves its intended purpose while maintaining artistic integrity.
              </p>
            </div>
          </div>
          <div className="animate-scale-in">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Jeff Honforloco"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute -bottom-8 -right-8 w-32 h-32 border border-photo-red/30"></div>
              <div className="absolute -top-8 -left-8 w-24 h-24 border border-photo-red/50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-40 md:py-48 bg-photo-gray-900">
        <div className="max-w-6xl mx-auto px-8 md:px-16 text-center">
          <h2 className="font-playfair text-5xl md:text-6xl font-extralight tracking-wide text-white mb-12 leading-[0.9]">
            Artistic Philosophy
          </h2>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-photo-red to-transparent mx-auto mb-16"></div>
          <blockquote className="font-playfair text-2xl md:text-3xl text-gray-300 leading-relaxed italic mb-16 tracking-wide">
            "{contentData.personal.philosophy}"
          </blockquote>
          
          <div className="grid md:grid-cols-3 gap-12 mt-20">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6 text-photo-red">Authenticity</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Creating genuine connections and capturing real emotions that translate 
                into powerful imagery.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6 text-photo-red">Innovation</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Constantly exploring new techniques, styles, and creative approaches 
                to visual storytelling.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6 text-photo-red">Excellence</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Maintaining the highest standards in every aspect of the creative process, 
                from concept to final delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-40 md:py-48">
        <div className="max-w-6xl mx-auto px-8 md:px-16">
          <h2 className="font-playfair text-5xl md:text-6xl font-extralight tracking-wide text-white mb-12 leading-[0.9] text-center">
            Services
          </h2>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-photo-red to-transparent mx-auto mb-20"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contentData.services.map((service: string, index: number) => (
              <div key={index} className="bg-photo-gray-900 p-8 text-center hover:bg-photo-gray-800 transition-colors duration-300">
                <h3 className="text-xl font-bold mb-4 text-photo-red capitalize">{service}</h3>
                <p className="text-gray-400">
                  Professional {service.toLowerCase()} with artistic vision and technical excellence.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-40 md:py-48 bg-photo-gray-900">
        <div className="text-center max-w-4xl mx-auto px-8 md:px-16">
          <h2 className="font-playfair text-5xl md:text-6xl font-extralight tracking-wide text-white mb-12 leading-[0.9]">
            Let's Create Something Amazing Together
          </h2>
          <p className="text-gray-400 text-xl mb-12 leading-relaxed tracking-wide">
            Whether you're looking for professional portraits, fashion photography, 
            or creative editorial work, I'm here to bring your vision to life with 
            technical expertise and artistic passion.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href="/contact" className="bg-photo-red hover:bg-photo-red-hover text-white px-16 py-6 font-medium tracking-[0.2em] uppercase text-sm transition-all duration-700 hover:scale-105">
              Book a Session
            </a>
            <a href="/portfolio" className="border-2 border-photo-red text-photo-red hover:bg-photo-red hover:text-white px-16 py-6 font-medium tracking-[0.2em] uppercase text-sm transition-all duration-700 hover:scale-105">
              View Portfolio
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
