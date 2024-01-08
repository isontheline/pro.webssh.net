---
title: Support
---

# Support

??? example "24 - Dragon :dragon_face: - Major Release Breaking Change"
    ** [#202 : Unified server list for SSH and SFTP](https://github.com/isontheline/pro.webssh.net/issues/202) **
    
    SSH and SFTP connections are now unified in the same "SERVERS" list. This means that you can now add a new server and use it for both SSH and SFTP connections. This breaking change have some drawbacks though :
    
    * If you choose both SSH and SFTP roles on your servers then devices older than iOS 16 won't be able to show them. Workaround : choose only one role per server.
    * You can have many duplicates in the "All" list as both SSH and SFTP connections are now unified. You can use ["webssh servedit"](/documentation/help/howtos/mashREPL/servedit/) command line inside mashREPL in order to remove the unwanted ones.
    * It is strongly advised to [backup your data](/documentation/help/howtos/mashREPL/database-backup/) before doing any change to your data.

??? warning "24.6 - Revalidation of all host keys"
    WebSSH now uses ED25519 - when available - to validate host keys. This means that you will have to revalidate all your host keys. Sorry for the inconvenience.

!!! abstract "All the help you need when you need it"
    ![isontheline maintainer of WebSSH](https://avatars.githubusercontent.com/u/44212923?v=4){ align=left width=130 }

    Hey there :wave: I'm [isontheline](https://github.com/isontheline) maintainer of WebSSH, the awesome iOS / macOS SSH, SFTP and Port Forwarding client that you use everyday!

    Whenever you need to make a [bug report](https://github.com/isontheline/pro.webssh.net/issues/new?assignees=&labels=&template=bug_report.md&title=), or want to share an [idea](https://github.com/isontheline/pro.webssh.net/discussions?discussions_q=category%3AIdeas) for a new feature, or just have a [question](https://github.com/isontheline/pro.webssh.net/discussions?discussions_q=category%3AQ%26A) about how to use WebSSH, I'm never very far : feel free to contact me by [email](mailto:team@webssh.net) or on [GitHub](https://github.com/isontheline/pro.webssh.net/discussions) <img src="https://github.githubassets.com/images/icons/emoji/octocat.png" width="20" height="20" align="top" />

    Have a nice day :sunny:

!!! bug "24 - Dragon :dragon_face:"
    If you encounter any catastrophic bug :bug:, it's time to submit a [bug report](https://github.com/isontheline/pro.webssh.net/issues/new?assignees=&labels=&template=bug_report.md&title=) for the upcoming milestone.
    You can also learn about features [added / changed / removed](/documentation/changelog/24/) inside the next version of WebSSH.
    Of course you can [Enroll to Beta Releases](/documentation/becoming-external-tester/) in order to reach the stars :sparkles: