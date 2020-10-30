---
title: Port Knocking
---
# Port Knocking
!!! info "About Port Knocking feature"
    Behind this :sparkles: "magical" name, [Port Knocking](https://en.wikipedia.org/wiki/Port_knocking) is "a method of externally opening ports on a firewall by generating a connection attempt on a set of prespecified closed ports".

## How to use it?
1. Add a connexion (either SSH, SFTP or TUNNEL) by pessing the **+** button
2. Fill all required fields in order to establish the SSH connection
3. Finally specify your port knocking sequence by using the right syntax

!!! tip "Port Knocking Sequence Syntax"
    The Port Knocking Sequence Syntax is as simple as : **PROTOCOL:PORT:WAITMS**

    1. Fields **PROTOCOL** and **PORT** are mandatory. Field **WAITMS** is optional.
    2. Field **PROTOCOL** can have these values : **TCP** or **UDP**
    3. Field **PORT** must be an integer between **1** and **65535**
    4. Field **WAITMS** is an integer to specify the sleep in milliseconds to apply after a port knock. Default is **100** if not specified.
    5. To add multiple knocks to the sequence, just add a comma between knocks

!!! abstract "Port Knocking Examples"
    * **TCP:1985** will knock your server on the TCP port 1985
    * **TCP:1985,TCP:2020** will knock your server on TCP port 1985 then 2020 (with a default sleep of 100ms)
    * **TCP:1984:200,UDP:1985:300,TCP:2014:200,UDP:2016:500** will knock on TCP port 1984 and will sleep 200 ms, then will knock on UDP port 1985 and will sleep 300 ms, then will knock on TCP port 2014 and will sleep 200 ms, then will knock on UDP port 2016 and will sleep 500 ms.