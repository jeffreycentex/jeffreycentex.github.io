---
title: Icom Remote data decoding and FLAMP
description: Use the built-in MFSK and Contestia decoder, RSID auto-detection, audio-file decoding, FLAMP file reception and the DSP filters in Icom Remote Client Next.
section: Software
order: 25
repo: https://github.com/jeffreycentex/icom-remote-client-next/tree/digitalmodes
---

The **Data**, **FLAMP** and **DSP** tabs in [Icom Remote Client Next](/docs/icom-remote/) (the `digitalmodes` branch) decode digital modes without any other program. For installing the app, see the [install guide](/docs/icom-remote/), and for screenshots see the [project overview](/projects/icom-remote/).

These features are **receive-only**. To transmit, use fldigi, WSJT-X or MS-DMT with the client's [rig control and audio cables](/docs/icom-remote/).

## Before you start

- A bundled native decoder ships in the release archives. On a source install, build it once with `python build_decoder.py` (`--cc gcc --cxx g++` in an MSYS2 UCRT64 shell on Windows).
- Run `python run_icomremote.py --check` and confirm the decoder reports it can start.
- Tune the radio, normally in **USB** or **USB-D**, and choose an IF filter wide enough for the signal.

## Decode a signal (Data tab)

The Data tab supports **MFSK16**, **MFSK32**, **MFSK64** and **Contestia 4-250**, using a bundled fldigi-derived modem engine. THOR is deferred.

1. Choose **Receiver audio** and tune the radio on the **Radio** tab.
2. Pick the modem and its **Sweetspot**, the signal's center in received audio Hz (default 1500 Hz). Changing it doesn't retune the radio.
3. Click **Start decoding**. Readable text appears with a decoder-quality meter and an Open/Closed squelch indicator.
4. Use **Stop decoding** to stop, or **Clear text** to clear the display.

The squelch starts on at a threshold of 20 and can be adjusted while decoding without restarting the modem. Received backspaces are honored, and the text history is bounded.

### RSID auto-detect

**Auto (RSID)** waits for a supported RSID announcement and selects the modem and audio center for you, including extended RSID for MFSK64. If the transmission already started without a burst, choose the mode and sweetspot by hand.

### Decode a saved file

Choose **Audio file** and a local recording to decode a saved transmission. Decoding finishes at the end of the file, and you can cancel it. PCM WAV works as-is. With PyAV installed you also get M4A, MP4, FLAC, OGG and MP3.

### What affects decoding

The radio's own IF filter, noise reduction, noise blanker and notch happen **before** audio reaches the client, so they can affect decoding. The computer playback filters and playback gain do **not** change the built-in decoder's input.

## Receive files (FLAMP tab)

Transfers decoded on the Data tab appear on the **FLAMP** tab.

1. Choose a receive folder.
2. Turn on **Automatically save completed files**, or use **Save selected** after a transfer completes.
3. Watch the table for the filename, blocks received out of total, missing block numbers, transfer ID and status.

Valid blocks survive repeated transmissions and decoder restarts, and later blocks fill gaps in the original transfer. Compatible duplicates are ignored, and conflicting metadata or block contents are reported.

- **Clear selected transfer** discards its retained blocks.
- Partial transfers stay in memory until the application closes. Completed files already saved to disk remain.
- Plain files, BASE64, BASE128, BASE256 and FLAMP LZMA are supported.
- The assembler works on the raw modem octets before display conversion and checks frame CRC, reception size and decompression limits.
- Saving never overwrites existing files. It adds numbered names instead. After fixing a folder or write error, use **Save selected** to retry.

## Filter the audio (DSP tab)

The **DSP** tab separates the radio's receive processing from computer audio filters.

**IC-7300MK2 radio controls** give independent Noise Reduction and Noise Blanker switches and levels, plus Off/Auto/Manual notch. A manual notch has a relative passband position and Wide, Mid or Narrow width. These controls show readback from the radio, and are enabled for the IC-7300MK2.

**Computer receive filters** are a SciPy bandpass and an independent manual audio notch. Set the center and full width in audio Hz, then click **Apply audio filters**.

- Selecting **Custom** on the Radio tab selects FIL1 and turns on the computer bandpass.
- Selecting FIL1 to FIL3 turns that bandpass off.
- The notch can stay on independently.
- Filters affect playback, virtual audio outputs and recordings, but are limited by the radio's IF filter.

## Tips

- If decoding is poor, use an IF filter wide enough for the signal, check the sweetspot, and try **Auto (RSID)** first.
- Run a recording in parallel (**Recording and control** tab) so you can re-decode a transmission from a file later.

## Related

- [Icom Remote install guide](/docs/icom-remote/)
- [HF digital modes](/docs/hf-digital-modes/)
- [Virtual audio cables](/docs/virtual-audio/)
