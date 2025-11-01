const canvas = new fabric.Canvas("canvas", { selection: false });

let storedBackgroundImageURL = null;
let tapColor = "#FF0000";

const history = [];
let historyIndex = -1;

function clearCanvas() {
  // Clear all objects from the canvas
  canvas.clear();
  canvas.discardActiveObject();
  canvas.getObjects().forEach((obj) => canvas.remove(obj));

  // Optionally, clear any other properties or settings
  storedBackgroundImageURL = "";
  canvas.setBackgroundImage(null);
  saveState();
}

// sessionStorage.setItem("model_type", "rectangle");

const chosenModel = sessionStorage.getItem("model_type")
  ? sessionStorage.getItem("model_type")
  : "sipper";

const chosenCurrentModel = sessionStorage.getItem("current_model")
  ? sessionStorage.getItem("current_model")
  : "normal";


const channel = new BroadcastChannel("session-sync");

channel.onmessage = (event) => {
  if (event.data.type) {
    console.log("received message");
    // const chosenModel = sessionStorage.getItem("model_type") ? sessionStorage.getItem("model_type") : 'sipper';
    // console.log("Chosen mode: ", chosenModel);
    // console.log("Event type: ", event.data.type);
    sessionStorage.setItem("model_type", event.data.type);
    // setSelectedModelContent();
    window.location.reload();
    window.location.reload();
  }
};

document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "visible") {
    // location.reload();
  }
});

const templateContainer = document.getElementById("template-container");

setSelectedModelContent(chosenModel);

function setSelectedModelContent(chosenModel) {
  if (chosenModel == "sipper") {
    // document.body.innerHTML = `<div class="no_edit_option">Customize feature not available for Sipper Containers<br><a href="./index.html">Back to home</a></div>`;
  }

  const is50 = sessionStorage.getItem("model_50");
  console.log(`is 50: ${is50}`);
  if (is50 == true) {
    document.body.innerHTML = `<div class="no_edit_option">Customize feature not available for 50ml round container<br><a href="./index.html">Back to home</a></div>`;
  }
  let newModel = chosenModel;
  if (chosenCurrentModel.includes('500') && chosenModel == 'round')  {
    newModel = `500_${chosenModel}`;
  }
  if (chosenCurrentModel.includes('750') && chosenModel == 'round')  {
    newModel = `750_${chosenModel}`;
  }
  if (chosenCurrentModel.includes('120') && chosenModel == 'sipper')  {
    newModel = `120_${chosenModel}`;
  }
  setBackgroundImage(
    `./assets/images/images/default_${newModel}.png`,
    false
  );
  // setBackgroundImage("/assets/images/images/default_round.png", false);
  createTemplates(chosenModel);
}

function createTemplates(chosenModel) {
  let newModel = chosenModel;
  if (chosenCurrentModel.includes('500') && chosenModel == 'round')  {
    newModel = `500_${chosenModel}`;
  }
  if (chosenCurrentModel.includes('750') && chosenModel == 'round')  {
    newModel = `750_${chosenModel}`;
  }
  if (chosenCurrentModel.includes('120') && chosenModel == 'sipper')  {
    newModel = `120_${chosenModel}`;
  }
  templateContainer.innerHTML = `
    <img src="./assets/images/images/default_${newModel}.png" alt="template1" title="template1"
        loading="eager" width="5%" height="auto" class="template-image selected" id="template1"
        template-no=1 data-theme="black">

    <img src="./assets/images/pattern_images/${newModel}_green.png" alt="template2" title="template2"
        loading="eager" width="5%" height="auto" class="template-image" id="template2"
        template-no=1 data-theme="white">

    <img src="./assets/images/pattern_images/${newModel}_brown.png" alt="template3" title="template3"
        loading="eager" width="5%" height="auto" class="template-image" id="template3"
        template-no=2 data-theme="white">

    <img src="./assets/images/pattern_images/${newModel}_mix.png" alt="template4" title="template4"
        loading="eager" width="5%" height="auto" class="template-image" id="template4"
        template-no=3 data-theme="black">

    <img src="./assets/images/img_upload_icon.png" alt="custom_template" title="custom_template"
        loading="eager" width="5%" height="auto" class="custom-template-button" id="custom_template"
        template-no=3 data-theme="black">

    <input type="file" accept="image/*" id="customTemplateFileInput" style="display: none;">
  `;

  const customButton = templateContainer.querySelector(
    ".custom-template-button"
  );
  const fileInput = templateContainer.querySelector("#customTemplateFileInput");

  // 👇 Trigger file picker on custom button click
  customButton.addEventListener("click", () => {
    fileInput.click();
  });

  // 👇 Handle file selection
  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const dataUrl = e.target.result;

      const img = new Image();
      img.onload = function () {
        let requiredWidth = chosenModel == "round" ? 2908 : 1926; 
        let requiredHeight = chosenModel == "round" ? 448 : 1289; 

         if (chosenCurrentModel.includes('500') && chosenModel == 'round') {
            requiredWidth = 1838;
            requiredHeight = 448;
          }

          else if (chosenCurrentModel.includes('750') && chosenModel == 'round') {
            requiredWidth = 4360;
            requiredHeight = 701;
          }
        

        if (img.width !== requiredWidth || img.height !== requiredHeight) {
          alert(
            `Image must be exactly ${requiredWidth}x${requiredHeight} pixels.`
          );
          return;
        }

        // ✅ Passed validation — proceed with your logic
        document
          .querySelectorAll(".dropdown-content1 img")
          .forEach((btn) => btn.classList.remove("selected"));

        customButton.classList.add("selected");

        setBackgroundImage(dataUrl, true);

        const theme = customButton.getAttribute("data-theme") || "black";
        doTemplateChangeWithCustomText(theme);
      };

      img.onerror = function () {
        alert("Failed to load the image.");
      };

      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  });
}


function setBackgroundImage(url, booleanValue) {
  fabric.Image.fromURL(url, (img) => {
    adjustCanvasSize(img);
    currentSvgObject = img;
    img.set({ selectable: false, evented: false });
    storedBackgroundImageURL = url; // Store the URL
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
      scaleX: canvas.width / img.width,
      scaleY: canvas.height / img.height,
    });
    saveState();
  });
}


function saveState() {
  const json = JSON.stringify({
    canvas: canvas.toJSON(),
  });
  if (historyIndex < history.length - 1) {
    history.splice(historyIndex + 1);
  }
  history.push(json);
  historyIndex++;
}

let currentZoom = 0.7;

function adjustCanvasSize(image) {
  let currentZoom = 0.7;
  const aspectRatio = image.width / image.height;

  canvas.setWidth(window.innerWidth * currentZoom);
  canvas.setHeight(canvas.width / aspectRatio);

  if (canvas.height > window.innerHeight * currentZoom) {
    canvas.setHeight(window.innerHeight * currentZoom);
    canvas.setWidth(canvas.height * aspectRatio);
  }

  canvas.renderAll();
}

let textProperties;
let logoProperties;
let qrProperties;
let imageProperties;
let addressProperties;

let isLogoAdded = false;

let getBackgroundNumber = "0";
let pdfImageBackground = "pdf_watermark.webp";

function addTemplateItems(templateNumber) {
  // Clear previous objects first
  // clearCanvas();
  // console.log(`template number: ${templateNumber}`);

  switch (templateNumber) {
    case 1:
      addLogo(
        "./assets/images/logohereimage.png",
        100,
        "white",
        "white",
        7,
        100
      ); // Example
      addText("Your Company Name", "#000000ff", 60, 100, 16);
      addAddressText("Your Address Here", "#070707ff", 55, 580, 18);
      break;
    case 2:
      addLogo(
        "./assets/images/yourLogoWhite.png",
        100,
        "white",
        "white",
        7,
        100
      ); // Example
      addText("Your Company Name", "#FFFFFF", 60, 100, 16);
      addAddressText("Your Address Here", "#FFFFFF", 55, 580, 18);
      break;
    case 3:
      addLogo(
        "./assets/images/yourLogoWhite.png",
        100,
        "white",
        "white",
        7,
        100
      );
      addText("Your Company Name", "#FFFFFF", 60, 100, 16);
      addAddressText("Your Address Here", "#FFFFFF", 55, 580, 18);
      break;
    case 4:
      addLogo(
        "./assets/images/yourLogoWhite.png",
        100,
        "black",
        "black",
        7,
        100
      );
      addText("Your Company Name", "#FFFFFF", 60, 100, 16);
      addAddressText("Your Address Here", "#FFFFFF", 55, 580, 18);
      break;
    case 5:
      addLogo(
        "./assets/images/logohereimage.png",
        100,
        "black",
        "black",
        7,
        100
      );
      addText("Your Company Name", "#000000", 60, 100, 16);
      addAddressText("Your Address Here", "#yourLogoWhite", 55, 580, 18);
      break;
    case 6:
      addLogo(
        "./assets/images/yourLogoWhite.png",
        100,
        "black",
        "black",
        7,
        100
      );
      addText("Your Company Name", "#FFFFFF", 60, 100, 16);
      addAddressText("Your Address Here", "#FFFFFF", 55, 580, 18);
      break;
    case 7:
      addLogo(
        "./assets/images/yourLogoWhite.png",
        100,
        "black",
        "black",
        7,
        100
      );
      addText("Your Company Name", "#FFFFFF", 60, 100, 16);
      addAddressText("Your Address Here", "#FFFFFF", 55, 580, 18);
      break;
    case 8:
      addLogo(
        "./assets/images/logohereimage.png",
        100,
        "black",
        "black",
        7,
        100
      );
      addText("Your Company Name", "#000000", 60, 100, 16);
      addAddressText("Your Address Here", "#yourLogoWhite", 55, 580, 18);
      break;
    default:
      addLogo(
        "./assets/images/yourLogoWhite.png",
        100,
        "black",
        "black",
        7,
        100
      );
      addText("Your Company Name", "#FFFFFF", 60, 100, 16);
      addAddressText("Your Address Here", "#FFFFFF", 55, 580, 18);
      break;
  }
}

