import { createSignal } from "solid-js";
import { getColourIn } from "./getColourIn";
import { printColouringBook } from "./printColouringBook";
import { ColourIn, Setting } from "./types";
import { DEFAULT_SETTINGS, SETTINGS_LIMITS } from "./values";
import colour_in_sample from "./assets/colour_in_sample.png"
import image_sample from "./assets/image_sample.png"

export default function App() {
  let results: ColourIn[] = [];
  const [currentSettings, setCurrentSettings] = createSignal({ ...DEFAULT_SETTINGS });
  const [image, setImage] = createSignal("");
  const [colourIn, setColourIn] = createSignal("");
  const [toggleColourIn, setToggleColourIn] = createSignal(false);
  const [generating, setGenerating] = createSignal(false);
  const [pageNo, setPageNo] = createSignal(1);
  const [resultsLen, setResultsLen] = createSignal(0);

  const handleImageUpload = (e: Event & { currentTarget: HTMLInputElement; target: HTMLInputElement; }) => {
    let image = e.target.files![0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = r => {
      let result = {
        "colour_in": "",
        "image": r.target!.result as string,
        "settings": { ...DEFAULT_SETTINGS },
        "height": 0,
        "width": 0
      };
      results.push(result);
      setToggleColourIn(false);
      setColourIn("");
      setResultsLen(results.length);
      setPageNo(results.length);
      setImage(r.target!.result as string);
      setCurrentSettings({ ...DEFAULT_SETTINGS });
      console.log("Image uploaded");
    }
  }

  const handleDeleteImage = (index: number) => {
    results.splice(index, 1);
    let pageNo = index + 1;
    if (pageNo > results.length) {
      pageNo--;
    }
    if (pageNo == 0) {
      (document.getElementById("imageInput") as HTMLInputElement).value = "";
      setCurrentSettings({ ...DEFAULT_SETTINGS });
      setImage("");
      setColourIn("");
    } else {
      setCurrentSettings({ ...results[pageNo - 1].settings });
      setImage(results[pageNo - 1].image);
      setColourIn(results[pageNo - 1].colour_in);
    }
    setPageNo(pageNo);
    setResultsLen(results.length);
    console.log("Page deleted");
  }

  const updateColourIn = (result: ColourIn, index: number) => {
    results[index] = result;
    setGenerating(false);
    setColourIn(result.colour_in);
    setToggleColourIn(true);
    console.log("Colour in updated");
  }

  const setInforForPrinting = (e: Event & { currentTarget: HTMLImageElement; target: Element; }, index: number) => {
    results[index].height = e.currentTarget.naturalHeight;
    results[index].width = e.currentTarget.naturalWidth;
    console.log("Image size set");
  }

  return (
    <div class="flex flex-col w-screen h-screen space-y-2">
      <div class="navbar bg-base-100 bg-gradient-to-r from-purple-500 to-pink-500">
        <a class="btn btn-ghost text-xl text-white" href="">ColourIn!</a>
      </div>
      <div class="flex flex-wrap justify-center items-center flex-1 space-x-2">
        <div class="max-w-lg items-center text-center space-y-2">
          <div class="card shadow-xl">
            <figure>
              {(image() && resultsLen() > 0 && (pageNo() > 0 && pageNo() <= resultsLen())) ? (
                <img src={(toggleColourIn() && colourIn()) ? colourIn() : image()} alt="image" onLoad={(e) => setInforForPrinting(e, pageNo() - 1)} />
              ) : (
                <div>
                  <img src={image_sample} alt="image_sample" />
                  <img class="absolute top-0 left-0 opacity-0 hover:opacity-100" src={colour_in_sample} alt="colour_in_sample" />
                </div>
              )}
            </figure>
            {(image() && resultsLen() > 0 && (pageNo() > 0 && pageNo() <= resultsLen())) && (
              <button class="btn btn-square btn-sm absolute top-0 left-0" disabled={generating()} onClick={() => handleDeleteImage(pageNo() - 1)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-slot="icon" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {(image() && resultsLen() > 0 && (pageNo() > 0 && pageNo() <= resultsLen())) && (
            <div class="join">
              <button class="join-item btn" disabled={resultsLen() <= 1 || pageNo() <= 1} onClick={() => {
                let prevPage = pageNo() - 1;
                setPageNo(prevPage);
                setCurrentSettings({ ...results[prevPage - 1].settings });
                setImage(results[prevPage - 1].image);
                setColourIn(results[prevPage - 1].colour_in);
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-slot="icon" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button class="join-item btn">Page {pageNo()}/{resultsLen()}</button>
              <button class="join-item btn" disabled={resultsLen() <= 1 || pageNo() >= resultsLen()} onClick={() => {
                let nextPage = pageNo() + 1;
                setPageNo(nextPage);
                setCurrentSettings({ ...results[nextPage - 1].settings });
                setImage(results[nextPage - 1].image);
                setColourIn(results[nextPage - 1].colour_in);
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-slot="icon" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          )}
        </div>
        <div class="items-center text-center">
          <div class="card card-bordered">
            <div class="card-body space-y-2">
              <h2 class="card-title">Create a Colouring Book!</h2>
              <label class="form-control w-full max-w-xs">
                <div class="label">
                  <span class="label-text">Open a new image:</span>
                </div>
                <input type="file" accept=".jpg,.png,.webp" class="file-input file-input-bordered file-input-secondary w-full max-w-xs" id="imageInput" onChange={(e) => handleImageUpload(e)} />
              </label>
              <div tabIndex={0} class="collapse collapse-plus bg-base-200 text-left">
                <input type="checkbox" />
                <div class="collapse-title font-medium">
                  Settings
                </div>
                <div class="collapse-content">
                  <div class="flex space-x-2">
                    {Object.entries(SETTINGS_LIMITS).map(([sn, s]) => (
                      <label class="form-control w-20">
                        <div class="label">
                          <span class="label-text">{sn}:</span>
                        </div>
                        <input disabled={image() == ""} class="input input-bordered" type="number" max={s.MAX} min={s.MIN} step="1"
                          value={currentSettings()[sn as Setting]} id={`${sn}-setting`}
                          onChange={(e) => {
                            currentSettings()[sn as Setting] = parseInt(e.target.value);
                            console.log(currentSettings());
                          }}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div class="card-actions justify-end">
                <button class="btn btn-primary" disabled={!image() || generating() || !(resultsLen() > 0)} onClick={() => {
                  setGenerating(true);
                  let index = pageNo() - 1;
                  results[index].settings = { ...currentSettings() };
                  getColourIn(results[index], index, updateColourIn);
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                  </svg>
                  Generate Page
                </button>
                <button class="btn" disabled={colourIn() == ""} onClick={() => setToggleColourIn(!toggleColourIn())}>
                  {toggleColourIn() ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="swap-off w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" data-slot="icon" class="swap-on w-6 h-6">
                      <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clip-rule="evenodd" />
                    </svg>
                  )}
                </button>
                <button class="btn" disabled={colourIn() == ""} onClick={() => printColouringBook(results)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer class="footer footer-center p-4 bg-base-300 text-base-content">
        <aside>
          <p><a class="underline" href="https://github.com/izzy456/colour-in-app">ColourIn! 2024</a></p>
        </aside>
      </footer>
    </div>
  );
}
