+++
keywords = ["viisix", "viisix nghia", "viisix hugo isso", "hugo", "isso", "gohugo", "go hugo"]
summary = "Building a information website using Wordpress, Druppal or Django is a little bit overkill; as we do not want to waste our methods and works into developing and maintenance such complex systems. In this article we will tell you how this website is built without the back-end site."
author = "Trong-Nghia Nguyen"
date = "2017-04-26T11:48:02+07:00"
title = "How did we build viisix.space?"
feature_image_v_adjust = 29
feature_image = "logo/gohugo_square.png"

+++

[Hugo](https://gohugo.io/) - a static site generator
------

{{< figure alt="Hugo logo" src="/logo/gohugo.png" >}}

When we decided to build new website for our group, the first thing came into
our mind is WordPress. It's well known and being used as blogs and websites around
the world, but WordPress, along with other CMS and frameworks required us to spend time and
methods into developing and maintenance. In fact, we are:
- Lack of resources: our server is not only used for hosting Web, as we are running tools
and services for other purposes.
- We do not want to spend much time to developing and customization in both front-end and back-end
of the website.
- We want to control our website, for testing and trying new technologies, so
Tumblr or Blogspot is also out of options. 

Static site generators are seem to be a good options, since they are easy to install, plus
you can host the generated contents anywhere you like, static files will be served fast behind
web server, markdown is supported so the contents are easy to deliver and to be moved from
other platforms. You can try some static site generator tools like *Jekyll* (Ruby), *Hexo* (JS) or
*Hugo* (Go).

We decided to give *[Hugo](https://gohugo.io/)* a chance, and surprisingly, it is fast, easy to use and configure.
One big plus for *Hugo* is its clear documentation comparing to *Jekyll* and *Hexo*. *Hugo* 
is also flexible, it supports many format in contents or configuration. It's just fit into your needs.

[Isso](http://posativ.org/isso/) - 3rd party comments service
------

{{< figure alt="Isso screen shot" src="/blog-images/how-did-we-built-viisix.space/01.png" >}}

How can we add comments function into a website if it is a static file without
back-end process? But it is not impossible. There are many third party service for that.
We use a self-host program written in Python called *[Isso](http://posativ.org/isso/)*,
which is lightweight and also easy to integrate with.

You don't like *Isso*? There are other options [here](https://gohugo.io/extras/comments/).

[Basscss](http://basscss.com/) - Simple stylesheet framework
------

I like [Basscss](http://basscss.com/) because of it's lightweight and high performance
style, not complex like Bootstrap. Basscss also works well with other CSS framework.

[Google's Code Prettify](https://github.com/google/code-prettify)
------

[Code Prettify](https://github.com/google/code-prettify) help source code snippet look more pretty. 
It's support many programing language and is shipped with 
[1 default and 4 more skins](https://rawgit.com/google/code-prettify/master/styles/index.html). 
But if you want you can find more themes [here](https://jmblog.github.io/color-themes-for-google-code-prettify/).
