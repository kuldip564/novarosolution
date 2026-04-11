import { permanentRedirect } from 'next/navigation';

export default function CareersRedirectPage() {
  permanentRedirect('/jobs');
}
