// Multiple Image Manager
class MultipleImageManager {
  // constructor(canvas) {
  //     this.canvas = canvas;
  //     this.uploadedImages = new Map(); // Store image objects with unique IDs
  //     this.imageCounter = 0;
  //     this.activeImageId = null;
  //     this.init();
  // }

  constructor(canvas) {
    this.canvas = canvas;
    this.uploadedImages = new Map();
    this.processedFiles = new Set(); // <-- new
    this.imageCounter = 0;
    this.activeImageId = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateUploadSection();
  }

  // Update the upload section HTML
  updateUploadSection() {
    const uploadSection = document.getElementById("upload2");
    if (!uploadSection) {
      console.error("Upload section not found");
      return;
    }

    // Show the upload section
    uploadSection.style.display = "block";
  }

  setupEventListeners() {
    document.addEventListener("click", (e) => {
      // File input trigger
      if (e.target.id === "uploadArrow2" || e.target.id === "uploadArea2") {
        document.getElementById("fileInput2").click();
        console.log("Upload handler triggered");
      }

      // Image item selection
      if (e.target.classList.contains("image-item")) {
        this.selectImage(e.target.dataset.imageId);
      }

      // Center image button
      if (e.target.id === "centerImageBtn") {
        this.centerActiveImage();
      }

      // Delete image button
      if (e.target.id === "deleteImageBtn") {
        this.deleteActiveImage();
      }
    });

    // File input change event
    document.addEventListener("change", (e) => {
      if (e.target.id === "fileInput2") {
        this.handleMultipleFileUpload(e.target.files);
      }
    });

    // Drag and drop events
    const uploadArea = document.getElementById("uploadArea2");
    if (uploadArea) {
      uploadArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadArea.style.backgroundColor = "#f0f8ff";
      });

      uploadArea.addEventListener("dragleave", (e) => {
        e.preventDefault();
        uploadArea.style.backgroundColor = "";
      });

      uploadArea.addEventListener("drop", (e) => {
        e.preventDefault();
        uploadArea.style.backgroundColor = "";
        const files = Array.from(e.dataTransfer.files).filter((file) =>
          file.type.startsWith("image/")
        );
        if (files.length > 0) {
          this.handleMultipleFileUpload(files);
        }
      });
    }
  }

  toggleUploadDropdown() {
    const uploadSec = document.getElementById("uploadsec2");
    const arrow = document.querySelector(".uparrow2");

    if (uploadSec.style.display === "none") {
      uploadSec.style.display = "block";
      arrow.src = "./assets/images/uparrow.png";
    } else {
      uploadSec.style.display = "none";
      arrow.src = "./assets/images/downarrow.png";
    }
  }

  handleMultipleFileUpload(files) {
    const fileArray = Array.from(files);

    fileArray.forEach((file, index) => {
      if (
        file.type.startsWith("image/") &&
        file.size <= 10 * 1024 * 1024 &&
        !this.processedFiles.has(file.name) // prevent duplicate
      ) {
        this.processedFiles.add(file.name); // mark as processed
        this.processImageFile(file, index);
      } else {
        console.warn(`Duplicate or invalid image skipped: ${file.name}`);
      }
    });
  }

  processImageFile(file, index) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.addImageToCanvas(e.target.result, file.name, index);
    };
    reader.readAsDataURL(file);
  }

  addImageToCanvas(imageSrc, fileName, index) {

const originalFromURL = fabric.Image.fromURL;

fabric.Image.fromURL = function (...args) {
  console.warn("fabric.Image.fromURL called from:", new Error().stack);
  return originalFromURL.apply(this, args);
};


    console.log(`addImageToCanvas called for: ${fileName}, index: ${index}`);
    fabric.Image.fromURL(imageSrc, (fabricImage) => {
      console.log(`fabric.Image.fromURL callback for: ${fileName}`);
      this.imageCounter++;
      const imageId = `image_${this.imageCounter}`;

      // Calculate position (center with slight offset for multiple images)
      const canvasWidth = this.canvas.getWidth();
      const canvasHeight = this.canvas.getHeight();

      const offsetX = ((index % 3) - 1) * 100; // Spread images horizontally
      const offsetY = Math.floor(index / 3) * 100; // Stack rows vertically

      const centerX = canvasWidth / 2 + offsetX;
      const centerY = canvasHeight / 2 + offsetY;

      // Set initial properties
      const maxSize = 150;
      const scale = Math.min(
        maxSize / fabricImage.width,
        maxSize / fabricImage.height
      );

      fabricImage.set({
        left: centerX - (fabricImage.width * scale) / 2,
        top: centerY - (fabricImage.height * scale) / 2,
        scaleX: scale,
        scaleY: scale,
        hasControls: true,
        hasBorders: true,
        className: "uploadedImage",
        imageId: imageId,
        selectable: true,
        moveable: true,
      });

      // Add to canvas
      this.canvas.add(fabricImage);
      console.log("image added to canvas");
      this.canvas.setActiveObject(fabricImage);
      // Add to UI list

      this.canvas.renderAll();
    });
  }


  
  centerActiveImage() {
    if (!this.activeImageId) return;

    const imageData = this.uploadedImages.get(this.activeImageId);
    if (imageData) {
      const canvasWidth = this.canvas.getWidth();
      const canvasHeight = this.canvas.getHeight();

      imageData.fabricObject.set({
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        originX: "center",
        originY: "center",
      });

      this.canvas.renderAll();
    }
  }

  deleteActiveImage() {
    if (!this.activeImageId) return;

    const imageData = this.uploadedImages.get(this.activeImageId);
    if (imageData) {
      // Remove from canvas
      this.canvas.remove(imageData.fabricObject);

      // Remove from our map
      this.uploadedImages.delete(this.activeImageId);

      // Remove from UI list
      const listItem = document.querySelector(
        `[data-image-id="${this.activeImageId}"]`
      );
      if (listItem) {
        listItem.remove();
      }

      // Hide controls and clear active
      document.getElementById("imageControls").style.display = "none";
      this.activeImageId = null;

      this.canvas.renderAll();
    }
  }

  // Get all uploaded images
  getAllUploadedImages() {
    return Array.from(this.uploadedImages.values());
  }

  // Clear all uploaded images
  clearAllImages() {
    this.uploadedImages.forEach((imageData) => {
      this.canvas.remove(imageData.fabricObject);
    });
    this.uploadedImages.clear();
    document.getElementById("imageList").innerHTML = "";
    document.getElementById("imageControls").style.display = "none";
    this.activeImageId = null;
    this.imageCounter = 0;
    this.canvas.renderAll();
  }
}

