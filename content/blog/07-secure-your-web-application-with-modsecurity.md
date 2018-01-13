+++
date = "2017-05-12T19:25:15+07:00"
title = "Secure your Web Application with ModSecurity"
feature_image_v_adjust = 60
feature_image = "logo/modsecurity.png"
keywords = ["viisix", "viisix nghia mod security", "mod security firewall", "waf", "firewall", "owasp"]
summary = "ModSecurity is an open source Web Application Firewall run as a module of your web server like Apache2 or Nginx. It provides you the ability to inspect web trafic according predefined rules, also with the options to monitor and control the trafic. The best thing is its lightness and plugable ability give you a good beginning to secure your system."
author = "Nghia Tr. Nguyen"

+++
[ModSecurity](http://modsecurity.org/) is an open source Web Application Firewall run as a module of your web server like Apache2 or Nginx. It provides you the ability to inspect web trafic according predefined rules, also with the options to monitor and control the trafic. The best thing is its lightness and plugable ability give you a good beginning to secure your system.

{{< figure alt="ModSecurity's logo" src="/logo/modsecurity.png" >}}

Install ModSecurity
-------------------

Firstly, install the necessary packages. I did not install ModSecurity's Debian binary package since it is having 
problem parsing JSON requests, probably because it does not work with YAJL library. So I went with the compiling
source code option.

```bash
$ sudo apt-get update
$ sudo apt-get install apache2-dev libapr1-dev libxml2-dev libexpat1-dev libpcre3-dev libyajl-dev libcurl4-gnutls-dev pkg-config lua5.1-dev
```

Create a folder to store the source code and start downloading it.

```bash
$ sudo mkdir -p /usr/share/modsecurity
$ sudo chown `whoami` /usr/share/modsecurity
$ cd /usr/share/modsecurity
$ wget https://www.modsecurity.org/tarball/2.9.1/modsecurity-2.9.1.tar.gz
```

You may want to verify the downloaded file.

```bash
$ wget https://www.modsecurity.org/tarball/2.9.1/modsecurity-2.9.1.tar.gz.sha256
$ sha256sum --check modsecurity-2.9.1.tar.gz.sha256
```

Extract the tarball archive file and start compiling ModSecurity. After finished, execute `make install`
to install the module.

```bash
$ tar zvfx modsecurity-2.9.1.tar.gz
$ cd /usr/src/modsecurity/modsecurity-2.9.1
$ ./configure --with-apxs=/usr/bin/apxs2 \
    --with-apr=/usr/bin/apr-config \
    --with-pcre=/usr/bin/pcre-config \
    --with-curl=/usr/bin/curl-config \
    --with-yajl=/usr/include/yajl \
    --with-lua=/usr/include/lua \
    --enable-pcre-jit \
    --enable-lua-cache
$ make
$ make install
```

*Note that ModSecurity will be installed at `/usr/local/modsecurity`.*

Now create some directories for later usages

```bash
$ sudo mkdir -p /var/cache/modsecurity
$ sudo mkdir -p /etc/modsecurity
```

Create configuration files
-------------------------- 

I decided to follow the Debian's Apache2 configuration structure, so that I created configuration files 
to be used with `a2enmod` command. First create `/etc/apache2/mods-available/security2.load` file

```text
# Depends: unique_id
LoadFile libxml2.so
LoadFile liblua5.1.so
LoadModule security2_module /usr/local/modsecurity/lib/mod_security2.so
```

Create a `/etc/apache2/mods-available/security2.conf` with following content

```text
<IfModule security2_module>
    # Include all .conf file in /etc/modsecurity.
    IncludeOptional /etc/modsecurity/main.conf
</IfModule>
```

Enable ModSecurity and reload the web service

```bash
$ sudo a2enmod security2
$ sudo service apache2 restart
```

Finally, check the `error.log` to see if ModSecurity is loaded so that you could see line like this

```text
ModSecurity for Apache/2.9.1 (http://www.modsecurity.org/) configured.
```

Install the [OWASP's Core Rule Set (CRS)](https://modsecurity.org/crs/)
-----------------------------------------------------------------------

The OWASP CRS is a set of attack detection rules. It's free and distributed under Apache Software License. 
To install the rule set, you should have `git` installed.

Go to the ModSecurity configuration directory, download the recommended configs and clone the OWASP's CRS

```bash
$ cd /etc/modsecurity
$ wget https://raw.githubusercontent.com/SpiderLabs/ModSecurity/master/modsecurity.conf-recommended
$ mv modsecurity.conf-recommended modsecurity.conf
$ wget https://raw.githubusercontent.com/SpiderLabs/ModSecurity/master/unicode.mapping
$ mkdir owasp-crs && cd owasp-crs
$ git clone https://github.com/SpiderLabs/owasp-modsecurity-crs .
$ cp crs-setup.conf.example crs-setup.conf
```

Create a new file `/etc/modsecurity/main.conf` having following lines:

```text
Include /etc/modsecurity/modsecurity.conf
Include /etc/modsecurity/owasp-crs/crs-setup.conf
Include /etc/modsecurity/owasp-crs/rules/*.conf
```

Replace this line in `/etc/modsecurity/modsecurity.conf`

```text
SecDataDir /tmp/
```

with

```text
SecDataDir /var/cache/modsecurity
```

You may want to look deeper into `/etc/modsecurity/modsecurity.conf` 
and `Include /etc/modsecurity/owasp-crs/crs-setup.conf` and make you changes. 
For example, changing the log location to `/var/log/apache2/modsec_audit.log`
by changing the value of `SecAuditLog` in `modsecurity.conf` file.

You also may want to run configuration test first, 
because Apache2 prior to v2.4.11 has problem parsing lines ending with `\`. 
For example, with this

```text
AH00526: Syntax error on line 36 of /etc/modsecurity/owasp-crs/rules/RESPONSE-950-DATA-LEAKAGES.conf:
Error parsing actions: Unknown action: \\
Action 'configtest' failed.
```

the solution is to add a space between `,` and `\` at the mentioned location.

Restart Apache2 and test.

Test XSS attack detection
-------------------------

Open your browser and try some basic of XSS attack to see if ModSecurity is worked or not.

For example: 
```text
https://viisix.space/?param=%22%3E%3Cscript%3Ealert(1);%3C/script%3E
```

Checking the audit log give me this result:

```text
Total Inbound Score: 15 - SQLI=0,XSS=15,RFI=0,LFI=0,RCE=0,PHPI=0,HTTP=0,SESS=0
```

Now let's edit `/etc/modsecurity/modsecurity.conf`, change `SecRuleEngine`'s value to `On`,
restart Apache2 and see the result with the same url before.

You can see that the request is denied by ModSecurity.

{{< figure alt="ModSecurity's Enable mode - Request denied" src="/blog-images/secure-your-web-application-with-modsecurity/ModSecurity_RequestDenied.png" >}}

Now, explore more and test other type of attack, or go and check if your site is still fully function or not? :D
