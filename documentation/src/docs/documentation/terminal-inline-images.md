---
title: Terminal Inline Images (SIXEL & iTerm2)
---
# Terminal Inline Images (SIXEL & iTerm2)
Since WebSSH 32.10[^1], the terminal can display images **inline**, right where a command prints them, without downloading the file first. Two protocols are understood:

* **SIXEL**, the DEC graphics format supported by xterm, mlterm, foot, WezTerm, Konsole, Windows Terminal... and by many tools (`img2sixel`, `chafa`, `timg`, ImageMagick, `mpv`).
* **iTerm2 inline images** (`OSC 1337 ; File=`), the protocol used by the `imgcat` utility.

!!! info "How images behave"
    * Images are drawn inside the terminal and scroll with the text, exactly like the output of any other command.
    * They are not selectable and are not part of the "Copy Screen" / "Copy All" exports.
    * Text written over an image erases the covered cells, so `clear` or a full screen program (`vim`, `htop`) removes them like any other output.
    * Images are kept for the current session only : a reconnection or a terminal reload starts with an empty screen.

## SIXEL
### Check that the terminal advertises SIXEL
Most tools probe the terminal with the *Primary Device Attributes* query. WebSSH answers with `4` (SIXEL) in the list :

```bash
printf '\e[c'
```

You should see `^[[?62;4;9;22c` typed in the terminal, the `;4` is the SIXEL capability. The terminal also answers the `XTSMGRAPHICS` queries (number of color registers, maximum geometry), honours `DECSET 80` (SIXEL scrolling) and reports its pixel size to the remote host (`TIOCGWINSZ`), so tools can size images to the screen without any option.

### Examples
[libsixel](https://github.com/saitoha/libsixel) ships `img2sixel` (packages `libsixel-bin` on Debian / Ubuntu, `libsixel` on Homebrew) :

```bash
img2sixel photo.jpg
```

```bash
img2sixel -w 400 photo.jpg
```

[chafa](https://hpjansson.org/chafa/) picks the best output for the terminal, force SIXEL to avoid its character art fallback :

```bash
chafa -f sixel photo.jpg
```

[timg](https://github.com/hzeller/timg) :

```bash
timg -p sixel photo.jpg
```

ImageMagick :

```bash
magick photo.png sixel:-
```

`convert photo.png sixel:-` with ImageMagick 6. [lsix](https://github.com/hackerb9/lsix) lists the images of a directory as thumbnails, and `mpv --vo=sixel video.mp4` even plays a video, though not smoothly over SSH.

## iTerm2 inline images (imgcat)
### Install imgcat
`imgcat` is a shell script published by iTerm2. It only needs `base64` on the remote host :

```bash
mkdir -p ~/bin && curl -fsSL https://iterm2.com/utilities/imgcat -o ~/bin/imgcat && chmod +x ~/bin/imgcat
```

### Examples
```bash
imgcat photo.png
```

```bash
imgcat -W 40 photo.png
```

`-W` / `-H` accept a number of cells, a size in pixels (`200px`), a percentage of the terminal (`50%`) or `auto`. Add `-r` to preserve the aspect ratio when both are given.

```bash
imgcat -l photo.png
```

Recent versions of `imgcat` send the image in many small parts (`MultipartFile`, `FilePart`, `FileEnd`) ; `-l` uses the original single sequence. WebSSH understands both.

Supported formats : PNG, JPEG, GIF (first frame only), WebP, AVIF, QOI.

## Kitty graphics protocol
!!! warning "Not supported yet"
    The [Kitty graphics protocol](https://sw.kovidgoyal.net/kitty/graphics-protocol/) (`kitten icat`, `chafa -f kitty`, `timg -p kitty`) is not supported : those commands print nothing, or an error saying that the terminal does not support graphics. Use the SIXEL or iTerm2 variants instead (`chafa -f sixel`, `timg -p sixel`, `imgcat`).

    Support depends on a newer version of the terminal engine used by WebSSH ([xterm.js](https://github.com/xtermjs/xterm.js)) and will be reconsidered once it is released.

## Using tmux
tmux does not forward unknown sequences to the terminal. Enable passthrough :

```bash
# in .tmux.conf (tmux >= 3.3)
set -g allow-passthrough on
```

* `imgcat` wraps its own sequences in a `DCS tmux` envelope when `TERM` starts with `screen` or `tmux`, nothing else to do.
* SIXEL through tmux requires tmux >= 3.4 built with `--enable-sixel` (the case of most recent distributions). Without it, tmux drops the graphics.

## Limits
* **10 MB per sequence** : bigger images are silently discarded. Scale them down before sending (`img2sixel -w`, `imgcat -W`, `magick -resize`).
* **Image cache** : 32 MB on iOS, 64 MB on macOS. When the cache is full the oldest images are evicted and replaced by a placeholder pattern while they are still in the scrollback.
* **Largest image** : 2048 x 2048 pixels (4 megapixels) after scaling to the requested size.
* No animation : only the first frame of an animated GIF is drawn.
* Images are not selectable, copyable or saveable from the terminal for now.

## Settings
* **Inline Images (SIXEL / iTerm2)** : enable or disable the feature (iOS : within system settings > WebSSH > SSH / macOS : within the app settings > SSH). Enabled by default. When disabled, the terminal no longer advertises SIXEL in its device attributes and the image sequences are ignored. The setting is read when a terminal opens : reconnect after changing it.

## Useful links
* [libsixel](https://github.com/saitoha/libsixel) and [Are We Sixel Yet?](https://www.arewesixelyet.com/)
* [chafa](https://hpjansson.org/chafa/)
* [imgcat](https://iterm2.com/utilities/imgcat) and [iTerm2 inline images protocol](https://iterm2.com/documentation-images.html)
* [xterm.js addon-image](https://github.com/xtermjs/xterm.js/tree/master/addons/addon-image)
* [GitHub issue #1457](https://github.com/isontheline/pro.webssh.net/issues/1457) (SIXEL)
* [GitHub issue #1708](https://github.com/isontheline/pro.webssh.net/issues/1708) (imgcat)

[^1]: Requires at least iOS 26 or macOS 26
