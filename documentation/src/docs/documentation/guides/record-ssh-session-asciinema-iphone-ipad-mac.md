---
title: "Record an SSH Session as asciinema on iPhone, iPad and Mac"
description: "Record a terminal session to an asciinema .cast file with WebSSH: start from the State Bar, add markers, auto-record a connection, play it back in the app or share it, and keep sensitive data out of the file."
---

# Record an SSH Session as asciinema on iPhone, iPad and Mac

A terminal recording is the fastest way to document a procedure, hand over an incident to a colleague or keep a trace of what was done on a server. Since WebSSH 31.4 any SSH, mosh or Telnet session can be recorded to an **asciinema** file, the `.cast` format read by the asciinema player, the asciinema CLI and GIF converters. Recording works in the FREE version, on iPhone, iPad and Mac.

## Start and Stop a Recording

Recording is driven from the **Recording** item of the [Terminal State Bar](/documentation/terminal-state-bar/), the record icon shown by default at the left of the bar.

1. Tap the **Recording** item (long press or right click opens the same menu)
2. Choose **Start Recording**
3. Pick **Record From This Point** to start with an empty screen, or **Record With Current Screen** to begin with what is on screen right now (the scrollback is not included)

The icon turns red while recording. The same menu then offers:

- **Add Marker**: name the step you are about to do, *before migration*, *rollback*. Markers show up as chapters in the asciinema player.
- **Review Recording**: play the file being written, positioned at the end, without stopping the recording.
- **Stop Recording**.
- **Recordings**: the list of recordings of this connection.

A recording also stops when you close the session. It does **not** stop on a disconnect: the reconnection is recorded in the same file with an automatic *Reconnected* marker, so an interrupted session still gives one continuous file.

??? tip "No State Bar, no recording button"
    The Recording item lives in the State Bar. If you removed it from your list, add it back from the *Built-in Items* picker, and check that the State Bar is not disabled for the connection or globally.

## Record Every Session of a Connection

For a server where every action should leave a trace, let WebSSH start the recording for you:

- **Per connection**: edit the connection, find **Auto Record** in the *Other Settings* section and set it to **Enabled**. **Inherit**, the default, follows the global setting.
- **Globally**: **Settings ▸ Advanced Settings ▸ SSH ▸ Recordings ▸ Auto Recording**. Disabled by default.

Auto-recording starts as soon as the terminal is ready, from the first byte, and you can still add markers or stop it from the State Bar.

## Find, Play, Share and Delete Recordings

The **Recordings** list opens from three places:

- the **Recording** item of the State Bar, for the current connection,
- the context menu of a server card, **Recordings**, for that connection,
- **History ▸ Recordings**, for every connection at once.

Each row shows the connection, the date, the duration and the size. Tap a row to play it in the built-in player, with the colors of the terminal theme used at the time, a timeline and the markers you added. The share button of the player, or **Share** in the row's context menu, hands the `.cast` file to any app, AirDrop or Files. **Delete** removes it after confirmation.

The files are regular files in the **Recordings** folder of WebSSH, in the Files app under *On My iPhone* ▸ **WebSSH** on iOS, in the app container on the Mac. They are sorted in one folder per connection, named after the connection's internal identifier, and each file is named after its start time: `2026-04-12-135448.cast`.

??? note "History and the FREE version"
    The History screen shows the 10 most recent entries in the FREE version, recordings included. The Recordings list opened from the State Bar or from a server card is not limited.

## Keep the Folder Tidy

**Settings ▸ Advanced Settings ▸ SSH ▸ Recordings ▸ Delete recordings older than** removes old files at launch: 7, 30 or 90 days, or **Never**. The default is 30 days. Share the recordings you want to keep before they expire, or set Never and prune the folder yourself.

## Play a Recording Elsewhere

WebSSH writes **asciicast v3** files. On a computer:

```bash
asciinema play 2026-04-12-135448.cast      # asciinema CLI 3 or later
asciinema upload 2026-04-12-135448.cast    # publish on asciinema.org
agg 2026-04-12-135448.cast demo.gif        # animated GIF, with a recent agg
```

Older tools that only read asciicast v2 can use `asciinema convert` from the asciinema CLI 3 to downgrade the file. The header of the file carries the terminal size, the color theme and the connection name as title; the events carry the output, the terminal resizes and the markers. Interval timestamps are rounded to the millisecond.

## What Is in the File, and What Is Not

- **Output only.** Keystrokes are never recorded. What you type appears in the file only when the server echoes it back, which is the case for commands and not for passwords typed at a password prompt.
- **No scrubbing.** Anything printed on screen is in the file: a `cat` of a secrets file, an API key in a command line, an environment dump. Review a recording before sharing it, or share only the part you need by trimming it on a computer.
- **Telnet with local echo** writes the characters you type into the output, so a password typed on such a session ends up in the file.
- **Record With Current Screen** captures the visible screen at that moment, including whatever was already there.
- Each pane of a [split layout](/documentation/help/howtos/split-panes-and-broadcast-input/) is recorded on its own, in its own file.

## Related Guides

- [Terminal State Bar](/documentation/terminal-state-bar/)
- [Check server logs from your iPhone](/documentation/guides/check-server-logs-iphone/)
- [Restart a server or service from your iPhone](/documentation/guides/restart-server-from-iphone/)
- [tmux on iPhone: sessions that survive disconnects](/documentation/guides/tmux-iphone-persistent-ssh-sessions/)

## Frequently Asked Questions

### Can I record an SSH session on iPhone or iPad?

Yes. Since WebSSH 31.4, tap the Recording item of the Terminal State Bar and choose Start Recording. The session is written to an asciinema .cast file that you can play in the app, share, or replay on a computer with the asciinema CLI. Recording is free.

### Does the recording include the commands I type?

Only as the server echoes them. WebSSH records the terminal output, never the keystrokes, so a password typed at a hidden prompt is not in the file. Anything printed on screen is, so review a recording before sharing it.

### Which format are WebSSH recordings in?

asciicast v3, the current asciinema format. Play it with asciinema CLI 3 or later, upload it to asciinema.org, or convert it to a GIF with agg. The file keeps the terminal size, the color theme, the resizes and the markers you added.

### Can WebSSH record every session automatically?

Yes. Set Auto Record to Enabled on a connection, or turn on Auto Recording in Settings, Advanced Settings, SSH, Recordings, for every connection. Recordings older than 30 days are deleted by default; change or disable that in the same settings group.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can I record an SSH session on iPhone or iPad?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Since WebSSH 31.4, tap the Recording item of the Terminal State Bar and choose Start Recording. The session is written to an asciinema .cast file that you can play in the app, share, or replay on a computer with the asciinema CLI. Recording is free."
      }
    },
    {
      "@type": "Question",
      "name": "Does the recording include the commands I type?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Only as the server echoes them. WebSSH records the terminal output, never the keystrokes, so a password typed at a hidden prompt is not in the file. Anything printed on screen is, so review a recording before sharing it."
      }
    },
    {
      "@type": "Question",
      "name": "Which format are WebSSH recordings in?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "asciicast v3, the current asciinema format. Play it with asciinema CLI 3 or later, upload it to asciinema.org, or convert it to a GIF with agg. The file keeps the terminal size, the color theme, the resizes and the markers you added."
      }
    },
    {
      "@type": "Question",
      "name": "Can WebSSH record every session automatically?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Set Auto Record to Enabled on a connection, or turn on Auto Recording in Settings, Advanced Settings, SSH, Recordings, for every connection. Recordings older than 30 days are deleted by default; change or disable that in the same settings group."
      }
    }
  ]
}
</script>
