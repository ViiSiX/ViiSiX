ViiSiX
------

ViiSiX content generate source code by Go Hugo. Contents are written using Markdown.

1. Run on your local machine (Requirement: Docker is installed)

Go to the source code directory, issue following commands:

```
$ make setup
$ make server
```

Then navigate to http://localhost:1313 to see the website.

2. Add content

We have 3 kinds of content:

- blog
- members
- projects

Depend on content type, issue the following commands:

```
$ make blog BLOG=nice-blog
$ make project PROJECT=awesome-project
$ make member MEMBER=handsome-sysadmin
```

Then you can edit `/content/blog/nice-blog.md`, input your content.

3. Generate public html files

Go to the source code directory, issue:

```
$ make public
```

Static web will be generated at `public` directory, you can now upload it
to a web server.
