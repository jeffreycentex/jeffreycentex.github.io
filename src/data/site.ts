// Central site config. Update URLs here (not in pages).
export const site = {
  name: 'Jeff Randow',
  callsign: 'N5SNT',
  tagline: 'Healthcare informatics, security, and radio.',
  description:
    'Jeff Randow (N5SNT): healthcare IT developer, Georgia Tech instructional associate, and amateur radio, Air Force MARS and EMCOMM operator. Blog, projects, and SDR documentation.',
  email: 'jeffrey@jeffreyrandow.org',
  gpg: {
    keyId: '0xFC2EBB8D',
    fingerprint: 'FC2E BB8D 3D0C BB24 6EA6  85D3 66F3 4935 7DA2 564E',
    file: '/keys/jeffreyrandow-org-0xFC2EBB8D.asc',
  },
  // All published public keys. Fingerprints computed from the key files (verify with: gpg --show-keys <file>).
  keys: [
    { id: '0xFC2EBB8D', label: 'Email key', emails: ['jeffrey@jeffreyrandow.org'], created: '2019-02-02', fingerprint: 'FC2E BB8D 3D0C BB24 6EA6  85D3 66F3 4935 7DA2 564E', file: '/keys/jeffreyrandow-org-0xFC2EBB8D.asc' },
    { id: '0xDEA62917', label: 'Proton Mail key', emails: ['jeffreycentex@protonmail.com'], created: '2019-02-02', fingerprint: 'DEA6 2917 71CD 8D6B 8C14  9F5F C9A6 E747 A423 4DE6', file: '/keys/protonmail-0xDEA62917.asc' },
  ],
  // IDs for the networks and nodes I'm on (shown on About and /docs/on-the-air/).
  onAir: [
    { label: 'Callsign', value: 'N5SNT' },
    { label: 'APRS', value: 'N5SNT-2', href: 'https://aprs.fi/info/a/N5SNT-2' },
    { label: 'DMR RadioID', value: '3158347', href: 'https://www.radioid.net/database/view?id=3158347' },
    { label: 'AllStarLink node', value: '57317', href: 'https://stats.allstarlink.org/stats/57317' },
    { label: 'Hams Over IP extension', value: '102515', href: 'https://hamsoverip.com' },
    { label: 'Amateur Wire', value: '1846', href: 'https://amateurwire.org' },
  ],
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
    { label: 'X (Twitter)', href: 'https://x.com/jeffreycentex', icon: 'twitter' },
    { label: 'Mastodon', href: 'https://mastodon.radio/@jeffreycentex', icon: 'fediverse', rel: 'me' },
    { label: 'Email', href: 'mailto:jeffrey@jeffreyrandow.org', icon: 'mail' },
    { label: 'RSS', href: '/rss.xml', icon: 'rss' },
  ],
};
