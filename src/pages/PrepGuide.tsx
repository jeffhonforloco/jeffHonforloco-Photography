import Layout from '../components/Layout';
import PrepGuide from '../components/PrepGuide';
import SEO from '../components/SEO';

const PrepGuidePage = () => {
  return (
    <Layout>
      <SEO 
        title="Free Prep Guide - Jeff Honforloco Photography"
        description="Download Jeff's ultimate prep guide for editorial shoots. Learn how to look like a cover star with professional tips and techniques."
        url="/prep-guide"
      />
      <PrepGuide />
    </Layout>
  );
};

export default PrepGuidePage;