function addLogo(src, maxWidth, logoColor, textColor, top, width) {
  fetch(src)
    .then((response) => response.blob())
    .then((blob) => {
      const reader = new FileReader();
      reader.onloadend = function () {
        const base64Image = reader.result;

        canvas.getObjects().forEach(function (obj) {
          if (obj.className === "logo") {
            canvas.remove(obj);
          }
        });

        // Now use the Base64 image data with Fabric.js
        fabric.Image.fromURL(base64Image, function (img) {
          // Get the canvas width and height
          const canvasWidth = canvas.getWidth();
          const canvasHeight = canvas.getHeight();

          const windowWidth = window.innerWidth;
          // Calculate the aspect ratio of the image
          const imgAspectRatio = img.width / img.height;
          let finalMaxWidth = maxWidth;

          windowWidth <= 1300 ? (finalMaxWidth = 75) : (finalMaxWidth = 100);
          windowWidth <= 1024 ? (finalMaxWidth = 75) : (finalMaxWidth = 100);
          windowWidth <= 500 ? (finalMaxWidth = 100) : (finalMaxWidth = 100);
          windowWidth <= 320 ? (finalMaxWidth = 75) : (finalMaxWidth = 100);

          // Scale the image based on maxWidth while maintaining the aspect ratio
          let newWidth = finalMaxWidth;
          let newHeight = newWidth / imgAspectRatio;

          // If the height is too large, adjust based on maxHeight (if you want a maxHeight)
          if (newHeight > canvasHeight) {
            newHeight = canvasHeight;
            newWidth = newHeight * imgAspectRatio;
          }

          // Calculate the position to center the logo (if desired)
          let left = (canvasWidth - newWidth) / 2;
          const newleft =
            chosenModel == "round" ? 50 : (canvasWidth - newWidth) / 2;
          left = newleft;

          if (chosenCurrentModel.includes('120') && chosenModel == 'sipper') {
            left = 50;
          }

          let top_value = 30;

          if ((chosenCurrentModel.includes('500') && chosenModel == 'round') ) {
            top_value = 100;
            if (windowWidth > 1351 && windowWidth < 1600) {
              top_value = 75; 
             }
            else if (windowWidth < 1350) {
              top_value = 50; 
            }
          }


          else if ((chosenCurrentModel.includes('750') && chosenModel == 'round') || (chosenCurrentModel.includes('120') && chosenModel == 'sipper') ) {
            top_value = 50;
            if (windowWidth > 1351 && windowWidth < 1600) {
              top_value = 30; 
             }
            else if (windowWidth < 1350) {
              top_value = 20; 
            }
          }

          else if (chosenModel == 'round') {
            if (windowWidth < 1350) {
              top_value = 15;
            }
          }

          const topPosition = (top || (canvasHeight - newHeight) / 2) + top_value; // Use provided 'top' or center

          img.set({
            left: left,
            top: topPosition,
            scaleX: newWidth / img.width,
            scaleY: newHeight / img.height,
            hasControls: true,
            hasBorders: true,
            className: "logo",
            isDelete: false,
          });

          // Add the image to the canvas
          canvas.add(img);
          canvas.renderAll();

          logoProperties = {
            top: topPosition,
            left: left,
          };

          isLogoAdded = false;
        });
      };

      reader.readAsDataURL(blob);
    });
}

function addText(textContent, color, baseFontSize = 16) {
  // Check if a text object with class 'businessText' already exists
  const existingText = canvas
    .getObjects()
    .find((obj) => obj.className === "businessText");

  // Get canvas width and height
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();

  // Get window width for responsive design
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // Initialize fontSizeValue and position values
  let fontSizeValue = baseFontSize;
  let topPercentage = 0.1; // Default 10% from the top of the canvas
  let leftPercentage = 0.1; // Default 10% from the left of the canvas

  fontSizeValue = baseFontSize * 0.3;
  topPercentage = 2;
  leftPercentage = 0.68;

  topPercentage = chosenModel == "round" ? 0.5 : 2;
  leftPercentage = chosenModel == "round" ? 1.35 : 0.68;

  if (chosenCurrentModel.includes('120') && chosenModel == 'sipper') {
    leftPercentage = 1.35;
    topPercentage = 0.8;
  }
  

  if (chosenCurrentModel.includes('500') && chosenModel == 'round') {
    topPercentage = 1;
  }
  if (chosenCurrentModel.includes('750') && chosenModel == 'round') {
    topPercentage = 0.65;
  }

  const top = canvasHeight * topPercentage;
  let left = canvasWidth * leftPercentage;

//   if (chosenModel !== "round") {
//   const windowWidth = window.innerWidth;

//   // Set a max width based on window size (optional)
//   let finalMaxWidth = 50; // default
//   if (windowWidth <= 320) finalMaxWidth = 75;
//   else if (windowWidth <= 1024) finalMaxWidth = 75;

//   // We'll center using Fabric.js properties instead of manual math
//   left = canvasWidth * 1.4;
// }


  const text = new fabric.Text(textContent, {
    left: left, // Set the left position based on the percentage of canvas width
    top: top, // Set the top position based on the percentage of canvas height
    fill: color,
    fontSize: fontSizeValue,
    fontFamily: "Arial",
    className: "businessText",
    isDelete: false,
  });

  // console.log("existingText: " + existingText);
  if (existingText) {
    existingText.set({
      fill: color,
    });
    canvas.renderAll();
  } else {
    canvas.add(text);
    // console.log("New text");
    canvas.renderAll();
  }

  textProperties = {
    top: text.top,
    left: text.left,
  };
}


function addAddressText(textContent, color, left1, top1, baseFontSize = 16) {
  const existingText = canvas
    .getObjects()
    .find((obj) => obj.className === "addressText");

  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();

  // Initialize fontSizeValue and position values
  let fontSizeValue = baseFontSize;
  let bottomOffset = 0.1; // Default 10% from the bottom of the canvas
  let leftPercentage = 0.1; // Default 10% from the left of the canvas

  fontSizeValue = baseFontSize * 0.8; // Default font size
  bottomOffset = -18;
  bottomOffset = chosenModel == "round" ? 4.5 : -18;
  leftPercentage = 0.7;

  leftPercentage = chosenModel == "round" ? 2.35 : 0.7;

  if (chosenCurrentModel.includes('500') && chosenModel == 'round') {
    bottomOffset = 0.15;
  }
  if (chosenCurrentModel.includes('750') && chosenModel == 'round') {
    bottomOffset = 3.75;
  }

    if (chosenCurrentModel.includes('120') && chosenModel == 'sipper') {
    leftPercentage = 2.5;
    bottomOffset = 2.75;
  }
  
  

  const bottom = (canvasHeight * bottomOffset) / 10; // Adjust the bottom percentage to fit canvas height
  const top = canvasHeight - bottom; // Set the top position relative to the bottom

  // Calculate left position
  let left = canvasWidth * leftPercentage;
  console.log(`Left value before if: ${left}`);

// if (chosenModel !== "round") {
//   const windowWidth = window.innerWidth;

//   // Set a max width based on window size (optional)
//   let finalMaxWidth = 50; // default
//   if (windowWidth <= 320) finalMaxWidth = 75;
//   else if (windowWidth <= 1024) finalMaxWidth = 75;

//   // We'll center using Fabric.js properties instead of manual math
//   left = canvasWidth * 1.4;
// }


console.log(`Value of left: ${left}`);

  if (existingText) {
    // Update properties of the existing text
    existingText.set({
      fill: color,
    });
    // Re-render the canvas after updating the object
    canvas.renderAll();
  } else {
    // If no existing text object is found, create a new one
    const text = new fabric.Text(textContent, {
      left: left,
      top: top,
      fill: color,
      fontSize: fontSizeValue,
      fontFamily: "Arial",
      className: "addressText",
      isDelete: false,
    });
    canvas.add(text);

    addressProperties = {
      top: text.top,
      left: text.left,
    };

    defaultXPosition = text.left;
    defaultYPosition = text.top;
  }
}

let defaultXPosition = 0;
let defaultYPosition = 0;
let isChanged = false;

// Event listener for selecting a template (for example from dropdown or other interface)
document.querySelectorAll(".dropdown-content1 img").forEach((img) => {
  img.addEventListener("click", function (e) {
    if (img.classList.contains("custom-template-button")) {
      return;
    }
    document
      .querySelectorAll(".dropdown-content1 img")
      .forEach((btn) => btn.classList.remove("selected"));
    e.target.classList.add("selected");
    const templateNumber = parseInt(img.getAttribute("template-no")); // Assuming each image has a data-templateNumber attribute
    const theme = img.getAttribute("data-theme"); // Assuming each image has a data-templateNumber attribute

    const getImageSrc = img.src;

    tapColor = img.getAttribute("tap-color");

    if (templateNumber == 9 || templateNumber == "9") {
      changeAddressAlignment("yes", 9);
    } else if (templateNumber == 16 || templateNumber == "16") {
      changeAddressAlignment("yes", 16);
    } else {
      changeAddressAlignment("no", null);
    }

    setBackgroundImage(getImageSrc, true);
    // addTemplateItems(parseInt(templateNumber));
    doTemplateChangeWithCustomText(theme);
  });
});
function doTemplateChangeWithCustomText(theme) {
  addTemplateItemsWithCustomText(theme);
}
let lastTemplateClicked = null; // Keep track of the last clicked template number

function changeAddressAlignment(checkCondition, templateNumber) {
  let addressText = canvas
    .getObjects()
    .find((obj) => obj.className === "addressText"); // Assuming you have a reference to your addressText object

  // If the same template is clicked again, do nothing
  if (templateNumber === lastTemplateClicked) {
    return;
  }
  // Check if the template is 9 or 16 and apply alignment adjustments
  if (!isChanged && checkCondition === "yes") {
    // Store initial position
    let topAdjustableValue = 0;

    if (window.innerWidth > 1500 && window.innerWidth < 1575) {
      // Special handling for templates 9 and 16
      if (templateNumber === 9) {
        topAdjustableValue = defaultYPosition + 20; // Adjust the top position for template 9
      } else if (templateNumber === 16) {
        topAdjustableValue = defaultYPosition - 35; // Adjust the top position for template 16
      } else {
        // For other templates, no adjustment is needed
        topAdjustableValue = defaultYPosition;
      }

      // Slightly adjust the top position
      addressText.set({
        top: topAdjustableValue, // Adjust the value as needed
      });
    }
    canvas.renderAll(); // Re-render the canvas to apply the changes
    isChanged = true;

    // Save the template clicked
    lastTemplateClicked = templateNumber;
  } else if (isChanged && checkCondition === "no") {
    // Revert to original position when the condition is 'no'
    addressText.set({
      top: defaultYPosition,
      left: defaultXPosition,
    });
    canvas.renderAll(); // Re-render the canvas to apply the changes

    // Reset variables

    isChanged = false;

    // Reset the last clicked template
    lastTemplateClicked = null;
  }
}


function doTemplateChange(numb) {
  addTemplateItems(numb);
}

// for brining first template logo and texts
addTemplateItems(1);

// ********************************************** For business text **********************************************

function updateBusinessText() {
  const textAreaValue = document.getElementById("textArea").value.trim();
  const textContent = textAreaValue.length > 0 ? textAreaValue : "Company Name";

  // Chec0 if a text object with class 'businessText' already exists
  const existingText = canvas
    .getObjects()
    .find((obj) => obj.className === "businessText");

  if (existingText) {
    // Update properties of the existing text
    existingText.set({
      text: textContent, // Update the text content
      left: existingText.left, // Maintain current position
      top: existingText.top,
      fill: existingText.fill, // Maintain current color
      fontSize: existingText.fontSize, // Maintain current font size
    });
    // Re-render the canvas after updating the object
    canvas.renderAll();
  } else {
    // If no existing text object is found, create a new one
    const text = new fabric.Text(textContent, {
      left: 100, // Default position
      top: 100,
      fill: "#000000", // Default color
      fontSize: 24,
      fontFamily: "Arial",
      className: "businessText",
      isDelete: false,
    });
    canvas.add(text);
  }
}

// Listen for input changes in the textarea
document
  .getElementById("textArea")
  .addEventListener("input", updateBusinessText);

// Call the function initially to set the default text
updateBusinessText();

// font family

function updateFontFamily() {
  const fontFamily = document.getElementById("Font-family1").value;

  // Check if a text object with class 'businessText' already exists
  const existingText = canvas
    .getObjects()
    .find((obj) => obj.className === "businessText");

  if (existingText) {
    // Update the font family of the existing text object
    existingText.set({
      fontFamily: fontFamily,
    });

    // Re-render the canvas after updating the object
    canvas.renderAll();
  }
}

