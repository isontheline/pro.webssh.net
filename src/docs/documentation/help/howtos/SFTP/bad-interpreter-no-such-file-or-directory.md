---
title: Bad interpreter / No such file or directory
---

# Bad interpreter / No such file or directory
Sometimes when you use WebSSH' SFTP to upload a shell script you may be facing an issue when launching it : 

*Bad interpreter / No such file or directory*

If so just use `dos2unix` command like this :

``` bash
dos2unix your_script.sh
```