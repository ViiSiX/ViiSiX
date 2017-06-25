FROM alpine:latest

MAINTAINER Tu A. Nguyen <mr.anhtu9889@gmail.com>

ENV HUGO_VERSION 0.24.1
ENV HUGO_BASE_URL http://localhost:1313
EXPOSE 1313
WORKDIR /src

RUN \
  apk add --virtual --update --no-cache curl \
  && rm -rf /var/cache/apk/*

RUN \
  mkdir -p /usr/local/bin \
  && curl -L https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_Linux-64bit.tar.gz | tar xz -C /usr/local/bin

CMD hugo server -b ${HUGO_BASE_URL} --bind=0.0.0.0
