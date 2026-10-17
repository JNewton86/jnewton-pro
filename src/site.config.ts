// Who the site is about. Change identity details here only — every page, meta tag,
// and (later) the structured data reads from this file. If an LLC is formed, add the
// organization here rather than editing pages.
export const site = {
  name: 'Jeff Newton',
  url: 'https://jnewton.pro',
  title: 'Jeff Newton — Technical Product Manager and Applied AI Developer',
  description:
    'Technical product manager and applied AI developer in Nashville with 15+ years across mortgage lending, fintech, and cloud-native software delivery.',
  location: 'Nashville, TN',
  email: 'jeff@jnewton.pro',
  phone: { display: '(904) 803-1017', href: 'tel:+19048031017' },
  resume: '/assets/Jeff_Newton_Resume.pdf',
  social: {
    linkedin: {
      label: 'LinkedIn',
      handle: 'JeffreyRNewton',
      url: 'https://www.linkedin.com/in/JeffreyRNewton',
    },
    github: { label: 'GitHub', handle: 'JNewton86', url: 'https://github.com/JNewton86' },
  },
} as const;

export const nav = [
  { label: 'About', href: '/#about' },
  { label: 'Work', href: '/#work' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Projects', href: '/projects/' },
  { label: 'Contact', href: '/#contact' },
] as const;