function updateFontFamilyCustom(fontPath, fontNo) {
  const fontFamily = `customFont${fontNo}`; // Choose a name for the font family
  const font = new FontFace(fontFamily, `url(${fontPath})`);

  // Load the font
  font
    .load()
    .then(function (loadedFont) {
      // Add the font to the document
      document.fonts.add(loadedFont);

      // Check if a text object with class 'businessText' already exists
      const existingText = canvas
        .getObjects()
        .find((obj) => obj.className === "businessText");

      if (existingText) {
        // Update the font family of the existing text object
        existingText.set({
          fontFamily: fontFamily,
        });

        // Re-render the canvas after updating the object
        canvas.renderAll();
      }
    })
    .catch(function (error) {
      console.error("Failed to load font:", error);
    });
}

// Add event listener to update font family when the dropdown changes
document
  .getElementById("Font-family1")
  .addEventListener("change", updateFontFamily);

// font style

function updateFontStyle() {
  const fontStyle = document.getElementById("font-style1").value;

  // Check if a text object with class 'businessText' already exists
  const existingText = canvas
    .getObjects()
    .find((obj) => obj.className === "businessText");

  if (existingText) {
    let fontWeight = "normal";
    let fontStyleValue = "normal";
    let underline = false;

    // Check the selected font style and update the corresponding properties
    if (fontStyle.includes("bold")) {
      fontWeight = "bold";
    }
    if (fontStyle.includes("italic")) {
      fontStyleValue = "italic";
    }
    if (fontStyle === "underline") {
      underline = true;
    }

    // Update the style properties of the existing text object
    existingText.set({
      fontWeight: fontWeight,
      fontStyle: fontStyleValue,
      underline: underline,
    });

    // Re-render the canvas after updating the object
    canvas.renderAll();
  }
}

document
  .getElementById("font-style1")
  .addEventListener("change", updateFontStyle);

// text alignment:
const alignmentIcons = document.querySelectorAll(".alignment1 .alignment-icon");

// Function to update the alignment of the businessText class object
function updateTextAlignment(alignment) {
  const existingText = canvas
    .getObjects()
    .find((obj) => obj.className === "businessText");

  if (existingText) {
    // Update the text alignment based on the selected icon
    existingText.set({
      textAlign: alignment,
    });
    // Re-render the canvas after updating the object
    canvas.renderAll();
  }
}

// Add click event listeners for each alignment icon
alignmentIcons.forEach((icon) => {
  icon.addEventListener("click", function () {
    // Remove 'selected' class from all icons
    alignmentIcons.forEach((item) => item.classList.remove("selected"));

    // Add 'selected' class to the clicked icon
    this.classList.add("selected");

    // Update alignment based on clicked icon
    if (this.id === "left-align") {
      updateTextAlignment("left");
    } else if (this.id === "center-align") {
      updateTextAlignment("center");
    } else if (this.id === "right-align") {
      updateTextAlignment("right");
    } else if (this.id === "tidyup-align") {
      updateTextAlignment("justify");
    }
  });
});

// color change
const colorPicker = document.getElementById("color-picker1");

// Function to update the color of the businessText class object
function updateTextColor(color) {
  const existingText = canvas
    .getObjects()
    .find((obj) => obj.className === "businessText");

  if (existingText) {
    // Update the text color with the selected color
    existingText.set({
      fill: color, // Set the color to the selected color
    });

    // Re-render the canvas after updating the object
    canvas.renderAll();
  }
}

// Add an event listener to the color picker to update the text color
colorPicker.addEventListener("input", function () {
  const selectedColor = colorPicker.value; // Get the selected color value
  updateTextColor(selectedColor); // Update the color of the businessText
});

// font size
const fontSizeInput = document.getElementById("numberInput1");

// Function to update the font size of the businessText class object
function updateFontSize(fontSize) {
  const existingText = canvas
    .getObjects()
    .find((obj) => obj.className === "businessText");

  if (existingText) {
    // Update the font size of the existing text object
    existingText.set({
      fontSize: fontSize, // Set the font size to the new value
    });

    // Re-render the canvas after updating the object
    canvas.renderAll();
  }
}

// Add event listener to the font size input to update the font size
fontSizeInput.addEventListener("input", function () {
  const newFontSize = parseInt(fontSizeInput.value, 10); // Get the value of the input and parse it as an integer
  updateFontSize(newFontSize); // Update the font size of the businessText
});

//  ************************** Business text code ends here **************************

// ******************************************** Logo code starts here ********************************************
function uploadLogo(src, maxWidth = 175, maxHeight = 175) {
  console.log("🟡 uploadLogo called with:", src);

  fetch(src)
    .then((response) => response.blob())
    .then((blob) => {
      const reader = new FileReader();

      reader.onloadend = function () {
        const base64Image = reader.result;
        console.log(
          "📦 Image loaded into base64, creating offscreen canvas..."
        );

        // Create offscreen canvas
        const tempCanvas = document.createElement("canvas");
        const ctx = tempCanvas.getContext("2d");
        maxWidth = 100;
        maxHeight = 100;
        tempCanvas.width = maxWidth;
        tempCanvas.height = maxHeight;

        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = function () {
          console.log(
            "✅ Original image loaded. Size:",
            img.width,
            "x",
            img.height
          );

          const imgWidth = img.width;
          const imgHeight = img.height;

          if (imgWidth === 0 || imgHeight === 0) {
            console.warn("⚠️ Image dimensions invalid.");
            return;
          }

          // Compute scale ratio
          const widthRatio = maxWidth / imgWidth;
          const heightRatio = maxHeight / imgHeight;
          const scaleRatio = Math.min(widthRatio, heightRatio);

          const scaledWidth = imgWidth * scaleRatio;
          const scaledHeight = imgHeight * scaleRatio;
          const offsetX = (maxWidth - scaledWidth) / 2;
          const offsetY = (maxHeight - scaledHeight) / 2;

          console.log(
            `📏 ScaleRatio: ${scaleRatio.toFixed(
              3
            )} | ScaledSize: ${scaledWidth.toFixed(1)}x${scaledHeight.toFixed(
              1
            )} | Offset: (${offsetX.toFixed(1)}, ${offsetY.toFixed(1)})`
          );

          ctx.clearRect(0, 0, maxWidth, maxHeight);
          ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

          const processedDataURL = tempCanvas.toDataURL("image/png");

          // Fabric will now load the processed image
          fabric.Image.fromURL(
            processedDataURL,
            function (finalImg) {
              console.log(
                "🧩 Fabric image created:",
                finalImg.width,
                "x",
                finalImg.height
              );
              
          const windowWidth = window.innerWidth;
          const canvasWidth = canvas.getWidth();
          let finalMaxWidth = maxWidth;

          windowWidth <= 1300 ? (finalMaxWidth = 75) : (finalMaxWidth = 100);
          windowWidth <= 1024 ? (finalMaxWidth = 75) : (finalMaxWidth = 100);
          windowWidth <= 500 ? (finalMaxWidth = 100) : (finalMaxWidth = 100);
          windowWidth <= 320 ? (finalMaxWidth = 75) : (finalMaxWidth = 100);

          // Scale the image based on maxWidth while maintaining the aspect ratio
          let newWidth = finalMaxWidth;
              const newleft =
            chosenModel == "round" ? 50 : (canvasWidth - newWidth) / 2;

              finalImg.set({
                left: newleft,
                top: 45,
                hasControls: true,
                hasBorders: true,
                selectable: true,
                evented: true,
                className: "logo",
              });

              // Check existing logo
              // Check existing logo
              const existingLogo = canvas
                .getObjects()
                .find((obj) => obj.className === "logo");

              if (existingLogo) {
                console.log("🔄 Removing existing logo and adding new one...");
                canvas.remove(existingLogo);
              }

              // Always add the fresh logo
              canvas.add(finalImg);
              canvas.setActiveObject(finalImg);

              finalImg.bringToFront(); // optional
              canvas.renderAll();

              console.log(
                `🎯 New logo added at (${finalImg.left}, ${finalImg.top}) | Draggable: ${finalImg.selectable}`
              );

              canvas.renderAll();
              console.log("✅ Canvas render complete");
            },
            { crossOrigin: "anonymous" }
          );
        };

        img.onerror = function () {
          console.error("❌ Failed to load image:", src);
        };

        img.src = base64Image;
      };

      isLogoAdded = true;
      reader.readAsDataURL(blob);
    })
    .catch((err) => console.error("🚨 Upload logo failed:", err));
}

const fileInputElement = document.getElementById("fileInput");
const fileSelectionText = document.getElementById("uploadText");
const uploadSection = document.querySelector(".uploadsec1");
const uploadArea = document.getElementById("uploadArea");
const mainLogo = document.getElementById("logoImage");

// Open file input dialog when clicking the upload area
uploadArea.addEventListener("click", function () {
  fileInputElement.click();
});

let flag = 0;
// Handle file selection
fileInputElement.addEventListener("change", function () {
  const file = fileInputElement.files[0];
  if (file) {
    fileSelectionText.innerText = `File selected: ${file.name}`;
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      uploadLogo(event.target.result);
      hideDropdown();
    };
    fileReader.readAsDataURL(file);
  }
});

function hideDropdown() {
  document.getElementById("upload1").click();
  toggleUploadDropdown();
}

// Call the function after the DOM is loaded
// Enable drag-and-drop functionality with keyboard and mouse support
uploadSection.addEventListener("dragover", function (event) {
  event.preventDefault();
  uploadArea.classList.add("dragover"); // Visual cue when dragging over
});

uploadSection.addEventListener("dragleave", function () {
  uploadArea.classList.remove("dragover");
});

uploadSection.addEventListener("drop", function (event) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file) {
    fileSelectionText.innerText = `File selected: ${file.name}`;
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      uploadLogo(event.target.result);
    };
    fileReader.readAsDataURL(file);
  }
});

// Keyboard interaction: Open file input on Enter or Space key press
uploadArea.addEventListener("keydown", function (event) {
  if (event.key === "Enter" || event.key === " ") {
    fileInputElement.click();
  }
});

// Ensure drag-and-drop area is focusable
uploadArea.setAttribute("tabindex", "0");
uploadArea.setAttribute("role", "button");

// ******************************************** Logo code ends here ********************************************

// ******************************************** Address code starts here ********************************************

function updateAddressText() {
  const textAreaValue = document.getElementById("textArea1").value.trim();
  const textContent =
    textAreaValue.length > 0 ? textAreaValue : "Your Address Here";

  // Check if a text object with class 'businessText' already exists
  const existingText = canvas
    .getObjects()
    .find((obj) => obj.className === "addressText");

  if (existingText) {
    // Update properties of the existing text
    existingText.set({
      text: textContent, // Update the text content
      left: existingText.left, // Maintain current position
      top: existingText.top,
      fill: existingText.fill, // Maintain current color
      fontSize: existingText.fontSize, // Maintain current font size
    });
    // Re-render the canvas after updating the object
    canvas.renderAll();
  } else {
    // If no existing text object is found, create a new one
    const text = new fabric.Text(textContent, {
      left: 100, // Default position
      top: 100,
      fill: "#000000", // Default color
      fontSize: 24,
      fontFamily: "Arial",
      className: "addressText",
      isDelete: false,
    });
    canvas.add(text);
  }
}

// Listen for input changes in the textarea
document
  .getElementById("textArea1")
  .addEventListener("input", updateAddressText);

// Call the function initially to set the default text
updateAddressText();

// font family

function updateFontFamilyAddress() {
  const fontFamily = document.getElementById("addressFont-family1").value;

  // Check if a text object with class 'businessText' already exists
  const existingText = canvas
    .getObjects()
    .find((obj) => obj.className === "addressText");

  if (existingText) {
    // Update the font family of the existing text object
    existingText.set({
      fontFamily: fontFamily,
    });

    // Re-render the canvas after updating the object
    canvas.renderAll();
  }
}

