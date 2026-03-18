import HomeLayout from '../assets/componet/HomeLayout';
import Services from '../components/Services';
import CTA from '../components/CTA';
import LoadingState from '../components/LoadingState';
import useSiteContent from '../hooks/useSiteContent';
import usePageReveal from '../hooks/usePageReveal';

const ServicesPage = () => {
  const { data, loading, error } = useSiteContent();
  const pageContent = data?.servicesPage;
  const pageRef = usePageReveal();

  if (loading) {
    return (
      <HomeLayout>
        <LoadingState screen label="Loading content..." />
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <main ref={pageRef} className="app-page-shell w-full min-h-screen text-white px-4 py-16 md:py-20">
        {error && (
          <div className="mx-auto max-w-5xl mb-4 text-sm text-red-400">
            {error}. Showing default content.
          </div>
        )}
        <section className="js-reveal page-hero-shell mx-auto max-w-5xl mb-8 md:mb-12">
          <p className="page-hero-eyebrow text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            {pageContent?.eyebrow || 'Services'}
          </p>
          <h1 className="page-hero-title mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-slate-50">
            {pageContent?.title || 'Everything you need to ship world-class products.'}
          </h1>
          <p className="page-hero-description mt-4 text-sm md:text-base text-slate-300 max-w-3xl">
            {pageContent?.description ||
              'From first prototype to global launch, NovaRo Solution provides a complete product pipeline tailored to how modern SaaS teams work.'}
          </p>
        </section>

        <div className="js-reveal">
          <Services data={data?.services} settings={data?.systemSettings} />
        </div>

        <div className="js-reveal">
          <CTA data={data?.cta} />
        </div>
      </main>
    </HomeLayout>
  );
};

export default ServicesPage;

