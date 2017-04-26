+++
author = "Trong-Nghia Nguyen"
date = "2017-04-21T00:50:19+07:00"
title = "Docker Note"
summary = "Following the trend, I decided to use Docker to create develop environment on my Mac Book, and note down these tips for later usage. Please feel free to correct me to perfect this document."
keywords = ["viisix", "viisix nghia docker", "docker note"]
feature_image = "logo/docker.png"
feature_image_v_adjust = 25

+++
I. Installation
---------------

You can follow [this document](https://docs.docker.com/docker-for-mac/install/) for installation. But I decided to use Home Brew, so that it can help me on upgrading to new version.

    $ brew update
    $ brew cask install docker

After finished installation, go to your Launchpad and click on Docker's Whale icon to start it. Wait until the service finish starting.

{{< figure src="/blog-images/docker-note/01.png" alt="Docker on Launchpad" >}}

Go to your console and check Docker's version to verify that the latest Docker is installed.

`$ docker -v`

Or you can enter this command to make sure that Docker is running:

    $ docker run hello-world

    Unable to find image 'hello-world:latest' locally
    latest: Pulling from library/hello-world
    78445dd45222: Pull complete
    Digest: sha256:c5515758d4c5e1e838e9cd307f6c6a0d620b5e07e6f927b07d05f6d12a1ac8d7
    Status: Downloaded newer image for hello-world:latest

    Hello from Docker!
    This message shows that your installation appears to be working correctly.

    To generate this message, Docker took the following steps:
    1. The Docker client contacted the Docker daemon.
    2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    3. The Docker daemon created a new container from that image which runs the
        executable that produces the output you are currently reading.
    4. The Docker daemon streamed that output to the Docker client, which sent it
        to your terminal.

    To try something more ambitious, you can run an Ubuntu container with:
    $ docker run -it ubuntu bash

    Share images, automate workflows, and more with a free Docker ID:
    https://cloud.docker.com/

    For more examples and ideas, visit:
    https://docs.docker.com/engine/userguide/

II. Useful Docker commands

*Some of these commands are going to be deprecated in later version of Docker.*

Check the list of running Container

`$ docker ps`

Show all Containers in the system

    $ docker ps -a

    CONTAINER ID    IMAGE           COMMAND     CREATED             STATUS                         PORTS    NAMES
    3bc6f3717662    48b5124b2768    "/hello"    About an hour ago   Exited (0) About an hour ago            sad_knuth

Delete a docker Container

`$ docker rm 3bc6f3717662`

Show all Images in the system

    $ docker images

    REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
    my-docker           latest              111000f402fe        53 seconds ago      277 MB
    hello-world         latest              48b5124b2768        2 months ago        1.84 kB

Pulling some Image from Docker Hub

`$ docker pull postgres:9.4-alpine`

Login to your Docker Hub account

`$ docker login -u <your_account>`

Tag your docker Image before push it to your Docker Hub repository

`$ docker tag 111000f402fe <your_account>/my-docker:latest`

`$ docker push <your_account>/my-docker`

To remove one Image, use

`$ docker rmi -f 111000f402fe`

III. Docker Compose - Running Apache2-PHP-PostgreSQL

To understand what docker compose is and how to use it, [official document](https://docs.docker.com/compose/) from Docker is recommended.
We will create 3 container for this stack using `docker-compose`, called: `db`, `fpm`, `httpd`.

Firstly, create new folder for your project

`$ mkdir drupal-project && cd drupal-project`

Download Drupal to your code folder, here I named it `app`. Remember to change drupal version to your working one. This step will enable you to share
the code folder between `fpm` and `httpd` container, and also you can also work on the source code.

    wget -O drupal.tar.gz "https://github.com/drupal/drupal/archive/8.3.0.tar.gz"; \
        mkdir app && tar zxf drupal.tar.gz --directory app --strip-components 1; \
        rm -f drupal.tar.gz

Create folders for your Docker Containers

`$ mkdir fpm httpd`

Create a `sh` script in `fpm` folder, let's call it `fpm.sh`, this will be the command of your Docker Image

    #!/bin/sh

    WORKING_DIR=/app

    cd $WORKING_DIR
    # Install packages using composer
    # Composer is installed when Docker Image for PHP-FPM is builed
    php /composer/composer.phar install

    # Start PHP-FPM service
    php-fpm

Create a Dockerfile in fpm folder with following content:

    FROM php:5.6-fpm-alpine
    LABEL maintainer nghia@viisix.space

    # Build some php extension
    RUN apk add --no-cache freetype libpng libjpeg-turbo freetype-dev libpng-dev libjpeg-turbo-dev \
        && docker-php-ext-configure gd \
            --with-freetype-dir=/usr/include \
            --with-png-dir=/usr/include \
            --with-jpeg-dir=/usr/include \
            && NPROC=$(getconf _NPROCESSORS_ONLN) \
            && docker-php-ext-install -j${NPROC} gd \
            && apk del --no-cache freetype-dev libpng-dev libjpeg-turbo-dev
    RUN apk --no-cache add \
        && apk --no-cache add postgresql-dev \
        && docker-php-ext-install pdo pdo_pgsql

    # Setting the timezone
    RUN echo "date.timezone = 'Asia/Ho_Chi_Minh'" > /usr/local/etc/php/conf.d/drupal.ini

    RUN mkdir /composer
    WORKDIR /composer
    RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
        && php -r "if (hash_file('SHA384', 'composer-setup.php') === '669656bab3166a7aff8a7506b8cb2d1c292f042046c5a994c43155c0be6190fa0355160742ab2e1c88d40d5be660b410') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;" \
        && php composer-setup.php \
        && php -r "unlink('composer-setup.php');"

    CMD ['php-fpm']

Create custom config file for `apache2` as `httpd/conf/drupal.conf`

    LoadModule proxy_module modules/mod_proxy.so
    LoadModule proxy_fcgi_module modules/mod_proxy_fcgi.so
    LoadModule rewrite_module modules/mod_rewrite.so
    LoadModule expires_module modules/mod_expires.so

    Listen 81

    <VirtualHost *:81>
        DocumentRoot /app

        ServerName example.com

        LogLevel debug
        CustomLog /proc/self/fd/1 common
        ErrorLog /proc/self/fd/2

        <Directory />
            Order deny,allow
            Deny from all
            Options FollowSymLinks
            AllowOverride None
            RedirectMatch 404 /.git(/|$)
        </Directory>

        ProxyPassMatch ^/(.*\.php(/.*)?)$ fcgi://fpm:9000/app/$1

        <Directory /app>
            ErrorDocument 404 /index.php
            Include /app/.htaccess
            
            Order allow,deny
            Allow from all
            Require all granted
            
            AllowOverride None
        </Directory>
    </VirtualHost>

And Dockerfile for `apache2` as `httpd/Dockerfile`

    FROM httpd:2.4-alpine
    LABEL maintainer nghia@viisix.space

    ENV CUSTOM_CONFIG_DIR conf/custom

    # Make apache2 import configs from custom folder
    RUN mkdir -p /usr/local/apache2/${CUSTOM_CONFIG_DIR}
    RUN echo "Include ${CUSTOM_CONFIG_DIR}/*.conf" >> /usr/local/apache2/conf/httpd.conf

    CMD ["httpd-foreground"]

*Why I do not copy `fpm/fpm.sh` and `httpd/conf/drupal.conf` into Docker Images?*

Because I want to be able to edit them later, without rebuilding Images for `fpm` and `httpd`.

Finally, create `docker-compose.yml` file

    version: "3"

    services:
      db:
        image: "postgres:9.4-alpine"
        volumes:
          - ./data:/var/lib/postgresql/data
        environment:
          POSTGRES_USER: "drupal"
          POSTGRES_PASSWORD: "drupal"

      fpm:
        build: ./fpm
        volumes:
          - ./app:/app
          - ./fpm/fpm.sh:/fpm.sh
        command: /bin/sh /fpm.sh
        depends_on:
          - db

      httpd:
        build: ./httpd
        volumes:
          - ./app:/app
          - ./httpd/conf:/usr/local/apache2/conf/custom:ro
        ports:
          - 80:81
        depends_on:
          - fpm

Build the Images

`$ docker-compose build`

And start the service

`$ docker-compose up`

Now you can go to your browser, enter `localhost` and start installing your new Drupal Website.
