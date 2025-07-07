
import Layout from '../components/Layout';
import HeroSection from '../components/sections/HeroSection';
import FeaturedWork from '../components/sections/FeaturedWork';
import AboutPreview from '../components/sections/AboutPreview';
import Recognition from '../components/sections/Recognition';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedWork />
      <AboutPreview />
      <Recognition />
    </Layout>
  );
};

export default Index;