// CSS for multiple image styling
const multipleImageCSS = `
.upload-area {
    padding: 20px;
    border: 2px dashed red;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-bottom: 15px;
}

.upload-area:hover {
    background-color: #f8f9fa;
}

.image-list {
    max-height: 200px;
    overflow-y: auto;
    margin-bottom: 15px;
    border: 1px solid #dee2e6;
    border-radius: 5px;
    padding: 10px;
}

.image-item {
    display: flex;
    align-items: center;
    padding: 8px;
    margin: 5px 0;
    background-color: #f8f9fa;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.image-item:hover {
    background-color: #e9ecef;
}

.image-item.active {
    background-color: #007bff;
    color: white;
}

.image-thumbnail {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 4px;
    margin-right: 10px;
    border: 1px solid #dee2e6;
}

.image-name {
    flex: 1;
    font-size: 14px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.image-controls {
    border-top: 1px solid #dee2e6;
    padding-top: 15px;
}

.image-controls h4 {
    margin: 0 0 15px 0;
    color: #333;
    font-size: 16px;
}

.control-group {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.control-group label {
    width: 80px;
    font-size: 14px;
    font-weight: bold;
}

.control-group input[type="range"] {
    flex: 1;
    margin: 0 10px;
}

.control-group span {
    width: 60px;
    font-size: 12px;
    text-align: right;
}

.image-actions {
    display: flex;
    gap: 10px;
    margin-top: 15px;
}

.control-btn {
    flex: 1;
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s ease;
}

.center-btn {
    background-color: #28a745;
    color: white;
}

.center-btn:hover {
    background-color: #218838;
}

.delete-btn {
    background-color: #dc3545;
    color: white;
}

.delete-btn:hover {
    background-color: #c82333;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .image-actions {
        flex-direction: column;
    }
    
    .control-group {
        flex-wrap: wrap;
    }
    
    .control-group label {
        width: 100%;
        margin-bottom: 5px;
    }
}
`;

// Add CSS to page
const imageStyleSheet = document.createElement("style");
imageStyleSheet.textContent = multipleImageCSS;
document.head.appendChild(imageStyleSheet);

// Initialize the multiple image manager
let multipleImageManager;

document.addEventListener("DOMContentLoaded", function () {
  // Wait for canvas to be available
  if (typeof canvas !== "undefined") {
    multipleImageManager = new MultipleImageManager(canvas);
    console.log("Triggered if condition");
  } else {
    // Retry after a short delay if canvas is not ready
    setTimeout(() => {
      if (typeof canvas !== "undefined") {
        multipleImageManager = new MultipleImageManager(canvas);
        console.log("Triggered else condition");
      }
    }, 1000);
  }
});