// Add event listener to update font family when the dropdown changes
document
  .getElementById("addressFont-family1")
  .addEventListener("change", updateFontFamilyAddress);

function updateFontFamilyCustomText() {
  const fontFamily = document.getElementById("CustomTextFont-family1").value;

  // Check if a text object with class 'businessText' already exists
  const existingText = canvas
    .getObjects()
    .find((obj) => obj.className === "CustomTextText");

  if (existingText) {
    // Update the font family of the existing text object
    existingText.set({
      fontFamily: fontFamily,
    });

    // Re-render the canvas after updating the object
    canvas.renderAll();
  }
}


// Utility to toggle a style property on the 'addressText' object
// Toggle function for font styles
function toggleTextStyle(styleType) {
  const textObj = canvas
    .getObjects()
    .find((obj) => obj.className === "addressText");

  if (!textObj) return;

  const button = document.getElementById(`address-${styleType}`);
  let update = {};

  switch (styleType) {
    case "bold":
      const isBold = textObj.fontWeight === "bold";
      update.fontWeight = isBold ? "normal" : "bold";
      button.classList.toggle("text-style-active", !isBold);
      break;

    case "italic":
      const isItalic = textObj.fontStyle === "italic";
      update.fontStyle = isItalic ? "normal" : "italic";
      button.classList.toggle("text-style-active", !isItalic);
      break;

    case "underline":
      const isUnderlined = textObj.underline === true;
      update.underline = !isUnderlined;
      button.classList.toggle("text-style-active", !isUnderlined);
      break;
  }

  textObj.set(update);
  canvas.renderAll();
}

// Attach event listeners
document
  .getElementById("address-bold")
  .addEventListener("click", () => toggleTextStyle("bold"));
document
  .getElementById("address-italic")
  .addEventListener("click", () => toggleTextStyle("italic"));
document
  .getElementById("address-underline")
  .addEventListener("click", () => toggleTextStyle("underline"));

// text alignment:
const alignmentIconsAddress = document.querySelectorAll(
  ".addressalignment1 .alignment-icon"
);

// Function to update the alignment of the addressText class object
function updateTextAlignmentAddress(alignment) {
  const existingText = canvas
    .getObjects()
    .find((obj) => obj.className === "addressText");

  if (existingText) {
    // Update the text alignment based on the selected icon
    existingText.set({
      textAlign: alignment,
    });
    // Re-render the canvas after updating the object
    canvas.renderAll();
  }
}

// Add click event listeners for each alignment icon
alignmentIconsAddress.forEach((icon) => {
  icon.addEventListener("click", function () {
    // Remove 'selected' class from all icons
    alignmentIconsAddress.forEach((item) => item.classList.remove("selected"));

    // Add 'selected' class to the clicked icon
    this.classList.add("selected");

    // Update alignment based on clicked icon
    if (this.id === "left-align") {
      updateTextAlignmentAddress("left");
    } else if (this.id === "center-align") {
      updateTextAlignmentAddress("center");
    } else if (this.id === "right-align") {
      updateTextAlignmentAddress("right");
    } else if (this.id === "tidyup-align") {
      updateTextAlignmentAddress("justify");
    }
  });
});

// color change
const colorPickerAddress = document.getElementById("address-color-picker1");

// Function to update the color of the businessText class object
function updateTextColorAddress(color) {
  const existingText = canvas
    .getObjects()
    .find((obj) => obj.className === "addressText");

  if (existingText) {
    // Update the text color with the selected color
    existingText.set({
      fill: color, // Set the color to the selected color
    });

    // Re-render the canvas after updating the object
    canvas.renderAll();
  }
}

// Add an event listener to the color picker to update the text color
colorPickerAddress.addEventListener("input", function () {
  const selectedColor = colorPickerAddress.value; // Get the selected color value
  updateTextColorAddress(selectedColor); // Update the color of the addressText
});

// font size
const fontSizeInputAddress = document.getElementById("addressnumberInput1");

// Function to update the font size of the addressText class object
function updateFontSizeAddress(fontSize) {
  const existingText = canvas
    .getObjects()
    .find((obj) => obj.className === "addressText");

  if (existingText) {
    // Update the font size of the existing text object
    existingText.set({
      fontSize: fontSize, // Set the font size to the new value
    });

    // Re-render the canvas after updating the object
    canvas.renderAll();
  }
}

// Add event listener to the font size input to update the font size
fontSizeInputAddress.addEventListener("input", function () {
  const newFontSize = parseInt(fontSizeInputAddress.value, 10); // Get the value of the input and parse it as an integer
  updateFontSizeAddress(newFontSize); // Update the font size of the businessText
});

// ******************************************** Address code ends here ********************************************

// ******************************************** Promotion image code starts here ********************************************

const radioButtons = document.querySelectorAll('input[name="upload"]');
const promotionImageUploadSection = document.querySelector(".upload2");
const promotionFileInput = document.getElementById("fileInput2");
const promotionFileSelectionText = document.getElementById("uploadText2");

function addPromotionImageToCanvas() {
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();
  const maxWidth = 200; // Maximum width in pixels

  // Create a new fabric image from the URL
  fabric.Image.fromURL("./assets/images/promotionhere.png", function (img) {
    // Get the current image's width and height
    const imgWidth = img.width;
    const imgHeight = img.height;

    // Calculate the scale ratio based on the maximum width
    let scaleX = 1;
    let scaleY = 1;

    if (imgWidth > maxWidth) {
      scaleX = maxWidth / imgWidth; // Calculate the scale to fit within maxWidth
      scaleY = scaleX; // Keep the aspect ratio the same
    }

    // Apply scaling
    img.set({
      scaleX: scaleX,
      scaleY: scaleY,
    });

    // Calculate the new position to center the image
    const centerX = (canvasWidth - imgWidth * scaleX) / 2;
    const centerY = (canvasHeight - imgHeight * scaleY) / 2;

    // Set the image position to the center
    img.set({
      left: centerX,
      top: centerY,
      hasControls: true,
      hasBorders: true,
      className: "promotionImage",
    });

    imageProperties = {
      top: centerY,
      left: centerX,
    };

    // Add the image to the canvas
    canvas.add(img);
    canvas.renderAll();
  });
}

radioButtons.forEach((radio) => {
  radio.addEventListener("change", function () {
    if (this.value === "yes") {
      // Show the upload section and enable the file input
      promotionImageUploadSection.style.display = "block";
      promotionFileInput.disabled = false;

      // Add the promotion image to the canvas
      addPromotionImageToCanvas();
    } else {
      // Hide the upload section and disable the file input
      promotionImageUploadSection.style.display = "none";
      promotionFileInput.disabled = true;

      // Remove the promotion image from the canvas if it exists
      const promotionImage = canvas
        .getObjects()
        .find((obj) => obj.className === "promotionImage");
      if (promotionImage) {
        canvas.remove(promotionImage);
        canvas.renderAll();
      }
    }
  });
});

function updatePromotionImage(src, maxWidth = 175, maxHeight = 175) {
  fetch(src)
    .then((response) => response.blob())
    .then((blob) => {
      const reader = new FileReader();
      reader.onloadend = function () {
        const base64Image = reader.result;

        // Check if an object with class 'logo' already exists
        const existingLogo = canvas
          .getObjects()
          .find((obj) => obj.className === "promotionImage");

        if (existingLogo) {
          // If the logo already exists, update its source image
          fabric.Image.fromURL(base64Image, function (img) {
            // Calculate the scale based on maxWidth and maxHeight while preserving aspect ratio
            const imgWidth = img.width;
            const imgHeight = img.height;

            let scaleX = 1;
            let scaleY = 1;

            if (imgWidth > maxWidth || imgHeight > maxHeight) {
              const widthRatio = maxWidth / imgWidth;
              const heightRatio = maxHeight / imgHeight;
              const scaleRatio = Math.min(widthRatio, heightRatio); // Maintain aspect ratio

              scaleX = scaleY = scaleRatio;
            }

            // Update the existing logo's image source
            existingLogo.setElement(img.getElement());
            existingLogo.set({
              scaleX: scaleX, // Adjusted scale
              scaleY: scaleY, // Adjusted scale
            });

            // Re-render the canvas
            canvas.renderAll();
          });
        } else {
         
        }
      };

      // Read the image file as a data URL
      reader.readAsDataURL(blob);
    });
}

// Handle file input change event
promotionFileInput.addEventListener("change", function () {
  const file2 = promotionFileInput.files[0];
  if (file2) {
    promotionFileSelectionText.innerText = `File selected: ${file2.name}`;

    const fileReader2 = new FileReader();
    fileReader2.onload = function (event) {
      const imageSrc = event.target.result;
      updatePromotionImage(imageSrc); // Update the promotion image
    };

    fileReader2.readAsDataURL(file2);
  }
});

// Handle drop event in the promotional image upload section
promotionImageUploadSection.addEventListener("drop", function (event) {
  event.preventDefault();
  const file2 = event.dataTransfer.files[0];
  if (file2) {
    promotionFileSelectionText.innerText = `File selected: ${file2.name}`;

    const fileReader2 = new FileReader();
    fileReader2.onload = function (event) {
      const imageSrc = event.target.result;
      updatePromotionImage(imageSrc); // Update the promotion image
    };

    fileReader2.readAsDataURL(file2);
  }
});

// ******************************************** Promotion image code ends here ********************************************

// ******************************************* qr image code starts here **************************************************

const radioButtonsQR = document.querySelectorAll('input[name="uploadQR"]');
const qrImageUploadSection = document.querySelector(".upload3");
const qrFileInput = document.getElementById("fileInput3");
const qrFileSelectionText = document.getElementById("uploadText3");

radioButtonsQR.forEach((radio) => {
  radio.addEventListener("change", function () {
    if (this.value === "yes") {
      // Show the upload section and enable the file input
      qrImageUploadSection.style.display = "block";
      qrFileInput.disabled = false;

      // Add the qr image to the canvas
      addqrImageToCanvas();
    } else {
      // Hide the upload section and disable the file input
      qrImageUploadSection.style.display = "none";
      qrFileInput.disabled = true;

      // Remove the qr image from the canvas if it exists
      const qrImage = canvas
        .getObjects()
        .find((obj) => obj.className === "qrImage");
      if (qrImage) {
        canvas.remove(qrImage);
        canvas.renderAll();
      }
    }
  });
});

function addqrImageToCanvas() {
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();
  const maxWidth = 75; // Maximum width in pixels

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  let topFactor = 120;
  if (windowWidth <= 768) {
    topFactor = 112;
  } else if (windowWidth <= 1400) {
    topFactor = 90;
  } else if (windowWidth <= 1400) {
    topFactor = 90;
  } else {
    topFactor = 150;
  }

  // Create a new fabric image from the URL
  fabric.Image.fromURL("./assets/images/qrWhite.png", function (img) {
    // Get the current image's width and height
    const imgWidth = img.width;
    const imgHeight = img.height;

    // Calculate the scale ratio based on the maximum width
    let scaleX = 1;
    let scaleY = 1;

    if (imgWidth > maxWidth) {
      scaleX = maxWidth / imgWidth; // Calculate the scale to fit within maxWidth
      scaleY = scaleX; // Keep the aspect ratio the same
    }

    // Apply scaling
    img.set({
      scaleX: scaleX,
      scaleY: scaleY,
    });

    // Calculate the new position to center the image
    const centerX = (canvasWidth - imgWidth * scaleX) / 2;
    const centerY = (canvasHeight - imgHeight * scaleY) / 2;

    // Set the image position to the center
    img.set({
      left: centerX,
      top: centerY + topFactor,
      hasControls: true,
      hasBorders: true,
      className: "qrImage",

      // uncomment the below to disable movement of the qr image
      // lockMovementX: true,
      // lockMovementY: true,
    });

    qrProperties = {
      top: centerY + topFactor,
      left: centerX,
    };

    // Add the image to the canvas
    canvas.add(img);
    canvas.renderAll();
  });
}

