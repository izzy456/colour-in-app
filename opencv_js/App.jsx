import { createSignal } from "solid-js";
import Incrementor from "./Incrementor";
import { getColourIn } from "./getColourIn";
import { printColouringBook } from "./printColouringBook";

export default function App() {
  const [settings, setSettings] = createSignal({"blur": 0, "contrast": 0, "brighten": 0, "sharpen": 0});
  const [results, setResults] = createSignal([]);
  const [imageUploaded, setImageUploaded] = createSignal(false);
  const [pageNo, setPageNo] = createSignal(1);
  const [toggleOnImage, setToggleOnImage] = createSignal(false);

  const handleImageUpload = (e) => {
    let image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = r => {
      setImageUploaded(true);
      setToggleOnImage(true);
      let updResults = [...results()];
      let result = {
        "colour_in": null,
        "image": r.target.result,
        "blur": 0,
        "contrast": 0,
        "brighten": 0,
        "sharpen": 0,
        "height": r.target.result.naturalHeight,
        "width": r.target.result.naturalWidth,
      };
      updResults.push(result);
      setResults(updResults);
      setPageNo(updResults.length);
    }
  }

  const updateResults = (result, index) => {
    let updResults = [...results()];
    updResults[index] = result;
    console.log(updResults);
    setResults(updResults);
  }

  const updateSettings = (valueName, value) => {
    let updSettings = {...settings()};
    updSettings[valueName] = parseInt(value);
    console.log(updSettings);
    setSettings(updSettings);
  }

  const handleDeleteImage = (index) => {
    let updResults = [...results()];
    updResults.splice(index, 1);
    console.log(updResults);
    let pageNo = index+1;
    if (pageNo>updResults.length) {
      pageNo--;
    }
    if (pageNo==0) {
      document.getElementById("imageInput").value = "";
    }
    console.log(pageNo)
    setResults(updResults);
    setPageNo(pageNo);
  }

  const setInforForPrinting = (e, index) => {
    let updResults = [...results()];
    updResults[index].height=e.target.naturalHeight;
    updResults[index].width=e.target.naturalWidth;
    console.log(updResults);
    setResults(updResults);
  }

  return (
    <div class="flex flex-col w-screen h-screen space-y-2">
      <div class="navbar bg-base-100 bg-gradient-to-r from-purple-500 to-pink-500">
        <a class="btn btn-ghost text-xl text-white" href="">ColourIn!</a>
      </div>
      <div class="flex flex-wrap justify-center flex-1 space-x-2 items-center">
        {(imageUploaded() && results().length>0 && (pageNo()>0 && pageNo()<=results().length))?(
          <div class="max-w-lg items-center text-center space-y-2">
            <div class="card shadow-xl">
              <figure>
                  <img src={
                    toggleOnImage()?
                      results()[pageNo()-1].image:
                      results()[pageNo()-1].colour_in?
                        results()[pageNo()-1].colour_in:
                        results()[pageNo()-1].image
                  } onLoad={(e) => setInforForPrinting(e, pageNo()-1)} alt="image"/>
              </figure>
              <button class="btn btn-square btn-sm absolute" onClick={() => handleDeleteImage(pageNo()-1)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-slot="icon" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="join">
              <button class="join-item btn" disabled={results().length<=1||pageNo()<=1} onClick={() => setPageNo(pageNo()-1)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-slot="icon" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button class="join-item btn">Page {pageNo()}</button>
              <button class="join-item btn" disabled={results().length<=1||pageNo()>=results().length} onClick={() => setPageNo(pageNo()+1)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-slot="icon" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        ):(
          <div/>
        )}
        <div class="items-center text-center">
          <div class="card card-bordered">
            <div class="card-body space-y-2">
              <h2 class="card-title">Create a Colouring Book!</h2>
              <label class="form-control w-full max-w-xs">
                <div class="label">
                  <span class="label-text">Open a new image:</span>
                </div>
                <input type="file" accept=".jpg,.png,.webp" class="file-input file-input-bordered file-input-secondary w-full max-w-xs" id="imageInput" onChange={(e) => handleImageUpload(e)}/>
              </label>
              {(imageUploaded() && results().length>0 && (pageNo()>0 && pageNo()<=results().length))?(
              <div class="flex space-x-2">
                  <Incrementor valueName="blur" min={0} max={10} value={settings().blur} handler={updateSettings}/>
                  <Incrementor valueName="contrast" min={-12} max={12} value={settings().contrast} handler={updateSettings}/>
                  <Incrementor valueName="brighten" min={-12} max={12} value={settings().brighten} handler={updateSettings}/>
                  <Incrementor valueName="sharpen" min={0} max={1} value={settings().sharpen} handler={updateSettings}/>
              </div>
              ):(<div/>)}
              <div class="card-actions justify-end">
                <button class="btn btn-primary" disabled={!imageUploaded() || !results().length>0} onClick={(e) => {
                  e.preventDefault();
                  getColourIn(results()[pageNo()-1].image, settings(), results()[pageNo()-1].height, results()[pageNo()-1].width).then((result) => {
                    updateResults(result, pageNo()-1);
                    setToggleOnImage(false);
                  })
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                  </svg>
                  Generate Page
                </button>
                {(imageUploaded() && results().length>0 && (pageNo()>0 && pageNo()<=results().length))?(
                  <label class="btn swap">
                    <input type="checkbox" disabled={!results()[pageNo()-1].colour_in} checked={toggleOnImage()} onChange={() => setToggleOnImage(!toggleOnImage())}/>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="swap-off w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" data-slot="icon" class="swap-on w-6 h-6">
                      <path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clip-rule="evenodd" />
                    </svg>
                  </label>
                ):(<div/>)}
                {(imageUploaded() && results().length>0 && (pageNo()>0 && pageNo()<=results().length))?(
                  <button class="btn" onClick={() => printColouringBook(results())}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                    </svg>
                  </button>
                ):(<div/>)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer class="footer footer-center p-4 bg-base-300 text-base-content">
        <aside>
          <p>ColourIn! 2024</p>
        </aside>
      </footer>
    </div>
  );
}
