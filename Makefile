setup:
	@docker build --rm -t alpine-hugo .
.PHONY: setup

server:
	@docker container run -d --rm -it --name hugo-server -p 1313:1313/tcp -v $(PWD):/src alpine-hugo
.PHONY: server

ssh:
	@docker container exec -it hugo-server sh
.PHONY: ssh

blog:
	@docker container exec -it hugo-server hugo new blog/${BLOG}.md
.PHONY: blog

project:
	@docker container exec -it hugo-server hugo new projects/${PROJECT}.md
.PHONY: project

member:
	@docker container exec -it hugo-server hugo new members/${MEMBER}.md
.PHONY: member

stop:
	@docker container rm -f hugo-server
.PHONY: stop

public:
	@docker container exec -it hugo-server hugo
.PHONY: public
