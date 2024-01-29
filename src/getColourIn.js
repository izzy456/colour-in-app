export async function getColourIn(image, settings) {
    const response = await fetch(
        "/get-colour-in", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "image": image,
                "blur_val": settings.blur,
                "contrast_val": settings.contrast*10,
                "brighten_val": settings.brighten*10,
                "sharpen": settings.sharpen
            })
        }
    );
    const result = await response.json();
    console.log(JSON.stringify(result));
    return result;
}
