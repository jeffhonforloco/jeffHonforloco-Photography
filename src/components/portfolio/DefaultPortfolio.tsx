import Layout from '../Layout';
import ImageGallery from '../ImageGallery';

interface DefaultPortfolioProps {
  title: string;
  description: string;
  images: Array<{ src: string; alt: string; caption: string }>;
}

const DefaultPortfolio = ({ title, description, images }: DefaultPortfolioProps) => {
  return (
    <Layout>
      {/* Portfolio Gallery Section */}
      <section className="pt-24 py-12 section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Image Gallery */}
          <ImageGallery images={images} className="animate-scale-in" />
        </div>
      </section>
    </Layout>
  );
};

export default DefaultPortfolio;