function updateQRImage(src, maxWidth = 75, maxHeight = 75) {
  fetch(src)
    .then((response) => response.blob())
    .then((blob) => {
      const reader = new FileReader();
      reader.onloadend = function () {
        const base64Image = reader.result;

        // Check if an object with class 'logo' already exists
        const existingLogo = canvas
          .getObjects()
          .find((obj) => obj.className === "qrImage");

        if (existingLogo) {
          // If the logo already exists, update its source image
          fabric.Image.fromURL(base64Image, function (img) {
            // Calculate the scale based on maxWidth and maxHeight while preserving aspect ratio
            const imgWidth = img.width;
            const imgHeight = img.height;

            let scaleX = 1;
            let scaleY = 1;

            if (imgWidth > maxWidth || imgHeight > maxHeight) {
              const widthRatio = maxWidth / imgWidth;
              const heightRatio = maxHeight / imgHeight;
              const scaleRatio = Math.min(widthRatio, heightRatio); // Maintain aspect ratio

              scaleX = scaleY = scaleRatio;
            }

            // Update the existing logo's image source
            existingLogo.setElement(img.getElement());
            existingLogo.set({
              scaleX: scaleX, // Adjusted scale
              scaleY: scaleY, // Adjusted scale
            });

            // Re-render the canvas
            canvas.renderAll();
          });
        } else {
          // If the logo doesn't exist, create a new one
          fabric.Image.fromURL(base64Image, function (img) {
            // Calculate the scale based on maxWidth and maxHeight while preserving aspect ratio
            const imgWidth = img.width;
            const imgHeight = img.height;

            let scaleX = 1;
            let scaleY = 1;

            if (imgWidth > maxWidth || imgHeight > maxHeight) {
              const widthRatio = maxWidth / imgWidth;
              const heightRatio = maxHeight / imgHeight;
              const scaleRatio = Math.min(widthRatio, heightRatio); // Maintain aspect ratio

              scaleX = scaleY = scaleRatio;
            }

            img.set({
              scaleX: scaleX, // Adjusted scale
              scaleY: scaleY, // Adjusted scale
              hasControls: true,
              hasBorders: true,
              className: "qrImage",
            });

            // Add the new image to the canvas
            canvas.add(img);
            canvas.renderAll();
          });
        }
      };

      // Read the image file as a data URL
      reader.readAsDataURL(blob);
    });
}

// Handle file input change event
qrFileInput.addEventListener("change", function () {
  const file2 = qrFileInput.files[0];
  if (file2) {
    qrFileSelectionText.innerText = `File selected: ${file2.name}`;

    const fileReader2 = new FileReader();
    fileReader2.onload = function (event) {
      const imageSrc = event.target.result;
      updateQRImage(imageSrc); // Update the promotion image
    };

    fileReader2.readAsDataURL(file2);
  }
});

// Handle drop event in the promotional image upload section
qrImageUploadSection.addEventListener("drop", function (event) {
  event.preventDefault();
  const file2 = event.dataTransfer.files[0];
  if (file2) {
    qrFileSelectionText.innerText = `File selected: ${file2.name}`;

    const fileReader2 = new FileReader();
    fileReader2.onload = function (event) {
      const imageSrc = event.target.result;
      updateQRImage(imageSrc); // Update the promotion image
    };

    fileReader2.readAsDataURL(file2);
  }
});


// ****************************************** qr image code ends here ******************************************************

// ************************************************** Add constraints to prevent objects going outside canvas ***************************************************

let isRepositioning = false; // Flag to prevent repeated alerts and infinite loop

let previousAngle = null; // Store the previous angle value


canvas.on("object:moving", function (event) {
  if (isRepositioning) return; // Prevent re-triggering during repositioning

  const obj = event.target;
  obj.setCoords();
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  // Calculate object boundaries considering scale
  const left = obj.left;
  const top = obj.top;
  const right = left + obj.width * obj.scaleX;
  const bottom = top + obj.height * obj.scaleY;

  // Apply different edge thresholds for left and right for 'secondTwo' pattern

  // Check if object is near or outside the canvas boundaries
  const isOutOfBounds =
    left < 0 || right > canvasWidth || top < 0 || bottom > canvasHeight;

  if (isOutOfBounds) {
    isRepositioning = true;

    // Reposition the object based on its stored properties
    if (obj.className === "businessText") {
      let textProps = textProperties;
      // alert("Company text was too close to the edges and moved")
      obj.animate(
        { left: textProps.left, top: textProps.top },
        {
          duration: 500,
          onChange: canvas.renderAll.bind(canvas),
          onComplete: function () {
            canvas.discardActiveObject();
            canvas.renderAll();

            // Re-enable moving after animation
            setTimeout(() => {
              isRepositioning = false;
            }, 100);
          },
        }
      );
    }

    if (obj.className === "logo") {
      let logoProps = logoProperties;
      // alert("Logo too was close to the edges and moved")
      obj.animate(
        { left: logoProps.left, top: logoProps.top },
        {
          duration: 500,
          onChange: canvas.renderAll.bind(canvas),
          onComplete: function () {
            canvas.discardActiveObject();
            canvas.renderAll();

            // Re-enable moving after animation
            setTimeout(() => {
              isRepositioning = false;
            }, 100);
          },
        }
      );
    }

    if (obj.className === "qrImage") {
      let qrProps = qrProperties;
      // alert("QR Image was too close to the edges and moved")
      obj.animate(
        { left: qrProps.left, top: qrProps.top },
        {
          duration: 500,
          onChange: canvas.renderAll.bind(canvas),
          onComplete: function () {
            canvas.discardActiveObject();
            canvas.renderAll();

            // Re-enable moving after animation
            setTimeout(() => {
              isRepositioning = false;
            }, 100);
          },
        }
      );
    }

    if (obj.className === "promotionImage") {
      let imageProps = imageProperties;
      // alert("Promotion was too close to the edges and moved")
      obj.animate(
        { left: imageProps.left, top: imageProps.top },
        {
          duration: 500,
          onChange: canvas.renderAll.bind(canvas),
          onComplete: function () {
            canvas.discardActiveObject();
            canvas.renderAll();

            // Re-enable moving after animation
            setTimeout(() => {
              isRepositioning = false;
            }, 100);
          },
        }
      );
    }

    if (obj.className === "addressText") {
      let addressProps = addressProperties;
      // alert("Address was text too close to the edges and moved")
      obj.animate(
        { left: addressProps.left, top: addressProps.top },
        {
          duration: 500,
          onChange: canvas.renderAll.bind(canvas),
          onComplete: function () {
            canvas.discardActiveObject();
            canvas.renderAll();

            // Re-enable moving after animation
            setTimeout(() => {
              isRepositioning = false;
            }, 100);
          },
        }
      );
    }

    if (obj.className === "customText") {
      const baseLeft = 150;
      const baseTop = 300;

      // Find a free spot to move the object
      const { left, top } = findNonOverlappingPosition(baseLeft, baseTop);
      console.warn(`returned left position: ${left}`);
      console.warn(`returned top position: ${top}`);
      obj.animate(
        { left, top },
        {
          duration: 500,
          onChange: canvas.renderAll.bind(canvas),
          onComplete: function () {
            canvas.discardActiveObject();
            canvas.renderAll();

            // Re-enable moving after animation
            setTimeout(() => {
              isRepositioning = false;
            }, 100);
          },
        }
      );
    }

    // Re-render the canvas after making the position adjustments
    canvas.renderAll();
    isRepositioning = false; // Reset the flag after repositioning

    setTimeout(() => {
      let alertMessage;

      if (obj.className == "businessText") {
        alertMessage =
          "Company text was too close to the edge and has been moved to the center.";
      } else if (obj.className == "logo") {
        alertMessage = "Logo was too close to the edge and has been moved.";
      } else if (obj.className == "qrImage") {
        alertMessage = "QR Image was too close to the edge and has been moved.";
      } else if (obj.className == "promotionImage") {
        alertMessage =
          "Promotion Image was too close to the edge and has been moved.";
      } else if (obj.className == "addressText") {
        alertMessage =
          "Address text was too close to the edge and has been moved.";
      } else {
        alertMessage = `${
          obj.className || "Object"
        } was too close to the edge and has been moved to the center.`;
      }

      showCustomAlert(alertMessage, false, 1500);
    }, 100);
  }
});
function findNonOverlappingPosition(
  baseLeft,
  baseTop,
  offsetStep = 20,
  maxTries = 10
) {
  const allObjects = canvas.getObjects();
  let newLeft = baseLeft;
  let newTop = baseTop;

  for (let i = 0; i < maxTries; i++) {
    // Check if any object is at this position (within threshold)
    const overlapping = allObjects.some((obj) => {
      return (
        obj.className === "customText" &&
        Math.abs(obj.left - newLeft) < 10 &&
        Math.abs(obj.top - newTop) < 10
      );
    });

    if (!overlapping) {
      return { left: newLeft, top: newTop };
    }

    // If overlapping, offset position slightly
    newLeft += offsetStep;
    newTop += offsetStep;
  }

  // If no free space found, just return last tried position
  return { left: newLeft, top: newTop };
}

function showCustomAlert2(message) {
  const alertMessage = document.getElementById("alertMessage");
  const customAlert = document.getElementById("customAlert");

  alertMessage.innerHTML = message;
  customAlert.style.display = "flex"; // Show the modal

  setTimeout(() => {
    customAlert.style.display = "none";
  }, 1500);
}

// Close the custom alert when the button is clicked
document
  .getElementById("closeAlertButton")
  .addEventListener("click", function () {
    document.getElementById("customAlert").style.display = "none"; // Hide the modal
  });

// ******************************************* Object movement constraint ends here *************************************************************

// ************************************************* 3D model related codes ***************************************************************

function changeTopColor() {
  const colorValue = tapColor;
  // console.log(`Color value inside function: ${colorValue}`);
  // console.log("input value : ", colorValue);
  if (modelViewer.model.materials.length >= 2) {
    // Specify the material name you want to change
    const targetMaterialName = "Top";

    // Find the material by name
    const targetMaterial = modelViewer.model.materials.find(
      (material) => material.name === targetMaterialName
    );
    // targetMaterial.pbrMetallicRoughness.baseColorTexture.setTexture(null);

    if (targetMaterial) {
      // Change the base color to a new value

      targetMaterial.pbrMetallicRoughness.baseColorTexture.setTexture(null);

      targetMaterial.setAlphaMode("OPAQUE");
      targetMaterial.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]);
      targetMaterial.pbrMetallicRoughness.setBaseColorFactor(tapColor); // White color
      targetMaterial.pbrMetallicRoughness.setRoughnessFactor(0.5); // Adjust roughness value
      targetMaterial.pbrMetallicRoughness.setMetallicFactor(0.2);
    } else {
      console.error(`Material with name '${targetMaterialName}' not found.`);
    }
  }
}

