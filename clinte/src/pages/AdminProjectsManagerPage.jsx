import { useEffect, useState } from 'react';
import { FaArrowLeft, FaSave, FaTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import HomeLayout from '../assets/componet/HomeLayout';
import LoadingState from '../components/LoadingState';
import { fetchSiteContent, updateSiteContent } from '../config/api';
import { useAuth } from '../context/AuthContext';
import usePageReveal from '../hooks/usePageReveal';

const emptyProject = {
  name: '',
  category: '',
  client: '',
  year: '',
  status: '',
  image: '',
  summary: '',
  challenge: '',
  solution: '',
  resultsText: '',
  techText: '',
  timeline: '',
  projectLink: '',
};

const parseList = (value, delimiter) =>
  String(value || '')
    .split(delimiter)
    .map((item) => item.trim())
    .filter(Boolean);

const toDraft = (project) => ({
  name: project?.name || '',
  category: project?.category || '',
  client: project?.client || '',
  year: project?.year || '',
  status: project?.status || '',
  image: project?.image || '',
  summary: project?.summary || '',
  challenge: project?.challenge || '',
  solution: project?.solution || '',
  resultsText: Array.isArray(project?.results) ? project.results.join('\n') : '',
  techText: Array.isArray(project?.tech) ? project.tech.join(', ') : '',
  timeline: project?.timeline || '',
  projectLink: project?.projectLink || '',
});

const toProject = (draft) => ({
  name: draft.name.trim(),
  category: draft.category.trim(),
  client: draft.client.trim(),
  year: draft.year.trim(),
  status: draft.status.trim(),
  image: draft.image.trim(),
  summary: draft.summary.trim(),
  challenge: draft.challenge.trim(),
  solution: draft.solution.trim(),
  results: parseList(draft.resultsText, '\n'),
  tech: parseList(draft.techText, ','),
  timeline: draft.timeline.trim(),
  projectLink: draft.projectLink.trim(),
});

const AdminProjectsManagerPage = () => {
  const { token } = useAuth();
  const pageRef = usePageReveal();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [siteContent, setSiteContent] = useState(null);
  const [projectsPage, setProjectsPage] = useState({
    eyebrow: '',
    title: '',
    description: '',
    items: [],
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [draft, setDraft] = useState(emptyProject);
  const [newProject, setNewProject] = useState(emptyProject);

  useEffect(() => {
    let isMounted = true;
    async function loadContent() {
      try {
        const content = await fetchSiteContent();
        if (!isMounted) return;
        const page = content?.projectsPage || {};
        const items = Array.isArray(page.items) ? page.items : [];
        setSiteContent(content);
        setProjectsPage({
          eyebrow: page.eyebrow || '',
          title: page.title || '',
          description: page.description || '',
          items,
        });
        setDraft(toDraft(items[0] || {}));
      } catch (error) {
        if (!isMounted) return;
        setStatus({ type: 'error', message: error.message || 'Failed to load projects content.' });
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadContent();
    return () => {
      isMounted = false;
    };
  }, []);

  const syncDraftByIndex = (index) => {
    const selected = projectsPage.items[index] || {};
    setDraft(toDraft(selected));
  };

  const persistProjects = async (nextProjectsPage, successMessage) => {
    if (!siteContent) return;
    setSaving(true);
    setStatus({ type: '', message: '' });
    try {
      const updated = await updateSiteContent(
        {
          ...siteContent,
          projectsPage: nextProjectsPage,
        },
        token,
      );
      setSiteContent(updated);
      setProjectsPage(nextProjectsPage);
      setStatus({ type: 'success', message: successMessage });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to save projects.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveHeader = async (event) => {
    event.preventDefault();
    await persistProjects(
      {
        ...projectsPage,
        eyebrow: projectsPage.eyebrow.trim(),
        title: projectsPage.title.trim(),
        description: projectsPage.description.trim(),
      },
      'Projects page header updated.',
    );
  };

  const handleUpdateProject = async (event) => {
    event.preventDefault();
    if (!projectsPage.items[selectedIndex]) {
      setStatus({ type: 'error', message: 'No project selected to update.' });
      return;
    }
    const payload = toProject(draft);
    if (!payload.name || !payload.summary) {
      setStatus({ type: 'error', message: 'Project name and summary are required.' });
      return;
    }
    const nextItems = [...projectsPage.items];
    nextItems[selectedIndex] = payload;
    await persistProjects(
      {
        ...projectsPage,
        items: nextItems,
      },
      'Project updated successfully.',
    );
  };

  const handleAddProject = async (event) => {
    event.preventDefault();
    const payload = toProject(newProject);
    if (!payload.name || !payload.summary) {
      setStatus({ type: 'error', message: 'New project must include name and summary.' });
      return;
    }
    const nextItems = [...projectsPage.items, payload];
    await persistProjects(
      {
        ...projectsPage,
        items: nextItems,
      },
      'New project added successfully.',
    );
    const nextIndex = nextItems.length - 1;
    setSelectedIndex(nextIndex);
    setDraft(toDraft(nextItems[nextIndex]));
    setNewProject(emptyProject);
  };

  const handleDeleteProject = async () => {
    if (!projectsPage.items.length) {
      setStatus({ type: 'error', message: 'No projects available to delete.' });
      return;
    }
    const nextItems = projectsPage.items.filter((_, index) => index !== selectedIndex);
    await persistProjects(
      {
        ...projectsPage,
        items: nextItems,
      },
      'Project deleted successfully.',
    );
    const nextIndex = Math.max(0, selectedIndex - 1);
    setSelectedIndex(nextIndex);
    setDraft(toDraft(nextItems[nextIndex] || {}));
  };

  return (
    <HomeLayout>
      <main ref={pageRef} className="app-page-shell w-full min-h-screen px-4 py-16 text-white md:py-20">
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
              to="/admin/content-manager"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300 hover:bg-white/10"
            >
              Open Content Manager
            </Link>
          </div>
          <h1 className="section-title mt-4 text-3xl font-bold md:text-5xl">Projects Manager</h1>
          <p className="mt-3 text-sm text-slate-300">
            Add, edit, delete, and link project cards with a cleaner workflow than raw JSON editing.
          </p>
        </section>

        {loading ? (
          <section className="js-reveal mx-auto mt-8 max-w-6xl">
            <LoadingState label="Loading projects manager..." />
          </section>
        ) : (
          <section className="js-reveal mx-auto mt-8 grid max-w-6xl gap-6 lg:grid-cols-[1.2fr,1fr]">
            <article className="premium-card rounded-3xl p-5 md:p-6">
              <h2 className="text-lg font-semibold text-slate-100">Projects Page Header</h2>
              <form className="mt-4 space-y-4" onSubmit={handleSaveHeader}>
                <input
                  value={projectsPage.eyebrow}
                  onChange={(event) =>
                    setProjectsPage((prev) => ({ ...prev, eyebrow: event.target.value }))
                  }
                  placeholder="Eyebrow"
                  className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                />
                <input
                  value={projectsPage.title}
                  onChange={(event) => setProjectsPage((prev) => ({ ...prev, title: event.target.value }))}
                  placeholder="Page title"
                  className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                />
                <textarea
                  rows={3}
                  value={projectsPage.description}
                  onChange={(event) =>
                    setProjectsPage((prev) => ({ ...prev, description: event.target.value }))
                  }
                  placeholder="Page description"
                  className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-65"
                >
                  <FaSave />
                  Save Header
                </button>
              </form>
            </article>

            <article className="premium-card rounded-3xl p-5 md:p-6">
              <h2 className="text-lg font-semibold text-slate-100">Add New Project</h2>
              <form className="mt-4 space-y-3" onSubmit={handleAddProject}>
                <input
                  value={newProject.name}
                  onChange={(event) => setNewProject((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Project name"
                  className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                />
                <input
                  value={newProject.category}
                  onChange={(event) => setNewProject((prev) => ({ ...prev, category: event.target.value }))}
                  placeholder="Category"
                  className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                />
                <div className="grid gap-3 md:grid-cols-3">
                  <input
                    value={newProject.client}
                    onChange={(event) => setNewProject((prev) => ({ ...prev, client: event.target.value }))}
                    placeholder="Client name"
                    className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                  />
                  <input
                    value={newProject.year}
                    onChange={(event) => setNewProject((prev) => ({ ...prev, year: event.target.value }))}
                    placeholder="Year"
                    className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                  />
                  <input
                    value={newProject.status}
                    onChange={(event) => setNewProject((prev) => ({ ...prev, status: event.target.value }))}
                    placeholder="Status (Live / Ongoing)"
                    className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                  />
                </div>
                <input
                  value={newProject.image}
                  onChange={(event) => setNewProject((prev) => ({ ...prev, image: event.target.value }))}
                  placeholder="Cover image URL (https://...)"
                  className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                />
                <textarea
                  rows={2}
                  value={newProject.summary}
                  onChange={(event) => setNewProject((prev) => ({ ...prev, summary: event.target.value }))}
                  placeholder="Summary"
                  className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                />
                <textarea
                  rows={2}
                  value={newProject.challenge}
                  onChange={(event) => setNewProject((prev) => ({ ...prev, challenge: event.target.value }))}
                  placeholder="Challenge"
                  className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                />
                <textarea
                  rows={2}
                  value={newProject.solution}
                  onChange={(event) => setNewProject((prev) => ({ ...prev, solution: event.target.value }))}
                  placeholder="Solution"
                  className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                />
                <input
                  value={newProject.projectLink}
                  onChange={(event) =>
                    setNewProject((prev) => ({ ...prev, projectLink: event.target.value }))
                  }
                  placeholder="Project link (https://...)"
                  className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                />
                <textarea
                  rows={2}
                  value={newProject.resultsText}
                  onChange={(event) =>
                    setNewProject((prev) => ({ ...prev, resultsText: event.target.value }))
                  }
                  placeholder="Results (one per line)"
                  className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                />
                <input
                  value={newProject.techText}
                  onChange={(event) => setNewProject((prev) => ({ ...prev, techText: event.target.value }))}
                  placeholder="Tech stack (comma separated)"
                  className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                />
                <input
                  value={newProject.timeline}
                  onChange={(event) => setNewProject((prev) => ({ ...prev, timeline: event.target.value }))}
                  placeholder="Timeline"
                  className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-65"
                >
                  <FaSave />
                  Add Project
                </button>
              </form>
            </article>

            <article className="premium-card rounded-3xl p-5 md:col-span-2 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-100">Edit Existing Project</h2>
                <div className="text-xs text-slate-400">Total: {projectsPage.items.length}</div>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-[220px,1fr]">
                <select
                  value={selectedIndex}
                  onChange={(event) => {
                    const index = Number(event.target.value);
                    setSelectedIndex(index);
                    syncDraftByIndex(index);
                  }}
                  className="h-fit rounded-xl border border-white/12 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-pink-500"
                >
                  {projectsPage.items.map((item, index) => (
                    <option key={`${item.name || 'project'}-${index}`} value={index}>
                      {item.name || `Project ${index + 1}`}
                    </option>
                  ))}
                </select>

                <form onSubmit={handleUpdateProject} className="space-y-3">
                  <input
                    value={draft.name}
                    onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="Project name"
                    className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                  />
                  <input
                    value={draft.category}
                    onChange={(event) => setDraft((prev) => ({ ...prev, category: event.target.value }))}
                    placeholder="Category"
                    className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                  />
                  <div className="grid gap-3 md:grid-cols-3">
                    <input
                      value={draft.client}
                      onChange={(event) => setDraft((prev) => ({ ...prev, client: event.target.value }))}
                      placeholder="Client name"
                      className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                    />
                    <input
                      value={draft.year}
                      onChange={(event) => setDraft((prev) => ({ ...prev, year: event.target.value }))}
                      placeholder="Year"
                      className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                    />
                    <input
                      value={draft.status}
                      onChange={(event) => setDraft((prev) => ({ ...prev, status: event.target.value }))}
                      placeholder="Status (Live / Ongoing)"
                      className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                    />
                  </div>
                  <input
                    value={draft.image}
                    onChange={(event) => setDraft((prev) => ({ ...prev, image: event.target.value }))}
                    placeholder="Cover image URL (https://...)"
                    className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                  />
                  <textarea
                    rows={2}
                    value={draft.summary}
                    onChange={(event) => setDraft((prev) => ({ ...prev, summary: event.target.value }))}
                    placeholder="Summary"
                    className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                  />
                  <textarea
                    rows={2}
                    value={draft.challenge}
                    onChange={(event) => setDraft((prev) => ({ ...prev, challenge: event.target.value }))}
                    placeholder="Challenge"
                    className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                  />
                  <textarea
                    rows={2}
                    value={draft.solution}
                    onChange={(event) => setDraft((prev) => ({ ...prev, solution: event.target.value }))}
                    placeholder="Solution"
                    className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                  />
                  <input
                    value={draft.projectLink}
                    onChange={(event) => setDraft((prev) => ({ ...prev, projectLink: event.target.value }))}
                    placeholder="Project link (https://...)"
                    className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                  />
                  <textarea
                    rows={3}
                    value={draft.resultsText}
                    onChange={(event) => setDraft((prev) => ({ ...prev, resultsText: event.target.value }))}
                    placeholder="Results (one per line)"
                    className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                  />
                  <input
                    value={draft.techText}
                    onChange={(event) => setDraft((prev) => ({ ...prev, techText: event.target.value }))}
                    placeholder="Tech stack (comma separated)"
                    className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                  />
                  <input
                    value={draft.timeline}
                    onChange={(event) => setDraft((prev) => ({ ...prev, timeline: event.target.value }))}
                    placeholder="Timeline"
                    className="w-full rounded-xl border border-white/12 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                  />
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-65"
                    >
                      <FaSave />
                      Update Project
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteProject}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-400/55 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-100 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-65"
                    >
                      <FaTrashAlt />
                      Delete Project
                    </button>
                  </div>
                </form>
              </div>
            </article>
          </section>
        )}

        {status.message && (
          <section className="mx-auto mt-4 max-w-6xl">
            <p className={`text-sm ${status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
              {status.message}
            </p>
          </section>
        )}
      </main>
    </HomeLayout>
  );
};

export default AdminProjectsManagerPage;
