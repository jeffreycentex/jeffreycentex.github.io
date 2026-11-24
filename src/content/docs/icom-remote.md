---
title: Icom Remote Client install guide
description: Download or build Icom Remote Client Next from the digitalmodes branch, connect to your radio, route audio, set up rigctld and the API, and troubleshoot.
section: Software
order: 20
repo: https://github.com/jeffreycentex/icom-remote-client-next/tree/digitalmodes
---

How to install Icom Remote Client Next (the **`digitalmodes` branch**) and connect it to a radio. For features and screenshots, see the [project overview](/projects/icom-remote/). For decoding and FLAMP, see [Data decoding and FLAMP](/docs/icom-remote-data/).

> **Transmit safety.** This app can key your transmitter. Test receive-only first, and transmit only when you are licensed and authorized on that frequency.

## Before you start

- An **IC-7300MK2** (primary, used daily) or **IC-705**. The IC-9700 and IC-7610 have profiles tested with a simulated radio.
- The radio's network server reachable from your computer, on a trusted network or an encrypted VPN or tunnel.
- For third-party programs (fldigi, WSJT-X, MS-DMT): [virtual audio cables](/docs/virtual-audio/).

## Option 1: Download a release

Open the [Releases page](https://github.com/jeffreycentex/icom-remote-client-next/releases) and expand **Assets** for the release you want. The application archives include the Python runtime, the GUI and the native digital decoder. The "Source code" archives are only for building from source.

| Platform | Download | Start it |
|---|---|---|
| macOS, Apple Silicon | `IcomRemote-<version>-macos-arm64.zip` | Unzip and move **Icom Remote.app** to Applications |
| Windows, x64 | `IcomRemote-<version>-windows-amd64.zip` | Unzip and run **Icom Remote.exe** |
| Linux, x86-64 | `IcomRemote-<version>-linux-x86_64.tar.gz` | Extract and run **Icom Remote** |

Other architectures need a build on that platform. Builds from individual CI runs are also under [Actions](https://github.com/jeffreycentex/icom-remote-client-next/actions): open a completed **test-and-build** run and look in **Artifacts**.

### Unsigned application warnings

The releases have no Apple Developer ID signature or notarization and no Windows code-signing certificate, so your OS may block the first launch. Only proceed with a download from the repository's own pages.

- **macOS:** try to open the app, then choose **System Settings → Privacy & Security → Open Anyway**. Allow **Local Network** access for the radio and **Microphone** access for transmit input when asked. Apple describes the process in [Opening an unidentified app](https://support.apple.com/en-us/102445).
- **Windows:** SmartScreen may warn. Review the download's origin and, if you proceed, choose **More info → Run anyway**. Allow the app through the firewall on the network you use to reach the radio.
- **Linux:** install PortAudio (`sudo apt install libportaudio2` on Debian/Ubuntu), then:

  ```sh
  tar xzf IcomRemote-*-linux-*.tar.gz
  chmod +x "Icom Remote"
  ./"Icom Remote"
  ```

## Option 2: Run from source

You need **Python 3.12 or newer** and a **C/C++17 compiler** for the native decoder.

- **macOS:** install the Xcode command-line tools.
- **Linux:** install a C/C++ toolchain and PortAudio.
- **Windows:** use MSYS2 UCRT64 with MinGW GCC for the native build.

```sh
git clone -b digitalmodes https://github.com/jeffreycentex/icom-remote-client-next.git
cd icom-remote-client-next
git checkout v1.2              # or another release tag
python -m venv .venv
```

**macOS and Linux:**

```sh
source .venv/bin/activate
python -m pip install --require-hashes -r requirements.lock
python build_decoder.py
python run_icomremote.py
```

**Windows:** install in PowerShell, build the decoder from an MSYS2 UCRT64 shell, then launch from PowerShell:

```powershell
.venv\Scripts\python.exe -m pip install --require-hashes -r requirements.lock
```

```sh
.venv/Scripts/python.exe build_decoder.py --cc gcc --cxx g++
```

```powershell
.venv\Scripts\python.exe run_icomremote.py
```

`python -m icomremote` is an equivalent entry point. For verbose logging use `--debug --log-file icom-debug.log`.

To track the newest work instead of a tag, skip the `git checkout` and run `git pull` on the `digitalmodes` branch.

### Build a standalone app

PyInstaller can't cross-compile, so build on the target OS:

```sh
python build.py
```

This installs the hash-locked dependencies, compiles the decoder, packages the app and licenses, runs the self-check, and writes an archive under `dist/`. Use `python build.py --no-install --no-decoder-build` if the decoder is already built, and `--console` on Windows to keep a console window for troubleshooting.

## Set up the radio

In the radio's network or remote settings:

1. Turn **Network Control** ON.
2. Set a **network user name and password** (the app logs in with these).
3. Keep the default UDP ports: control **50001**, serial/CI-V **50002**, audio **50003**.
4. Note the radio's **IP address**, or give it a fixed address in your router.

On the IC-705, these settings are under **Menu → Set → WLAN Set → Remote Settings**.

## First connection

1. On the **Radio** tab, enter the address and network credentials.
2. Leave the radio profile on **Auto (from radio)** unless you need to force a CI-V address (IC-7300MK2 B6h, IC-705 A4h, IC-9700 A2h, IC-7610 98h).
3. Choose **Connect**. The header shows the connection state and persistent failure details. If the radio is in standby with its network server available, you see **STANDBY**. Use the radio's power control to wake it.
4. Tune: type the frequency in **kHz** and press Enter, or use the arrows. Pick **LSB**, **USB**, **AM** or **FM**, with **DATA** for the data variants, and **FIL1** to **FIL3** for the radio's filters. **Custom** adds the computer bandpass.

### Frequency presets

**Import presets…** loads up to 15 buttons from a text file, one `name, frequency in kHz` per line, with names up to 10 characters. Blank lines and lines starting with `#` are ignored.

```text
40m Voice, 7110
40m FT8, 7074
20m FT8, 14074
```

The file is remembered and watched for changes. The default is `quicktune.txt` in the [state directory](#settings-and-logs). A preset changes only the frequency.

**Remember password** saves the radio password in unencrypted local settings. The API token is also saved there. Preferences are saved on exit.

## Audio routing

The **Audio** tab selects receive outputs, a transmit input, gains and the modulation-source settings.

### Two receive outputs

Choose a device under **Play to**, then enable **Also play to** for a second output. Each has its own gain and buffering. For example, use `BlackHole 2ch` to feed a decoder and your speakers to listen at the same time. Either output can be turned off independently.

### Virtual cables for fldigi, WSJT-X and others

Use **separate cables** for receive and transmit. The client rejects routes that would feed received audio back into its transmit input. For voice, choose your microphone under **Audio from**.

| Connection | Windows | macOS | Linux |
|---|---|---|---|
| Client receive output | `CABLE Input` | `BlackHole 2ch` | `IcomRX` sink |
| fldigi / WSJT-X receive input | `CABLE Output` | `BlackHole 2ch` | `Monitor of IcomRX` |
| fldigi / WSJT-X transmit output | second cable's input | `BlackHole 16ch` | `IcomTX` sink |
| Client transmit input | second cable's output | `BlackHole 16ch` | `IcomTX.monitor` source |

Install [VB-Audio Virtual Cable](https://vb-audio.com/Cable/) plus a second independent cable on Windows, or `brew install blackhole-2ch blackhole-16ch` on macOS. On Linux the two PulseAudio or PipeWire null sinks do the job. Full steps are in [Virtual audio cables](/docs/virtual-audio/).

On macOS, microphone permission applies to input devices, including virtual cables. When you run from source, it may belong to Terminal or the Python launcher. If the transmit level stays at zero, check **System Settings → Privacy & Security → Microphone**.

## Voice, data and PTT

The selected **Audio from** input is used for both voice and data.

| PTT control | DATA modes | Voice modes |
|---|---|---|
| PTT button | Available | Refused |
| Hamlib `T 1` | Available | Refused |
| Hold **Space** with **Arm voice PTT** on | Available | Available |

- Remote **data** transmit needs **DATA MOD** set to LAN/WLAN. Remote **voice** needs **DATA OFF MOD** set to LAN/WLAN. A transmit input must be selected.
- While voice PTT is armed, Space keys transmit even in a text field. Arming starts off and clears on disconnect.
- PTT is released on disarm, leaving the Radio tab, losing window focus, disconnecting, changing the transmit input, switching between voice and DATA, or the transmit timeout.
- The **RX/TX** indicator follows the radio's readback. **Output / SWR** shows transmit measurements: green below 1.5, yellow below 2.5, red at 2.5 or above.

### Switching between LAN and local USB audio

**DATA MOD → LAN** controls the data transmit source and **DATA OFF MOD → LAN** controls voice. Both checkboxes work while connected: checking saves the current source and selects LAN, and unchecking restores the saved source and confirms it on the radio. Receive audio keeps playing, and the client releases PTT before changing a source.

For remote voice with data from a computer on the radio's USB port, use **DATA OFF MOD = LAN** and **DATA MOD = USB**. Leave the voice checkbox checked and uncheck the data checkbox. Select DATA mode before transmitting from the local USB program. The client's own data PTT is refused while the radio takes data audio from USB.

Original values go to `restore.json` before the client changes them, and are restored when you disconnect or quit. If something is uncertain, the record is kept for recovery at the next connection. **Restore now** restores managed sources immediately. A zero **LAN MOD level** triggers a warning, because remote transmit audio would be silent.

### Power and tuning

**Power** sets RF POWER when you release the slider. **TUNE** toggles the antenna tuner. On the IC-7300MK2, **Low Power Tune** (5% RF power) and **Powered Tune** (the selected power) send a steady 1 kHz tone, start tuning and continue for five seconds before returning to receive. Click again to stop early.

## Rig control and API

### Hamlib rigctld

Enable the CAT server and use **127.0.0.1:4532** from programs on the same computer. It accepts only loopback connections, so use an authenticated tunnel for other computers.

| Application | Setup |
|---|---|
| WSJT-X / JTDX / JS8Call | Hamlib NET rigctl, server `127.0.0.1:4532`, PTT by CAT, pick the right DATA mode |
| fldigi | Hamlib NET rigctl at `127.0.0.1:4532`. Capture is the receive cable, Playback is the transmit cable. |
| MS-DMT | Hamlib rigctld TCP profile at `127.0.0.1:4532`. `T 1` keys and `T 0` releases PTT. |

`PKTUSB`, `PKTLSB`, `PKTAM` and `PKTFM` select the DATA variants, and plain USB/LSB also select them by default (a checkbox changes that). Client-supplied passbands are ignored.

```sh
rigctl -m 2 -r 127.0.0.1:4532 F 7110000
rigctl -m 2 -r 127.0.0.1:4532 M PKTUSB 0
rigctl -m 2 -r 127.0.0.1:4532 f m l STRENGTH
```

### HTTP API and console control

Enable the HTTP API on **127.0.0.1:7373** for schedulers and scripts such as [FLDigi Net Scheduler](/docs/fldigi-net-scheduler/). It gives status, frequency and mode changes, and recording controls. Changes are refused while transmitting or tuning. Connect to the radio in the window first.

```sh
python run_icomremote.py ctl status
python run_icomremote.py ctl tune --khz 7110 --mode USB-D
python run_icomremote.py ctl record-start --name "{date}_net" --max-seconds 3600
python run_icomremote.py ctl record-stop
```

The endpoint reference is in the [API document](https://github.com/jeffreycentex/icom-remote-client-next/blob/digitalmodes/docs/API.md).

## Recording

Choose a folder and **WAV**, **M4A** or **MP4** under **Recording and control**, then click **Record**. WAV is 16-bit PCM at 48 kHz. M4A and MP4 use AAC and need PyAV, which is in the locked dependencies. You can start recording before connecting, and it waits for audio. Enabled computer receive filters are included. Names carry UTC time, frequency and mode, for example `icom_20261123T180000Z_7110.000kHz_USB.wav`. A classic WAV file is limited to 4 GB, about 12 hours.

## Settings and logs

| Platform | State directory |
|---|---|
| macOS | `~/Library/Application Support/IcomRemoteNext/` |
| Windows | `%APPDATA%\IcomRemoteNext\` |
| Linux | `~/.config/icomremote-next/` |

Logs, `quicktune.txt` and the modulation restore record live here. `ICOM_REMOTE_STATE_DIR` overrides the location. The current log is `icomremote.log`, with the previous five runs as `.1` to `.5`. After a problem and a restart, `icomremote.log.1` holds the previous session. The **Log** tab shows recent entries, and **Export Log…** saves the full session log.

## Check your install

```sh
python run_icomremote.py --check
```

It reports Qt, PortAudio devices, recording support, the resampler, protocol modules and whether the bundled decoder can start. Exit status 0 means the required parts passed. For a packaged app run its executable with `--check`, for example `"/Applications/Icom Remote.app/Contents/MacOS/Icom Remote" --check` on macOS.

### Console connection test

The probe connects without the GUI. Close any other client using the radio first.

```sh
python -m icomremote.probe --host 192.168.1.50 -u USER --seconds 20
```

Supply the password with the `ICOM_PASSWORD` environment variable or `-p`. Options include `--play "BlackHole 2ch"`, `--list-devices`, `--wav rx.wav`, `--civ B6`, `--debug` and `--bind-same-ports`.

## Troubleshooting

| Symptom | Try |
|---|---|
| Can't connect | Check Network Control, address, credentials, UDP 50001 to 50003, VPN route, and that no other client holds the session. Run the probe. |
| Transmit level stays at zero | Check the input selection, cable direction, macOS microphone permission and the radio's **LAN MOD** level. |
| PTT refused | Read the status bar reason. Data PTT needs DATA MOD set to LAN, voice needs DATA OFF MOD set to LAN, and an input must be selected. |
| Decoder gets no audio | Confirm the client's output is the receive cable and the decoder reads the matching end. |
| Native decoder won't start | Run `--check`, and for a source install repeat `python build_decoder.py`. |
| Settings odd after a crash | Reconnect so the restore file is applied, or choose **Restore now**. |
| Bug report | Send `icomremote.log.1` and run with `--debug` for protocol diagnostics. |

## Update

For a source install:

```sh
cd icom-remote-client-next
git fetch
git checkout digitalmodes && git pull
source .venv/bin/activate
python -m pip install --require-hashes -r requirements.lock
python build_decoder.py
```

For a packaged app, download the newer release archive.

## Licensing

GPL-3.0-or-later. The RS-BA1 implementation is based on [kappanhang](https://github.com/nonoo/kappanhang) (MIT). Digital reception uses fldigi-derived native modem sources, with their notices retained in the repository.
