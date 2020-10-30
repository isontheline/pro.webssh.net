---
title: Older versions
---
# Older versions
## Version 14.4 (17 september 2020)
- Fix Tab Bar UI Bug (issue #20) on devices without home button
- Fix Keyboard: button with three dots incomprehensible command (issue #45)
- Fix Ssh terminal repeats bugs (issue #36)

## Version 14.3 (6 september 2020)
- Fix "plus" button submenu hidden (issue #53)

## Version 14.2 (31 august 2020)
- Fix translation (issue #50)
- In App Rating (issue #49)
- Code cleanup : Delete unused source code (issue #29)

## Version 14.1 (18 august 2020)
- Fixing "Face ID login crash (issue #34)
- Tunnel : Red dot doesn't go to gray when disconnected (issue #27)
- Fixing Web Tunneling crash (issue #41)
- Whois now works again (issue #19)


## Version 14.0 (4 august 2020)
- Support for ECDSA and ED25519 (issue #5)
- Fixing white terminal (issue #17)
- Fixing tunnel crash (issue #18)
- Fixing no colors on terminal (issue #24)

## Version 13.16 (31 jully 2020)
- Support for newer devices

## Version 13.15 (23 january 2018)
- Added : Ability to add ctrl-key inside macros
- Fixed : Crashes for some users on connection's list

## Version 13.14 (21 october 2017)
- Fixed : MD5 fingerprint should now work inside SFTP navigator
- Fixed : Dynamic Port Forwarding can now be used with /etc/hosts entries

## Version 13.13 (22 september 2017)
- Added : Dynamic Port Forwarding (Host Bastion). WooHoo!
- Changed : SSH read buffer improvement.
- Changed : SSH read buffer is now 8Ko instead of 1Ko. This value can now be customized by you!
- Changed : Little improvements about text selection
- Removed : No more "Would you like to paste this content?" when pasting on terminal
- Changed : Improving size scaling when launching the terminal
- Changed : HTERM wrapper has been updated in order to have better support of columns and rows resizing

## Version 13.12 (Not released)
- Added : Badge to alert when a new WebSSH Weekly Digest is available
- Fixed : UDP port knocking should work now ;)

## Version 13.11 (Not released)
- Changed : Settings button is now on navigation bar again
- Fixed : Crashes for some users on connection's list

## Version 13.10 (15 jully 2017)
- Changed : Add and Settings buttons have been moved inside "+" blue button because we will add new mysterious features ;oD
- Added : Ability to hide special keys over the keyboard (useful with external keyboard). You will find this option inside WebSSH settings panel.
- Added : Ability to manage macros offline (inside connection's settings)
- Fixed : Web browser login/password can now be used even when no /etc/hosts file entry defined
- Removed : 2FA settings inside SFTP. 2FA has never worked for SFTP :(
- Removed : Annoying message "Want to be notified for connection timeout?"
- Fixed : Ability to set a password without only digits
- Fixed : Font size is now saved when increased or decreased on terminal view
- Fixed : Ability to dismiss keyboard while searching a connection (Thanks to Alex)
- Fixed : Ability to ping to an entry of /etc/hosts

## Version 13.9 (28 june 2017)
- Added : A web browser is now implemented inside WebSSH. Useful with Port Forwarding ;)
- Added : Ability to edit /etc/hosts (only in WebSSH app of course :)

## Version 13.8 (16 june 2017)
- Added : Support of Port Forwarding (Remote)

## Version 13.7 (13 january 2017)
- Added : iOS 7 support
- Changed : French language sentences
- Fixed : Language switch
- Added : You can now launch a command at connection startup
- Added : You can now assign a command to a specific connection
- Fixed : Saved commands menu is now kept open until you close it
- Fixed : SFTP screen to add a file or directory is now rotation compatible on iPad retina

## Version 13.6 (7 january 2017)
- Changed : Support for IPv6 have been improved
- Changed : Removing useless top line above iPad keyboard
- Changed : Improving speed access for preferences data

## Version 13.5 (22 december 2016)
- Touch ID issue fixed
- "Select" screen issue fixed
- IPv6 support

## Version 13.2 (10 december 2015)
- Added : Ability to specify wait time between knocks. eg : 22:tcp:1000 => We will knock on port 22 by using tcp procotol and we will wait 1000ms
- Fixed : Adding current folder to SFTP favorites didn't save the folder

## Version 13.1 (30 november 2015)
- Fixed : Bad label on "OK" button for applying a WebSSH general password

## Version 13.0 (20 november 2015)
- Added : Port Knocking
- Fixed : Crash for some input dialogs

## Version 12.1 (11 november 2015)
- Fixed : crash at startup for some users

## Version 12.0 (2 november 2015)
- Fixed : High hard disk usage due to Helpshift SDK Libary logs
- Fixed : Crash due to memory pressure of the Helpshift SDK Library
- Added : Ctrl-[ and Ctrl-] keys are now mapped on external keyboard
- Fixed : Slow connection to SSH servers
- Fixed : White screen below terminal
- Changed : Crash reporting library has been updated
- Changed : Black icon is back
- Changed : SFTP screens popup are now iOS 9 "look compliant"

## Version 11.0 (21 october 2015)
- Added : Simple Web Browser : you can now surf inside WebSSH, this will allow you to don't stop any opened connections
- Fixed : Bad screen size since beta release [2015-10-05]
- Fixed : Prompt deadlock
- Fixed : Boot time improved
- Added : Be warned for a disconnection while you are using another app. You will be warned 30 seconds before the disconnection. You must allow local notifications (WebSSH Settings) and you must enable background tasks for this feature to work.
- Added : Ability to retrieve your public IP address
- Fixed : Keyboard activation after reconnection

## Version 10.0 (1 october 2015)
- Fixed : Long press touch on the terminal fixed
- Changed : WebSSH app icon
- Changed : iOS 9.0 is now required : WebSSH Original for iOS < 9 can be purchased on the app store
- Changed : OpenSSH has been upgraded : If you can't connect to one of your server please download WebSSH Original from the App Store
- Fixed : Popup menu in the terminal window which doesn't open properly

## Version 9.2 (21 september 2015)
- Fixed : iOS 5 crash at startup
- Fixed : Crash on the server list if host can not be reached (is server up?)

## Version 9.1 (4 september 2015)
- Changed : Due to ARM 64 crashes while resizing font with fingers, font size can now be increased/decreased with a new menu inside the terminal window
- Fixed : Host fingerprint is now based on host + port instead of only host
- Fixed : OpenSSH library has been downgraded (as WebSSH 8.4) in order to support more SSH servers than WebSSH 8.5

## Version 9.0 (5 august 2015)
- Added : Ability to clone a connection
- Added : Paste button over the terminal (like exit, fullscreen...)
- Changed : New SFTP files icons
- Fixed : Connections are now sorted by their names
- Added : Host status (provided by BeRoot services)
- Added : PING : Ability to WHOIS an IP from ping results
- Fixed : WHOIS : To single out one record, look it up with "=xxx" to receive a full display for this record only.
- Fixed : WHOIS IPV4
- Added : Fn keys support from hardware keyboard
- Fixed : You won't be asked for the type of connection to launch again
- Fixed : Appirater won't be launched when app go to foreground again : it will only be launched at app startup if needed

## Version 8.5 (28 jully 2015)
- Added : Checking Host Key Fingerprint in order to avoid Man-In-The-Middle attack

## Version 8.4 (4 jully 2015)
- Added : ARM 64 support
- Removed : Ads on Essential release
- Changed : 1 max connection and 1 max macro on Essential release
- Fixed : crash while requesting md5 on a file

## Version 8.3 (9 april 2015)
- Fixed : crash at startup on iOS 5 (Pro release)
- Fixed : drop support of iOS 5 (Essential release)
- Fixed : unable to connect to a server if a bad passphrase has been provided to decrypt the private key
- Fixed : crash at startup on iOS 5
- Fixed : can't unlock the app if an active SSH session is running. Thanks to B. MORRISON

## Version 8.2 (31 march 2015)
- Fixed : keyboard can not be fired up when reconnecting on the same terminal

## Version 8.1 (19 march 2015)
- Added : copy paste support (iOS >= 7)
- Fixed : crash at startup on iOS 5

## Version 8.0.4 (9 march 2015)
- Fixed : navigation bar is hidden after editing saved connections
- Fixed : crash at startup on iOS < 7
- Fixed : crash while deleting a connection
- Added : password is now requested if authentication by private key and private key is encrypted
- Fixed : Facebook social icon blank page. Thanks to @cladxxx

## Version 8.0.3 (28 february 2015)
- Added : Two Factor Authentication (Google Authenticator for example) [https://www.webssh.net/blog/two-factor-authentication.html]
- Added : ability to disable Touch ID for legal issue. Thanks to Fergus!
- Fixed : crash when returning to the app with the following conditions : Pin Code / Touch ID is enabled and a modal window is displayed (like terminal type for example). Thanks to Icebird!

## Version 8.0.2 (7 february 2015)
- New : Touch ID is now available (to enable it, make sure that you have set a WebSSH password)
- Fixed : WebSSH is crashing while launching 8.0.1 (after an upgrade from previous version)
- Fixed : WHOIS for DENIC domain names (test.de, ...)
- Fixed : WHOIS crash when domain contains UTF-8 symbols
- Fixed : crash when editing a connection
- Fixed : IDN support for Ping and Whois
- Version 8.0.1 (26 january 2015)
- Fixed : WebSSH is crashing while launching 8.0 (after an upgrade from previous version)

## Version 8.0 (10 january 2015)
- WebSSH Sync & Backup
- Polish language
- Swedish language
- Bug fixes
- TouchID support
- Two Factor Authentication
- Local backup
- WHOIS IP
- Command to launch when connection established

## Version 7.2 (30 october 2014)
- Danish translation
- Brazilian Portuguese translation
- Bug fixes

## Version 7.1 (17 october 2014)
-iphone 6 / iPhone 6 Plus support
- Bug fixes

## Version 7.0 (28 september 2014)
- Terminal is now powered by chromium-hterm project
- New multiple screens layout
- Saved Commands
- New Keyboard Layout for SSH Terminal
- You can now import your Private Keys from iTunes. Supported files are : id_rsa / id_dsa / identity / *.ppk
- New Virtual Arrow Keys : Stick / Pad
- SSH Terminal Fullscreen Support
- XTERM 256 COLOR Support
- Bug fix : crash when pinging with high latency network
- Bug fix : crash with additional keys over keyboard
- Bug fix : crash with SFTP text editor

## Version 6.1 (16 jully 2014)
- Bug fixes

## Version 6.0 (8 jully 2014)
- File type appears in SFTP file permissions
- Ability to set backspace sequence for SSH connection
- SSH keyboard keys added : $, *, Home, End, PGUP, PGDN
- Now you can send crash report to our support if WebSSH crashes
- Added bel vibration (sound for iPad)
- Korean language
- Simplified Chinese language
- Italian language
- German language
- Fixed bug preventing private key association for new connection
- New layout for saved connections
- XTERM is now the default SSH terminal type
- Improved XTERM support
- Bug Fix #80 : Changing screen for multiple SSH Terminals disables typing via bluetooth keyboard
- Feature #97 : New HMAC support : hmac-sha2-512,hmac-sha2-256,hmac-ripemd160

## Version 5.0 (25 december 2013)
- You can now open multiple connections by swiping navigation bar
- New navigation bar color
- Fixed a bug preventing the removal of connections
- Ability to delete a connection from its form
- Added device awake functionality (from settings)
- Updated Home Menu
- Added a cancel button on WebSSH password creation
- Ability to reconnect to a closed SSH connection
- Added "Group name" field in connections in order to group connections
- SSH "Tab" button is now the first
- SSH Terminal Type is now "VT100" by default
- SFTP scroll is now faster
- SSH keyboard keys customization
- Added SSH function keys (F1...F12)

## Version 4.0 (21 october 2013)
- Support for Bluetooth keyboards (iOS 7)
- Fixed a bug that prevented the use of the main menu

## Version 3.0 (20 september 2013)
- New renderer SSH terminal
- Edit text files (SFTP)

## Version 2.3.2 (11 september 2013)
- Fix bug for users which can not access "Saved Connections"

## Version 2.3.1 (27 june 2013)
- Saving commands
- Launch script at startup
- SFTP text file editing

## Version 2.3 (10 june 2013)
- Terminal profil colors and font size
- Copy & Paste feature
- Zoom feature
- Establish connections from Private RSA/DSA keys

## Version 2.1 (20 march 2013)
- Russian translation
- Spanish Translation
- New interface
- The version shown in "About"
- Resizing the terminal after a rotation
- The authentication password is not running on iPad
- Crash when a host is unreachable
- Crash while rotating on iOS 5.x

## Version 2.0 (20 february 2013)
- New interface faster and more ergonomic
- Ability to protect the application at opening with a password
- The Up, Down, Left and Right keys work again in "vi"

## Version 1.9 (2 october 2012)
- Added Ctrl key
- Compatibility for iOS 6
- Compatibility for iPhone 5

## Version 1.8 (11 september 2012)
- Bug correction of "Next"/"Previous" keyboard keys in contact form

## Version 1.7 (30 august 2012)
- Bug correction of in app purchase "Save passwords"

## Version 1.6 (8 august 2012)
- Added keys Up, Down, Right and Left

## Version 1.5 (14 jully 2012)
- Adding keyboard keys Esc and Tab

## Version 1.4 (16 june 2012)
- Bugs fixes

## Version 1.3 (4 june 2012)
- Improved latency during keyboard strikes
- Fixed bug display characters
- Use of white on black theme for the console

## Version 1.2 (27 april 2012)
- Ability to establish an SSH connection even on a LAN
- You can bypass saving the password, then password will be prompted when connecting
- A disconnect icon
- Bug fixes for iOS 5.1

## Version 1.1 (19 march 2012)
- Fixed automatic capitalization in the forms
- Checking the hostname before logging

## Version 1.0 (8 march 2012)
- Initial version