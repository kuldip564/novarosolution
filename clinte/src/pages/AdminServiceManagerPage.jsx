import { useEffect, useState } from 'react';
import { FaArrowLeft, FaEdit, FaPlusCircle, FaSave, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import HomeLayout from '../assets/componet/HomeLayout';
import LoadingState from '../components/LoadingState';
import { fetchSiteContent, updateSiteContent } from '../config/api';
import {
  getServiceIconComponent,
  resolveServiceIconKey,
  SERVICE_ICON_PRESETS,
} from '../config/serviceIcons';
import { useAuth } from '../context/AuthContext';
import usePageReveal from '../hooks/usePageReveal';

const emptyService = {
  iconKey: 'launch-support',
  title: '',
  badge: '',
  deliveryTime: '',
  pricing: '',
  description: '',
  detailsText: '',
  featuresText: '',
};

const AdminServiceManagerPage = () => {
  const { token } = useAuth();
  const pageRef = usePageReveal();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activePanel, setActivePanel] = useState('add');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [siteContent, setSiteContent] = useState(null);
  const [servicesTitle, setServicesTitle] = useState('');
  const [servicesDescription, setServicesDescription] = useState('');
  const [serviceItems, setServiceItems] = useState([]);
  const [newService, setNewService] = useState(emptyService);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editService, setEditService] = useState(emptyService);

  useEffect(() => {
    let isMounted = true;
    async function loadContent() {
      try {
        const content = await fetchSiteContent();
        if (!isMounted) return;
        const items = Array.isArray(content?.services?.items) ? content.services.items : [];
        setSiteContent(content);
        setServicesTitle(content?.services?.title || '');
        setServicesDescription(content?.services?.description || '');
        setServiceItems(items);
        if (items[0]) {
          setEditService({
            iconKey: resolveServiceIconKey(items[0]),
            title: items[0].title || '',
            badge: items[0].badge || '',
            deliveryTime: items[0].deliveryTime || '',
            pricing: items[0].pricing || '',
            description: items[0].description || '',
            detailsText: Array.isArray(items[0].details) ? items[0].details.join(', ') : '',
            featuresText: Array.isArray(items[0].features) ? items[0].features.join(', ') : '',
          });
        }
      } catch (error) {
        if (!isMounted) return;
        setStatus({ type: 'error', message: error.message || 'Failed to load service data.' });
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadContent();
    return () => {
      isMounted = false;
    };
  }, []);

  const setEditByIndex = (index) => {
    const service = serviceItems[index];
    setSelectedIndex(index);
    if (!service) {
      setEditService(emptyService);
      return;
    }
    setEditService({
      iconKey: resolveServiceIconKey(service),
      title: service.title || '',
      badge: service.badge || '',
      deliveryTime: service.deliveryTime || '',
      pricing: service.pricing || '',
      description: service.description || '',
      detailsText: Array.isArray(service.details) ? service.details.join(', ') : '',
      featuresText: Array.isArray(service.features) ? service.features.join(', ') : '',
    });
  };

  const persistServices = async (nextItems, message, nextTitle = servicesTitle, nextDescription = servicesDescription) => {
    setSaving(true);
    setStatus({ type: '', message: '' });
    try {
      const base = siteContent || (await fetchSiteContent());
      const payload = {
        ...base,
        services: {
          ...base.services,
          title: nextTitle,
          description: nextDescription,
          items: nextItems,
        },
      };
      const updated = await updateSiteContent(payload, token);
      const updatedItems = Array.isArray(updated?.services?.items) ? updated.services.items : [];
      setSiteContent(updated);
      setServiceItems(updatedItems);
      setServicesTitle(updated?.services?.title || nextTitle);
      setServicesDescription(updated?.services?.description || nextDescription);
      setStatus({ type: 'success', message });
      return updatedItems;
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to save services.' });
      return null;
    } finally {
      setSaving(false);
    }
  };

  const parseCsvList = (text) =>
    text
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  const handleUpdateServiceSection = async () => {
    await persistServices(
      serviceItems,
      'Service section heading updated successfully.',
      servicesTitle.trim(),
      servicesDescription.trim(),
    );
  };

  const handleAddService = async (event) => {
    event.preventDefault();
    const title = newService.title.trim();
    const description = newService.description.trim();
    if (!title || !description) {
      setStatus({ type: 'error', message: 'Title and description are required.' });
      return;
    }
    const nextItems = [
      ...serviceItems,
      {
        iconKey: newService.iconKey || 'launch-support',
        title,
        badge: newService.badge.trim() || 'Premium',
        deliveryTime: newService.deliveryTime.trim() || 'Flexible timeline',
        pricing: newService.pricing.trim() || 'Contact for pricing',
        description,
        details: parseCsvList(newService.detailsText),
        features: parseCsvList(newService.featuresText),
      },
    ];
    const savedItems = await persistServices(nextItems, 'Service added successfully.');
    if (savedItems) {
      setNewService(emptyService);
      setEditByIndex(savedItems.length - 1);
    }
  };

  const handleUpdateService = async (event) => {
    event.preventDefault();
    if (!serviceItems[selectedIndex]) {
      setStatus({ type: 'error', message: 'Please select a service to update.' });
      return;
    }
    const title = editService.title.trim();
    const description = editService.description.trim();
    if (!title || !description) {
      setStatus({ type: 'error', message: 'Title and description are required.' });
      return;
    }
    const nextItems = serviceItems.map((item, index) =>
      index === selectedIndex
        ? {
            ...item,
            iconKey: editService.iconKey || 'launch-support',
            title,
            badge: editService.badge.trim() || 'Premium',
            deliveryTime: editService.deliveryTime.trim() || 'Flexible timeline',
            pricing: editService.pricing.trim() || 'Contact for pricing',
            description,
            details: parseCsvList(editService.detailsText),
            features: parseCsvList(editService.featuresText),
          }
        : item,
    );
    await persistServices(nextItems, 'Service updated successfully.');
  };

  const handleDeleteService = async (index) => {
    const nextItems = serviceItems.filter((_, itemIndex) => itemIndex !== index);
    const savedItems = await persistServices(nextItems, 'Service deleted successfully.');
    if (savedItems) {
      if (savedItems.length === 0) {
        setSelectedIndex(0);
        setEditService(emptyService);
      } else {
        setEditByIndex(Math.min(index, savedItems.length - 1));
      }
    }
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
              Back
            </Link>
            <Link
              to="/admin/content-manager"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300 hover:bg-white/10"
            >
              Open Content Manager
            </Link>
          </div>
          <h1 className="section-title mt-4 text-3xl font-bold md:text-5xl">Service Manager</h1>
          <p className="mt-3 text-sm text-slate-300">
            Add, update and delete services from a dedicated, premium admin page.
          </p>
        </section>

        {loading ? (
          <section className="js-reveal mx-auto mt-8 max-w-6xl">
            <LoadingState label="Loading services..." />
          </section>
        ) : (
          <>
            <section className="js-reveal mx-auto mt-8 max-w-6xl rounded-3xl border border-white/12 bg-slate-950/75 p-6 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Section Settings</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <input
                  value={servicesTitle}
                  onChange={(event) => setServicesTitle(event.target.value)}
                  placeholder="Services section title"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                />
                <button
                  type="button"
                  onClick={handleUpdateServiceSection}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-70"
                >
                  <FaSave />
                  Save Section Title
                </button>
              </div>
              <textarea
                value={servicesDescription}
                onChange={(event) => setServicesDescription(event.target.value)}
                rows="3"
                placeholder="Services section description"
                className="mt-4 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
              />
            </section>

            <section className="js-reveal mx-auto mt-6 max-w-6xl">
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'add', label: 'Add Service', icon: <FaPlusCircle /> },
                  { id: 'update', label: 'Update Service', icon: <FaEdit /> },
                  { id: 'delete', label: 'Delete Service', icon: <FaTrash /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActivePanel(item.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                      activePanel === item.id
                        ? 'bg-linear-to-r from-red-600 via-pink-600 to-purple-600 text-white'
                        : 'bg-white/8 text-slate-200 hover:bg-white/15'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </section>

            {activePanel === 'add' && (
              <section className="js-reveal mx-auto mt-6 max-w-6xl rounded-3xl border border-white/12 bg-slate-950/75 p-6 md:p-8 backdrop-blur-xl">
                <h2 className="text-xl font-semibold text-slate-100">Add New Service</h2>
                <form onSubmit={handleAddService} className="mt-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      value={newService.title}
                      onChange={(event) => setNewService((prev) => ({ ...prev, title: event.target.value }))}
                      placeholder="Service title"
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                    />
                    <select
                      value={newService.iconKey}
                      onChange={(event) =>
                        setNewService((prev) => ({ ...prev, iconKey: event.target.value }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                    >
                      {SERVICE_ICON_PRESETS.map((iconOption) => (
                        <option key={iconOption.key} value={iconOption.key}>
                          {iconOption.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <input
                      value={newService.badge}
                      onChange={(event) => setNewService((prev) => ({ ...prev, badge: event.target.value }))}
                      placeholder="Badge (example: Most Popular)"
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                    />
                    <input
                      value={newService.deliveryTime}
                      onChange={(event) =>
                        setNewService((prev) => ({ ...prev, deliveryTime: event.target.value }))
                      }
                      placeholder="Delivery time (example: 4-8 weeks)"
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                    />
                    <input
                      value={newService.pricing}
                      onChange={(event) => setNewService((prev) => ({ ...prev, pricing: event.target.value }))}
                      placeholder="Pricing (example: Starting at $2,000)"
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                    />
                  </div>
                  <textarea
                    rows="3"
                    value={newService.description}
                    onChange={(event) =>
                      setNewService((prev) => ({ ...prev, description: event.target.value }))
                    }
                    placeholder="Service description"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                  />
                  <input
                    value={newService.detailsText}
                    onChange={(event) =>
                      setNewService((prev) => ({ ...prev, detailsText: event.target.value }))
                    }
                    placeholder="Details comma separated (example: API setup, deployment, optimization)"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                  />
                  <input
                    value={newService.featuresText}
                    onChange={(event) =>
                      setNewService((prev) => ({ ...prev, featuresText: event.target.value }))
                    }
                    placeholder="Features comma separated (example: React, API, SEO)"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                  />
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white disabled:opacity-70"
                  >
                    <FaPlusCircle />
                    {saving ? 'Saving...' : 'Add Service'}
                  </button>
                </form>
              </section>
            )}

            {activePanel === 'update' && (
              <section className="js-reveal mx-auto mt-6 max-w-6xl rounded-3xl border border-white/12 bg-slate-950/75 p-6 md:p-8 backdrop-blur-xl">
                <h2 className="text-xl font-semibold text-slate-100">Update Service</h2>
                {serviceItems.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-400">No services available to update.</p>
                ) : (
                  <form onSubmit={handleUpdateService} className="mt-4 space-y-4">
                    <select
                      value={selectedIndex}
                      onChange={(event) => setEditByIndex(Number(event.target.value))}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                    >
                      {serviceItems.map((item, index) => (
                        <option key={`${item.title}-${index}`} value={index}>
                          {item.title || `Service ${index + 1}`}
                        </option>
                      ))}
                    </select>
                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        value={editService.title}
                        onChange={(event) =>
                          setEditService((prev) => ({ ...prev, title: event.target.value }))
                        }
                        placeholder="Service title"
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                      <select
                        value={editService.iconKey}
                        onChange={(event) =>
                          setEditService((prev) => ({ ...prev, iconKey: event.target.value }))
                        }
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      >
                        {SERVICE_ICON_PRESETS.map((iconOption) => (
                          <option key={iconOption.key} value={iconOption.key}>
                            {iconOption.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <input
                        value={editService.badge}
                        onChange={(event) =>
                          setEditService((prev) => ({ ...prev, badge: event.target.value }))
                        }
                        placeholder="Badge"
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                      <input
                        value={editService.deliveryTime}
                        onChange={(event) =>
                          setEditService((prev) => ({ ...prev, deliveryTime: event.target.value }))
                        }
                        placeholder="Delivery time"
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                      <input
                        value={editService.pricing}
                        onChange={(event) =>
                          setEditService((prev) => ({ ...prev, pricing: event.target.value }))
                        }
                        placeholder="Pricing"
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                      />
                    </div>
                    <textarea
                      rows="3"
                      value={editService.description}
                      onChange={(event) =>
                        setEditService((prev) => ({ ...prev, description: event.target.value }))
                      }
                      placeholder="Service description"
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                    />
                    <input
                      value={editService.detailsText}
                      onChange={(event) =>
                        setEditService((prev) => ({ ...prev, detailsText: event.target.value }))
                      }
                      placeholder="Details comma separated"
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                    />
                    <input
                      value={editService.featuresText}
                      onChange={(event) =>
                        setEditService((prev) => ({ ...prev, featuresText: event.target.value }))
                      }
                      placeholder="Features comma separated"
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-pink-500"
                    />
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-red-600 via-pink-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white disabled:opacity-70"
                    >
                      <FaSave />
                      {saving ? 'Saving...' : 'Update Service'}
                    </button>
                  </form>
                )}
              </section>
            )}

            {activePanel === 'delete' && (
              <section className="js-reveal mx-auto mt-6 max-w-6xl rounded-3xl border border-white/12 bg-slate-950/75 p-6 md:p-8 backdrop-blur-xl">
                <h2 className="text-xl font-semibold text-slate-100">Delete Service</h2>
                {serviceItems.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-400">No services available to delete.</p>
                ) : (
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {serviceItems.map((item, index) => {
                      const IconComponent = getServiceIconComponent(resolveServiceIconKey(item));
                      return (
                      <article key={`${item.title}-${index}`} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/6 text-pink-200">
                          <IconComponent />
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-slate-100">{item.title}</h3>
                        {item.badge && (
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-pink-300">
                            {item.badge}
                          </p>
                        )}
                        <p className="mt-2 text-sm text-slate-300 line-clamp-2">{item.description}</p>
                        <p className="mt-2 text-xs text-slate-400">
                          {item.deliveryTime || 'Flexible timeline'} - {item.pricing || 'Contact for pricing'}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleDeleteService(index)}
                          disabled={saving}
                          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-400/35 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/15 disabled:opacity-70"
                        >
                          <FaTrash />
                          Delete
                        </button>
                      </article>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {status.message && (
              <section className="js-reveal mx-auto mt-4 max-w-6xl">
                <p className={`text-sm ${status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {status.message}
                </p>
              </section>
            )}
          </>
        )}
      </main>
    </HomeLayout>
  );
};

export default AdminServiceManagerPage;

