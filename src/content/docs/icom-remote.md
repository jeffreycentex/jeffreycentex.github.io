---
title: Icom Remote Client install guide
description: Requirements, install, radio network settings, audio cables, first connection, rigctld and troubleshooting for Icom Remote Client Next.
section: Software
order: 20
repo: https://github.com/jeffreycentex/icom-remote-client-next
---

This guide covers installing Icom Remote Client Next and connecting it to a radio. For features, supported radios and screenshots, see the [project overview](/projects/icom-remote/).

> **Transmit safety.** This app can key your transmitter. Test receive-only first, and only transmit when you are licensed and authorized to do so on that frequency.

## Before you start

- A supported Icom radio with its network server enabled (IC-7300MK2 is tested on the real radio; IC-705, IC-9700 and IC-7610 have profiles).
- **Python 3.10 or newer** for a source install. The lock file was compiled for Python 3.12.
- For data modes: **two** [virtual audio cables](/docs/virtual-audio/), one per direction.
- **Linux only:** PortAudio (`sudo apt install libportaudio2` or `sudo dnf install portaudio`).

## Set up the radio

In the radio's network or remote settings:

1. Turn **Network Control** ON.
2. Set a **network user name and password**. The app logs in with these.
3. Keep the **UDP ports** at their defaults: control 50001, serial 50002, audio 50003.
4. Note the radio's **IP address**, or give it a fixed one in your router.

On the IC-705 the menu path is `Menu > Set > WLAN Set > Remote Settings`. The path on the IC-7300MK2 has not been verified in the app's documentation, so check your radio's manual.

Also check the radio's **LAN MOD Level**. If it is 0 %, transmit audio will be silent, and the app warns you about this on connect.

## Install from source

```sh
git clone https://github.com/jeffreycentex/icom-remote-client-next.git
cd icom-remote-client-next
python -m venv .venv
.venv/bin/python -m pip install --require-hashes -r requirements.lock
.venv/bin/python run_icomremote.py
```

On Windows, use `.venv\Scripts\python` as the interpreter.

- The lock file pins exact versions and package hashes for a reproducible install.
- This revision uses its own **IcomRemoteNext** settings identity. **Close the original Icom Remote client** before connecting to the same radio or using the same local CAT/API ports.
- On macOS, `Launch Icom Remote Next.command` starts the app from its own `.venv`.

### Optional

`pip install samplerate` is not needed. The radio sends 48 kHz audio and most sound devices run at 48 kHz, so the default linear interpolator only trims clock drift.

## Standalone builds

Tagged versions and CI builds are published from the repository (see its **Releases** and **Actions** pages). These builds are **unsigned**, so only use ones from the repository's own pages.

- **macOS (Apple silicon):** unzip and move **Icom Remote.app** to Applications. On macOS 15 and later, open it once, dismiss the warning, then use **System Settings → Privacy & Security → Open Anyway**. Allow **Local Network** and **Microphone** access when asked, or the app can't reach the radio or read transmit audio.
- **Windows:** unzip and run `Icom Remote.exe`. If SmartScreen warns, choose *More info* then *Run anyway*, and allow the firewall prompt on private networks.
- **Linux:** `tar xzf IcomRemote-*-linux-*.tar.gz` and run `./"Icom Remote"`. It needs `libportaudio2`.

To build yourself, run `python build.py` in the virtual environment. It builds, runs the built app's self-check, and writes an archive to `dist/`. Each OS must be built on that OS.

## First connection

1. Start the app and enter the radio's **address, user name and password**, then choose **Connect**.
2. Leave **Radio** on *Auto* (recommended) so the app uses the CI-V address the radio reports. Choosing a model profile forces that address.
3. The header shows **CONNECTED**, **CONNECTING**, **DISCONNECTED** or a red failure state that stays visible across tabs.
4. Tune with a frequency in kHz, the mode (LSB, USB, AM, FM, or DATA for USB-D and similar) and the filter (FIL1 to FIL3).
5. Choose a **Receive audio output** (a virtual cable or speakers) and tick **Play to**.

The password is saved only if you select **Remember password**, and then it is stored unencrypted in local settings.

### Quick tune presets

Use **Import presets…** on the Radio tab to load a file with one `name, kHz` per line, for example `40m FT8, 7074`. Up to ten buttons appear on the main page. The selected file is remembered and watched for changes.

## Audio and decoders

For data modes you need **two** cables so received audio never loops back to the transmitter (the app refuses a shared cable). Voice uses your microphone and needs no cable.

