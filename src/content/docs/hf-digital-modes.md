---
title: HF digital modes
description: How to receive and decode FT8, JS8Call, PSK31, RTTY and other digital modes over HF, locally or through a remote SDR.
section: Radio
order: 10
---

*Work in progress. This guide will grow as I add band-by-band details.*

Digital modes turn audio tones into text, and a computer does the decoding. You can do it with your own radio, or receive-only through a remote [KiwiSDR](/docs/kiwisdr-remote/), such as [my public receiver](http://newbraunfels.proxy.kiwisdr.com:8073) in New Braunfels, Texas.

## What you need

1. **A receiver:** an HF radio with a USB or sound-card interface, an SDR, or a remote KiwiSDR.
2. **An audio path:** a USB codec, or a virtual audio cable when decoding audio from a remote receiver.
3. **Decoding software:** pick by mode (below).
4. **Accurate time:** FT8 and JS8Call need your clock within about a second. Use NTP or a tool like Meinberg NTP/Chrony.

## Common modes and software

| Mode | Typical use | Software |
|---|---|---|
| FT8 / FT4 | Weak-signal, automated contacts | WSJT-X |
| JS8Call | Keyboard chat and relayed messages | JS8Call |
| PSK31 and friends | Keyboard conversations | fldigi |
| RTTY | Contests and nets | fldigi |
| Olivia, MFSK, THOR | Robust nets and weak signals | fldigi |

## Typical FT8 dial frequencies (USB, kHz)

| Band | Dial |
|---|---|
| 80 m | 3573 |
| 40 m | 7074 |
| 30 m | 10136 |
| 20 m | 14074 |
| 17 m | 18100 |
| 15 m | 21074 |
| 10 m | 28074 |

## Receive-only with a remote SDR

1. Connect to a KiwiSDR with the [KiwiSDR Remote Client](/docs/kiwisdr-remote/).
2. Route its audio to a virtual cable.
3. Select that cable as the input in WSJT-X, JS8Call or fldigi.
4. Use rigctld (`127.0.0.1:4532`) so the decoder follows the receiver frequency.
5. Schedule recurring nets with the [FLDigi Net Scheduler](/docs/fldigi-net-scheduler/).

Receiving needs no license in the US; transmitting requires an amateur license and the right operating privileges for the band and mode.
