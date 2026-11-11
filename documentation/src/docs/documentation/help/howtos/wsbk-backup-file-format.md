---
title: The .wsbk Backup File Format
seo_title: "The .wsbk File Format: Decrypt a WebSSH Database Backup Yourself - WebSSH"
description: "Specification of the .wsbk file written by WebSSH for its encrypted database backups: header layout, PBKDF2-HMAC-SHA256 key derivation, AES-256-GCM encryption, and the steps to get the SQLite database back with your own tools."
---

# The .wsbk backup file format[^1]
A `.wsbk` file is an [encrypted backup](automatic-database-backups.md) of the WebSSH database. The format is documented here on purpose: your backups are yours, and you should be able to open them without WebSSH, with the tools and the language you like, as long as you have the password.

A `.wsbk` file is **one SQLite database file, encrypted with AES-256-GCM, with a key derived from the password by PBKDF2-HMAC-SHA256**. Nothing else: no compression, no archive, no proprietary algorithm. Every cryptographic library has what is needed.

This page describes the format; it does not ship code.

## Layout
All integers are unsigned. The file is a header, the ciphertext, then the authentication tag.

| Offset | Size (bytes) | Field | Value |
| --- | --- | --- | --- |
| 0 | 4 | Magic | ASCII `WSBK` (`57 53 42 4B`) |
| 4 | 1 | Format version | `1` |
| 5 | 1 | Key derivation | `1` = PBKDF2-HMAC-SHA256 |
| 6 | 4 | Iterations | Big endian. WebSSH writes `600000` (`00 09 27 C0`) |
| 10 | 1 | Salt length `S` | WebSSH writes `16` |
| 11 | `S` | Salt | Random |
| 11 + `S` | 12 | Nonce | Random, the AES-GCM nonce (IV) |
| 23 + `S` | n | Ciphertext | Same length as the SQLite database |
| end − 16 | 16 | Tag | AES-GCM authentication tag |

With the 16-byte salt WebSSH writes, the header is **39 bytes** long, and a file is 55 bytes larger than the database it holds.

The **header** is everything before the ciphertext: bytes `0` to `22 + S` included.

## Password
The key derivation takes the password as bytes:

1. normalise the password to Unicode **NFC**,
2. encode it in **UTF-8**.

Nothing is trimmed or changed otherwise: case, spaces and punctuation all count. The password WebSSH generates looks like `K7QM-2XHD-9PWA-RT4E-B6NZ-LC3V`; its dashes are part of the password.

The password of a backup is the database password of the device at the time, shown in **Settings ▸ Maintenance ▸ Local Database ▸ Show Password**, or the password you typed for an **Export (Encrypted)** with another password.

## Key derivation
```
key = PBKDF2-HMAC-SHA256(password bytes, salt, iterations) → 32 bytes
```

The salt and the iteration count are read from the header. Always use the count found in the file, not a constant: a later version of WebSSH may write a higher one.

## Encryption
```
AES-256-GCM
  key                 the 32-byte key above
  nonce               the 12 bytes of the header
  additional data     the whole header, from the magic to the nonce included
  ciphertext          the bytes between the header and the tag
  tag                 the last 16 bytes of the file
```

The additional authenticated data is what makes the header tamper-proof: if a single bit of the file is changed, header included, the decryption fails. So does a wrong password. There is no other integrity check and no way to tell a wrong password from a damaged file.

## Decrypting a backup, step by step
1. Read the file. Check that it starts with `WSBK`, that the version is `1` and the key derivation is `1`.
2. Read the iteration count (4 bytes, big endian) and the salt length `S`, then the salt and the 12-byte nonce.
3. Keep the header aside: the first `23 + S` bytes.
4. Split the rest: the last 16 bytes are the tag, everything before is the ciphertext.
5. Derive the 32-byte key from the password with PBKDF2-HMAC-SHA256.
6. Decrypt with AES-256-GCM, giving the header as additional authenticated data and the tag for verification.
7. Write the result to a file: it is the SQLite database.

To check the result, look at its first 16 bytes: a SQLite database starts with the text `SQLite format 3` followed by a zero byte. It then opens in any SQLite tool.

!!! warning "The decrypted file is not protected"
    The SQLite database holds your connections and may hold passwords and private keys in clear. Do not leave decrypted copies around.

## What WebSSH accepts
When it restores a backup, WebSSH refuses a file whose iteration count is below `1000` or above `10000000`, whose salt is shorter than 8 or longer than 64 bytes, or whose version or key derivation it does not know. A file written by your own tools within these limits restores in WebSSH like one of its own: drop it in the **backups** folder with a name like `20261112_221406_webssh.wsbk` and it shows up in the list.

WebSSH recognises an encrypted backup by its magic, not by its extension.

## Test vector
A small file to check an implementation against. The iteration count is deliberately low; real backups use 600000.

| | |
| --- | --- |
| Password | `correct horse battery staple` |
| Iterations | `1000` |
| Salt | `000102030405060708090a0b0c0d0e0f` |
| Nonce | `a0a1a2a3a4a5a6a7a8a9aaab` |
| Plaintext (58 bytes) | `SQLite format 3`, a zero byte, then `WebSSH reference backup, format version 1.` |

The resulting 113-byte file, in hexadecimal:

```
5753424b0101000003e810000102030405060708090a0b0c0d0e0fa0a1a2a3a4
a5a6a7a8a9aaab858dffbb397e23d37fcddc816682287c2ef7194931e13eadde
f8ca52bc1a367ded91b9c034e50c27d35b3fd278190fdaa12725f76af82e656c
ab9c0f811addac50c96af85c9f99399306
```

The first 39 bytes are the header (up to `…a8a9aaab`), the last 16 are the tag (`9c0f811addac50c96af85c9f99399306`), and the 58 bytes in between are the ciphertext.

## Versions of the format
The version byte is `1`. Version 1 files will remain readable by every later version of WebSSH. If the format ever changes (another key derivation, another cipher), the version byte or the key derivation byte will change with it and this page will describe both.

[^1]: Available since WebSSH 33.4
