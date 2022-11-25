---
title: Create or attach an existing tmux session
---

# Create or attach an existing tmux session
Sometimes connection could break (network changed / lost) and then your session work is "lost".

In order to avoid this trouble you can use tmux[^1] with the following parameters :
``` bash
tmux new -As "your_session_name"
```

You can replace `your_session_name` with any identifier you want.

!!! tip "Tip"
    Instead of typing this command every time you launch your connection, you can set a custom "Execute command" :

    1. Edit your connection
    2. Go to "Terminal Settings"
    3. Touch "Execute command"
    4. Choose "Custom"
    5. Fill the field with the above command
    6. Save your connection
    7. Launch your connection and enjoy :innocent:

[^1]: [tmux article on Wikipedia](https://en.wikipedia.org/wiki/Tmux)