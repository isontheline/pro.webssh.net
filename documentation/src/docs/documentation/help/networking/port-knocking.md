---
title: Port Knocking
---
# Port Knocking
!!! abstract "About Port Knocking feature"
    Behind this :sparkles: "magical" name, [Port Knocking](https://en.wikipedia.org/wiki/Port_knocking) is "a method of externally opening ports on a firewall by generating a connection attempt on a set of prespecified closed ports".

## How to use it inside WebSSH?
1. Add a connection (either SSH, SFTP or TUNNEL) by pessing the **+** button
2. Fill all required fields in order to establish the SSH connection
3. Finally specify your port knocking sequence by using the right syntax

!!! tip "Port Knocking Sequence Syntax"
    The Port Knocking Sequence Syntax is as simple as : **PORT:PROTOCOL:WAITMS**

    1. Fields **PORT** and **PROTOCOL** are mandatory. Field **WAITMS** is optional.
    2. Field **PORT** must be an integer between **1** and **65535**
    3. Field **PROTOCOL** can have these values : **TCP** or **UDP**
    4. Field **WAITMS** is an integer to specify the sleep in milliseconds to apply after a port knock. Default is **100** if not specified.
    5. To add multiple knocks to the sequence, just add a comma between knocks

!!! example "Port Knocking Examples"
    * **1985:TCP** will knock your server on the TCP port 1985
    * **1985:TCP,2020:TCP** will knock your server on TCP port 1985 then 2020 (with a default sleep of 100ms)
    * **1789:TCP:200,1985:UDP:300,1492:TCP:200,2005:UDP:500** will knock on TCP port 1789 and will sleep 200 ms, then will knock on UDP port 1985 and will sleep 300 ms, then will knock on TCP port 1492 and will sleep 200 ms, then will knock on UDP port 2005 and will sleep 500 ms.

## Examples of server side implementation by using knockd
### Debian / Ubuntu : /etc/knockd.conf
```
[options]
        UseSyslog

[SSH]
      sequence    = 1789,1985,1492,2005
      seq_timeout = 10
      command     = /sbin/iptables -I INPUT -s %IP% -p tcp --dport 22 -j ACCEPT
      tcpflags    = syn
      cmd_timeout   = 10
      stop_command  = /sbin/iptables -D INPUT -s %IP% -p tcp --dport 22 -j ACCEPT
```

* On this example, we use the **iptables** command to open the port **22** on the server after you have knocked the right sequence : **1789,1985,1492,2005**
* After the sequence is done, the port **22** is opened for **10** seconds and then closed again

### CentOS / RHEL / Fedora / AlmaLinux / RockyLinux : /etc/knockd.conf
```
[options]
        UseSyslog

[SSH]
      sequence      = 1789,1985,1492,2005
      seq_timeout   = 10
      start_command = /bin/firewall-cmd --zone=public --add-rich-rule 'rule family="ipv4" source address="%IP%" port protocol="tcp" port="22" accept'
      tcpflags      = syn
      cmd_timeout   = 10
      stop_command  = /bin/firewall-cmd --zone=public --remove-rich-rule 'rule family="ipv4" source address="%IP%" port protocol="tcp" port="22" accept'
```

* On this example, we use the **firewall-cmd** command to open the port **22** on the server after you have knocked the right sequence : **1789,1985,1492,2005**
* After the sequence is done, the port **22** is opened for **10** seconds and then closed again