let imageExistingData = "";
async function apply_texture() {
  try {
    // Ensure the model is fully loaded before applying the texture
    const rightSection = document.querySelector(".rightsection");
    if (!rightSection) {
      console.error("The rightsection element is not found.");
      return;
    }

    // Use html2canvas to capture the content of the rightsection

    const imgData = canvas.toDataURL({
      format: "png",
      multiplier: 10,
    });

    imageExistingData = imgData;

    // Check if modelViewer is defined and has at least 3 materials
    if (
      modelViewer &&
      modelViewer.model &&
      modelViewer.model.materials.length > 2
    ) {
      // Specify the material name you want to change
      const targetMaterialName = "Texture";

      // Find the material by name
      const targetMaterial = modelViewer.model.materials.find(
        (material) => material.name === targetMaterialName
      );

      if (targetMaterial) {
        // Assuming createTexture is a valid method of modelViewer
        const texture = await modelViewer.createTexture(imgData); // If modelViewer requires a different method, update accordingly

        // Apply the texture to the baseColorTexture of the target material
        targetMaterial.pbrMetallicRoughness.baseColorTexture.setTexture(
          texture
        );

        modelCache[modelViewer.src] = modelViewer.model;

        changeTopColor();

        closeAlertManually(); // Close any alert or modal if necessary

        sendLabelEmail();
      } else {
        console.error(`Material '${targetMaterialName}' not found.`);
        closeAlertManually();
      }
    } else {
      console.error(
        "Model doesn't have enough materials or modelViewer is not defined."
      );
      closeAlertManually();
    }
  } catch (error) {
    console.error("Error applying texture:", error);
  }
}

let currentAlert;
let closeAlertButton;

function showCustomAlert(
  message = "This is a custom alert!",
  includeClose = true,
  timeout = null,
  color = "green"
) {
  const alertContainer = document.getElementById("alert-container");

  // Remove existing alert if there is one
  if (currentAlert) {
    closeAlert(currentAlert);
  }

  const alertBox = document.createElement("div");
  alertBox.className = "alert";
  alertBox.innerHTML = message;
  alertBox.style.backgroundColor = color;

  if (includeClose) {
    const closeIcon = document.createElement("span");
    closeIcon.className = "close";
    closeIcon.innerText = "×";
    closeIcon.onclick = () => closeAlert(alertBox);
    alertBox.appendChild(closeIcon);
  }

  alertContainer.appendChild(alertBox);
  currentAlert = alertBox; // Keep track of the current alert

  // Create and display the close button for manual closing

  // Set timeout to close the alert if specified
  if (timeout) {
    setTimeout(() => {
      closeAlert(alertBox);
    }, timeout);
  }
}

function closeAlert(alertBox) {
  alertBox.classList.add("hidden");
  setTimeout(() => {
    alertBox.remove();
    currentAlert = null; // Reset current alert
  }, 500); // Wait for fade-out transition
}

function closeAlertManually() {
  if (currentAlert) {
    closeAlert(currentAlert);
  }
}

