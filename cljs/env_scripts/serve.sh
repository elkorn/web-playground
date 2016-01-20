#!/bin/bash

docker run --rm -v "$PWD"/target:/usr/share/nginx/html:ro -p 80:80 dmohs/nginx