| Direction | Windows | macOS | Linux |
|---|---|---|---|
| Icom Remote *Play to* (receive) | `CABLE Input` | `BlackHole 2ch` | `IcomRX` sink |
| Decoder input | `CABLE Output` | `BlackHole 2ch` | `Monitor of IcomRX` |
| Decoder output (transmit) | second cable's input | `BlackHole 16ch` | `IcomTX` |
| Icom Remote *Audio from* | second cable's output | `BlackHole 16ch` | `IcomTX.monitor` |

Full setup, including Linux PulseAudio/PipeWire steps, is in [Virtual audio cables](/docs/virtual-audio/).

On macOS, the first time the app reads an input device it asks for microphone permission. If you declined, the transmit level stays at zero. Enable it under **System Settings → Privacy & Security → Microphone**.

### rigctld (CAT control)

The built-in rigctld listens on `127.0.0.1:4532`. Use `0.0.0.0` only if you must allow other machines on your LAN.

- **WSJT-X / JTDX / JS8Call:** Settings → Radio: Rig `Hamlib NET rigctl`, Network Server `127.0.0.1:4532`, PTT Method `CAT`, Mode `Data/Pkt` or `USB`, Split `None`. Use *Test CAT* then *Test PTT*.
- **fldigi:** Configure → Rig Control → Hamlib: rig `Hamlib NET rigctl`, device `127.0.0.1:4532`. Under Configure → Soundcard → Devices → PortAudio, set **Capture** to the receive cable and **Playback** to the transmit cable.

```bash
rigctl -m 2 -r 127.0.0.1:4532 F 14074000   # set frequency
rigctl -m 2 -r 127.0.0.1:4532 M PKTUSB 0   # USB-D
```

## Recording

Tick **Record received audio** to save what the radio receives (not your transmit audio). WAV is 16-bit PCM at 48 kHz. M4A/MP4 (AAC, 64 kbit/s) needs PyAV, which is in `requirements.txt`; without it those formats are greyed out. Filenames carry the UTC time, frequency and mode, for example `icom_20261024T180000Z_14074.000kHz_USB-D.wav`.

## The restore file

While connected, the app sets the radio's DATA MOD and DATA OFF MOD inputs to LAN and records the original values on disk. If the app is killed or the network drops, the originals stay in `restore.json` in the settings folder. The next connection restores them, or choose **Restore now**.

| OS | Settings folder |
|---|---|
| macOS | `~/Library/Application Support/IcomRemote/` |
| Windows | `%APPDATA%\IcomRemote\` |
| Linux | `~/.config/icomremote/` |

To fix it by hand on the IC-7300 or IC-705: Menu → Set → Connectors → MOD Input → DATA MOD.

## Check your install

```bash
python run_icomremote.py --check
```

It reports Qt, audio, recording, resampler and protocol status, and exits with 0 when everything is OK. Run it from the built app too, for example `"/Applications/Icom Remote.app/Contents/MacOS/Icom Remote" --check`.

## Troubleshooting

| Symptom | Try |
|---|---|
| Can't connect | Confirm Network Control is on, the address is right, and UDP 50001 to 50003 are open. Run the probe below. |
| "Radio in use" | Another client is connected. Close the original Icom Remote or RS-BA1 software. |
| Transmit is silent | Check LAN MOD Level isn't 0 %, DATA MOD/DATA OFF MOD are LAN, and macOS microphone access is allowed. |
| PTT refused | Read the status bar reason. Data PTT needs an *Audio from* input and DATA MOD set to LAN. Voice needs the armed space bar. |
| Weird behavior after a crash | Reconnect so the restore file puts the radio back, or use **Restore now**. |
| Need a bug report | Send `icomremote.log.1` (the previous run) from the settings folder. Start with `--debug` for packet dumps. |

Connection probe without the GUI:

```bash
python -m icomremote.probe --host 192.168.1.50 -u USER -p PASSWORD --debug
```

The password can also come from the `ICOM_PASSWORD` environment variable.

## Remote control API

The HTTP/JSON API is off by default. Tick **Enable** in the *Remote control API* box to use `127.0.0.1:7373`, which [FLDigi Net Scheduler](/docs/fldigi-net-scheduler/) uses. API tune requests are refused while the radio is on the air.

```bash
python run_icomremote.py ctl status
python run_icomremote.py ctl tune --khz 7074 --mode USB-D
```

## Update

```bash
cd icom-remote-client-next
git pull
.venv/bin/python -m pip install --require-hashes -r requirements.lock
```