// 3d model code
async function exportGLB() {
  const glTF = await modelViewer.exportScene();
  const file = new File([glTF], "vtech-bottle-3d-output.glb");
  const link = document.createElement("a");
  link.download = file.name;
  link.href = URL.createObjectURL(file);
  link.click();

  const formData = new FormData();
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  formData.append("glbFile", file);
  formData.append("name", userDetails.name);
  formData.append("mobile", userDetails.mobile);
  formData.append("email", userDetails.email);

  try {
    const response = await fetch(
      "https://www.popularwater.in/app/assets/php/sendEmailGLB.php",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();

    if (data.success) {
      // console.log('File sent successfully!');
    } else {
      console.error("Error sending file:", data.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
const modal = document.getElementById("modelViewerModal");
const closeModal = document.querySelector(".close");
const exportGLBButton = document.getElementById("exportGLBButton");

function sendLabelEmail() {
  const formData = new FormData();
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  formData.append("labelImage", imageExistingData); // Assuming imgData contains the base64-encoded image
  formData.append("name", userDetails.name);
  formData.append("mobile", userDetails.mobile);
  formData.append("email", userDetails.email);

  fetch("https://www.popularwater.in/app/assets/php/sendImage.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log("Image sent successfully!");
      } else {
        console.error("Error sending image:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function executeTask() {
  if (isLogoAdded) return;

  canvas.getObjects().forEach(function (obj) {
    if (obj.className === "logo") {
      console.log("Removing logo");
      canvas.remove(obj);
    }
  });
}

function screenshotFunction() {
  const secondImageUrl = `./assets/images/modelImages/${pdfImageBackground}`; // Background image URL

  if (!modelViewer) {
    console.error("ModelViewer element not found");
    return;
  }

  // Increase the size of the modelViewer for better clarity
  let enlargedWidth = 3500; // Adjust as needed for better quality
  let enlargedHeight = 3500; // Adjust as needed for better quality

  const bScreenWidth = window.innerWidth;
  const bScreenHeight = window.innerHeight;

  if (bScreenWidth >= 765 && bScreenWidth <= 767) {
    enlargedWidth = 1000;
    enlargedHeight = 1000;
  }
  if (bScreenWidth >= 1065 && bScreenWidth <= 1075) {
    enlargedWidth = 1000;
    enlargedHeight = 1000;
  }

  // Save the original size
  const originalWidth = modelViewer.clientWidth;
  const originalHeight = modelViewer.clientHeight;

  // Set the enlarged size for better screenshot quality
  modelViewer.style.width = enlargedWidth + "px";
  modelViewer.style.height = enlargedHeight + "px";

  // After a short delay to allow the modelViewer to render at the new size
  setTimeout(() => {
    // Capture the modelViewer screenshot
    let screenshot = new Image();
    screenshot.src = modelViewer.toDataURL({
      format: "png",
      multiplier: window.devicePixelRatio * 5, // High resolution for better quality (consider device pixel ratio)
    });

    // Create an Image element for the background image (watermark)
    let backgroundImage = new Image();
    backgroundImage.crossOrigin = "anonymous"; // Set crossOrigin if images are from different origins
    backgroundImage.src = secondImageUrl;

    // After both images have loaded
    Promise.all([
      new Promise((resolve) => {
        screenshot.onload = resolve;
      }),
      new Promise((resolve) => {
        backgroundImage.onload = resolve;
      }),
    ]).then(() => {
      const { jsPDF } = window.jspdf;
      // Create a new jsPDF instance
      const doc = new jsPDF();

      // Define A4 page dimensions in mm (210 x 297)
      const A4_WIDTH = 210;
      const A4_HEIGHT = 297;

      // Original screenshot dimensions
      const originalScreenshotWidth = screenshot.width;
      const originalScreenshotHeight = screenshot.height;

      // Set the desired width in mm (around 100mm) for the PDF
      const targetWidthInMm = 100; // Target width in mm
      const targetWidthInPixels = targetWidthInMm; // Convert mm to pixels (1mm = 3.779527px)

      // Calculate the aspect ratio of the screenshot
      const aspectRatio = originalScreenshotWidth / originalScreenshotHeight;

      // Set the width to the target width, and calculate the corresponding height based on the aspect ratio
      let imgWidth = targetWidthInPixels;
      let imgHeight = imgWidth / aspectRatio; // Maintain aspect ratio for height

      // Get the screen width to determine the scaling factor
      const screenWidth = window.innerWidth;

      let scalingFactor = 1;
      let extendingFactor = 1;

      // Apply different scaling factors based on screen width
      if (screenWidth >= 1200) {
        // PC range (larger screens)
        scalingFactor = 0.7; // For PC, use a 70% scaling factor
      } else if (screenWidth >= 600 && screenWidth < 1200) {
        // Tablet range (medium screens)
        scalingFactor = 2.8; // For tablets, use a larger scaling factor
        extendingFactor = 1.8;
      } else {
        // Mobile range (small screens)
        scalingFactor = 1.5; // For mobile, use a larger scaling factor
        extendingFactor = 3.5;
      }

      if (screenWidth >= 765 && screenWidth <= 767) {
        scalingFactor = 1.5;
        extendingFactor = 1.5;
      }

      if (screenWidth >= 1065 && screenWidth <= 1075) {
        scalingFactor = 1.5;
        extendingFactor = 1.5;
      }

      // Apply the scaling factor to both width and height
      imgWidth *= scalingFactor;
      imgHeight *= scalingFactor;

      // Convert the image dimensions to mm for jsPDF (A4 page is in mm)
      const pixelToMm = 0.264583; // 1 pixel = 0.264583 mm
      // imgWidth = imgWidth * pixelToMm;
      // imgHeight = imgHeight * pixelToMm;

      // If the image height exceeds the A4 page height, scale down proportionally
      if (imgHeight > A4_HEIGHT) {
        const scaleFactor = A4_HEIGHT / imgHeight;
        imgHeight *= scaleFactor;
        imgHeight *= extendingFactor;
        imgWidth *= scaleFactor;
        imgWidth *= extendingFactor;
      }

      // Add the background image (watermark) to the PDF
      doc.addImage(backgroundImage, "WEBP", 0, 0, A4_WIDTH, A4_HEIGHT); // A4 size as background

      let increasedOffset = 0;
      if (screenWidth >= 600 && screenWidth < 1200) increasedOffset += 25;

      if (screenWidth >= 765 && screenWidth <= 767) increasedOffset = 0;
      if (screenWidth >= 1065 && screenWidth <= 1075) increasedOffset = 0;
      // if (screenWidth >= 765 && screenWidth <= 767) increasedOffset += 50;
      // Calculate the X and Y position for centering the image (with offset)
      const centerX = (A4_WIDTH - imgWidth) / 2;
      const offsetY = 20 + increasedOffset; // You can change this value to adjust how much to move down
      let centerY = (A4_HEIGHT - imgHeight) / 2 + offsetY; // Apply the offset

      // Add the screenshot image to the PDF (centered with slight offset)

      doc.addImage(screenshot, "PNG", centerX, centerY, imgWidth, imgHeight);

      // Save the generated PDF with the image
      doc.save("exported_output.pdf");

      const pdfBlob = doc.output("blob");

      // Prepare the form data to send the PDF to the server
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));

      const formData = new FormData();
      formData.append("pdfFile", pdfBlob, "exported_output.pdf");
      formData.append("labelImage", imageExistingData); // Append image data as labelImage

      if (
        userDetails &&
        userDetails.name &&
        userDetails.mobile &&
        userDetails.email
      ) {
        formData.append("name", userDetails.name); // Append user name
        formData.append("mobile", userDetails.mobile); // Append user mobile
        formData.append("email", userDetails.email); // Append user email
      }

      // Send the PDF to the PHP server using fetch
      fetch("https://www.popularwater.in/app/assets/php/sendEmail.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // console.log('PDF sent successfully!');
          } else {
            console.error("Error sending PDF:", data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      // // Revert to the original size
      modelViewer.style.width = originalWidth + "px";
      modelViewer.style.height = originalHeight + "px";

      pdfModal.style.visibility = "hidden";
    });
  }, 100); // Adjust the delay if needed to allow time for rendering
}

// ************************************************************************ END OF PDF OUTPUT CODE ***************************************************************************

// ************************************************************************ Custom Dropdown **********************************************************************************

// ************************************************************************************ End of get label png ************************************************************************

const closeButton = document.querySelector(".close-button-signup");
const signupForm = document.querySelector("#signupForm");
const signupPopup = document.querySelector(".signup-form");

// Close popup function
closeButton.addEventListener("click", () => {
  signupPopup.style.display = "none";
});

// Form submit and validation
signupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Validate input fields
  const name = document.getElementById("name").value;
  const mobile = document.getElementById("mobile").value;
  const email = document.getElementById("email").value;

  if (name && mobile && email) {
    const userDetails = {
      name,
      mobile,
      email,
    };

    // Save details to localStorage
    localStorage.setItem("userDetails", JSON.stringify(userDetails));

    // Close the popup
    signupPopup.style.display = "none";
    showToast("Details saved successfully!", "success");
    document.getElementById("export3dModel").click();
  } else {
    showToast("Please fill all fields correctly.", "error");
  }
});

function showToast(message, type) {
  toastMessage.textContent = message;

  // Add appropriate class (success or error)
  toast.classList.add(type); // 'success' or 'error'
  toast.classList.add("show"); // Make the toast visible

  // Remove the 'show' class after 3 seconds to hide the toast
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000); // Hide after 3 seconds
}

// Display the popup (you can trigger this by setting display property)
function showSignupForm() {
  signupPopup.style.display = "flex";
}

// changing background
$(".backgroundChangeButtons").click(function () {
  // Get the src of the clicked button's image
  var imageSrc = $(this).find("img").attr("src");
  var imageId = $(this).find("img").attr("id");
  var stoneImagesrc = $(this).find("img").attr("stone-image");
  var customClass = $(this).find("img").attr("custom-class");

  // Set the imageSrc as the background of the target element (for example, a div with class 'background-element')
  $(".modal-content").css("background-image", "url(" + imageSrc + ")");

  $(".stone-img-bg img").attr("src", stoneImagesrc);

  // $('.pdf-modal-content').css('background-image', 'url(' + imageSrc + ')');
  $(".stone-img-bg")
    .removeClass()
    .addClass("stone-img-bg")
    .addClass(customClass);
  $(".right-img-bg")
    .removeClass()
    .addClass("right-img-bg")
    .addClass(rightImgClass);
  // Add the 'active' class to the clicked button and remove it from others
  $(".backgroundChangeButtons").removeClass("active");
  $(this).addClass("active");

  switch (imageId) {
    case "bgImage1":
      getBackgroundNumber = "1";
      pdfImageBackground = "pdf_watermark.webp";
      break;
    case "bgImage2":
      getBackgroundNumber = "2";
      pdfImageBackground = "pdfImage2.webp";
      break;
    case "bgImage3":
      getBackgroundNumber = "3";
      pdfImageBackground = "pdfImage3.webp";
      break;
    case "bgImage4":
      getBackgroundNumber = "4";
      pdfImageBackground = "pdfImage4.webp";
      break;
    case "bgImage5":
      getBackgroundNumber = "5";
      pdfImageBackground = "pdfImage5.webp";
      break;
    default:
      getBackgroundNumber = "1";
      pdfImageBackground = "pdf_watermark.webp";
      break;
  }
});


function toggleCustomTextStyle(styleType) {
  const activeObject = canvas.getActiveObject();

  console.log("function called");
  // Ensure it's a customTextText object
  // if (!activeObject || activeObject.className !== 'customTextText') return;

  console.log("function not returned");

  let update = {};
  const button = document.getElementById(`custom-text-${styleType}`);

  switch (styleType) {
    case "bold":
      const isBold = activeObject.fontWeight === "bold";
      update.fontWeight = isBold ? "normal" : "bold";
      button.classList.toggle("text-style-active", !isBold);
      break;

    case "italic":
      const isItalic = activeObject.fontStyle === "italic";
      update.fontStyle = isItalic ? "normal" : "italic";
      button.classList.toggle("text-style-active", !isItalic);
      break;

    case "underline":
      const isUnderlined = !!activeObject.underline;
      update.underline = !isUnderlined;
      button.classList.toggle("text-style-active", !isUnderlined);
      break;
  }

  activeObject.set(update);
  canvas.renderAll();
}

// Attach events to buttons
document
  .getElementById("custom-text-bold")
  .addEventListener("click", () => toggleCustomTextStyle("bold"));
document
  .getElementById("custom-text-italic")
  .addEventListener("click", () => toggleCustomTextStyle("italic"));
document
  .getElementById("custom-text-underline")
  .addEventListener("click", () => toggleCustomTextStyle("underline"));

function updateCustomTextStyleButtons(textObj) {
  const boldBtn = document.getElementById("custom-text-bold");
  const italicBtn = document.getElementById("custom-text-italic");
  const underlineBtn = document.getElementById("custom-text-underline");

  if (!textObj || textObj.className !== "customTextText") {
    // Clear button highlights if something else is selected
    boldBtn.classList.remove("text-style-active");
    italicBtn.classList.remove("text-style-active");
    underlineBtn.classList.remove("text-style-active");
    return;
  }

  // Update button states based on current text styles
  textObj.fontWeight === "bold"
    ? boldBtn.classList.add("text-style-active")
    : boldBtn.classList.remove("text-style-active");

  textObj.fontStyle === "italic"
    ? italicBtn.classList.add("text-style-active")
    : italicBtn.classList.remove("text-style-active");

  textObj.underline
    ? underlineBtn.classList.add("text-style-active")
    : underlineBtn.classList.remove("text-style-active");
}

// Listen for canvas selection change
canvas.on("selection:created", function (e) {
  updateCustomTextStyleButtons(e.selected[0]);
});

canvas.on("selection:updated", function (e) {
  updateCustomTextStyleButtons(e.selected[0]);
});

// Also handle deselection
canvas.on("selection:cleared", function () {
  updateCustomTextStyleButtons(null);
});

// document.getElementById('customTextfont-style1').addEventListener('change', updateFontStylecustomText);

// text alignment:

// Function to update the alignment of the addressText class object
function updateTextAlignmentCustomText(alignment) {
  const existingText = canvas
    .getObjects()
    .find((obj) => obj.className === "customTextText");

  if (existingText) {
    // Update the text alignment based on the selected icon
    existingText.set({
      textAlign: alignment,
    });
    // Re-render the canvas after updating the object
    canvas.renderAll();
  }
}

const alignmentIconscustomText = document.querySelectorAll(
  ".customTextalignment1 .customText-icon"
);
// Add click event listeners for each alignment icon
alignmentIconscustomText.forEach((icon) => {
  icon.addEventListener("click", function () {
    // Remove 'selected' class from all icons
    alignmentIconscustomText.forEach((item) =>
      item.classList.remove("selected")
    );

    // Add 'selected' class to the clicked icon
    this.classList.add("selected");

    // Update alignment based on clicked icon
    if (this.id === "left-align") {
      updateTextAlignmentCustomText("left");
    } else if (this.id === "center-align") {
      updateTextAlignmentCustomText("center");
    } else if (this.id === "right-align") {
      updateTextAlignmentCustomText("right");
    } else if (this.id === "tidyup-align") {
      updateTextAlignmentCustomText("justify");
    }
  });
});

// color change
const colorPickerCustomText = document.getElementById(
  "customText-color-picker1"
);

// Function to update the color of the businessText class object
function updateTextColorCustomText(color) {
  const existingText = canvas
    .getObjects()
    .find((obj) => obj.className === "CustomTextText");

  if (existingText) {
    // Update the text color with the selected color
    existingText.set({
      fill: color, // Set the color to the selected color
    });

    // Re-render the canvas after updating the object
    canvas.renderAll();
  }
}

// Add an event listener to the color picker to update the text color
if (colorPickerCustomText) {
  colorPickerCustomText.addEventListener("input", function () {
    const selectedColor = colorPickerCustomText.value; // Get the selected color value
    updateTextColorCustomText(selectedColor); // Update the color of the addressText
  });
}

// font size
const fontSizeInputCustomText = document.getElementById(
  "customTextnumberInput1"
);

// Function to update the font size of the addressText class object
function updateFontSizeCustomText(fontSize) {
  const existingText = canvas
    .getObjects()
    .find((obj) => obj.className === "customTextText");

  if (existingText) {
    // Update the font size of the existing text object
    existingText.set({
      fontSize: fontSize, // Set the font size to the new value
    });

    // Re-render the canvas after updating the object
    canvas.renderAll();
  }
}

// Add event listener to the font size input to update the font size
if (fontSizeInputCustomText) {
  fontSizeInputCustomText.addEventListener("input", function () {
    const newFontSize = parseInt(fontSizeInputCustomText.value, 10); // Get the value of the input and parse it as an integer
    updateFontSizeCustomText(newFontSize); // Update the font size of the businessText
  });
}

// ********************************************** Custom Text Implementation **********************************************


function addCustomText(textContent, color, baseFontSize = 16) {
  const existingText = canvas
    .getObjects()
    .find((obj) => obj.className === "customTextText");
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();

  let fontSizeValue = baseFontSize * 0.25;
  let topPercentage = 1.5; // Between company name (2) and address (bottom)
  let leftPercentage = 0.68;

  const top = canvasHeight * topPercentage;
  const left = canvasWidth * leftPercentage;

  const text = new fabric.Text(textContent, {
    left: left,
    top: top,
    fill: color,
    fontSize: fontSizeValue,
    fontFamily: "Arial",
    className: "customTextText",
  });

  if (existingText) {
    existingText.set({
      text: textContent,
      fill: color,
    });
    canvas.renderAll();
  } else {
    canvas.add(text);
    canvas.renderAll();
  }

  customTextProperties = {
    top: text.top,
    left: text.left,
  };
}

// Add custom text properties variable at the top with other properties
let customTextProperties;

// Update the addTemplateItems function to include custom text
function addTemplateItemsWithCustomText(theme) {
  // Clear previous objects first if needed

  switch (theme) {
    case "black":
      addLogo(
        "./assets/images/logohereimage.png",
        100,
        "white",
        "white",
        7,
        100
      );
      addText("Your Company Name", "#000000ff", 60, 100, 16);
      // addCustomText("Your Custom Text", "#000000ff", 16); // Add custom text
      addAddressText("Your Address Here", "#070707ff", 55, 580, 18);
      break;
    case "white":
      addLogo(
        "./assets/images/yourLogoWhite.png",
        100,
        "white",
        "white",
        7,
        100
      );
      addText("Your Company Name", "#FFFFFF", 60, 100, 16);
      // addCustomText("Your Custom Text", "#FFFFFF", 16);
      addAddressText("Your Address Here", "#FFFFFF", 55, 580, 18);
      break;

    // Add other cases as needed...
    default:
      addLogo(
        "./assets/images/yourLogoWhite.png",
        100,
        "black",
        "black",
        7,
        100
      );
      addText("Your Company Name", "#FFFFFF", 60, 100, 16);
      // addCustomText("Your Custom Text", "#FFFFFF", 16);
      addAddressText("Your Address Here", "#FFFFFF", 55, 580, 18);
      break;
  }
}

// ********************************************** Custom Text Event Handlers **********************************************

function updateCustomTextContent() {
  const textAreaValue = document.getElementById("customTextArea").value.trim();
  const textContent =
    textAreaValue.length > 0 ? textAreaValue : "Your Custom Text";

  // Check if a text object with class 'customTextText' already exists
  const existingText = canvas
    .getObjects()
    .find((obj) => obj.className === "customTextText");

  if (existingText) {
    // Update properties of the existing text
    existingText.set({
      text: textContent,
      left: existingText.left,
      top: existingText.top,
      fill: existingText.fill,
      fontSize: existingText.fontSize,
    });
    canvas.renderAll();
  } else {
    // If no existing text object is found, create a new one
    const text = new fabric.Text(textContent, {
      left: 100,
      top: 200, // Position between company name and address
      fill: "#000000",
      fontSize: 24,
      fontFamily: "Arial",
      className: "customTextText",
    });
    canvas.add(text);
  }
}

// Font family update for custom text
function updateFontFamilyCustomText() {
  const fontFamily = document.getElementById("customTextFont-family1").value;
  const existingText = canvas
    .getObjects()
    .find((obj) => obj.className === "customTextText");

  if (existingText) {
    existingText.set({
      fontFamily: fontFamily,
    });
    canvas.renderAll();
  }
}


// Text alignment for custom text
function updateTextAlignmentCustomText(alignment) {
  const existingText = canvas
    .getObjects()
    .find((obj) => obj.className === "customTextText");

  if (existingText) {
    existingText.set({
      textAlign: alignment,
    });
    canvas.renderAll();
  }
}

// Color update for custom text
function updateTextColorCustomText(color) {
  const existingText = canvas
    .getObjects()
    .find((obj) => obj.className === "customTextText");

  if (existingText) {
    existingText.set({
      fill: color,
    });
    canvas.renderAll();
  }
}

// Font size update for custom text
function updateFontSizeCustomText(fontSize) {
  const existingText = canvas
    .getObjects()
    .find((obj) => obj.className === "customTextText");

  if (existingText) {
    existingText.set({
      fontSize: fontSize,
    });
    canvas.renderAll();
  }
}

// ********************************************** Event Listeners Setup **********************************************

canvas.on("object:modified", function (event) {
  const obj = event.target;

  // Check if the angle has changed (indicating rotation)
  if (obj.angle !== previousAngle) {
    obj.setCoords();
    previousAngle = obj.angle;

    // Update properties for all object types
    if (obj.className == "businessText") {
      textProperties = { top: obj.top, left: obj.left };
    } else if (obj.className == "logo") {
      logoProperties = { top: obj.top, left: obj.left };
    } else if (obj.className == "qrImage") {
      qrProperties = { top: obj.top, left: obj.left };
    } else if (obj.className == "promotionImage") {
      imageProperties = { top: obj.top, left: obj.left };
    } else if (obj.className == "addressText") {
      addressProperties = { top: obj.top, left: obj.left };
    } else if (obj.className == "customTextText") {
      customTextProperties = { top: obj.top, left: obj.left };
    }
  } else {
    if (isRepositioning) return;

    const obj = event.target;
    obj.setCoords();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const boundingRect = obj.getBoundingRect();
    const left = boundingRect.left;
    const top = boundingRect.top;
    const right = left + boundingRect.width;
    const bottom = top + boundingRect.height;

    const isOutOfBounds =
      left < 0 || right > canvasWidth || top < 0 || bottom > canvasHeight;

    if (isOutOfBounds) {
      isRepositioning = true;
      console.log("if condition worked here");

      // Handle custom text case
      if (obj.className === "customTextText") {
        let customTextProps = customTextProperties;
        obj.animate(
          { left: customTextProps.left, top: customTextProps.top },
          {
            duration: 500,
            onChange: canvas.renderAll.bind(canvas),
            onComplete: function () {
              canvas.discardActiveObject();
              canvas.renderAll();
              setTimeout(() => {
                isRepositioning = false;
              }, 100);
            },
          }
        );

        setTimeout(() => {
          showCustomAlert(
            "Custom text was too close to the edge and has been moved.",
            false,
            1500
          );
          console.log("this area called");
        }, 100);
      }

      // ... rest of your existing object handling code ...
    }
  }

  canvas.renderAll();
});


document.addEventListener("DOMContentLoaded", function () {
  const dropdownButton = document.getElementById("dropdownButton");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const fontImageContainer = document.getElementById("fontImageContainer");

  const fontImages = {
    "Nature Beauty": "./assets/images/fonts/Nature Beauty.png",
    Datacron: "./assets/images/fonts/Datacron.png",
    Fonarto: "./assets/images/fonts/Fonarto.png",
    Balloon: "./assets/images/fonts/Balloon.png",
    Edo: "./assets/images/fonts/Edo.png",
    "Jumping Chick": "./assets/images/fonts/Jumping Chick.png",
    "Boogie Boys": "./assets/images/fonts/Boogie Boys.png",
    "Sunny Spells": "./assets/images/fonts/Sunny Spells.png",
    Merienda: "./assets/images/fonts/Merienda.png",
    "Good Times": "./assets/images/fonts/Good Times.png",
    Scarytale: "./assets/images/fonts/Scarytale.png",
    Alro: "./assets/images/fonts/Alro.png",
    "Blade rounded": "./assets/images/fonts/Blade rounded.png",
    "Airstrike Academy": "./assets/images/fonts/Airstrike.png",
    "Race Sport": "./assets/images/fonts/Race Sport.png",
    HalvettBlackCond: "./assets/images/fonts/HalvettBlackCond.png",
    "AGRevueCyr-Roman": "./assets/images/fonts/AGRevueCyr-Roman.png",
    Aestera: "./assets/images/fonts/Aestera.png",
    Agraham: "./assets/images/fonts/Agraham.png",
    AL_Nevrada: "./assets/images/fonts/AL_Nevrada.png",
    BalapDemo: "./assets/images/fonts/BalapDemo.png",
    Bangkok: "./assets/images/fonts/Bangkok.png",
    Basmala: "./assets/images/fonts/Basmala.png",
    "Battlesbridge Demo": "./assets/images/fonts/Battlesbridge Demo.png",
    Berdano: "./assets/images/fonts/Berdano.png",
    Catchland: "./assets/images/fonts/Catchland.png",
    Firlest: "./assets/images/fonts/Firlest.png",
    Rekalgera: "./assets/images/fonts/Rekalgera.png",
    "Slugs Racer": "./assets/images/fonts/Slugs Racer.png",
    "The Richland": "./assets/images/fonts/The Richland.png",
  };

  // Toggle dropdown visibility
  if (dropdownButton) {
    dropdownButton.addEventListener("click", function () {
      const isOpen = dropdownMenu.style.display === "block";
      dropdownMenu.style.display = isOpen ? "none" : "block";
    });
  }

  // Hover and click handlers for dropdown
  if (dropdownMenu) {
    dropdownMenu.addEventListener("mouseover", function (event) {
      if (event.target.classList.contains("dropdown-option")) {
        const font = event.target.getAttribute("data-font");
        // showFontImage(font, event.clientX, event.clientY);
      }
    });

    dropdownMenu.addEventListener("mouseout", function () {
      hideFontImage();
    });

    dropdownMenu.addEventListener("click", function (event) {
      if (event.target.classList.contains("dropdown-option")) {
        const selectedFont = event.target.getAttribute("data-font");
        const selectedFontPath = event.target.getAttribute("data-font-path");
        const selectedFontNo = event.target.getAttribute("data-font-no");
        dropdownButton.innerHTML = `${selectedFont} <i class="fa-solid fa-chevron-down"></i>`;
        dropdownMenu.style.display = "none";

        const allOptions = dropdownMenu.querySelectorAll(".dropdown-option");
        allOptions.forEach((option) => {
          option.style.backgroundColor = "";
        });
        event.target.style.backgroundColor = "#f1f1f1";

        updateFontFamilyCustom(selectedFontPath, selectedFontNo);
        hideFontImage();
      }
    });
  }

  function showFontImage(font, mouseX, mouseY) {
    const img = document.createElement("img");
    img.src = fontImages[font];
    fontImageContainer.innerHTML = "";
    fontImageContainer.appendChild(img);
    fontImageContainer.style.display = "block";
    fontImageContainer.style.left = `${mouseX + 10}px`;
    fontImageContainer.style.top = `${mouseY + 10}px`;
  }

  function hideFontImage() {
    fontImageContainer.style.display = "none";
  }

  // ============ CUSTOM TEXT SETUP ============

  // Listen for input changes in the custom text area
  const customTextArea = document.getElementById("customTextArea");
  if (customTextArea) {
    customTextArea.addEventListener("input", updateCustomTextContent);
  }

  // Font family change listener
  const customTextFontFamily = document.getElementById(
    "customTextFont-family1"
  );
  if (customTextFontFamily) {
    customTextFontFamily.addEventListener("change", updateFontFamilyCustomText);
  }

  // Font style change listener
  // const customTextFontStyle = document.getElementById('customTextfont-style1');
  // if (customTextFontStyle) {
  //     customTextFontStyle.addEventListener('change', updateFontStyleCustomText);
  // }

  // Color picker listener
  const customTextColorPicker = document.getElementById(
    "customText-color-picker1"
  );
  if (customTextColorPicker) {
    customTextColorPicker.addEventListener("input", function () {
      const selectedColor = customTextColorPicker.value;
      updateTextColorCustomText(selectedColor);
    });
  }

  // Font size input listener
  const customTextFontSizeInput = document.getElementById(
    "customTextnumberInput1"
  );
  if (customTextFontSizeInput) {
    customTextFontSizeInput.addEventListener("input", function () {
      const newFontSize = parseInt(customTextFontSizeInput.value, 10);
      updateFontSizeCustomText(newFontSize);
    });
  }

  // Alignment icons listeners for custom text
  const customTextAlignmentIcons = document.querySelectorAll(
    ".customTextalignment1 .alignment-icon"
  );
  customTextAlignmentIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      customTextAlignmentIcons.forEach((item) =>
        item.classList.remove("selected")
      );
      this.classList.add("selected");

      if (this.id === "customText-left-align") {
        updateTextAlignmentCustomText("left");
      } else if (this.id === "customText-center-align") {
        updateTextAlignmentCustomText("center");
      } else if (this.id === "customText-right-align") {
        updateTextAlignmentCustomText("right");
      } else if (this.id === "customText-tidyup-align") {
        updateTextAlignmentCustomText("justify");
      }
    });
  });

  // ============ INITIALIZE CUSTOM TEXT - THIS MUST BE LAST ============
  // console.log("Initializing custom text...");
  // addCustomText("Your Custom Text", "#000000ff", 16);
  // console.log("Custom text initialized");
});

