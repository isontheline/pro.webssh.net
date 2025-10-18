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

??? info "iPhone Default Layout"
    The default iPhone layout is the following :
    ```
    {ESC}{TAB}{CTL}{FN}{ARROWS}[/][:][-][|]{PJUMP}{INS}{PGUP}{PGDN}{HOME}{END}[!][*][$]{HELP}
    ```

    If VoiceOver is enabled, the default iPhone layout will be :
    ```
    {ESC}{TAB}{CTL}{LEFT}{UP}{DOWN}{RIGHT}[/][|]{PJUMP}[:][-]{FN}{INS}{PGUP}{PGDN}{HOME}{END}{HELP}
    ```

??? info "iPad Default Layout"
    The default iPad layout is the following :
    ```
    {ESC}{TAB}{CTL}{FN}[/][*]{ARROWS}[|][:][-][!]{PJUMP}{INS}{PGUP}{PGDN}{HOME}{END}[$][.][`]{HELP}
    ```

    If VoiceOver is enabled, the default iPad layout will be :
    ```
    {ESC}{TAB}{CTL}{FN}[/]{LEFT}{UP}{DOWN}{RIGHT}[|][-]{PJUMP}[*][:][!][$][.]{INS}{PGUP}{PGDN}{HOME}{END}{HELP}
    ```

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

| Token            | Description                                                      | Required Version |
|------------------|------------------------------------------------------------------|------------------|
| {ARROWS}         | The all-in-one four arrows key                                   | 23.0             |
| {BRACKETS}       | All brackets options on same key                                 | 28.3             |
| {CTL}            | Control Key                                                      | 23.0             |
| {DEL}            | Delete Key                                                       | 23.0             |
| {DOWN}           | Down Arrow Key                                                   | 23.0             |
| {END}            | End Key                                                          | 23.0             |
| {ENTER}          | Enter Key                                                        | 28.3             |
| {ESC}            | Escape / Meta Key                                                | 23.0             |
| {FN}             | Display the function keys page                                   | 23.0             |
| {HELP}           | Help Key : Show this help page                                   | 23.0             |
| {HOME}           | Home Key                                                         | 23.0             |
| {INS}            | Insert Key                                                       | 23.0             |
| {LEFT}           | Left Arrow Key                                                   | 23.0             |
| {PASTE}          | Paste Key : Paste the clipboard content to the terminal          | 23.0             |
| {PASTE_PASSWORD} | Paste Password Key : Paste the current connection password       | 23.0             |
| {PGDN}           | Page Down Key                                                    | 23.0             |
| {PGUP}           | Page Up Key                                                      | 23.0             |
| {PJUMP}          | Page Jump : Add a new keys page to allow you to subdivide layout | 23.0             |
| {RIGHT}          | Right Arrow Key                                                  | 23.0             |
| {TAB}            | Tab Key                                                          | 23.0             |
| {TOGGLE_KEYBOARD}| Toggle Keyboard : Show / Hide the virtual keyboard               | 30.5             |
| {UP}             | Up Arrow Key                                                     | 23.0             |

[^1]: In order to use this functionality, you must upgrade to WebSSH 23.0.1138