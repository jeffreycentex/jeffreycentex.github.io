---
title: KiwiSDR Remote data decoding and FLAMP
description: Use the built-in MFSK and Contestia decoder, RSID auto-detection, audio-file decoding and FLAMP file reception in KiwiSDR Remote Client.
section: Software
order: 15
repo: https://github.com/jeffreycentex/kiwisdr-remote-client/tree/digitalmodes
---

The **Data** and **FLAMP** tabs in [KiwiSDR Remote Client](/docs/kiwisdr-remote/) (the `digitalmodes` branch) decode digital text and receive files straight from receiver audio, with no fldigi installation and no virtual audio cable. To install the app, see the [install guide](/docs/kiwisdr-remote/). For screenshots, see the [project overview](/projects/kiwisdr-remote/).

The client is **receive-only**.

## Before you start

- The decoder is bundled in packaged builds. For a source install, build it once with `python build_decoder.py` (`--cc gcc --cxx g++` in an MSYS2 UCRT64 shell on Windows).
- Connect to a receiver (try [mine](http://newbraunfels.proxy.kiwisdr.com:8073)), tune on **Listen**, normally in **USB**, and choose a bandwidth that includes the whole digital signal.
- On **DSP**, turn **Auto Notch** and **Noise Reduction** **off**. Those receiver-side filters still change the audio the decoder sees.

## Decode digital text (Data tab)

Supported modes: **MFSK16**, **MFSK32**, **MFSK64** and **Contestia 4-250**. THOR is deferred.

1. On **Data**, select the mode.
2. Enter the signal's audio center in **Sweetspot**, in audio Hz. This does **not** change the radio frequency.
3. Choose **Start decoding**. Decoded text appears continuously in the Data pane.
4. Use **Stop decoding** before you change the mode or sweetspot. **Clear text** clears the display.

You can start decoding before the receiver connects, and the decoder resets its modem state when the receiver reconnects. Mode, sweetspot and squelch are remembered, while decoding starts off.

### Squelch and quality

**Squelch** starts enabled with a threshold of 20. The **Quality** meter shows the modem's receive metric from 0 to 100, and **Open/Closed** shows whether it meets the threshold. Adjust the threshold while decoding to suppress noise characters without restarting the modem.

### RSID auto-detect

Choose **Auto (RSID)** to listen for mode announcements and set the modem and audio center automatically. Auto recognizes MFSK16, MFSK32, MFSK64 (using the extended RSID sequence) and Contestia 4-250. It needs an RSID announcement in the incoming audio, so choose a mode and sweetspot manually for signals without one.

### Decode a recording

Select **Audio file**, choose a file and start decoding. Files run through the same squelch and Auto detector as receiver audio and finish automatically at the end. File decoding works without connecting a receiver, and **Stop decoding** cancels it. PCM WAV works with the minimal dependencies. PyAV adds M4A, MP4, FLAC, Ogg and MP3.

### What the decoder hears

The decoder takes the Kiwi audio **before** the local Audio Bandpass and Manual Notch filters. Receiver-side Auto Notch and Noise Reduction still affect it.

## Receive files (FLAMP tab)

The **FLAMP** tab assembles file-transfer frames received through Data, from receiver audio or a recording. Each row shows the file, received and total blocks, missing block numbers, and save status. Frames must pass their CRC checks before their contents are accepted.

1. Choose a receive folder. On macOS the default is `~/Documents/KiwiSDR/Received`.
2. **Automatically save completed files** starts enabled. Turn it off to review completed transfers and use **Save selected**.
3. Watch for missing blocks. Transfers are tracked separately by their FLAMP identifier.

Existing files are preserved, and a numbered filename is used when necessary.

- Incomplete transfers stay in memory while the app is open. Stopping and restarting decoding keeps valid blocks.
- A later transmission of the same transfer can fill gaps, and repeated blocks are ignored.
- Conflicting metadata or block contents are reported for review.
- **Clear selected transfer** resets that transfer's receive state and leaves any saved file in place.
- Plain files, BASE64, BASE128, BASE256 and FLAMP's LZMA compression are supported.

### Limits and trust

- Reception is limited to **32 transfers**, **32 MiB per file** and **64 MiB** of retained transfer data.
- File contents are saved exactly as received. A file's embedded digital signature is **not** authenticated by the receiver, so treat received files as untrusted.

## Related

- [KiwiSDR Remote install guide](/docs/kiwisdr-remote/)
- [HF digital modes](/docs/hf-digital-modes/)
- [Virtual audio cables](/docs/virtual-audio/)
