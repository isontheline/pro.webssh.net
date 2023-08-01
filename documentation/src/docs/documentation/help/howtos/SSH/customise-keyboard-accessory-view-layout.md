---
title: Keyboard Accessory View Customisation
---

# How to customise the keyboard accessory view layout?[^1]

In order to customise the keyboard accessory view layout, you need to edit the [WebSSH SSH Config File](documentation/help/SSH/ssh-config-file/). In this file you can define a layout for the keyboard accessory view, on a per connection basis or globally. The configuration is done using the `#!KeyboardAccessoryViewLayout` keyword.

## Layout Syntax
Each key is defined by a token. 

A token can be :

* A Character Key
* A Special Key

A token can be repeated multiple times and there are no separator between tokens. You can add as many tokens as you want but it's your responsibility to ensure that the layout will fit on the screen width. "Page Jump" key is also available to add a new page.

Example (apply to all connections here) :

```bash
Host *
    #!KeyboardAccessoryView {ESC}{TAB}{CTL}{FN}[/][*]{ARROWS}[|][:][-][!]{PJUMP}{INS}{PGUP}{PGDN}{HOME}{END}[$][.]
```

## Character Keys
Character Keys are defined by the character itself surrounded by brackets : `[X]`

Just replace `X` by the character you want to add. It could be a letter, a number or a special character. No matter the case, only one character is allowed.

When you press a Character Key, the character will be sent to the terminal.

## Special Keys
Special Keys are defined by a token surrounded by braces : `{CMD}`

Just replace `CMD` by an allowed token. See below for the list of allowed tokens.

When you press a Special Key, the corresponding action will be executed.

### Allowed Special Keys Tokens

When you press a Special Key, the corresponding action will be executed.

| Token | Description |
| --- | --- |
| {ESC} | Escape / Meta Key |
| {TAB} | Tab Key |
| {CTL} | Control Key |
| {FN} | Display the function keys page |
| {ARROWS} | The all-in-one four arrows key |
| {PJUMP} | Page Jump : Add a new keys page to allow you to subdivide your layout |
| {INS} | Insert Key |
| {DEL} | Delete Key |
| {PGUP} | Page Up Key |
| {PGDN} | Page Down Key |
| {HOME} | Home Key |
| {END} | End Key |
| {UP} | Up Arrow Key |
| {DOWN} | Down Arrow Key |
| {LEFT} | Left Arrow Key |
| {RIGHT} | Right Arrow Key |
| {HELP} | Help Key : Show this help page |

[^1]: In order to use this functionality, you must upgrade WebSSH to 23