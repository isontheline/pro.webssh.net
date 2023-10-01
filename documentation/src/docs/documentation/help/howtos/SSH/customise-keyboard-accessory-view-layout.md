---
title: Keyboard Accessory View Customisation
---

# How to customise the keyboard accessory view layout?[^1]

* In order to customise the keyboard accessory view layout, you need to edit the [WebSSH SSH Config File](/documentation/help/SSH/ssh-config-file/). 
* You can define a keyboard layout on a per connection basis or globally. 
* The configuration is done by using the `#!KeyboardAccessoryViewLayout` keyword.

??? tip "Customising the layout by idioms (iPhone / iPad)"
    Customising the layout by idioms is also available :
    
    * For iPhone use the keyword : `#!KeyboardAccessoryViewLayoutIdiomPhone`
    * For iPad use the keyword : `#!KeyboardAccessoryViewLayoutIdiomPad`
    * The layout defined by `#!KeyboardAccessoryViewLayout` will be used as a fallback if the layout for the current idiom is not defined.

## Layout Syntax
Each accessory keyboard key is defined by a **Token** and it can be one of the following :

* A Character Key Token
* A Special Key Token

A **token** can be repeated multiple times and there are no separator between tokens. You can add as many tokens as you want but it's your responsibility to ensure that the layout will fit on the screen width. "Page Jump" key token is also available to add a new page.

### Example 1 (apply to a specific connection named "MY_SERVER") :
```bash
Host MY_SERVER
    # We define a layout with some keys splited on two panels as we are using the "Page Jump" key token : {PJUMP}
    #!KeyboardAccessoryViewLayout {ESC}{TAB}{CTL}{FN}[/][*]{ARROWS}[|][:][-][!]{PJUMP}{INS}{PGUP}{PGDN}{HOME}{END}[$][.]
```

### Example 2 (apply to all connections here as we use the wildcard * character) :
```bash
Host *
    # We define a custom layout using plain directional keys instead of the all-in-one {ARROWS} key token :
    #!KeyboardAccessoryViewLayout {ESC}{TAB}{CTL}{FN}{LEFT}{UP}{DOWN}{RIGHT}[/][*]
```

## Character Keys
Character Keys are defined by the character itself surrounded by brackets : `[X]`

Just replace `X` by the character you want to add. It could be a letter, a number or a special character. No matter the case, only one character is allowed.

### Example
```bash
Host *
    # When you press a Character Key, it will be sent to the terminal :
    #!KeyboardAccessoryViewLayout [A][B][C][X][Y][Z]
```

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

[^1]: In order to use this functionality, you must upgrade to WebSSH 23.0.1138