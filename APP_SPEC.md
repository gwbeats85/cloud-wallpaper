# Cloud Wallpaper

Status: tiny static wallpaper page for Plash.

## Goal

Host a Vanta Clouds page that can act as a calm live wallpaper for study,
reading, and sleep/focus modes.

## Non-Goals

- No custom browser shell.
- No accounts, analytics, tracking, backend, or database.
- No local helper required for the GitHub Pages version.

## Modes

- `morning`: bright blue sky.
- `sunset`: warmer sky with orange sun and cloud color.
- `night`: dim blue-gray reading mode.
- `sleep`: darkest low-motion mode.
- `auto`: picks a mode from local time and slowly updates.

## URL Parameters

- `mode=morning|sunset|night|sleep|auto`
- `ui=0|1`
- `speed=0.05..2`
- `scale=0.5..5`

## Plash URL

Use `ui=0` for wallpaper mode.

```text
https://gwbeats85.github.io/cloud-wallpaper/?mode=auto&ui=0
```
