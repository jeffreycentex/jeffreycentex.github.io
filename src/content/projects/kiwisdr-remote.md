---
title: KiwiSDR Remote Client
tagline: A receive-only desktop and headless client for remote KiwiSDR receivers. Tune, listen, record, and feed fldigi, WSJT-X or JS8Call.
repo: https://github.com/jeffreycentex/kiwisdr-remote-client
docs: kiwisdr-remote
order: 10
platforms: [Windows, macOS, Linux]
tags: [Python, Qt, KiwiSDR, hamlib]
license: GPL-3.0-or-later
screenshots:
  - src: /img/projects/kiwi-main-window.webp
    alt: KiwiSDR Remote Listen tab showing receiver connection, tuning modes and Quick Tune presets
    caption: Listen. Connect to a receiver, set frequency, mode and bandwidth, and use Quick Tune presets.
  - src: /img/projects/kiwi-audio-tab.webp
    alt: Audio tab showing output device, gain and Record to file
    caption: Audio. Choose speakers or a virtual cable, set gain, and record to WAV or M4A.
  - src: /img/projects/kiwi-dsp-tab.webp
    alt: DSP tab showing Noise Blanker, Audio Bandpass, Manual Notch, Auto Notch and Noise Reduction
    caption: DSP. Noise blanker, audio bandpass, manual notch, auto notch and noise reduction.
  - src: /img/projects/kiwi-automation-tab.webp
    alt: Automation tab showing Hamlib rigctld, the API and session limits
    caption: Automation. Hamlib rigctld, the HTTP/JSON API and session limits.
---

KiwiSDR Remote Client lets you use any public (or private) [KiwiSDR](http://kiwisdr.com) as the receiver for your own decoding software. Connect to a receiver anywhere in the world, tune it like a radio, send the audio to a virtual cable, and let fldigi, WSJT-X or JS8Call do the decoding. It is **receive-only**, so there is nothing to transmit and no PTT to worry about.

> **Try it with mine.** I run a public KiwiSDR in New Braunfels, Texas. [Listen in your browser](http://newbraunfels.proxy.kiwisdr.com:8073), or connect to `newbraunfels.proxy.kiwisdr.com:8073` from the client.

It builds on [kiwisdr-remote](https://github.com/jeffreycentex/kiwisdr-remote) and a pinned copy of [jks-prv/kiwiclient](https://github.com/jks-prv/kiwiclient) for the receiver protocol, adding a compact interface and control, recording and security improvements.

## Features

- **Tune** USB, LSB, AM, AMN, AMW and FMN with adjustable bandwidth and receiver-specific frequency limits.
- **Listen** through speakers or a virtual audio cable, with drift correction and resampling.
- **Record** native-rate mono WAV, or AAC in M4A/MP4 when PyAV is installed. Existing recordings are never intentionally replaced.
- **Quick Tune** buttons (up to 15) loaded from a simple text file, for example `40m FT8, 7074`.
- **DSP:** KiwiSDR noise blanker, audio bandpass and manual notch (SciPy), plus the KiwiSDR's auto notch and noise reduction.
- **Hamlib rigctl** server on `127.0.0.1:4532`, so decoders follow the receiver frequency.
- **HTTP/JSON API** on `127.0.0.1:7373` for scripts and schedulers such as [FLDigi Net Scheduler](/projects/fldigi-net-scheduler/).
- **Headless mode** with a `ctl` command line: connect, tune and record without loading Qt.
- **Compact desktop UI:** a 680 × 600 window with Listen, Audio, DSP, Automation and Log tabs. The window position is remembered.
- **Keyboard shortcuts** for address, frequency, record and connect.

## Built to be safe

- TLS certificates are verified, and redirects can't downgrade to plaintext or forward a password to another host.
- Control services bind to loopback by default. The HTTP API requires a token for non-loopback binding, and rigctld has no authentication, so use an encrypted tunnel for remote access.
- Receiver passwords are never saved or logged.
- Connections retry automatically, and a long reconnect gap is filled with silence in WAV recordings so timing stays correct.
- Storage overload stops recording with an error instead of silently dropping audio.

## How it fits together

1. The client connects to a KiwiSDR and receives audio.
2. Audio goes to speakers or a [virtual cable](/docs/virtual-audio/).
3. Your decoder reads that cable, and tunes the receiver through rigctld.
4. Optional recordings and API control let you automate nets and monitoring.

## Platforms and validation

Windows, macOS and Linux, with Python 3.10 or newer. CI runs the test suite on all three platforms. It has been validated on macOS with real Qt and PyAV, and with live tuning and WAV recording against a public KiwiSDR. Physical audio devices and decoder applications still need testing on each system.
