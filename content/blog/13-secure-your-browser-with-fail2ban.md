+++
author = "Nghia Tr. Nguyen"
summary = "Fail2ban is an opensource IDS written in Python. It protects your server from brute force attacks by scanning log files and updating iptables' rules."
keywords = ["viisix", "viisix nghia fail2ban", "security", "ids", "fail2ban krb5kdc", "fail2ban kerberos"]
feature_image = "logo/fail2ban.png"
feature_image_v_adjust = 5
date = "2017-11-21T16:29:39+07:00"
title = "Secure Your Browser With Fail2ban" 

+++
This guide will show you how to install fail2ban in Debian and custom Fail2ban rules set to protect your services.

### Installation

We will install Fail2ban via `apt-get`, it will automatic install related packages and setup suitable `iptables` rules.

```bash
$ sudo apt-get update
$ sudo apt-get install fail2ban
```

Create a custom config file to set up the local policy for Fail2ban.

```bash
$ cd /etc/fail2ban
$ sudo cp jail.conf jail.local
```

Modified `jail.local` file. Below is an example:
```
[DEFAULT]
ignoreip = 127.0.0.1/8
bantime = 1800
maxretry = 6

# Set the email for getting alerts about attacks
destemail = root@localhost

# Set up rule for sshd service
[sshd]
enabled = true
port    = 22
logpath = %(sshd_log)s
backend = %(sshd_backend)s
```

Restart the `fail2ban` service
```bash
$ sudo service fail2ban restart
```

Check the `iptables` to see if fail2ban worked.
```bash
$ sudo iptables -S
# or
$ sudo iptables -L -v
```

### Make Fail2ban works with Kerberos-KDC service

Since Fail2ban works based on services' log file so we need to make `krb5kdc` writing its log into a file, for example, `/var/log/krb5kdc.log`. You can use the default `messages` file but I do prefer to have a seperate log file.

Create new filter on `/etc/fail2ban/filter.d/krb5kdc.conf`:

```
[INCLUDES]

before = common.conf

[Definition]

_daemon = krb5kdc

failregex = AS_REQ \([\w\s{}]+\) <HOST>: (PREAUTH_FAILED|CLIENT_NOT_FOUND):

ignoreregex =

[Init]

# "maxlines" is number of log lines to buffer for multi-line regex searches
maxlines = 10

journalmatch = _SYSTEMD_UNIT=krb5-kdc.service + _COMM=krb5-kdc
```

In `jail.local`, create a new section for `krb5kdc`:

```
[krb5kdc]
enabled  = true
port     = 88
protocol = udp
logpath  = /var/log/krb5kdc.log
filter   = krb5kdc
```

That's it ~ Now restart the `fail2ban` service to see the result.

Have fun securing your other service, but don't lock you out forever.
