---
title: Windows Defender ATP Disable
date: 2024-04-20
category: Security
tags: [O365,Security]
summary: O365 Defender ATP Disable
---
So, this morning, I was awoken at 2:30 AM in the morning by a nice, friendly Veridgm support technician from India who was doing an upgrade of our office Patient Management System. The problem?  Windows Defender ATP was blocking the installation.  You would think that this would be easy to temporarily disable via one of the multiple Microsoft Admin Portals out there, but not that I could find at dark-thirty this morning.

So how did I solve it?  I applied an exclusion to the local drive volumes and I offboarded the server (which disables the Defender ATP service).  I did NOT like doing this.  When I was using FortiEDR before, we could suspend it via the admin portal.  But not via Defender - or at least with E3/BP license levels.  I turned everything back on after they were done.

Then I ran into an ASR issue updating one of the FAT clients - it was a hotfix built less than two weeks ago, so the "newness" ASR blocked me.  But it wasn't consistent.  Blocked on 1 server, but not the others.