# This is a modified copy of: https://github.com/opencv/opencv/blob/4.x/platforms/js/opencv_js.config.py
# Classes and methods whitelist for OpenCV.js

core = {
    '': ['bitwise_not', 'bitwise_or', 'convertScaleAbs']
}

imgproc = {
    '': ['blur', 'cvtColor', 'filter2D', 'morphologyEx']
}

white_list = makeWhiteList([core, imgproc])