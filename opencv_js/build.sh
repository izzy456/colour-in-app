#!/bin/bash -e
echo Setup latest EMSDK
git clone https://github.com/emscripten-core/emsdk.git || (cd emsdk && git pull)
cd emsdk
./emsdk install latest
./emsdk activate latest
source "$(pwd)/emsdk_env.sh"
cd ..

echo Get latest OpenCV
git clone https://github.com/opencv/opencv.git || (cd opencv && git pull)

echo Copy in custom config
\cp opencv_js/opencv_js.config.py opencv/platforms/js/

echo Building opencv.js and opencv.wasm
cd opencv
docker run --rm -v $(pwd):/src -u $(id -u):$(id -g) emscripten/emsdk python3 ./platforms/js/build_js.py wasm_build \
--build_wasm --disable_single_file --cmake_option="-DBUILD_LIST=js,core,imgproc" \
--emscripten_dir=../emsdk/upstream/emscripten
sed -i "s/var Module=moduleArg;var readyPromiseResolve/var Module=moduleArg;var cv=Module;var readyPromiseResolve/1" wasm_build/bin/opencv.js

echo Uploading artifacts to S3
aws s3 cp --recursive wasm_build/bin s3://opencv-build-artifacts/

echo Done