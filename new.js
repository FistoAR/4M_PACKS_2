// Custom Text Manager
class CustomTextManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.customTexts = new Map(); // Store custom text objects with unique IDs
    this.textCounter = 0;
    this.activeTextId = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener("click", (e) => {
      // Add new custom text button
      if (e.target.id === "addCustomTextBtn") {
        this.addNewCustomText();
      }

      // Delete custom text button
      if (e.target.id === "deleteCustomTextBtn") {
        this.deleteActiveCustomText();
      }

      // Custom text item click
      if (e.target.classList.contains("custom-text-item")) {
        this.selectCustomText(e.target.dataset.textId);
      }

      // Alignment icons
     
    });

    document.addEventListener("input", (e) => {
      if (e.target.id === "customTextArea") {
        this.updateActiveTextContent(e.target.value);
      }
      if (e.target.id === "customTextFontSize") {
        // this.updateActiveFontSize(parseInt(e.target.value));
      }
      if (e.target.id === "customTextColor") {
        // this.updateActiveColor(e.target.value);
      }
    });

    document.addEventListener("change", (e) => {
      if (e.target.id === "customTextFont-family") {
        this.updateActiveFontFamily(e.target.value);
      }
      if (e.target.id === "customTextFont-style") {
        this.updateActiveFontStyle(e.target.value);
      }
    });
  }

  toggleCustomTextDropdown() {
    const customTextSection = document.getElementById("customText1");
    const customTextSec = customTextSection.querySelector(".customTextsec1");
    const arrow = customTextSection.querySelector(".uparrow");

    if (
      customTextSec.style.display === "none" ||
      !customTextSec.style.display
    ) {
      customTextSec.style.display = "block";
      customTextSection.classList.add("active-customText");
      arrow.src = "./assets/images/uparrow.png";
    } else {
      customTextSec.style.display = "none";
      customTextSection.classList.remove("active-customText");
      arrow.src = "./assets/images/downarrow.png";
    }
  }

  addNewCustomText() {
    this.textCounter++;
    const textId = `customText_${this.textCounter}`;

    // Calculate position for new text (spread them out)
    const canvasWidth = this.canvas.getWidth();
    const canvasHeight = this.canvas.getHeight();

    const baseTop = canvasHeight * 0.3;
    const offsetTop = (this.textCounter - 1) * 40; // Offset each new text
    const left = canvasWidth * 0.5;

    // Create fabric text object
    const fabricText = new fabric.IText(`Custom Text ${this.textCounter}`, {
      left: left,
      top: baseTop + offsetTop,
      fill: "#000000",
      fontSize: 16,
      fontFamily: "Arial",
      textAlign: "left",
      className: "customText",
      customTextId: textId,
    });

    // Add to canvas
    this.canvas.add(fabricText);

    fabricText.customType = "customTextText";

    // Store in our map
    this.customTexts.set(textId, {
      fabricObject: fabricText,
      properties: {
        text: `Custom Text ${this.textCounter}`,
        fontFamily: "Arial",
        fontSize: 16,
        fontStyle: "normal",
        color: "#000000",
        textAlign: "left",
        top: baseTop + offsetTop,
        left: left,
      },
    });

    // Add to UI list
    // this.addTextToList(textId, `Custom Text ${this.textCounter}`);

    // Select the new text
    this.selectCustomText(textId);

    this.canvas.renderAll();
  }

  selectCustomText(textId) {
    // Remove active class from all items
    document.querySelectorAll(".custom-text-item").forEach((item) => {
      item.classList.remove("active");
    });

    // Add active class to selected item
    const selectedItem = document.querySelector(`[data-text-id="${textId}"]`);
    if (selectedItem) {
      selectedItem.classList.add("active");
    }

    // Set as active
    this.activeTextId = textId;

    // Show controls
    const controls = document.getElementById("customTextControls");
    controls.style.display = "block";

    // Load text properties into controls
    this.loadTextProperties(textId);

    // Select the fabric object on canvas
    const textData = this.customTexts.get(textId);
    if (textData) {
      this.canvas.setActiveObject(textData.fabricObject);
      this.canvas.renderAll();
    }
  }

  loadTextProperties(textId) {
    const textData = this.customTexts.get(textId);
    if (!textData) return;

    const props = textData.properties;

    // Load into controls
    const textarea = document.getElementById("customTextArea");
    textarea.value = "";
    textarea.focus();
    // document.getElementById('customTextFont-family').value = props.fontFamily;
    document.getElementById("customTextFont-style").value = props.fontStyle;
    document.getElementById("customTextFontSize").value = props.fontSize;
    document.getElementById("customTextColor").value = props.color;

    // Update alignment icons
    document.querySelectorAll(".alignment-icon").forEach((icon) => {
      icon.classList.remove("selected");
      if (icon.dataset.align === props.textAlign) {
        icon.classList.add("selected");
      }
    });
  }

  updateActiveTextContent(newText) {
    if (!this.activeTextId) return;

    const textData = this.customTexts.get(this.activeTextId);
    if (textData) {
      textData.fabricObject.set("text", newText || "Your Custom Text");
      textData.properties.text = newText || "Your Custom Text";
      this.canvas.renderAll();

      // Update list item preview
      this.updateListItemPreview(this.activeTextId, newText);
    }
  }

  updateActiveFontFamily(fontFamily) {
    if (!this.activeTextId) return;

    const textData = this.customTexts.get(this.activeTextId);
    if (textData) {
      textData.fabricObject.set("fontFamily", fontFamily);
      textData.properties.fontFamily = fontFamily;
      this.canvas.renderAll();
    }
  }

  updateActiveFontStyle(fontStyle) {
    if (!this.activeTextId) return;

    const textData = this.customTexts.get(this.activeTextId);
    if (textData) {
      let fontWeight = "normal";
      let fontStyleValue = "normal";
      let underline = false;

      if (fontStyle.includes("bold")) {
        fontWeight = "bold";
      }
      if (fontStyle.includes("italic")) {
        fontStyleValue = "italic";
      }
      if (fontStyle === "underline") {
        underline = true;
      }

      textData.fabricObject.set({
        fontWeight: fontWeight,
        fontStyle: fontStyleValue,
        underline: underline,
      });

      textData.properties.fontStyle = fontStyle;
      this.canvas.renderAll();
    }
  }

