---
title: "A new site, a new orbit"
description: "Why I rebuilt this site, and what to expect: security notes, healthcare informatics, and radio and SDR projects."
pubDate: 2026-11-22
category: Projects
tags: [Site, Astro]
---

This site is a fresh start. It's a fast, static, dark-mode home for the things I write about and build, now with documentation for my radio tools living next to the blog.

## What to expect

- **Security.** Practical lessons from running endpoint and identity security in a healthcare practice.
- **Healthcare informatics.** EHR data pipelines, HL7 and FHIR, and the occasional war story.
- **Radio and SDR.** Write-ups for my [projects](/projects/) and guides in the [docs](/docs/): HF digital modes, Air Force MARS, CERT and EMCOMM.

## How it's built

The site uses [Astro](https://astro.build) for static output with almost no JavaScript, [Pagefind](https://pagefind.app) for search that runs entirely in your browser, and GitHub Pages for hosting. The starfield behind the page is generated at build time as tiny SVG tiles, so it costs no extra image requests.

Thanks for stopping by. 73 de N5SNT.
