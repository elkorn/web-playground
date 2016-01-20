#!/bin/bash

rm -rf target/*
docker run --rm -it -v "$PWD":/app dmohs/cljs-react-build php src/php/index.php > target/index.html
docker run --rm -it -v "$PWD":/app -p 3449:3449 -e BUILD_HOST=0.0.0.0 dmohs/cljs-react-build rlfe lein figwheel
