import {
  FaBullhorn,
  FaChartLine,
  FaCloud,
  FaCode,
  FaCogs,
  FaMobileAlt,
  FaPalette,
  FaRocket,
  FaSearch,
  FaServer,
  FaShieldAlt,
} from 'react-icons/fa'

export const SERVICE_ICON_PRESETS = [
  { key: 'web-development', label: 'Web Development', Icon: FaCode },
  { key: 'ui-ux-design', label: 'UI / UX Design', Icon: FaPalette },
  { key: 'app-development', label: 'App Development', Icon: FaMobileAlt },
  { key: 'seo-growth', label: 'SEO & Growth', Icon: FaChartLine },
  { key: 'cloud-devops', label: 'Cloud & DevOps', Icon: FaCloud },
  { key: 'backend-api', label: 'Backend & APIs', Icon: FaServer },
  { key: 'marketing', label: 'Marketing', Icon: FaBullhorn },
  { key: 'security', label: 'Security', Icon: FaShieldAlt },
  { key: 'search-strategy', label: 'Search Strategy', Icon: FaSearch },
  { key: 'product-engineering', label: 'Product Engineering', Icon: FaCogs },
  { key: 'launch-support', label: 'Launch Support', Icon: FaRocket },
]

const ICON_BY_KEY = SERVICE_ICON_PRESETS.reduce((acc, item) => {
  acc[item.key] = item.Icon
  return acc
}, {})

const LEGACY_ICON_FALLBACKS = {
  '🌐': 'web-development',
  '🎨': 'ui-ux-design',
  '📱': 'app-development',
  '🚀': 'seo-growth',
}

export function getServiceIconComponent(iconKey) {
  return ICON_BY_KEY[iconKey] || FaRocket
}

export function resolveServiceIconKey(service = {}) {
  const candidate = String(service.iconKey || service.icon || '').trim().toLowerCase()
  if (candidate && ICON_BY_KEY[candidate]) return candidate
  if (candidate && LEGACY_ICON_FALLBACKS[candidate]) return LEGACY_ICON_FALLBACKS[candidate]

  const title = String(service.title || '').toLowerCase()
  if (title.includes('web')) return 'web-development'
  if (title.includes('design') || title.includes('ux') || title.includes('ui')) return 'ui-ux-design'
  if (title.includes('app') || title.includes('mobile')) return 'app-development'
  if (title.includes('seo') || title.includes('growth')) return 'seo-growth'
  if (title.includes('cloud') || title.includes('devops')) return 'cloud-devops'
  if (title.includes('backend') || title.includes('api')) return 'backend-api'
  if (title.includes('security')) return 'security'
  if (title.includes('marketing')) return 'marketing'

  return 'launch-support'
}
