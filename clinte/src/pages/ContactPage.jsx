import HomeLayout from '../assets/componet/HomeLayout';
import ContactForm from '../components/ContactForm';
import LoadingState from '../components/LoadingState';
import useSiteContent from '../hooks/useSiteContent';
import usePageReveal from '../hooks/usePageReveal';

const ContactPage = () => {
  const { data, loading, error } = useSiteContent();
  const pageContent = data?.contactPage;
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
          <div className="mx-auto max-w-4xl mb-4 text-sm text-red-400">
            {error}. Showing default content.
          </div>
        )}
        <section className="js-reveal page-hero-shell mx-auto max-w-4xl mb-8 md:mb-12">
          <p className="page-hero-eyebrow text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            {pageContent?.eyebrow || 'Contact'}
          </p>
          <h1 className="page-hero-title mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-slate-50">
            {pageContent?.title || "Share what you're building. We'll help you ship it."}
          </h1>
          <p className="page-hero-description mt-4 text-sm md:text-base text-slate-300 max-w-3xl">
            {pageContent?.description ||
              "Whether you're exploring a new idea or scaling an existing product, we'd love to learn more. Tell us about your timelines, team, and what success looks like."}
          </p>
        </section>

        <div className="js-reveal">
          <ContactForm content={data?.contactForm} settings={data?.systemSettings} />
        </div>
      </main>
    </HomeLayout>
  );
};

export default ContactPage;

