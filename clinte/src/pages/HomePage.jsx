import HomeLayout from '../assets/componet/HomeLayout';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Services from '../components/Services';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import ContactForm from '../components/ContactForm';
import LoadingState from '../components/LoadingState';
import useSiteContent from '../hooks/useSiteContent';
import useHomeAnimations from '../hooks/useHomeAnimations';

const HomePage = () => {
  const { data, loading, error } = useSiteContent();
  const pageRef = useHomeAnimations();

  if (loading) {
    return (
      <HomeLayout>
        <LoadingState screen label="Loading content..." />
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <div ref={pageRef} className="app-page-shell w-full min-h-screen text-white">
        {error && (
          <div className="mx-auto max-w-6xl px-4 pt-10 text-sm text-red-400">
            {error}. Showing default content.
          </div>
        )}
        <div className="js-reveal">
          <Hero data={data?.hero} />
        </div>
        <div className="js-reveal">
          <Stats data={data?.stats} />
        </div>
        <div className="js-reveal">
          <Services data={data?.services} />
        </div>
        <div className="js-reveal">
          <Features data={data?.features} />
        </div>
        <div className="js-reveal">
          <Testimonials data={data?.testimonials} />
        </div>
        <div className="js-reveal">
          <CTA data={data?.cta} />
        </div>
        <div className="js-reveal">
          <ContactForm content={data?.contactForm} />
        </div>
      </div>
    </HomeLayout>
  );
};

export default HomePage;

