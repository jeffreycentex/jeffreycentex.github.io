import { getCollection } from 'astro:content';

export const docSections = [
  { key: 'Software', label: 'Install guides', blurb: 'Step-by-step setup for my SDR and radio tools.' },
  { key: 'Radio', label: 'Radio', blurb: 'How-tos and reference for HF operating.' },
  { key: 'Emergency', label: 'Emergency & community', blurb: 'Air Force MARS, EMCOMM and CERT.' },
] as const;

export async function getDocs() {
  return (await getCollection('docs')).sort((a, b) => a.data.order - b.data.order);
}

export async function getProjects() {
  return (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
}
