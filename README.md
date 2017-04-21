ViiSiX
------

ViiSiX content generate source code by Go Hugo. Contents are written using Markdown.

1. Run on your local machine

Go to the source code directory, issue this command

`$ hugo server`

2. Add content

We have 3 kinds of content:

- blog
- members
- projects

Depend on content type, issue the following command

`$ hugo new <content-type>/>content-url>.md`

For example

`$ hugo new blog/hello-world.md`

Then you can edit `/content/blog/hello-world.md`, input your content.

3. Generate public html files

Go to the source code directory, issue

`$ hugo`

Static web will be generated at `public` directory, you can now upload it
to a web server.
