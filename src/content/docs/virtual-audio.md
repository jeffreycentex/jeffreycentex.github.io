---
title: Virtual audio cables
description: Route audio between my remote clients and fldigi, WSJT-X or JS8Call on Windows, macOS and Linux (PulseAudio and PipeWire).
section: Software
order: 40
---

A virtual audio cable is a software device that appears as both an output and an input. A program plays into one end, and another program records from the other end. They connect [KiwiSDR Remote](/docs/kiwisdr-remote/) and [Icom Remote](/docs/icom-remote/) to decoders such as fldigi, WSJT-X and JS8Call.

## How many cables?

- **Receive only** (KiwiSDR Remote, or just listening with Icom Remote): **one** cable.
- **Transmit with Icom Remote** (data modes): **two** cables, one per direction. If receive and transmit shared one cable, received audio would be sent back to the radio, so Icom Remote refuses that combination. Voice needs no cable, since *Audio from* is your microphone.

## Windows

- **VB-CABLE** from [vb-audio.com/Cable](https://vb-audio.com/Cable/) gives one cable. For a second, add *Hi-Fi Cable* or *VB-CABLE A+B* from the same site. They are donationware.
- Receive: the client plays to `CABLE Input`, and the decoder records from `CABLE Output`.
- Transmit (Icom Remote): the decoder plays to the second cable's input, and Icom Remote's *Audio from* is the second cable's output.

## macOS

Install [BlackHole](https://existential.audio/blackhole/):

```bash
brew install blackhole-2ch blackhole-16ch
```

| Direction | Device |
|---|---|
| Receive: client *Play to* | `BlackHole 2ch` |
| Receive: decoder input | `BlackHole 2ch` |
| Transmit: decoder output | `BlackHole 16ch` |
| Transmit: Icom Remote *Audio from* | `BlackHole 16ch` |

The first time an app reads an input device, macOS asks for microphone permission for the program running it (Terminal or the app bundle). If you declined, enable it under **System Settings → Privacy & Security → Microphone**.

## Linux (PulseAudio and PipeWire)

There is no driver to install. Two *null sinks* named `IcomRX` and `IcomTX` act as the cables, and each sink's "Monitor of …" source is the other end.

### 1. Which sound server?

```bash
pactl info | grep "Server Name"
```

`PulseAudio (on PipeWire …)` means PipeWire (Ubuntu 22.10+, Fedora 34+, Debian 12 desktop). Plain `pulseaudio` means PulseAudio.

### 2. Packages

```bash
# Debian / Ubuntu / Raspberry Pi OS
sudo apt install libportaudio2 pulseaudio-utils libasound2-plugins
# Fedora
sudo dnf install portaudio pulseaudio-utils alsa-plugins-pulseaudio
# Arch
sudo pacman -S portaudio libpulse alsa-plugins
```

On PipeWire systems, make sure `pipewire-pulse` is installed (it usually is).

### 3. Create the cables

Click **Create 'IcomRX' virtual sink** and **Create 'IcomTX' virtual sink** in Icom Remote, or run:

```bash
pactl load-module module-null-sink sink_name=IcomRX sink_properties=device.description=IcomRX
pactl load-module module-null-sink sink_name=IcomTX sink_properties=device.description=IcomTX
pactl list short sinks | grep Icom
```

These last until you log out or the sound server restarts.

### 4. Make them permanent

**PipeWire:** create `~/.config/pipewire/pipewire-pulse.conf.d/icomremote.conf`:

```text
pulse.cmd = [
  { cmd = "load-module" args = "module-null-sink sink_name=IcomRX sink_properties=device.description=IcomRX" flags = [ ] }
  { cmd = "load-module" args = "module-null-sink sink_name=IcomTX sink_properties=device.description=IcomTX" flags = [ ] }
]
```

Then run `systemctl --user restart pipewire-pulse`, or log out and in.

**PulseAudio:** add to `~/.config/pulse/default.pa` (create it if needed):

```text
.include /etc/pulse/default.pa
load-module module-null-sink sink_name=IcomRX sink_properties=device.description=IcomRX
load-module module-null-sink sink_name=IcomTX sink_properties=device.description=IcomTX
```

Then run `pulseaudio -k`.

### 5. Connect programs

| Program | Setting | Device |
|---|---|---|
| Icom Remote | *Play to* (receive) | `PulseAudio/PipeWire sink: IcomRX` |
| Icom Remote | *Audio from* (transmit) | `PulseAudio/PipeWire source: IcomTX.monitor` |
| fldigi / WSJT-X | input | `Monitor of IcomRX` |
| fldigi / WSJT-X | output | `IcomTX` |

**WSJT-X and JS8Call** only list ALSA devices, so you see `pulse`, `default` and hardware cards, never "Monitor of IcomRX". Route them with `pavucontrol`:

1. In WSJT-X or JS8Call → Settings → Audio, set **Input** and **Output** to `pulse` (or `default`).
2. With the program running, open `pavucontrol`. On the **Recording** tab, set its stream to **Monitor of IcomRX**. On the **Playback** tab, set its stream to **IcomTX**.
3. PulseAudio and PipeWire remember this per program.

If a program hides monitor sources (some fldigi setups), remap the monitor as a normal input:

```bash
pactl load-module module-remap-source master=IcomRX.monitor source_name=IcomRX_in source_properties=device.description=IcomRX-Input
```

Avoid `pactl set-default-source IcomRX.monitor`. It works, but it also redirects every other program's microphone to the radio.

> The Linux steps are standard PulseAudio and PipeWire usage but have not yet been tested on a real Linux desktop with these apps.
