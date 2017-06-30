+++
author = "Tu A. Nguyen"
date = "2017-06-26T16:28:33+07:00"
summary = "In this guide, I will show you how to create a Docker Swarm cluster using docker-machine and Oracle VirtualBox"
title = "Get your hand dirty with Docker Swarm - Part I"
keywords = ["viisix", "docker", "swarm"]
feature_image = ""
feature_image_v_adjust = 12.5

+++
# Installation

Oracle VirtualBox: Download and install the package [here](https://www.virtualbox.org/wiki/Downloads).

Docker Machine: there are 2 ways to install `docker-machine`:

- If you're using macOS or Windows, Docker Machine is installed along with [Docker binary](https://docs.docker.com/engine/installation/).
- If you want only Machine binaries, can find the latest versions on the [docker/machine release page](https://github.com/docker/machine/releases/) on GitHub.

# Setup

## Provisioning docker machine VMs

In this lab, I will create 3 docker machine VMs to make a Swarm cluster:

```
$ for i in 1 2 3; do docker-machine create -d virtualbox worker$i; done
Running pre-create checks...
Creating machine...
(worker1) Copying /Users/anhtu.nguyen/.docker/machine/cache/boot2docker.iso to /Users/anhtu.nguyen/.docker/machine/machines/worker1/boot2docker.iso...
(worker1) Creating VirtualBox VM...
(worker1) Creating SSH key...
(worker1) Starting the VM...
(worker1) Check network to re-create if needed...
(worker1) Waiting for an IP...
Waiting for machine to be running, this may take a few minutes...
Detecting operating system of created instance...
Waiting for SSH to be available...
Detecting the provisioner...
Provisioning with boot2docker...
Copying certs to the local machine directory...
Copying certs to the remote machine...
Setting Docker configuration on the remote daemon...
Checking connection to Docker...
Docker is up and running!
To see how to connect your Docker Client to the Docker Engine running on this virtual machine, run: docker-machine env worker1
(cont...)
```

Above command will download `boot2docker.iso` into `~/.docker/machine/cache` directory, then create the VirtualBox VMs in `~/.docker/machine/machines/worker*` directories.

```
$ docker-machine ls
NAME      ACTIVE   DRIVER       STATE     URL                         SWARM   DOCKER        ERRORS
worker1   -        virtualbox   Running   tcp://192.168.99.100:2376           v17.03.2-ce
worker2   -        virtualbox   Running   tcp://192.168.99.101:2376           v17.03.2-ce
worker3   -        virtualbox   Running   tcp://192.168.99.102:2376           v17.03.2-ce
```

It can be seen 3 VMs have been created with docker version *v17.03.2-ce*.
Connect to Docker Engine running on those VMs to see more details:

```
$ eval $(docker-machine env worker1)
$ docker version
Client:
 Version:      17.06.0-ce
 API version:  1.27 (downgraded from 1.30)
 Go version:   go1.8.3
 Git commit:   02c1d87
 Built:        Fri Jun 23 21:31:53 2017
 OS/Arch:      darwin/amd64

Server:
 Version:      17.03.2-ce
 API version:  1.27 (minimum version 1.12)
 Go version:   go1.7.5
 Git commit:   f5ec1e2
 Built:        Tue Jun 27 01:35:00 2017
 OS/Arch:      linux/amd64
 Experimental: false

$ docker info
Containers: 0
 Running: 0
 Paused: 0
 Stopped: 0
Images: 0
Server Version: 17.03.2-ce
Storage Driver: aufs
 Root Dir: /mnt/sda1/var/lib/docker/aufs
 Backing Filesystem: extfs
 Dirs: 0
 Dirperm1 Supported: true
Logging Driver: json-file
Cgroup Driver: cgroupfs
Plugins:
 Volume: local
 Network: bridge host macvlan null overlay
 Log:
Swarm: inactive
Runtimes: runc
Default Runtime: runc
Init Binary: docker-init
containerd version: 4ab9917febca54791c5f071a9d1f404867857fcc
runc version: 54296cf40ad8143b62dbcaa1d90e520a2136ddfe
init version: 949e6fa
Security Options:
 seccomp
  Profile: default
Kernel Version: 4.4.74-boot2docker
Operating System: Boot2Docker 17.03.2-ce (TCL 7.2); HEAD : c019897 - Thu Jun 29 02:04:54 UTC 2017
OSType: linux
Architecture: x86_64
CPUs: 1
Total Memory: 995.8MiB
Name: worker1
ID: P4NE:FV57:DEWO:OKVQ:LD5E:5OFO:YVA5:4KTJ:6Q7K:4TS6:O5J6:LXRJ
Docker Root Dir: /mnt/sda1/var/lib/docker
Debug Mode (client): false
Debug Mode (server): true
 File Descriptors: 14
 Goroutines: 22
 System Time: 2017-06-30T07:34:03.013544759Z
 EventsListeners: 0
Registry: https://index.docker.io/v1/
Labels:
 provider=virtualbox
Experimental: false
Insecure Registries:
 127.0.0.0/8
Live Restore Enabled: false
```

## Initialing Swarm cluster

**worker1** is chosen to become Swarm manager:

```
$ docker swarm init --advertise-addr 192.168.99.100
Swarm initialized: current node (4j86n5w9cg8hbrp2ilqjsra45) is now a manager.

To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-0f55oel26f96bld5l87zhp67bancll22k5dm413zy08e37h15r-cx4bdqsgzy1qfl1q8toyz9cx2 192.168.99.100:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.
```

`docker info` shows **Swarm** mode has been activated:

```
$ docker info
Containers: 0
 Running: 0
 Paused: 0
 Stopped: 0
Images: 0
Server Version: 17.03.2-ce
Storage Driver: aufs
 Root Dir: /mnt/sda1/var/lib/docker/aufs
 Backing Filesystem: extfs
 Dirs: 0
 Dirperm1 Supported: true
Logging Driver: json-file
Cgroup Driver: cgroupfs
Plugins:
 Volume: local
 Network: bridge host macvlan null overlay
 Log:
Swarm: active
 NodeID: 4j86n5w9cg8hbrp2ilqjsra45
 Is Manager: true
 ClusterID: upskkykpv1vxzbiv4bl76y0gt
 Managers: 1
 Nodes: 1
 Orchestration:
  Task History Retention Limit: 5
 Raft:
  Snapshot Interval: 10000
  Number of Old Snapshots to Retain: 0
  Heartbeat Tick: 1
  Election Tick: 3
 Dispatcher:
  Heartbeat Period: 5 seconds
 CA Configuration:
  Expiry Duration: 3 months
  Force Rotate: 0
 Root Rotation In Progress: false
 Node Address: 192.168.99.100
 Manager Addresses:
  192.168.99.100:2377
Runtimes: runc
Default Runtime: runc
Init Binary: docker-init
containerd version: 4ab9917febca54791c5f071a9d1f404867857fcc
runc version: 54296cf40ad8143b62dbcaa1d90e520a2136ddfe
init version: 949e6fa
Security Options:
 seccomp
  Profile: default
Kernel Version: 4.4.74-boot2docker
Operating System: Boot2Docker 17.03.2-ce (TCL 7.2); HEAD : c019897 - Thu Jun 29 02:04:54 UTC 2017
OSType: linux
Architecture: x86_64
CPUs: 1
Total Memory: 995.8MiB
Name: worker1
ID: P4NE:FV57:DEWO:OKVQ:LD5E:5OFO:YVA5:4KTJ:6Q7K:4TS6:O5J6:LXRJ
Docker Root Dir: /mnt/sda1/var/lib/docker
Debug Mode (client): false
Debug Mode (server): true
 File Descriptors: 32
 Goroutines: 126
 System Time: 2017-06-30T09:01:19.149550336Z
 EventsListeners: 0
Registry: https://index.docker.io/v1/
Labels:
 provider=virtualbox
Experimental: false
Insecure Registries:
 127.0.0.0/8
Live Restore Enabled: false
```

Check **Swarm** status:

```
$ docker node ls
ID                            HOSTNAME            STATUS              AVAILABILITY        MANAGER STATUS
4j86n5w9cg8hbrp2ilqjsra45 *   worker1             Ready               Active              Leader
```

## Joining another machines to Swarm cluster

Did you see the output of `docker swarm init` command above, it's included the TOKEN which used for joining nodes to the cluster? If you forgot to write down it, in **Manager** node, run this command to see it:

```
$ docker swarm join-token worker
To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-0f55oel26f96bld5l87zhp67bancll22k5dm413zy08e37h15r-cx4bdqsgzy1qfl1q8toyz9cx2 192.168.99.100:2377
```

Connect to the other Docker Engine VMs and join them into the cluster:

```
$ eval $(docker-machine env worker2)
$ docker swarm join --token SWMTKN-1-0f55oel26f96bld5l87zhp67bancll22k5dm413zy08e37h15r-cx4bdqsgzy1qfl1q8toyz9cx2 192.168.99.100:2377
$ docker info
Containers: 0
 Running: 0
 Paused: 0
 Stopped: 0
Images: 0
Server Version: 17.03.2-ce
Storage Driver: aufs
 Root Dir: /mnt/sda1/var/lib/docker/aufs
 Backing Filesystem: extfs
 Dirs: 0
 Dirperm1 Supported: true
Logging Driver: json-file
Cgroup Driver: cgroupfs
Plugins:
 Volume: local
 Network: bridge host macvlan null overlay
 Log:
Swarm: active
 NodeID: up3ouns9ynhwxqcv18y6nvpva
 Is Manager: false
 Node Address: 192.168.99.101
 Manager Addresses:
  192.168.99.100:2377
Runtimes: runc
Default Runtime: runc
Init Binary: docker-init
containerd version: 4ab9917febca54791c5f071a9d1f404867857fcc
runc version: 54296cf40ad8143b62dbcaa1d90e520a2136ddfe
init version: 949e6fa
Security Options:
 seccomp
  Profile: default
Kernel Version: 4.4.74-boot2docker
Operating System: Boot2Docker 17.03.2-ce (TCL 7.2); HEAD : c019897 - Thu Jun 29 02:04:54 UTC 2017
OSType: linux
Architecture: x86_64
CPUs: 1
Total Memory: 995.8MiB
Name: worker2
ID: 2WDE:EXEJ:VXNR:64XQ:LK5H:DKMQ:6PWR:WIDG:FKOK:RNCJ:VZUZ:SAGE
Docker Root Dir: /mnt/sda1/var/lib/docker
Debug Mode (client): false
Debug Mode (server): true
 File Descriptors: 24
 Goroutines: 73
 System Time: 2017-06-30T09:17:28.855078269Z
 EventsListeners: 0
Registry: https://index.docker.io/v1/
Labels:
 provider=virtualbox
Experimental: false
Insecure Registries:
 127.0.0.0/8
Live Restore Enabled: false

$ docker node ls
Error response from daemon: This node is not a swarm manager. Worker nodes can't be used to view or modify cluster state. Please run this command on a manager node or promote the current node to a manager.
```

It can be seen that **worker2** is running as a *slave* in the cluster (`Is Manager: false`). Note that *slave* nodes can not check the status of **Swarm** cluster. Joining **worker3** with same method.

Connect to **manager** node and check cluster status:

```
$ eval $(docker-machine env worker1)
$ docker node ls
ID                            HOSTNAME            STATUS              AVAILABILITY        MANAGER STATUS
4j86n5w9cg8hbrp2ilqjsra45 *   worker1             Ready               Active              Leader
9stuyaszvo3m8lvothnhqwccy     worker3             Ready               Active
up3ouns9ynhwxqcv18y6nvpva     worker2             Ready               Active
```

That's all for the tutorial today. In next blog, I will show you how to bring up a service/stack in **Swarm**.

---
Mr. Tule
