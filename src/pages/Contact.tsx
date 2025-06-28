
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const Contact = () => {
  const [contentData, setContentData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    sessionType: '',
    message: ''
  });

  useEffect(() => {
    fetch('/data/jeff-content.json')
      .then(response => response.json())
      .then(data => setContentData(data))
      .catch(error => console.error('Error loading content:', error));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
      <section className="py-40 md:py-48 pt-32 max-w-6xl mx-auto px-8 md:px-16">
        <div className="text-center mb-20 animate-fade-in">
          <h1 className="font-playfair text-6xl md:text-7xl lg:text-8xl font-extralight tracking-wide text-white mb-12 leading-[0.9]">
            Get in Touch
          </h1>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-photo-red to-transparent mx-auto mb-12"></div>
          <p className="text-gray-400 text-xl leading-relaxed tracking-wide max-w-3xl mx-auto">
            Ready to create something extraordinary? Let's discuss your photography needs 
            and bring your vision to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-20">
          {/* Contact Form */}
          <div className="animate-scale-in">
            <h2 className="font-playfair text-4xl font-extralight tracking-wide text-white mb-12">Book a Session</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-3 tracking-wider uppercase">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-photo-gray-900 border border-gray-700 text-white focus:border-photo-red focus:outline-none transition-colors text-lg"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-3 tracking-wider uppercase">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-photo-gray-900 border border-gray-700 text-white focus:border-photo-red focus:outline-none transition-colors text-lg"
                />
              </div>

              <div>
                <label htmlFor="sessionType" className="block text-sm font-medium mb-3 tracking-wider uppercase">
                  Session Type
                </label>
                <select
                  id="sessionType"
                  name="sessionType"
                  value={formData.sessionType}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-photo-gray-900 border border-gray-700 text-white focus:border-photo-red focus:outline-none transition-colors text-lg"
                >
                  <option value="">Select a session type</option>
                  {contentData.services.map((service: string, index: number) => (
                    <option key={index} value={service.toLowerCase().replace(' ', '-')}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-3 tracking-wider uppercase">
                  Project Details *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project, vision, timeline, and any specific requirements..."
                  className="w-full px-6 py-4 bg-photo-gray-900 border border-gray-700 text-white focus:border-photo-red focus:outline-none transition-colors resize-none text-lg"
                />
              </div>

              <button type="submit" className="w-full bg-photo-red hover:bg-photo-red-hover text-white px-12 py-6 font-medium tracking-[0.2em] uppercase text-sm transition-all duration-700 hover:scale-105">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="animate-fade-in space-y-16">
            <div>
              <h2 className="font-playfair text-4xl font-extralight tracking-wide text-white mb-12">Let's Connect</h2>
              
              <div className="space-y-12">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-photo-red tracking-wider uppercase">Contact Information</h3>
                  <div className="space-y-3 text-gray-400 text-lg">
                    <p>{contentData.contact.address}</p>
                    <p>{contentData.contact.phone}</p>
                    {contentData.contact.emails.map((email: string, index: number) => (
                      <p key={index}>
                        <a href={`mailto:${email}`} className="hover:text-photo-red transition-colors">
                          {email}
                        </a>
                      </p>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 text-photo-red tracking-wider uppercase">Response Time</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    I typically respond to inquiries within 24-48 hours. For urgent projects 
                    or time-sensitive bookings, please mention this in your message.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 text-photo-red tracking-wider uppercase">Social Media</h3>
                  <div className="space-y-3">
                    <a 
                      href="https://instagram.com/jeffhonforloco" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-gray-400 hover:text-photo-red transition-colors text-lg"
                    >
                      Instagram: @jeffhonforloco
                    </a>
                    <a 
                      href="https://youtube.com/@jeffhonforloco" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-gray-400 hover:text-photo-red transition-colors text-lg"
                    >
                      YouTube: @jeffhonforloco
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional CTA */}
            <div className="bg-photo-gray-900 p-8 text-center">
              <h3 className="text-2xl font-bold mb-4 text-white">Portfolio Review</h3>
              <p className="text-gray-400 mb-6 text-lg">
                Explore my work to get inspired for your upcoming project.
              </p>
              <a href="/portfolio" className="bg-photo-red hover:bg-photo-red-hover text-white px-12 py-4 font-medium tracking-[0.2em] uppercase text-sm transition-all duration-700 hover:scale-105 inline-block">
                View Portfolio
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
