
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const Journal = () => {
  const [blogData, setBlogData] = useState<any>(null);

  useEffect(() => {
    fetch('/data/blog-posts.json')
      .then(response => response.json())
      .then(data => setBlogData(data))
      .catch(error => console.error('Error loading blog data:', error));
  }, []);

  if (!blogData) {
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
        <div className="text-center mb-20 animate-fade-in">
          <h1 className="font-playfair text-6xl md:text-7xl lg:text-8xl font-extralight tracking-wide text-white mb-12 leading-[0.9]">
            Journal
          </h1>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-photo-red to-transparent mx-auto mb-12"></div>
          <p className="text-gray-400 text-xl max-w-4xl mx-auto leading-relaxed tracking-wide">
            Photography insights, techniques, equipment reviews, and behind-the-scenes 
            stories from professional shoots and personal projects.
          </p>
        </div>

        {/* Categories */}
        <div className="mb-20">
          <h2 className="font-playfair text-4xl font-extralight tracking-wide text-white mb-12 text-center">Explore by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogData.categories.map((category: string, index: number) => (
              <div
                key={category}
                className="bg-photo-gray-900 p-8 hover:bg-photo-gray-800 transition-colors cursor-pointer animate-scale-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="font-semibold text-photo-red mb-3 text-lg group-hover:text-white transition-colors">{category}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {category === 'Photography Tips & Techniques' && 'Lighting, composition, editing workflows'}
                  {category === 'Client Preparation & Session Insights' && 'Props, locations, session planning'}
                  {category === 'Equipment Reviews & Recommendations' && 'Cameras, lenses, software, accessories'}
                  {category === 'Industry Trends & News' && 'Fashion trends, tech updates, events'}
                  {category === 'Personal Projects & Artistic Explorations' && 'New styles, personal stories, collaborations'}
                  {category === 'Business & Marketing Advice' && 'Portfolio building, client relations, contracts'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Posts */}
        <div>
          <h2 className="font-playfair text-4xl font-extralight tracking-wide text-white mb-16 text-center">Latest Articles</h2>
          <div className="grid lg:grid-cols-2 gap-12">
            {blogData.posts.map((post: any, index: number) => (
              <Link
                key={post.id}
                to={`/journal/${post.id}`}
                className="group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="overflow-hidden aspect-[16/10] bg-photo-gray-900 mb-8">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mb-6">
                  <span className="text-photo-red text-sm font-medium tracking-wider uppercase">{post.category}</span>
                  <div className="flex items-center gap-3 text-gray-400 text-sm mt-2">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <h3 className="font-playfair text-3xl font-extralight tracking-wide text-white mb-4 group-hover:text-photo-red transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-lg">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-40 md:py-48 bg-photo-gray-900">
        <div className="text-center max-w-3xl mx-auto px-8 md:px-16">
          <h2 className="font-playfair text-4xl font-extralight tracking-wide text-white mb-8">Stay Updated</h2>
          <p className="text-gray-400 mb-12 text-lg leading-relaxed">
            Get the latest photography tips, techniques, and industry insights 
            delivered directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-photo-black border border-gray-700 text-white focus:border-photo-red focus:outline-none text-lg"
            />
            <button className="bg-photo-red hover:bg-photo-red-hover text-white px-12 py-4 font-medium tracking-[0.2em] uppercase text-sm transition-all duration-700 hover:scale-105 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Journal;
