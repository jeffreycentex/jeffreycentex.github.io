---
title: "Windows Defender ATP blocked a vendor upgrade at 2:30 AM"
description: "Workarounds, trade-offs and lessons from an after-hours Patient Management System upgrade that Defender for Endpoint blocked."
pubDate: 2024-04-20
category: Security
tags: [Security, O365, EDR]
draft: true
---

> **Draft placeholder.** This is a summary of my original 2024 post. Paste the full original text here and remove `draft: true` to publish.

A vendor upgrade of the office Patient Management System was scheduled for the early morning, and Windows Defender ATP blocked it. The two workarounds were a local drive volume exclusion and offboarding the server, which stops Defender ATP.

## What I didn't like

Offboarding felt heavy-handed compared with suspending the other EDR product (FortiEDR), which can be paused from its admin portal. Everything was re-enabled once the upgrade finished.

## A second surprise

An Attack Surface Reduction (ASR) rule blocked a recent FAT-client hotfix on one server but not on others, which is a reminder to test ASR rules in audit mode against vendor software before enforcing them.
