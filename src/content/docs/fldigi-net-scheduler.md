---
title: FLDigi Net Scheduler install guide
description: Requirements, downloads, running from source, configuring fldigi and the Remote API, the schedule file, CSV import and testing.
section: Software
order: 30
repo: https://github.com/jeffreycentex/fldigi-net-scheduler
---

How to install FLDigi Net Scheduler and connect it to fldigi. For features and a screenshot, see the [project overview](/projects/fldigi-net-scheduler/).

> **The app never transmits.** It only changes receive-side settings.

## Before you start

| You need | Details |
|---|---|
| **fldigi** | XML-RPC enabled (on by default, port 7362). Tested against 4.2.13. |
| **Rig control in fldigi** | flrig, Hamlib or RigCAT, so mode and frequency changes reach the radio. With KiwiSDR Remote, use its rigctld on port 4532. |
| **Python 3.9+ and PySide6 6.5+** | Only for a source install. Standalone builds bundle both. |
| **Optional: a Remote API** | [KiwiSDR Remote](/docs/kiwisdr-remote/) or [Icom Remote](/docs/icom-remote/) with its API enabled (default `127.0.0.1:7373`), for SDR connect and recording. Run **only one** at a time, because they share audio and rigctl. |

## Download a build

Open the [Releases page](https://github.com/jeffreycentex/fldigi-net-scheduler/releases) and choose the asset for your platform. Each build bundles Python and PySide6.

- **Windows x64:** run `fldigi-net-scheduler.exe`.
- **Linux x64:** `chmod +x fldigi-net-scheduler`, then `./fldigi-net-scheduler`. The build targets Ubuntu 24.04 and uses system libraries.
- **macOS (Apple silicon):** unzip `fldigi-net-scheduler-macos-arm64.zip` and open **FLDigi Net Scheduler.app**. The bundle is ad-hoc signed and not notarized, so approve the first launch in **System Settings → Privacy & Security**.

## Run from source

```bash
git clone https://github.com/jeffreycentex/fldigi-net-scheduler.git
cd fldigi-net-scheduler
python3 -m pip install -r requirements.txt
python3 fldigi_net_scheduler.py
```

On Windows, use `py` instead of `python3`. Add `--config PATH` to use a specific schedule file.

## Build it yourself

Run on the target Windows or Linux machine:

```bash
python -m pip install -r requirements-build.txt
python -m PyInstaller --clean --noconfirm fldigi_net_scheduler.spec
```

One executable appears in `dist/`. Build on each OS you need. For Linux distribution, build on the oldest distribution you want to support.

## Configure fldigi

1. Make sure fldigi's XML-RPC server is on (default `127.0.0.1:7362`).
2. Set up rig control in fldigi (flrig, Hamlib or RigCAT). Without it, `rig.set_mode` only changes fldigi's display, and the scheduler logs a warning.
3. Start fldigi, then the scheduler. On the **Connections** tab, confirm the host and port. Live status should show the dial, rig mode, modem and carrier.

## Configure the Remote API (optional)

In the scheduler's Remote API box:

1. Set the API host and port (default `127.0.0.1:7373`) and token if you set one.
2. Choose **Default SDR…** to store a KiwiSDR server and password. Rows set to *Use the Default SDR* follow it.
3. Use **Off** in a row's SDR dialog if you use Icom Remote instead.

## Build your first schedule

1. Open the **Schedule** tab and choose **Add row**.
2. Fill in the net name, day (UTC), start time (UTC), frequency, rig mode, digital mode and sweet spot.
3. For SDR or recording, set the SDR dialog and **Record**, and give the row a **Duration** in minutes. A red cell means something required is missing.
4. Switch the row **On**. New rows start **Off**, and Off rows never run.
5. Test with **Run selected now**, then **Stop active net** when you're done.

Times are evaluated in **UTC**. A Tuesday 01:00 UTC net is Monday evening in the Americas, and the **Local start** column shows exactly that.

### Sweet spot

The **FLDigi PSK Sweet Spot** field (default 1500 Hz) is where fldigi's carrier is placed. Each row's dial is reduced by the difference between that and the row's sweet spot:

```text
dial sent to fldigi = freq - (FLDigi PSK Sweet Spot - row sweet spot)
carrier             = FLDigi PSK Sweet Spot
```

| Freq | Row sweet spot | Dial sent |
|---|---|---|
| 7110 kHz | 900 Hz | 7109.400 kHz |
| 7110 kHz | 1500 Hz | 7110.000 kHz |
| 7110 kHz | 2000 Hz | 7110.500 kHz |

## Where the schedule is saved

The schedule is autosaved to JSON on every edit. The exact path is shown in the status bar.

| OS | Path |
|---|---|
| macOS | `~/Library/Preferences/FLDigiNetScheduler/schedule.json` |
| Linux | `~/.config/FLDigiNetScheduler/schedule.json` |
| Windows | `%LOCALAPPDATA%\FLDigiNetScheduler\schedule.json` |

Passwords for SDR servers are stored in plain text in this file, and never written to the log. Older schedule files are converted automatically when loaded.

## Edit nets in Excel (CSV)

`nets_csv.py` is a command-line tool that needs no Qt. **Close the GUI before importing**, because the GUI saves on exit and would overwrite your import.

```bash
python3 nets_csv.py export -o nets.csv           # add --no-passwords to omit passwords
python3 nets_csv.py import nets.csv --dry-run    # validate without saving
python3 nets_csv.py import nets.csv              # replace all nets
python3 nets_csv.py import nets.csv --append     # add after existing nets
```

An import keeps your settings, Default SDR and any running net, and writes a `schedule.json.bak-<timestamp>` backup first. It accepts Excel-style output: `;` separators, times like `1:00 AM`, full day names, `TRUE`/`yes`/`1` for On, and decimal commas.

## Try it without a radio

Two mock servers let you test the whole flow:

```bash
python3 mock_fldigi.py          # fake fldigi on 127.0.0.1:7362
python3 mock_kiwiremote.py      # fake Remote API on 127.0.0.1:7373
python3 fldigi_net_scheduler.py # in another terminal
```

The mock Remote API treats the servers `busy.example`, `fail.example` and `slow.example` as returning 503, 502 and 504, so you can see the error handling.

## Troubleshooting

| Symptom | Try |
|---|---|
| Can't connect to fldigi | Confirm XML-RPC is enabled and the host/port on the Connections tab match. |
| Mode changes don't reach the radio | Set up rig control (flrig, Hamlib or RigCAT) in fldigi. |
| A modem doesn't switch | Some modes, such as OFDM, fail silently in fldigi. The scheduler polls `modem.get_name` and logs the result. |
| Net didn't start after the computer slept | The scheduler catches up a few minutes late, but won't replay a long gap. |
| SDR busy or slow | A 503 or 504 makes the Remote keep retrying, while a 502 skips recording for that net. |
| Row shows red | A required SDR is missing, or SDR or Record is set without a duration. |

## Update

```bash
cd fldigi-net-scheduler
git pull
python3 -m pip install -r requirements.txt
```

Release builds are replaced by downloading the newer asset.
