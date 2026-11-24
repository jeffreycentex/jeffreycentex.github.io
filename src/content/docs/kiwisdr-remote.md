---
title: KiwiSDR Remote Client install guide
description: Download or build KiwiSDR Remote Client from the digitalmodes branch, then set up audio, rig control, recording, the API and headless mode.
section: Software
order: 10
repo: https://github.com/jeffreycentex/kiwisdr-remote-client/tree/digitalmodes
---

How to install KiwiSDR Remote Client (the **`digitalmodes` branch**) and connect it to a receiver and a decoder. For features and screenshots, see the [project overview](/projects/kiwisdr-remote/). For the Data and FLAMP tabs, see [KiwiSDR Remote data decoding and FLAMP](/docs/kiwisdr-remote-data/).

## Before you start

- A **KiwiSDR address** as `host:port` (for example `kiwi.example.net:8073`), or `https://host[:port]` for a TLS receiver. Find one on the [worldwide map](http://map.kiwisdr.com/) or the [receiver list](http://rx.kiwisdr.com/). To try the client right away, use mine in New Braunfels, Texas: `newbraunfels.proxy.kiwisdr.com:8073` ([open it in a browser](http://newbraunfels.proxy.kiwisdr.com:8073)).
- A [virtual audio cable](/docs/virtual-audio/) if you want to feed fldigi, WSJT-X or JS8Call.
- **Python 3.10 or newer** and a C and C++17 compiler, only for a source install. Packaged builds include everything.
- **Linux:** PortAudio and the usual Qt runtime libraries.

## Option 1: Download a release

Open the [Releases page](https://github.com/jeffreycentex/kiwisdr-remote-client/releases) and download the archive for your system (the Build workflow publishes them when a `v*` tag is released, for example `v0.3`):

| Platform | Asset | What's inside |
|---|---|---|
| Windows x64 | `KiwiSDR-Remote-<tag>-windows-x64.zip` | `KiwiSDR Remote.exe` (GUI) and `kiwiremote-cli.exe` |
| macOS, Apple silicon | `KiwiSDR-Remote-<tag>-macos-arm64.zip` | `KiwiSDR Remote.app` |
| Linux x64 | `KiwiSDR-Remote-<tag>-linux-x64.tar.gz` | `KiwiSDR Remote` and `kiwiremote-cli` |

**KiwiSDR Remote** opens the GUI, and **kiwiremote-cli** runs headless mode and API commands. The decoder is built in.

macOS builds are ad-hoc signed and not notarized, so macOS may block the first launch. Open it once, then choose **System Settings → Privacy & Security → Open Anyway**. Only use downloads from the repository's own Releases page.

## Option 2: Run from source

```bash
git clone -b digitalmodes https://github.com/jeffreycentex/kiwisdr-remote-client.git
cd kiwisdr-remote-client
python -m venv .venv
source .venv/bin/activate          # Windows PowerShell: .venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python build_decoder.py
python run_kiwiremote.py
```

Use `python3` if that is what your system calls it. `python build_decoder.py` builds the bundled digital decoder, so run it once after installing.

### Compilers for the decoder

| Platform | What to install |
|---|---|
| **macOS** | Xcode command-line tools |
| **Linux** | GCC (C and C++17), plus `libportaudio2` (`sudo apt install libportaudio2` on Debian/Ubuntu) and Qt runtime libraries |
| **Windows** | MinGW-w64 through MSYS2. In the UCRT64 shell run `python build_decoder.py --cc gcc --cxx g++`. |

### Optional packages

| Package | Gives you |
|---|---|
| PyAV | M4A/MP4 (AAC) recording and extra audio-file formats for decoding. WAV works without it. |
| SciPy | The local Audio Bandpass and Manual Notch filters. |
| `samplerate` | Higher-quality resampling (otherwise linear interpolation). It is skipped on Windows. |
| `certifi` | Extra TLS trust certificates. |

The Python package and launchers keep their original names (`kiwiremote`, `run_kiwiremote.py`, `kiwiremote-cli`) for compatibility. The desktop app is still called **KiwiSDR Remote**.

### Build a standalone app

PyInstaller builds for the OS you are on; it doesn't cross-compile.

```bash
python -m pip install -r requirements.txt pyinstaller
python build_decoder.py
pyinstaller --noconfirm kiwiremote.spec
```

The pinned kiwiclient sources are already included. Use `python fetch_kiwiclient.py` only if you intend to refresh them.

## First run

1. Enter `host:port` and choose **Connect**. Give a receiver password only if the receiver needs one. The password is sent both for receiver access and for Kiwi's daily IP time-limit exemption, and an exemption only works if it matches the password the receiver owner configured.
2. On **Listen**, set the frequency in kHz, the mode and the bandwidth.
3. On **Audio**, choose an output under **Play to**. Turn on **Also play to** to send the same audio to a second device, for example your speakers and `BlackHole 2ch`. Each output has its own gain and remembers its selection.
4. To record, open **Audio → Record to file**, choose a format and folder, and click **Record**. **Open** reveals the folder.

### Quick Tune presets

Choose **File → Edit quick-tune presets…** to open `quicktune.txt`. On macOS it is at `~/Library/Preferences/KiwiSDR Remote/quicktune.txt`. Add one `name, frequency in kHz` per line:

```text
# Name, frequency in kHz
40m FT8, 7074
WWV, 10000
```

Up to 15 buttons appear, with labels up to 10 characters. A button changes only the frequency. Saving the file updates the buttons while the app runs, and deleting it hides them.

### Keyboard shortcuts

Use Ctrl on Windows and Linux, Command on macOS.

| Shortcut | Action |
|---|---|
| Ctrl/Command+L | Focus receiver address |
| Ctrl/Command+F | Focus frequency |
| Ctrl/Command+R | Start or stop recording |
| Ctrl/Command+Return | Connect or disconnect |

## Connect a decoder

You can use the built-in decoder (see [data decoding and FLAMP](/docs/kiwisdr-remote-data/)), or an external one:

1. Send the client's audio to a virtual cable on the **Audio** tab.
2. In fldigi, WSJT-X or JS8Call, choose the matching end of that cable as the audio **input**. Device names for each OS are in [Virtual audio cables](/docs/virtual-audio/).
3. Turn on rig control in the decoder:
   - **WSJT-X / JS8Call:** Rig `Hamlib NET rigctl`, Network Server `127.0.0.1:4532`.
   - **fldigi:** enable Hamlib with rig `Hamlib NET rigctl` and device `127.0.0.1:4532`.
4. Leave **Auto Notch** and **Noise Reduction** off on the **DSP** tab when feeding a digital decoder.

The client is receive-only, so PTT commands from the decoder are accepted and ignored.

```bash
rigctl -m 2 -r 127.0.0.1:4532 F 7074000
rigctl -m 2 -r 127.0.0.1:4532 M USB 2800
```

## Filters

**DSP → Audio Bandpass** uses SciPy to filter playback and recordings. Its cutoffs are the center minus and plus half the width. The default center of 1,500 Hz and width of 2,400 Hz give cutoffs of 300 and 2,700 Hz. It starts off, and it bypasses settings that put a cutoff outside the usable range (above zero and below half the sample rate).

**Manual Notch** removes a narrow tone at a chosen frequency and width. It starts off at 1,000 Hz with a 50 Hz width. **Auto Notch** and **Noise Reduction** use the KiwiSDR's WDSP filters and start off.

## Headless mode and the API

Run the service without a GUI, then control it from another terminal:

```bash
python run_kiwiremote.py --headless --record-dir ./recordings

python run_kiwiremote.py ctl connect kiwi.example.net:8073 --wait 10
python run_kiwiremote.py ctl tune --khz 7074 --mode USB
python run_kiwiremote.py ctl record-start --name "{date}_net" --max-seconds 3600
python run_kiwiremote.py ctl record-stop
python run_kiwiremote.py ctl disconnect
```

The API is always on in headless mode. In the GUI, enable it on the **Automation** tab (default `127.0.0.1:7373`). Everything shares one tuning and recording state. The [API reference](https://github.com/jeffreycentex/kiwisdr-remote-client/blob/digitalmodes/docs/API.md) lists endpoints, authentication, error codes and filename templates.

## Recording

Choose **WAV** or **M4A/MP4** (needs PyAV). WAV rotates at 1 GiB, and a sample-rate change starts a new part. Filenames are reserved atomically, so existing recordings are never replaced. WAV fills reconnect gaps with silence, up to 30 minutes per gap, and M4A/MP4 uses mono AAC at 48 kHz and 64 kbit/s without gap silence. If storage can't keep up, recording stops with an error instead of dropping audio silently.

## Session limits

- Sessions without a receiver password end after **45 minutes** by default. Passworded sessions have no limit.
- A periodic reset disconnects for 15 seconds every 120 minutes and keeps a running recording. Local receivers (loopback, private or link-local) are exempt.
- Per-connect overrides win, and zero disables a limit or reset.

## Security notes

- Both control services bind to loopback by default. The HTTP API requires a token for non-loopback binding but stays plaintext, and rigctld has no authentication. Use an authenticated encrypted tunnel for remote access.
- Receiver passwords are not saved. An optional API token is stored in the app's Qt settings, so protect your user account.
- TLS verifies certificates, and redirects can't downgrade to plaintext or forward a password to another host.

## Update

```bash
cd kiwisdr-remote-client
git pull
source .venv/bin/activate
python -m pip install -r requirements.txt
python build_decoder.py
```

For a packaged app, download the newer release archive.

## Troubleshooting

| Symptom | Try |
|---|---|
| Connection keeps retrying | It retries after 5 s (15 s if the receiver is busy). Try another receiver, or check the port. |
| Stops retrying immediately | A bad password or an invalid TLS certificate stops retries. Correct the password, or connect explicitly to a trusted address. |
| "Time limit" style rejection | The receiver limits sessions. Use the correct receiver password for the daily exemption, or reconnect later. |
| No sound in the decoder | Confirm the client's output is the virtual cable and the decoder's input is the matching other end. |
| Decoder doesn't follow frequency | Check rigctld is enabled on **Automation** and the decoder points at `127.0.0.1:4532`. |
| M4A/MP4 is greyed out | Install PyAV, or record WAV. |
| Filters have no effect | Install SciPy. |
| Data tab can't start | For a source install, run `python build_decoder.py` (see the compilers table above). |
| Bug report | **Log → Export log…** saves the latest 2,000 lines. |

## Uninstall

Delete the project folder and its `.venv`. Settings live in the OS configuration folder, such as `~/Library/Preferences/KiwiSDR Remote/` on macOS.

## Licensing

GPL-3.0-or-later. The project keeps the history and attribution of [KiwiSDR Remote](https://github.com/jeffreycentex/kiwisdr-remote). The vendored kiwiclient sources keep their own licenses (parts GPL-2.0-or-later, and `mod_pywebsocket` BSD). Keep upstream notices when you redistribute source or binaries.
