---
title: Icom Remote Client Next
tagline: An open-source RS-BA1 client for Icom radios with remote voice and data, dual audio outputs, built-in MFSK and Contestia decoding, FLAMP file reception, Hamlib and an HTTP API.
repo: https://github.com/jeffreycentex/icom-remote-client-next/tree/digitalmodes
docs: icom-remote
order: 20
platforms: [Windows, macOS, Linux]
tags: [Python, PySide6, RS-BA1, Icom, Digital modes, FLAMP]
license: GPL-3.0-or-later
screenshots:
  - src: /img/projects/icom-macos.webp
    alt: Icom Remote Next Radio tab on macOS showing connection, tuning, filters, presets and meters
    caption: Radio tab. Connection, tuning, mode, filters, presets, PTT, RF power and meters.
  - src: /img/projects/icom-audio.webp
    alt: Audio tab with two receive outputs, transmit input and modulation-source settings
    caption: Audio tab. Two receive outputs with separate gains, a transmit input, and DATA MOD / DATA OFF MOD switching.
  - src: /img/projects/icom-data.webp
    alt: Data tab showing demonstration MFSK32 decoded text with quality meter and squelch
    caption: Data tab. Built-in MFSK16/32/64 and Contestia decoding with RSID auto-detection and squelch.
  - src: /img/projects/icom-flamp.webp
    alt: FLAMP tab showing complete and partial demonstration transfers
    caption: FLAMP tab. Files and messages with retained blocks, missing-block tracking and automatic saving.
  - src: /img/projects/icom-dsp.webp
    alt: DSP tab with radio noise reduction, noise blanker and notch plus computer bandpass and notch filters
    caption: DSP tab. IC-7300MK2 radio DSP controls and computer bandpass and notch filters.
  - src: /img/projects/icom-recording-control.webp
    alt: Recording and control tab showing recording formats and local rig-control servers
    caption: Recording and control tab. WAV and M4A/MP4 recording, Hamlib rigctld and the HTTP API.
  - src: /img/projects/icom-log.webp
    alt: Log tab showing the current session log and export button
    caption: Log tab. Live session log with full export.
---

> This page covers the **`digitalmodes` branch**, which has the current features, screenshots and releases (v1.2 at the time of writing). [Browse the branch on GitHub](https://github.com/jeffreycentex/icom-remote-client-next/tree/digitalmodes).

Icom Remote Next is a Python implementation of Icom's **RS-BA1 network protocol** for Windows, macOS and Linux. It builds on the protocol work in [kappanhang](https://github.com/nonoo/kappanhang) and wraps it in a desktop interface that connects directly to an **IC-7300MK2 or IC-705** over the radio's built-in LAN or WLAN connection. There is no RS-BA1 software and no PC at the radio.

I use it every day to take part in Air Force MARS nets from remote sites, working both voice and digital traffic through the station's radio. Switching between remote voice operation and data from a computer at the radio is part of that everyday workflow.

## Features

- **Control** frequency, mode (LSB, USB, AM, FM and the DATA variants), FIL1 to FIL3, RF power and the antenna tuner, with up to 15 frequency presets.
- **Two receive outputs at once**, each with its own gain and buffering. For example, feed a decoder through a virtual cable and listen on speakers at the same time.
- **Transmit voice or data** from a microphone or a virtual cable, with armed Space-bar voice PTT and CAT-controlled data PTT.
- **Switch the transmit source while connected.** DATA MOD and DATA OFF MOD move between LAN and local USB with PTT released first, a confirmed readback and tracked restoration.
- **Decode digital modes in the app:** MFSK16, MFSK32, MFSK64 and Contestia 4-250, with RSID auto-detection, adjustable squelch, live receiver audio or saved audio files.
- **Receive FLAMP files and messages,** retaining valid blocks across repeats and decoder restarts, then saving automatically or on request.
- **Filter and tune.** IC-7300MK2 noise reduction, noise blanker and notch, plus a computer bandpass and manual notch. Low Power Tune and Powered Tune send a 1 kHz tone to start antenna tuning.
- **Record** received audio as WAV or AAC in M4A/MP4.
- **Integrate** through a Hamlib rigctld server (WSJT-X, JTDX, JS8Call, fldigi and MS-DMT), an HTTP API and a console client.

The built-in digital features are receive-only. Programs such as fldigi, WSJT-X or MS-DMT can provide transmit audio and use the client's rig control.

## Built with safety in mind

- Keying is refused unless the DATA state, audio source and input all match. Voice PTT must be armed, starts off at every launch and disarms when the window loses focus, the tab changes, the connection drops or the timeout expires.
- Repeated key-down requests never extend the timeout, and a CAT client's PTT is released if that client disconnects.
- Audio routes that would feed receive audio back into the transmit input are rejected.
- Modulation settings are written to a restore file first, and recovered at the next connection if the app is killed.
- CAT is loopback-only, and the HTTP API keeps Host and token protections.

> The RS-BA1 credential encoding is reversible, so use a trusted network or an encrypted VPN or tunnel when you reach a station remotely.

## Supported radios

| Radio | Default CI-V | Status |
|---|---|---|
| IC-7300MK2 | B6h | Primary radio, used daily. Radio DSP and tone-tune controls available. |
| IC-705 | A4h | Owner-confirmed operation. Automatic modulation-source switching uses WLAN. |
| IC-9700 | A2h | Profile and protocol tested with the simulated radio. No antenna-tuner command. |
| IC-7610 | 98h | Profile tested with the simulated radio. Set modulation sources manually on the radio. |

Connection with other RS-BA1 radios is not guaranteed by the *Auto* profile.

## What changed recently

- **v1.2:** Data and FLAMP tabs with a bundled native decoder, two simultaneous receive outputs, connected DATA MOD and DATA OFF MOD switching, TUNE as a toggle with Low Power and Powered Tune, and a Custom receive filter.
- **v1.1:** DSP tab, Low Power Tune, 15 presets and a Log tab with export.
- **v1.0:** an original radio icon and single-file Windows and Linux builds.

## How it fits together

IC-7300MK2 or IC-705, over UDP (ports 50001 to 50003), to Icom Remote, which feeds [virtual audio cables](/docs/virtual-audio/), rigctld and the built-in decoders for fldigi, WSJT-X, MS-DMT or [FLDigi Net Scheduler](/projects/fldigi-net-scheduler/).

## Credits and licensing

GPL-3.0-or-later. The RS-BA1 implementation is based on kappanhang (MIT). The digital reception engine uses fldigi-derived native modem sources, with their GPL and LGPL notices retained in the repository.
