import { ColourIn, Setting } from "./types";
import { SETTINGS_LIMITS } from "./values";

declare global {
    interface Window {
        cv: any;
    }
}

export async function getColourIn(input: ColourIn, index: number, setColourIn: Function) {
    let cv = await window.cv;
    let colour_in = "";

    // Convert b64 image data to OpenCV Mat format
    const loadImage = (src: string) => new Promise(resolve => {
        const imageEl = new Image();
        imageEl.onload = () => resolve(imageEl);
        imageEl.src = src;
    });
    const imageEl = await loadImage(input.image);
    let img = cv.imread(imageEl)

    // Convert image to grayscale
    cv.cvtColor(img, img, cv.COLOR_BGR2GRAY);
    
    // Adjust image contrast and create light/dark layers (balance)
    let layers = [];
    if (input.settings.contrast >= SETTINGS_LIMITS[Setting.CONTRAST].MIN && input.settings.contrast <= SETTINGS_LIMITS[Setting.CONTRAST].MAX) {
        cv.convertScaleAbs(img, img, input.settings.contrast * 10 / 127 + 1, 0);
        if (input.settings.balance > SETTINGS_LIMITS[Setting.BALANCE].MIN && input.settings.balance <= SETTINGS_LIMITS[Setting.BALANCE].MAX) {
            for (let i = 0; i < input.settings.balance; i++) {
                let n_layer = new cv.Mat();
                cv.convertScaleAbs(img, n_layer, input.settings.contrast * 10 / 127 + 1, -i * 10);
                layers.push(n_layer);
                let p_layer = new cv.Mat();
                cv.convertScaleAbs(img, p_layer, input.settings.contrast * 10 / 127 + 1, i * 10);
                layers.push(p_layer);
            }
        }
    }

    // Add blur to image
    if (input.settings.blur > SETTINGS_LIMITS[Setting.BLUR].MIN && input.settings.blur <= SETTINGS_LIMITS[Setting.BLUR].MAX) {
        let ksize = new cv.Size(input.settings.blur + 1, input.settings.blur + 1);
        cv.blur(img, img, ksize);
        layers.forEach(layer => {
            cv.blur(layer, layer, ksize);
        });
    }

    // Get image outline (outline = dilate - erode)
    let kernel = cv.Mat.ones(2, 2, cv.CV_8U);
    cv.morphologyEx(img, img, cv.MORPH_GRADIENT, kernel);
    layers.forEach(layer => {
        cv.morphologyEx(layer, layer, cv.MORPH_GRADIENT, kernel);
        // Combine light/dark layer outlines with image outline
        cv.bitwise_or(img, layer, img);
        layer.delete();
    });

    // Invert image
    cv.bitwise_not(img, img);

    // Sharpen image
    if (input.settings.sharpen) {
        kernel = cv.matFromArray(3, 3, cv.CV_8S, [0, -1, 0, -1, 5, -1, 0, -1, 0]);
        cv.filter2D(img, img, -1, kernel);
    }
    kernel.delete();

    // CV imshow only accepts canvas element
    const canvas = document.createElement("canvas");
    canvas.width = input.width;
    canvas.height = input.height;
    const ctx = canvas.getContext("2d");
    cv.imshow(canvas, img);
    img.delete();

    // Convert image back to b64 string
    colour_in = canvas.toDataURL();

    input.colour_in = colour_in;

    setColourIn(input, index);
}
