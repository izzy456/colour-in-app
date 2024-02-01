#!/bin/bash -e
echo Cloning OpenCV
git clone git@github.com:opencv/opencv.git

echo Building opencv.js and opencv.wasm
cd opencv
docker run --rm -v $(pwd):/src -u $(id -u):$(id -g) emscripten/emsdk python3 ./platforms/js/build_js.py wasm_build --build_wasm --disable_single_file --cmake_option="-DBUILD_LIST=js,core,imgproc" --config=../opencv_js/opencv_js.config.py

echo Uploading artifacts to S3
cd wasm_build/bin
zip opencv.zip opencv.js opencv_js.wasm
aws s3 cp opencv.zip s3://opencv-build-artifacts

echo Done