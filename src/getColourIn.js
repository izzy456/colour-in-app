export async function getColourIn(image, settings) {
    const response = await fetch(
        import.meta.env.VITE_GET_COLOUR_IN_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "image": image,
                "blur_val": settings.blur,
                "light_val": parseFloat(settings.light)/10,
                "dark_val": parseFloat(settings.dark)/10,
                "sharpen": settings.sharpen
            })
        }
    );
    const result = await response.json();
    console.log(JSON.stringify(result));
    return result;
}
