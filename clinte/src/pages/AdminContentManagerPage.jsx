import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import HomeLayout from '../assets/componet/HomeLayout';
import LoadingState from '../components/LoadingState';
import { fetchSiteContent, updateSiteContent } from '../config/api';
import { useAuth } from '../context/AuthContext';
import usePageReveal from '../hooks/usePageReveal';

const AdminContentManagerPage = () => {
  const { token } = useAuth();
  const pageRef = usePageReveal();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeEditor, setActiveEditor] = useState('all');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [siteContent, setSiteContent] = useState(null);
  const [savedSnapshot, setSavedSnapshot] = useState('');
  const [ownerProfiles, setOwnerProfiles] = useState([]);
  const [savedOwnerProfilesSnapshot, setSavedOwnerProfilesSnapshot] = useState('[]');
  const [selectedOwnerIndex, setSelectedOwnerIndex] = useState(0);
  const [lastSavedAt, setLastSavedAt] = useState('');
  const [form, setForm] = useState({
    heroBadge: '',
    heroTitleMain: '',
    heroTitleGradient: '',
    heroDescription: '',
    heroPrimaryCta: '',
    heroSecondaryCta: '',
    heroHighlightsJson: '[]',
    servicesTitle: '',
    servicesDescription: '',
    statsTitle: '',
    featuresTitle: '',
    featuresDescription: '',
    testimonialsTitle: '',
    testimonialsDescription: '',
    ctaTitle: '',
    ctaDescription: '',
    ctaPrimaryCta: '',
    ctaSecondaryCta: '',
    contactFormTitle: '',
    contactFormDescription: '',
    contactFormSubmitText: '',
    contactFormSuccessMessage: '',
    aboutEyebrow: '',
    aboutTitle: '',
    aboutParagraphsJson: '[]',
    aboutWorkTitle: '',
    aboutWorkDescription: '',
    aboutWorkPointsJson: '[]',
    servicesPageEyebrow: '',
    servicesPageTitle: '',
    servicesPageDescription: '',
    projectsPageEyebrow: '',
    projectsPageTitle: '',
    projectsPageDescription: '',
    projectsJson: '[]',
    contactPageEyebrow: '',
    contactPageTitle: '',
    contactPageDescription: '',
    teamEyebrow: '',
    teamTitle: '',
    teamDescription: '',
    ownerName: '',
    ownerRole: '',
    ownerBio: '',
    ownerEmail: '',
    ownerExperience: '',
    ownerAvatar: '',
    statsJson: '[]',
    featuresJson: '[]',
    testimonialsJson: '[]',
  });

  const jsonFieldKeys = [
    'heroHighlightsJson',
    'aboutParagraphsJson',
    'aboutWorkPointsJson',
    'statsJson',
    'featuresJson',
    'testimonialsJson',
    'projectsJson',
  ];

  const sectionFieldMap = {
    team: [
      'teamEyebrow',
      'teamTitle',
      'teamDescription',
      'ownerName',
      'ownerRole',
      'ownerBio',
      'ownerEmail',
      'ownerExperience',
      'ownerAvatar',
    ],
    hero: [
      'heroBadge',
      'heroTitleMain',
      'heroTitleGradient',
      'heroDescription',
      'heroPrimaryCta',
      'heroSecondaryCta',
      'heroHighlightsJson',
    ],
    sections: [
      'servicesTitle',
      'servicesDescription',
      'statsTitle',
      'featuresTitle',
      'featuresDescription',
      'testimonialsTitle',
      'testimonialsDescription',
      'ctaTitle',
      'ctaDescription',
      'ctaPrimaryCta',
      'ctaSecondaryCta',
    ],
    about: [
      'aboutEyebrow',
      'aboutTitle',
      'aboutParagraphsJson',
      'aboutWorkTitle',
      'aboutWorkDescription',
      'aboutWorkPointsJson',
    ],
    pages: [
      'servicesPageEyebrow',
      'servicesPageTitle',
      'servicesPageDescription',
      'projectsPageEyebrow',
      'projectsPageTitle',
      'projectsPageDescription',
      'projectsJson',
      'contactPageEyebrow',
      'contactPageTitle',
      'contactPageDescription',
    ],
    contact: [
      'contactFormTitle',
      'contactFormDescription',
      'contactFormSubmitText',
      'contactFormSuccessMessage',
    ],
    json: ['statsJson', 'featuresJson', 'testimonialsJson', 'projectsJson'],
  };

  const normalizeOwner = useCallback((owner) => ({
    name: owner?.name || '',
    role: owner?.role || '',
    bio: owner?.bio || '',
    email: owner?.email || '',
    experience: owner?.experience || '',
    avatar: owner?.avatar || '',
  }), []);

  const setOwnerFormFields = useCallback((owner) => {
    const normalized = normalizeOwner(owner);
    setForm((prev) => ({
      ...prev,
      ownerName: normalized.name,
      ownerRole: normalized.role,
      ownerBio: normalized.bio,
      ownerEmail: normalized.email,
      ownerExperience: normalized.experience,
      ownerAvatar: normalized.avatar,
    }));
  }, [normalizeOwner]);

  const toFormValues = useCallback((content) => {
    const ownerList =
      Array.isArray(content?.teamSection?.ownerList) && content.teamSection.ownerList.length
        ? content.teamSection.ownerList
        : [content?.teamSection?.owner || {}];
    const primaryOwner = ownerList[0] || {};
    return {
    heroBadge: content?.hero?.badge || '',
    heroTitleMain: content?.hero?.titleMain || '',
    heroTitleGradient: content?.hero?.titleGradient || '',
    heroDescription: content?.hero?.description || '',
    heroPrimaryCta: content?.hero?.primaryCta || '',
    heroSecondaryCta: content?.hero?.secondaryCta || '',
    heroHighlightsJson: JSON.stringify(content?.hero?.highlights || [], null, 2),
    servicesTitle: content?.services?.title || '',
    servicesDescription: content?.services?.description || '',
    statsTitle: content?.stats?.title || '',
    featuresTitle: content?.features?.title || '',
    featuresDescription: content?.features?.description || '',
    testimonialsTitle: content?.testimonials?.title || '',
    testimonialsDescription: content?.testimonials?.description || '',
    ctaTitle: content?.cta?.title || '',
    ctaDescription: content?.cta?.description || '',
    ctaPrimaryCta: content?.cta?.primaryCta || '',
    ctaSecondaryCta: content?.cta?.secondaryCta || '',
    contactFormTitle: content?.contactForm?.title || '',
    contactFormDescription: content?.contactForm?.description || '',
    contactFormSubmitText: content?.contactForm?.submitText || '',
    contactFormSuccessMessage: content?.contactForm?.successMessage || '',
    aboutEyebrow: content?.aboutPage?.eyebrow || '',
    aboutTitle: content?.aboutPage?.title || '',
    aboutParagraphsJson: JSON.stringify(content?.aboutPage?.paragraphs || [], null, 2),
    aboutWorkTitle: content?.aboutPage?.workTitle || '',
    aboutWorkDescription: content?.aboutPage?.workDescription || '',
    aboutWorkPointsJson: JSON.stringify(content?.aboutPage?.workPoints || [], null, 2),
    servicesPageEyebrow: content?.servicesPage?.eyebrow || '',
    servicesPageTitle: content?.servicesPage?.title || '',
    servicesPageDescription: content?.servicesPage?.description || '',
    projectsPageEyebrow: content?.projectsPage?.eyebrow || '',
    projectsPageTitle: content?.projectsPage?.title || '',
    projectsPageDescription: content?.projectsPage?.description || '',
    projectsJson: JSON.stringify(content?.projectsPage?.items || [], null, 2),
    contactPageEyebrow: content?.contactPage?.eyebrow || '',
    contactPageTitle: content?.contactPage?.title || '',
    contactPageDescription: content?.contactPage?.description || '',
    teamEyebrow: content?.teamSection?.eyebrow || '',
    teamTitle: content?.teamSection?.title || '',
    teamDescription: content?.teamSection?.description || '',
    ownerName: primaryOwner?.name || '',
    ownerRole: primaryOwner?.role || '',
    ownerBio: primaryOwner?.bio || '',
    ownerEmail: primaryOwner?.email || '',
    ownerExperience: primaryOwner?.experience || '',
    ownerAvatar: primaryOwner?.avatar || '',
    statsJson: JSON.stringify(content?.stats?.items || [], null, 2),
    featuresJson: JSON.stringify(content?.features?.items || [], null, 2),
    testimonialsJson: JSON.stringify(content?.testimonials?.items || [], null, 2),
  };
  }, []);

  const loadContentData = useCallback(async () => {
    const content = await fetchSiteContent();
    setSiteContent(content);
    const incomingOwners =
      Array.isArray(content?.teamSection?.ownerList) && content.teamSection.ownerList.length
        ? content.teamSection.ownerList
        : [content?.teamSection?.owner || {}];
    const normalizedOwners = incomingOwners.map(normalizeOwner);
    setOwnerProfiles(normalizedOwners);
    setSavedOwnerProfilesSnapshot(JSON.stringify(normalizedOwners));
    setSelectedOwnerIndex(0);
    const loadedForm = toFormValues(content);
    setForm(loadedForm);
    setSavedSnapshot(JSON.stringify(loadedForm));
    setLastSavedAt(new Date().toLocaleTimeString());
  }, [normalizeOwner, toFormValues]);

  useEffect(() => {
    let isMounted = true;

    async function initLoad() {
      try {
        if (!isMounted) return;
        await loadContentData();
      } catch (error) {
        if (!isMounted) return;
        setStatus({ type: 'error', message: error.message || 'Failed to load content data.' });
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initLoad();
    return () => {
      isMounted = false;
    };
  }, [loadContentData]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const editorOptions = [
    { id: 'all', label: 'All Data' },
    { id: 'team', label: 'Team Owner' },
    { id: 'hero', label: 'Hero' },
    { id: 'sections', label: 'Sections + CTA' },
    { id: 'about', label: 'About' },
    { id: 'pages', label: 'Pages' },
    { id: 'contact', label: 'Contact Form' },
    { id: 'json', label: 'JSON Data' },
  ];

  const activeEditorLabel =
    editorOptions.find((item) => item.id === activeEditor)?.label || 'All Data';
  const isDirty = useMemo(
    () =>
      JSON.stringify(form) !== savedSnapshot ||
      JSON.stringify(ownerProfiles) !== savedOwnerProfilesSnapshot,
    [form, ownerProfiles, savedOwnerProfilesSnapshot, savedSnapshot],
  );

  const handleOwnerSelect = (event) => {
    const nextIndex = Number(event.target.value);
    setSelectedOwnerIndex(nextIndex);
    const selected = ownerProfiles[nextIndex];
    if (selected) {
      setOwnerFormFields(selected);
    }
  };

  const handleAddOwner = () => {
    const blankOwner = normalizeOwner({});
    setOwnerProfiles((prev) => {
      const next = [...prev, blankOwner];
      setSelectedOwnerIndex(next.length - 1);
      return next;
    });
    setOwnerFormFields(blankOwner);
    setStatus({ type: 'success', message: 'New owner profile added. Fill details and save.' });
  };

  const handleUpdateOwner = () => {
    const ownerFromForm = normalizeOwner({
      name: form.ownerName,
      role: form.ownerRole,
      bio: form.ownerBio,
      email: form.ownerEmail,
      experience: form.ownerExperience,
      avatar: form.ownerAvatar,
    });
    setOwnerProfiles((prev) => {
      if (!prev.length) return [ownerFromForm];
      const next = [...prev];
      const index = selectedOwnerIndex >= 0 ? selectedOwnerIndex : 0;
      next[index] = ownerFromForm;
      return next;
    });
    setStatus({ type: 'success', message: 'Owner profile updated in editor. Click Save to apply.' });
  };

  const handleDeleteOwner = () => {
    setOwnerProfiles((prev) => {
      if (prev.length <= 1) {
        const blankOwner = normalizeOwner({});
        setSelectedOwnerIndex(0);
        setOwnerFormFields(blankOwner);
        return [blankOwner];
      }
      const next = prev.filter((_, index) => index !== selectedOwnerIndex);
      const nextIndex = Math.max(0, selectedOwnerIndex - 1);
      setSelectedOwnerIndex(nextIndex);
      setOwnerFormFields(next[nextIndex]);
      return next;
    });
    setStatus({ type: 'success', message: 'Owner profile deleted in editor. Click Save to apply.' });
  };

  const handleFormatJsonFields = () => {
    try {
      setForm((prev) => {
        const next = { ...prev };
        for (const key of jsonFieldKeys) {
          const parsed = JSON.parse(prev[key] || '[]');
          next[key] = JSON.stringify(parsed, null, 2);
        }
        return next;
      });
      setStatus({ type: 'success', message: 'JSON fields formatted successfully.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Invalid JSON found. Please fix JSON fields first.',
      });
    }
  };

  const handleReloadLatest = async () => {
    setStatus({ type: '', message: '' });
    setLoading(true);
    try {
      await loadContentData();
      setStatus({ type: 'success', message: 'Latest content loaded from server.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to reload latest content.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetCurrentSection = () => {
    if (!savedSnapshot) return;
    const snapshot = JSON.parse(savedSnapshot);
    const ownerSnapshot = JSON.parse(savedOwnerProfilesSnapshot || '[]');
    if (activeEditor === 'all') {
      setForm(snapshot);
      if (ownerSnapshot.length) {
        setOwnerProfiles(ownerSnapshot);
        setSelectedOwnerIndex(0);
      }
      setStatus({ type: 'success', message: 'All unsaved changes were reset.' });
      return;
    }
    const keys = sectionFieldMap[activeEditor] || [];
    setForm((prev) => {
      const next = { ...prev };
      keys.forEach((key) => {
        next[key] = snapshot[key];
      });
      return next;
    });
    if (activeEditor === 'team' && ownerSnapshot.length) {
      setOwnerProfiles(ownerSnapshot);
      setSelectedOwnerIndex(0);
      setOwnerFormFields(ownerSnapshot[0]);
    }
    setStatus({
      type: 'success',
      message: `${activeEditorLabel} section reset to last saved values.`,
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    setSaving(true);
    try {
      const baseContent = siteContent || (await fetchSiteContent());
      const statsItems = JSON.parse(form.statsJson);
      const featuresItems = JSON.parse(form.featuresJson);
      const testimonialsItems = JSON.parse(form.testimonialsJson);
      const heroHighlights = JSON.parse(form.heroHighlightsJson);
      const aboutParagraphs = JSON.parse(form.aboutParagraphsJson);
      const aboutWorkPoints = JSON.parse(form.aboutWorkPointsJson);
      const projectsItems = JSON.parse(form.projectsJson);

      const ownerFromForm = normalizeOwner({
        name: form.ownerName,
        role: form.ownerRole,
        bio: form.ownerBio,
        email: form.ownerEmail,
        experience: form.ownerExperience,
        avatar: form.ownerAvatar,
      });
      const resolvedOwners = (ownerProfiles.length ? ownerProfiles : [ownerFromForm]).map(
        normalizeOwner,
      );
      const safeSelectedIndex =
        selectedOwnerIndex >= 0 && selectedOwnerIndex < resolvedOwners.length
          ? selectedOwnerIndex
          : 0;
      resolvedOwners[safeSelectedIndex] = ownerFromForm;

      const payload = {
        ...baseContent,
        hero: {
          ...baseContent.hero,
          badge: form.heroBadge,
          titleMain: form.heroTitleMain,
          titleGradient: form.heroTitleGradient,
          description: form.heroDescription,
          primaryCta: form.heroPrimaryCta,
          secondaryCta: form.heroSecondaryCta,
          highlights: heroHighlights,
        },
        services: {
          ...baseContent.services,
          title: form.servicesTitle,
          description: form.servicesDescription,
        },
        stats: {
          ...baseContent.stats,
          title: form.statsTitle,
          items: statsItems,
        },
        features: {
          ...baseContent.features,
          title: form.featuresTitle,
          description: form.featuresDescription,
          items: featuresItems,
        },
        testimonials: {
          ...baseContent.testimonials,
          title: form.testimonialsTitle,
          description: form.testimonialsDescription,
          items: testimonialsItems,
        },
        cta: {
          ...baseContent.cta,
          title: form.ctaTitle,
          description: form.ctaDescription,
          primaryCta: form.ctaPrimaryCta,
          secondaryCta: form.ctaSecondaryCta,
        },
        contactForm: {
          ...baseContent.contactForm,
          title: form.contactFormTitle,
          description: form.contactFormDescription,
          submitText: form.contactFormSubmitText,
          successMessage: form.contactFormSuccessMessage,
        },
        aboutPage: {
          ...baseContent.aboutPage,
          eyebrow: form.aboutEyebrow,
          title: form.aboutTitle,
          paragraphs: aboutParagraphs,
          workTitle: form.aboutWorkTitle,
          workDescription: form.aboutWorkDescription,
          workPoints: aboutWorkPoints,
        },
        servicesPage: {
          ...baseContent.servicesPage,
          eyebrow: form.servicesPageEyebrow,
          title: form.servicesPageTitle,
          description: form.servicesPageDescription,
        },
        projectsPage: {
          ...baseContent.projectsPage,
          eyebrow: form.projectsPageEyebrow,
          title: form.projectsPageTitle,
          description: form.projectsPageDescription,
          items: projectsItems,
        },
        contactPage: {
          ...baseContent.contactPage,
          eyebrow: form.contactPageEyebrow,
          title: form.contactPageTitle,
          description: form.contactPageDescription,
        },
        teamSection: {
          ...baseContent.teamSection,
          eyebrow: form.teamEyebrow,
          title: form.teamTitle,
          description: form.teamDescription,
          owner: resolvedOwners[0] || ownerFromForm,
          ownerList: resolvedOwners,
        },
      };

      const updatedContent = await updateSiteContent(payload, token);
      setSiteContent(updatedContent);
      setOwnerProfiles(resolvedOwners);
      setSavedSnapshot(JSON.stringify(form));
      setSavedOwnerProfilesSnapshot(JSON.stringify(resolvedOwners));
      setLastSavedAt(new Date().toLocaleTimeString());
      setStatus({ type: 'success', message: 'Website content updated successfully.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to update content.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <HomeLayout>
      <main
        ref={pageRef}
        className="admin-content-manager-page w-full min-h-screen px-4 py-16 text-white md:py-20"
      >
        <section className="js-reveal mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300 hover:bg-white/10"
            >
              <FaArrowLeft />
              Back to Dashboard
            </Link>
            <Link
              to="/admin/service-manager"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300 hover:bg-white/10"
            >
              Open Service Manager
            </Link>
            <Link
              to="/admin/projects-manager"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300 hover:bg-white/10"
            >
              Open Projects Manager
            </Link>
          </div>
          <h1 className="section-title mt-4 text-3xl font-bold md:text-5xl">Content Manager</h1>
          <p className="mt-3 text-sm text-slate-300">
            Manage almost all website details from admin: hero, about, projects, pages, sections,
            CTA, contact text, and owner details.
            Service add/update/delete is now in dedicated Service Manager page.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`rounded-full border px-3 py-1 font-semibold ${
                isDirty
                  ? 'border-amber-400/60 bg-amber-500/15 text-amber-200'
                  : 'border-emerald-400/50 bg-emerald-500/15 text-emerald-200'
              }`}
            >
              {isDirty ? 'Unsaved changes' : 'All changes saved'}
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-slate-300">
              Active Section: {activeEditorLabel}
            </span>
            {lastSavedAt && (
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-slate-300">
                Last Sync: {lastSavedAt}
              </span>
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {editorOptions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveEditor(item.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  activeEditor === item.id
                    ? 'border-pink-400/60 bg-pink-500/20 text-pink-200'
                    : 'border-white/15 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Tip: open a single section tab to update faster, then click Save from sticky bar.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleReloadLatest}
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10"
            >
              Reload Latest
            </button>
            <button
              type="button"
              onClick={handleResetCurrentSection}
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10"
            >
              Reset {activeEditorLabel}
            </button>
            <button
              type="button"
              onClick={handleFormatJsonFields}
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10"
            >
              Format JSON
            </button>
          </div>
        </section>

        {loading ? (
          <section className="js-reveal mx-auto mt-8 max-w-6xl">
            <LoadingState label="Loading content..." />
          </section>
        ) : (
          <section className="js-reveal mx-auto mt-8 max-w-6xl">
            <form
              onSubmit={handleSave}
              className="admin-content-manager-form space-y-6 rounded-3xl border border-white/12 bg-slate-950/75 p-6 pb-28 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] md:p-8 md:pb-32"
            >
              {(activeEditor === 'all' || activeEditor === 'team') && (
                <>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">
                    Team Owner Details
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/12 bg-white/5 p-3">
                    <label className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                      Owner Profile
                    </label>
                    <select
                      value={selectedOwnerIndex}
                      onChange={handleOwnerSelect}
                      className="min-w-[170px] rounded-xl border border-white/12 bg-slate-900 px-3 py-2 text-xs text-slate-100 outline-none focus:border-pink-500"
                    >
                      {ownerProfiles.map((ownerItem, index) => (
                        <option key={`${ownerItem.name || 'owner'}-${index}`} value={index}>
                          {ownerItem.name ? `${index + 1}. ${ownerItem.name}` : `Owner ${index + 1}`}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAddOwner}
                      className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
                    >
                      Add Owner
                    </button>
                    <button
                      type="button"
                      onClick={handleUpdateOwner}
                      className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
                    >
                      Update Owner
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteOwner}
                      className="rounded-xl border border-red-400/50 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/20"
                    >
                      Delete Owner
                    </button>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Team Eyebrow</label>
                      <input
                        name="teamEyebrow"
                        value={form.teamEyebrow}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Team Section Title</label>
                      <input
                        name="teamTitle"
                        value={form.teamTitle}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Owner Name</label>
                      <input
                        name="ownerName"
                        value={form.ownerName}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Owner Role</label>
                      <input
                        name="ownerRole"
                        value={form.ownerRole}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Owner Email</label>
                      <input
                        name="ownerEmail"
                        value={form.ownerEmail}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Owner Avatar (emoji)</label>
                      <input
                        name="ownerAvatar"
                        value={form.ownerAvatar}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm text-slate-300">Team Section Description</label>
                      <textarea
                        name="teamDescription"
                        rows="3"
                        value={form.teamDescription}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm text-slate-300">Owner Experience</label>
                      <input
                        name="ownerExperience"
                        value={form.ownerExperience}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm text-slate-300">Owner Bio</label>
                      <textarea
                        name="ownerBio"
                        rows="3"
                        value={form.ownerBio}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {(activeEditor === 'all' || activeEditor === 'hero') && (
                <>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">
                    Hero Content
                  </h3>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Hero Badge</label>
                      <input
                        name="heroBadge"
                        value={form.heroBadge}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Hero Title (Main)</label>
                      <input
                        name="heroTitleMain"
                        value={form.heroTitleMain}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Hero Title (Gradient)</label>
                      <input
                        name="heroTitleGradient"
                        value={form.heroTitleGradient}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Hero Primary CTA</label>
                      <input
                        name="heroPrimaryCta"
                        value={form.heroPrimaryCta}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Hero Secondary CTA</label>
                      <input
                        name="heroSecondaryCta"
                        value={form.heroSecondaryCta}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Hero Description</label>
                    <textarea
                      name="heroDescription"
                      rows="3"
                      value={form.heroDescription}
                      onChange={onChange}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Hero Highlights (JSON Array)</label>
                    <textarea
                      name="heroHighlightsJson"
                      rows="6"
                      value={form.heroHighlightsJson}
                      onChange={onChange}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 font-mono text-xs text-slate-100 outline-none focus:border-pink-500 md:text-sm"
                    />
                  </div>
                </>
              )}

              {(activeEditor === 'all' || activeEditor === 'sections') && (
                <>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">
                    Sections + CTA
                  </h3>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Services Title</label>
                      <input
                        name="servicesTitle"
                        value={form.servicesTitle}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">CTA Title</label>
                      <input
                        name="ctaTitle"
                        value={form.ctaTitle}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Stats Title</label>
                      <input
                        name="statsTitle"
                        value={form.statsTitle}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Features Title</label>
                      <input
                        name="featuresTitle"
                        value={form.featuresTitle}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm text-slate-300">Features Description</label>
                      <textarea
                        name="featuresDescription"
                        rows="3"
                        value={form.featuresDescription}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Testimonials Title</label>
                      <input
                        name="testimonialsTitle"
                        value={form.testimonialsTitle}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm text-slate-300">Testimonials Description</label>
                      <textarea
                        name="testimonialsDescription"
                        rows="3"
                        value={form.testimonialsDescription}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Services Description</label>
                    <textarea
                      name="servicesDescription"
                      rows="3"
                      value={form.servicesDescription}
                      onChange={onChange}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">CTA Description</label>
                    <textarea
                      name="ctaDescription"
                      rows="3"
                      value={form.ctaDescription}
                      onChange={onChange}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">CTA Primary Button</label>
                      <input
                        name="ctaPrimaryCta"
                        value={form.ctaPrimaryCta}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">CTA Secondary Button</label>
                      <input
                        name="ctaSecondaryCta"
                        value={form.ctaSecondaryCta}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {(activeEditor === 'all' || activeEditor === 'pages') && (
                <>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">
                    Page Headers
                  </h3>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Services Page Eyebrow</label>
                      <input
                        name="servicesPageEyebrow"
                        value={form.servicesPageEyebrow}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm text-slate-300">Services Page Title</label>
                      <input
                        name="servicesPageTitle"
                        value={form.servicesPageTitle}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm text-slate-300">Services Page Description</label>
                      <textarea
                        name="servicesPageDescription"
                        rows="3"
                        value={form.servicesPageDescription}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Projects Page Eyebrow</label>
                      <input
                        name="projectsPageEyebrow"
                        value={form.projectsPageEyebrow}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm text-slate-300">Projects Page Title</label>
                      <input
                        name="projectsPageTitle"
                        value={form.projectsPageTitle}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm text-slate-300">Projects Page Description</label>
                      <textarea
                        name="projectsPageDescription"
                        rows="3"
                        value={form.projectsPageDescription}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Contact Page Eyebrow</label>
                      <input
                        name="contactPageEyebrow"
                        value={form.contactPageEyebrow}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm text-slate-300">Contact Page Title</label>
                      <input
                        name="contactPageTitle"
                        value={form.contactPageTitle}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm text-slate-300">Contact Page Description</label>
                      <textarea
                        name="contactPageDescription"
                        rows="3"
                        value={form.contactPageDescription}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {(activeEditor === 'all' || activeEditor === 'about') && (
                <>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">
                    About Content
                  </h3>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">About Eyebrow</label>
                      <input
                        name="aboutEyebrow"
                        value={form.aboutEyebrow}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm text-slate-300">About Title</label>
                      <input
                        name="aboutTitle"
                        value={form.aboutTitle}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm text-slate-300">About Paragraphs (JSON Array)</label>
                      <textarea
                        name="aboutParagraphsJson"
                        rows="6"
                        value={form.aboutParagraphsJson}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 font-mono text-xs text-slate-100 outline-none focus:border-pink-500 md:text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">About Work Title</label>
                      <input
                        name="aboutWorkTitle"
                        value={form.aboutWorkTitle}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm text-slate-300">About Work Description</label>
                      <textarea
                        name="aboutWorkDescription"
                        rows="3"
                        value={form.aboutWorkDescription}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm text-slate-300">About Work Points (JSON Array)</label>
                      <textarea
                        name="aboutWorkPointsJson"
                        rows="6"
                        value={form.aboutWorkPointsJson}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 font-mono text-xs text-slate-100 outline-none focus:border-pink-500 md:text-sm"
                      />
                    </div>
                  </div>
                </>
              )}

              {(activeEditor === 'all' || activeEditor === 'json') && (
                <>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">
                    JSON Data Editors
                  </h3>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Stats Items (JSON Array)</label>
                    <textarea
                      name="statsJson"
                      rows="8"
                      value={form.statsJson}
                      onChange={onChange}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 font-mono text-xs text-slate-100 outline-none focus:border-pink-500 md:text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Features Items (JSON Array)</label>
                    <textarea
                      name="featuresJson"
                      rows="8"
                      value={form.featuresJson}
                      onChange={onChange}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 font-mono text-xs text-slate-100 outline-none focus:border-pink-500 md:text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Testimonials Items (JSON Array)</label>
                    <textarea
                      name="testimonialsJson"
                      rows="10"
                      value={form.testimonialsJson}
                      onChange={onChange}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 font-mono text-xs text-slate-100 outline-none focus:border-pink-500 md:text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">
                      Projects Items (JSON Array: name, category, client, year, status, image, summary, challenge, solution, results, tech, timeline, projectLink)
                    </label>
                    <textarea
                      name="projectsJson"
                      rows="10"
                      value={form.projectsJson}
                      onChange={onChange}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 font-mono text-xs text-slate-100 outline-none focus:border-pink-500 md:text-sm"
                    />
                  </div>
                </>
              )}

              {(activeEditor === 'all' || activeEditor === 'contact') && (
                <>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">
                    Contact Form Content
                  </h3>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm text-slate-300">Contact Form Title</label>
                      <input
                        name="contactFormTitle"
                        value={form.contactFormTitle}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm text-slate-300">Contact Form Description</label>
                      <textarea
                        name="contactFormDescription"
                        rows="3"
                        value={form.contactFormDescription}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300">Contact Form Submit Text</label>
                      <input
                        name="contactFormSubmitText"
                        value={form.contactFormSubmitText}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm text-slate-300">Contact Form Success Message</label>
                      <textarea
                        name="contactFormSuccessMessage"
                        rows="3"
                        value={form.contactFormSuccessMessage}
                        onChange={onChange}
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {status.message && (
                <p className={`text-sm ${status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {status.message}
                </p>
              )}

              <div className="admin-content-savebar">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span
                    className={`inline-flex h-2 w-2 rounded-full ${
                      isDirty ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                  />
                  {isDirty
                    ? 'You have unsaved changes in content manager'
                    : 'Everything is up to date'}
                </div>
                <button
                  type="submit"
                  disabled={saving || !isDirty}
                  className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FaSave />
                  {saving ? 'Saving...' : 'Save Website Content'}
                </button>
              </div>
            </form>
          </section>
        )}
      </main>
    </HomeLayout>
  );
};

export default AdminContentManagerPage;

