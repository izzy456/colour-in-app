import { ColourIn } from "./types";

export async function getColourIn(input: ColourIn, index: number, setColourIn: Function) {
    const result = fetch(
        "/get-colour-in", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input)
        }).then(res => {
            if (res.ok) {
                return res.json();
            } else {
                console.log("Error response received");
                return input;
            }
        }).catch(err => {
            console.log("Something went wrong");
            return input;
        });
    setColourIn(await result, index);
}
