export async function getColourIn(image, settings, height, width) {
    let cv = await window.cv;
    let colour_in = "";

    // Convert b64 image data to OpenCV Mat format
    const loadImage = src => new Promise(resolve => {
        const imageEl = new Image();
        imageEl.onload = () => resolve(imageEl);
        imageEl.src = src;
    });
    const imageEl = await loadImage(image);
    console.log("Image loaded");
    let img = cv.imread(imageEl);

    // Convert image to grayscale
    cv.cvtColor(img, img, cv.COLOR_BGR2GRAY);

    // Adjust image contrast and brightness
    if (settings.contrast>=-12 && settings.contrast<=12
        && settings.brighten>=-12 && settings.brighten<=12) {
        cv.convertScaleAbs(img, img, settings.contrast*10/127+1, settings.brighten*10);
    }

    // Add blur to image
    if (settings.blur>0 && settings.blur<=10) {
        let ksize = new cv.Size(settings.blur, settings.blur);
        cv.blur(img, img, ksize);
    }

    // Get image outline (outline = dilate - erode)
    let kernel = cv.Mat.ones(2, 2, cv.CV_8U);
    cv.morphologyEx(img, img, cv.MORPH_GRADIENT, kernel);

    // Invert image
    cv.bitwise_not(img, img);

    // Sharpen image
    if (settings.sharpen) {
        kernel = cv.matFromArray(3, 3, cv.CV_8S, [0, -1, 0, -1, 5, -1, 0, -1, 0])
        cv.filter2D(img, img, -1, kernel);
    }
    
    // CV imshow only accepts canvas element
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    cv.imshow(canvas, img);
    img.delete();

    // Convert image back to b64 string
    colour_in = canvas.toDataURL();
    console.log(colour_in);
    return {
        "image": image,
        "blur_val": settings.blur,
        "contrast_val": settings.contrast,
        "brighten_val": settings.brighten,
        "sharpen": settings.sharpen,
        "colour_in": colour_in,
    };
}
