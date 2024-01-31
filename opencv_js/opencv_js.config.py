# Classes and methods whitelist for OpenCV.js

core = {
    '': ['bitwise_not', 'bitwise_or', 'convertScaleAbs']
}

imgproc = {
    '': ['blur', 'cvtColor', 'filter2D', 'morphologyEx']
}

white_list = makeWhiteList([core, imgproc])