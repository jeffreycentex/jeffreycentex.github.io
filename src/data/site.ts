// Central site config. Update URLs here (not in pages).
export const site = {
  name: 'Jeff Randow',
  callsign: 'N5SNT',
  tagline: 'Healthcare informatics, security, and radio.',
  description:
    'Jeff Randow (N5SNT): healthcare IT developer, Georgia Tech instructional associate, and amateur radio, Air Force MARS and EMCOMM operator. Blog, projects, and SDR documentation.',
  email: 'jeffrey@jeffreyrandow.org',
  gpg: {
    keyId: '0xEA020EB8B631EE8A',
    // Taken from the issuer-fingerprint packet in the published key. Verify with: gpg --show-keys <file>
    fingerprint: '2020 5A73 B232 6DBC D410  4825 EA02 0EB8 B631 EE8A',
    file: '/keys/gpg-0xEA020EB8B631EE8A.asc',
  },
  signal: '__jeffreycentex__',
  // My public KiwiSDR receiver (shortwave, listen live in a browser).
  kiwi: 'http://newbraunfels.proxy.kiwisdr.com:8073',
  // Web resume at /resume/. Use its Print / Save as PDF button for a PDF.
  resumeUrl: '/resume/',
  nav: [
    { label: 'About', href: '/about/' },
    { label: 'Blog', href: '/blog/' },
    { label: 'Projects', href: '/projects/' },
    { label: 'Docs', href: '/docs/' },
    { label: 'Keys', href: '/keys/' },
  ],
  socials: [
    { label: 'GitHub', href: 'https://github.com/jeffreycentex', icon: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jeffreyrandow', icon: 'linkedin' },
    { label: 'Mastodon', href: 'https://mastodon.radio/@jeffreycentex', icon: 'fediverse', rel: 'me' },
    { label: 'Email', href: 'mailto:jeffrey@jeffreyrandow.org', icon: 'mail' },
    { label: 'RSS', href: '/rss.xml', icon: 'rss' },
  ],
};
