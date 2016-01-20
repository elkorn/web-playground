#!/bin/bash

docker run --rm -it -v "$PWD":/app dmohs/cljs-react-build lein cljsbuild once
docker run --rm -it -v "$PWD":/app dmohs/cljs-react-build php src/php/index.php > target/index.html
