---
title: Open files with WebSSH (Text Editor & Hex Viewer)
seo_title: "Open .txt and Text Files with WebSSH on iPhone, iPad and Mac - WebSSH"
description: "Open text, JSON, XML and YAML files straight in the WebSSH Text Editor from the Files app or the Finder, set WebSSH as the default app for .txt files, and fall back to the Hex Viewer for binaries."
---
# Open files with WebSSH (Text Editor & Hex Viewer)
Since WebSSH 33.1[^1], a file opened with WebSSH from the Files app (iPhone / iPad) or the Finder (Mac) goes straight to the right tool:

* **Text files** open directly in the **Text Editor**, no question asked: `.txt`, `.log`, `.md`, source code, shell scripts, `.json`, `.xml`, `.yaml`...
* **Any other file** (binary, or without extension) shows a chooser: **Text Editor** or **Hex Viewer**.

## Open a file with WebSSH
=== "iPhone / iPad"
    1. In the Files app, long press the file
    2. Tap **Open With…**[^2] (or **Share**) and choose **WebSSH**

=== "Mac"
    1. In the Finder, right click the file
    2. Choose **Open With** > **WebSSH**

    Files you opened this way are also listed in **File** > **Open Recent**.

## Make WebSSH the default app for .txt files
On iOS 26 / iPadOS 26, the Files app lets you pick a default app per file type:

1. In the Files app, long press a `.txt` file
2. Tap **Open With…**
3. Choose **WebSSH** and enable **Always Open With**

From now on, a simple tap on any `.txt` file opens it in the WebSSH Text Editor. The same works for the other text types WebSSH registers as a default handler: plain text (`.txt`, `.log`, `.md`, source code, scripts), JSON, XML and YAML.

??? info "Other file types"
    For every other type (images, archives, binaries...), WebSSH still appears in **Open With** so you can inspect the file in the Hex Viewer, but it never offers to become the default app: your usual apps keep their place.

## Not a text file after all?
When a file opened in the Text Editor turns out not to be text (a binary renamed `.txt`, for instance), WebSSH tells you and offers **Open in Hex Viewer**: the same file opens in the Hex Viewer, in place of the editor.

## Prefer to choose every time?
Go to **WebSSH** > **Settings** > **Advanced Settings** > **Open With WebSSH (Files)** and select **Always ask**: the Text Editor / Hex Viewer chooser is back for every file, text included.

[^1]: Requires WebSSH 33.1 or later.
[^2]: The **Open With…** menu and the **Always Open With** option require iOS 26 / iPadOS 26. On earlier versions, use **Share** > **WebSSH**.