updateActiveFontSize(fontSize) {
    let textData;

    if (this.activeTextId) {
        textData = this.customTexts.get(this.activeTextId);
    } else {
        const activeObj = this.canvas.getActiveObject();
        if (activeObj && activeObj.className === "customText") {
            textData = Array.from(this.customTexts.values()).find(
                t => t.fabricObject === activeObj
            );
            if (textData) {
                this.activeTextId = Object.keys(this.customTexts).find(
                    key => this.customTexts.get(key) === textData
                );
            }
        }
    }

    if (!textData) return;

    textData.fabricObject.set('fontSize', fontSize);
    textData.properties.fontSize = fontSize;
    this.canvas.renderAll();
}


  updateActiveColor(color) {
    if (!this.activeTextId) return;

    const textData = this.customTexts.get(this.activeTextId);
    if (textData) {
      textData.fabricObject.set("fill", color);
      textData.properties.color = color;
      this.canvas.renderAll();
    }
  }

  updateAlignment(alignment) {
    if (!this.activeTextId) return;

    const textData = this.customTexts.get(this.activeTextId);
    if (textData) {
      textData.fabricObject.set("textAlign", alignment);
      textData.properties.textAlign = alignment;
      this.canvas.renderAll();

      // Update visual selection
      document.querySelectorAll(".alignment-icon").forEach((icon) => {
        icon.classList.remove("selected");
      });
      document
        .querySelector(`[data-align="${alignment}"]`)
        .classList.add("selected");
    }
  }

  updateListItemPreview(textId, newText) {
    const listItem = document.querySelector(`[data-text-id="${textId}"]`);
    if (listItem) {
      const preview = listItem.querySelector(".text-preview");
      const displayText = newText || "Your Custom Text";
      preview.textContent =
        displayText.substring(0, 20) + (displayText.length > 20 ? "..." : "");
    }
  }

  deleteActiveCustomText() {
    if (!this.activeTextId) return;

    const textData = this.customTexts.get(this.activeTextId);
    if (textData) {
      // Remove from canvas
      this.canvas.remove(textData.fabricObject);

      // Remove from our map
      this.customTexts.delete(this.activeTextId);

      // Remove from UI list
      const listItem = document.querySelector(
        `[data-text-id="${this.activeTextId}"]`
      );
      if (listItem) {
        listItem.remove();
      }

      // Hide controls and clear active
      document.getElementById("customTextControls").style.display = "none";
      this.activeTextId = null;

      this.canvas.renderAll();
    }
  }

  // Method to get all custom text objects for export/save
  getAllCustomTexts() {
    return Array.from(this.customTexts.values()).map((textData) => ({
      fabricObject: textData.fabricObject,
      properties: textData.properties,
    }));
  }

  // Method to clear all custom texts
  clearAllCustomTexts() {
    this.customTexts.forEach((textData, textId) => {
      this.canvas.remove(textData.fabricObject);
    });
    this.customTexts.clear();
    document.getElementById("customTextList").innerHTML = "";
    document.getElementById("customTextControls").style.display = "none";
    this.activeTextId = null;
    this.textCounter = 0;
    this.canvas.renderAll();
  }
}

// CSS for custom text styling (add this to your CSS file)

// Initialize the custom text manager when the page loads
let customTextManager;

document.addEventListener("DOMContentLoaded", function () {
  // Wait for canvas to be available
  if (typeof canvas !== "undefined") {
    customTextManager = new CustomTextManager(canvas);
  } else {
    // Retry after a short delay if canvas is not ready
    setTimeout(() => {
      if (typeof canvas !== "undefined") {
        customTextManager = new CustomTextManager(canvas);
      }
    }, 1000);
  }
});
