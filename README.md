# Cloud Wallpaper

Vanta Clouds wallpaper page for Plash.

## Modes

```text
?mode=morning
?mode=sunset
?mode=night
?mode=sleep
?mode=auto
```

Hide controls for Plash:

```text
?mode=auto&ui=0
```

Tune motion. If Plash looks still, use an explicit speed while testing:

```text
?mode=sunset&speed=0.35&scale=2.8
?mode=sunset&ui=0&speed=0.9
```

## Local Preview

```sh
python3 -m http.server 5188
```

Then open:

```text
http://127.0.0.1:5188/?mode=auto
```

## GitHub Pages

Settings:

- Source: Deploy from a branch
- Branch: `main`
- Folder: `/ (root)`
