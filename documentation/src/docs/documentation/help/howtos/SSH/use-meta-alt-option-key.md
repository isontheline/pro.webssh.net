---
title: Meta / Alt / Option
---

# Meta / Alt / Option
## How to use the dedicated ALT key[^2] on the virtual keyboard?
1. Add the `{ALT}` token to your [Keyboard Accessory View Layout](/documentation/help/howtos/SSH/customise-keyboard-accessory-view-layout/), e.g. :
```
#!KeyboardAccessoryViewLayout {ESC}{TAB}{CTL}{ALT}{FN}{ARROWS}{PJUMP}{INS}{PGUP}{PGDN}{HOME}{END}{HELP}
```
2. Launch a SSH connection
3. Tap the "Alt" key : it is now toggled
4. Press a key character (or an arrow key) in order to send the wanted escape sequence

## How to use the Meta / Alt / Option key[^1] on the virtual keyboard?
1. Launch a SSH connection
2. Long press the "Esc" key on the virtual keyboard
3. Choose the "Alt" key
4. As the "Alt" key is now toggled you can now press a key character in order to send the wanted escape sequence

## How to choose the ALT + Arrow keys encoding[^2]?
By default, ALT + ◄ / ► send the readline words motion sequences (`ESC b` / `ESC f`) and ALT + ▲ / ▼ send the `ESC` prefixed arrow sequences.

If you are using a program that expects the standard xterm modifier sequences (`\e[1;3A-D`) — like Zellij, tmux or byobu — add the following to your [SSH Config File](/documentation/help/SSH/ssh-config-file/) :
```
#!AltArrowKeysMode csi
```
This setting applies to both the virtual keyboard arrow keys and a physical keyboard.

## How to use it[^1] on a physical keyboard?
1. Launch a SSH connection
2. Press "Control" AND "Option" keys AND press a key character in order to send the wanted escape sequence

[^1]: In order to use this functionality, you must upgrade WebSSH to 16.2
[^2]: In order to use this functionality, you must upgrade WebSSH to 32.4