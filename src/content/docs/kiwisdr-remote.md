---
title: KiwiSDR Remote Client install guide
description: Requirements, install options, audio and decoder setup, first run, updating and troubleshooting for KiwiSDR Remote Client.
section: Software
order: 10
repo: https://github.com/jeffreycentex/kiwisdr-remote-client
---

This guide gets KiwiSDR Remote Client installed and feeding a decoder. For features and screenshots, see the [project overview](/projects/kiwisdr-remote/).

## Before you start

- **Python 3.10 or newer** if you install from source (not needed for a standalone build).
- A **KiwiSDR** address as `host:port` (for example `kiwi.example.net:8073`). Public receivers are listed at [receiverbook.de](https://www.receiverbook.de/) and on kiwisdr.com. To try the client right away, use my receiver in New Braunfels, Texas: `newbraunfels.proxy.kiwisdr.com:8073` ([open it in a browser](http://newbraunfels.proxy.kiwisdr.com:8073)).
- A [virtual audio cable](/docs/virtual-audio/) if you want to send audio to a decoder (fldigi, WSJT-X, JS8Call).
- **Linux only:** PortAudio and the usual Qt runtime libraries.

## Option 1: Run from source

```bash
git clone https://github.com/jeffreycentex/kiwisdr-remote-client.git
cd kiwisdr-remote-client
python -m venv .venv
source .venv/bin/activate          # Windows PowerShell: .venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python run_kiwiremote.py
```

Use `python3` instead of `python` if that is how your system names it.

### Platform notes

| Platform | Notes |
|---|---|
| **macOS** | Works as shown. Install a virtual cable with `brew install blackhole-2ch` if you need one. |
| **Windows** | Use PowerShell for the activation command. The optional `samplerate` package is skipped, and the built-in linear resampler is used. |
| **Linux** | Debian/Ubuntu: `sudo apt install libportaudio2`, plus your distribution's Qt runtime libraries. |

### Optional packages

| Package | Gives you |
|---|---|
| PyAV | M4A/MP4 (AAC) recording. WAV works without it. |
| SciPy | The local Audio Bandpass and Manual Notch filters. |
| `samplerate` | Higher-quality resampling (otherwise linear interpolation). |
| `certifi` | Extra TLS trust certificates. |

## Option 2: Standalone build

Release archives for Windows x64, macOS Apple silicon and Linux x64 are produced by the repository's **Build** workflow when a `v*` tag is published. Download the one for your system from the [Releases page](https://github.com/jeffreycentex/kiwisdr-remote-client/releases).

- **Windows and Linux:** two self-contained executables. **KiwiSDR Remote** opens the GUI, and **kiwiremote-cli** runs headless mode and API commands.
- **macOS:** `KiwiSDR Remote.app`. Local builds are ad-hoc signed and not notarized, so macOS may block the first launch. Open it once, then allow it under **System Settings → Privacy & Security → Open Anyway**.

### Build it yourself

PyInstaller builds for the OS you are on; it does not cross-compile.

```bash
python -m pip install -r requirements.txt pyinstaller
pyinstaller --noconfirm kiwiremote.spec
```

## First run

1. Enter `host:port` (or `https://host[:port]` for a TLS receiver). Add a password only if the receiver needs one, then choose **Connect**.
2. On **Listen**, set the frequency in kHz, the mode and the bandwidth.
3. On **Audio**, choose an output device. Pick speakers to listen, or a virtual cable to feed a decoder.
4. To record, open **Audio → Record to file**, pick a format and folder, and choose **Record**.

### Quick Tune presets

Choose **File → Edit quick-tune presets…** to open `quicktune.txt`. On macOS it lives at `~/Library/Preferences/KiwiSDR Remote/quicktune.txt`. Add one `name, frequency in kHz` per line:

```text
# Name, frequency in kHz
40m FT8, 7074
WWV, 10000
```

Up to 15 buttons appear, with labels up to 10 characters. Saving the file updates the buttons while the app runs.

### Keyboard shortcuts

Use Ctrl on Windows and Linux, Command on macOS.

| Shortcut | Action |
|---|---|
| Ctrl/Command+L | Focus receiver address |
| Ctrl/Command+F | Focus frequency |
| Ctrl/Command+R | Start or stop recording |
| Ctrl/Command+Return | Connect or disconnect |

## Connect a decoder

1. Send the client's audio to a virtual cable (**Audio** tab).
2. In the decoder, choose the other end of that cable as the audio **input**. See [Virtual audio cables](/docs/virtual-audio/) for exact device names on each OS.
3. Turn on rig control in the decoder:
   - **WSJT-X / JS8Call:** Rig `Hamlib NET rigctl`, Network Server `127.0.0.1:4532`.
   - **fldigi:** enable Hamlib with rig `Hamlib NET rigctl` and device `127.0.0.1:4532`.
4. Leave **Auto Notch** and **Noise Reduction** off in the DSP tab when feeding a digital decoder.

The client is receive-only, so PTT commands from the decoder are accepted and ignored.

Test rigctl from a terminal:

```bash
rigctl -m 2 -r 127.0.0.1:4532 F 7074000
rigctl -m 2 -r 127.0.0.1:4532 M USB 2800
```

## Headless mode

Run the service without a GUI, then control it from another terminal:

```bash
python run_kiwiremote.py --headless --record-dir ./recordings

python run_kiwiremote.py ctl connect kiwi.example.net:8073 --wait 10
python run_kiwiremote.py ctl tune --khz 7074 --mode USB
python run_kiwiremote.py ctl record-start --name "{date}_net" --max-seconds 3600
python run_kiwiremote.py ctl record-stop
python run_kiwiremote.py ctl disconnect
```

The API is always on in headless mode, and the GUI enables it on the **Automation** tab (default `127.0.0.1:7373`). The full endpoint reference is in the [API document](https://github.com/jeffreycentex/kiwisdr-remote-client/blob/HEAD/docs/API.md).

## Session limits to know about

- Sessions without a receiver password end after **45 minutes** by default. Passworded sessions have no limit.
- A periodic reset disconnects for 15 seconds every 120 minutes, keeping a running recording. Local receivers (loopback, private or link-local) are exempt.
- Per-connect overrides win, and zero disables a limit or reset.

## Security notes

- Both control services bind to loopback by default. The HTTP API requires a token if you bind it elsewhere, but it stays plaintext, and rigctld has no authentication. Use an authenticated encrypted tunnel for remote access.
- Receiver passwords are not saved. An optional API token is stored in the app's Qt settings, so protect your user account.

## Update

```bash
cd kiwisdr-remote-client
git pull
source .venv/bin/activate
python -m pip install -r requirements.txt
```

## Troubleshooting

| Symptom | Try |
|---|---|
| Connection keeps retrying | It retries after 5 s (15 s if the receiver is busy). Try another receiver, or check the port. |
| Stops retrying immediately | A bad password or an invalid TLS certificate stops retries. Correct the password, or connect explicitly to a trusted address. |
| No sound in the decoder | Confirm the client's output is the virtual cable and the decoder's input is the matching other end. |
| Decoder doesn't follow frequency | Check rigctld is enabled on **Automation** and the decoder points at `127.0.0.1:4532`. |
| M4A/MP4 is greyed out | Install PyAV, or record WAV. |
| Filters have no effect | Install SciPy. The bandpass cutoffs must be above 0 Hz and below half the sample rate. |
| Log for a bug report | **Log → Export log…** saves the latest 2,000 lines. |

## Uninstall

Delete the project folder and its `.venv`. Settings live in the OS configuration folder, such as `~/Library/Preferences/KiwiSDR Remote/` on macOS.
