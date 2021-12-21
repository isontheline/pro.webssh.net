---
title: Scrollback buffer in tmux
---

# Scrollback buffer in tmux
When using tmux the scrollback buffer isn't managed by WebSSH' terminal but by tmux itself.

If you want to navigate through the scrollback buffer you need to enter copy mode. 
To do so you can use these keys :
`Ctrl-b` then `[`

!!! tip "Tip"
    Instead of pressing these keys every time you need to enter copy mode you can create a WebSSH' Snippet like this :

    * Name : `tmux copy mode`
    * Tags : `*`
    * Icon : Any icon you want :innocent:
    * Macro Prefered : `YES`
    * Snippet : `<ctrl-b>[`

    Now you will be able to enter copy mode by just pressing the choosen icon in the Snippets HUD menu :muscle: