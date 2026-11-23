---
title: Icom Remote Client Next
tagline: A cross-platform client for Icom's RS-BA1 LAN remote protocol, with CAT/rigctld, an HTTP API, DATA PTT, voice, and recording. No shack PC required.
repo: https://github.com/jeffreycentex/icom-remote-client-next
docs: icom-remote
order: 20
platforms: [Windows, macOS, Linux]
tags: [Python, PySide6, RS-BA1, Icom, CAT]
license: GPL-3.0-or-later
screenshots:
  - src: /img/projects/icom-main.webp
    alt: Icom Remote running on macOS in dark mode before connecting
    caption: The Radio tab on macOS, before connecting.
---

Icom Remote Next talks directly to the network server built into supported Icom radios. There is no RS-BA1 software and no PC at the radio. It was built for the IC-7300MK2 and follows the design of [KiwiSDR Remote](/projects/kiwisdr-remote/). This "Next" revision keeps the protocol and adds a tabbed GUI plus safer control and recording.

## Features

- **Radio tab:** connection, tuning, S-meter, preset buttons, DATA PTT, voice arming, RF power, tuner and transmit meters, and Output/SWR readout.
- **Tune** frequency, mode (LSB, USB, AM, FM and the DATA variants) and filter (FIL1 to FIL3).
- **Quick tune** buttons from a simple `name, kHz` file.
- **Transmit** data audio from a virtual cable or voice from a microphone, with strict PTT rules and a PTT timeout.
- **DATA MOD / DATA OFF MOD handling:** the app switches the radio's modulation input to LAN while connected and puts the original back afterwards, including crash recovery from an on-disk record.
- **Antenna tuner** TUNE cycle, and **power on/off** from the app.
- **rigctld** on `127.0.0.1:4532` for WSJT-X, JTDX, JS8Call and fldigi (Hamlib NET rigctl).
- **Remote control API** (HTTP/JSON) for schedulers like [FLDigi Net Scheduler](/projects/fldigi-net-scheduler/).
- **Recording** of received audio to WAV or AAC in M4A/MP4.
- **Diagnostics:** `--check` self-test, a connection probe tool, rotating logs, and optional packet dumps.

## Safety first

Transmitting remotely deserves careful rules, so the app is built around them:

- All changes go through one service boundary with a bounded command worker.
- PTT goes straight to the radio's session loop, so recording can't delay key-up, and a second caller can't take over an active key-down.
- Voice PTT must be armed, starts off at every launch, and disarms on disconnect or when the window loses focus.
- Keying stops on timeout, mode change while keyed, disconnect, input change, or when the rigctl client that keyed it disconnects.
- Tuner and mode/frequency changes are refused while transmitting.
- CAT is loopback-only by default, and the HTTP API keeps Host, token and CORS protections.

> RS-BA1 itself uses reversible credential obfuscation. Run it on a trusted network or through an encrypted tunnel.

## Supported radios

| Radio | CI-V | DATA MOD switching | TUNE | Tested |
|---|---|---|---|---|
| IC-7300MK2 | B6h | yes | yes | on the radio |
| IC-705 | A4h | yes | yes (external tuner) | fake radio only |
| IC-9700 | A2h | yes | no | fake radio only |
| IC-7610 | 98h | no (set to LAN on the radio) | yes | fake radio only |

Other RS-BA1 radios may connect with *Auto*, but only receive and basic CAT are expected.

## How it fits together

IC-7300MK2 ⇄ UDP (ports 50001 to 50003) ⇄ Icom Remote ⇄ rigctld and [virtual audio cables](/docs/virtual-audio/) ⇄ your digital-mode software.