const saveButton = document.getElementById("save-button");
saveButton.addEventListener("click", () => {
  // Export canvas as high-quality PNG
  const dataURL = canvas.toDataURL({
    format: "png",
    quality: 1.0, // Quality from 0 to 1 (only applies to JPEG, but good to include)
    multiplier: 1, // Multiplier for high-res output (e.g., 4x resolution)
  });

  // Create a temporary download link
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "canvas-output.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

document.getElementById("apply").addEventListener("click", () => {
  const dataURL = canvas.toDataURL({
    format: "png",
    quality: 1.0,
    multiplier: 4,
  });

  // Send image back to parent window
  if (window.opener) {
    window.opener.postMessage(dataURL, "*"); // Use specific origin in production
  }

  // Close the editor window
  window.close();
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Delete" || e.key === "Backspace") {
    const activeObjects = canvas.getActiveObjects();

    console.log("Delete button clicked");
    if (activeObjects && activeObjects.length > 0) {
      activeObjects.forEach((obj) => {
        // Only delete if obj.isDelete !== false
        if (obj.isDelete !== false) {
          canvas.remove(obj);
        }
      });
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    }
  }
});

const navBackButton = document.getElementById("navBackButton");
navBackButton.addEventListener("click", () => {
  window.close();

  // If window is not closed, redirect to index.html after a short delay
  setTimeout(() => {
    if (!window.closed) {
      window.location.replace("index.html");
    }
  }, 100);
});
