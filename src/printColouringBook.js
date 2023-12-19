const pageHeight = "29.7", pageWidth = "21", padding = "2", units = "cm";

export function printColouringBook(pages) {
    var date = new Date();
    var printWindow = window.open("about:blank", `My Colouring Book - ${date}`);
    var html = "<html><head></head><body>";
    pages.map((result) => {
      if (result.colour_in) {
        let isLandscape = result.width>result.height;
        let style = "page-break-after: always; page-break-inside: avoid;"
        let maxWidth, maxHeight, width, height;
        if (isLandscape) {
          console.log("rotate image");
          style += " transform: rotate(-90deg) translateX(-100%); transform-origin: top left;";
          maxWidth = pageHeight-padding;
          maxHeight = pageWidth-padding;
          width = result.height;
          height = result.width;
        } else {
          maxWidth = pageWidth-padding;
          maxHeight = pageHeight-padding;
          width = result.width;
          height = result.height;
        }
        style += ` max-width: ${maxWidth}${units}; max-height: ${maxHeight}${units};`;
        if (result.height/result.width>maxHeight/maxWidth) {
            console.log("resize height");
            style += ` width: auto; height: ${maxHeight}${units};`;
        } else if (result.width/result.height>maxWidth/maxHeight) {
            style += ` width: ${maxWidth}${units}; height: auto;`;
        } else {
            style += " width: auto; height: auto;";
        }
        html += `<img style=\"${style}\" src=\"${result.colour_in}\"/>`;
      }
    });
    html += "</body></html>";
    printWindow.document.write(html);
    printWindow.print();
  }
  