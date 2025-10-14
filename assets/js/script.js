
// <!-- ************************* Navigation Bar script ************************* -->


const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});


$('#uploadOwnDesign').click(function() {
    window.location.href = './logo.html';
});

// <!-- ********************************** template1 part  **************************************** -->




function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown-content1');
    const upArrow = document.querySelector('#uparrow');  // Get the up arrow image

    // Toggle the display of the dropdown content
    if (dropdown.style.display === 'none' || dropdown.style.display === '') {
        dropdown.style.display = 'flex';  // Show dropdown
        upArrow.src = './assets/images/uparrow.png';  // Change to down arrow
        upArrow.alt = 'downarrow';  // Optional: Update alt text
        upArrow.title = 'downarrow';  // Optional: Update title text
    } else {
        dropdown.style.display = 'none';  // Hide dropdown
        upArrow.src = './assets/images/downarrow.png';  // Change back to up arrow
        upArrow.alt = 'uparrow';  // Optional: Update alt text
        upArrow.title = 'uparrow';  // Optional: Update title text
    }
}




// tempart part end

// upload part start
function toggleUploadDropdown() {
    const uploadSection = document.getElementById('upload1');
    uploadSection.classList.toggle('active-upload');
}

// upload part end

// name part start
function toggleCompanyDropdown() {
    const companySection = document.getElementById('companyname1');
    companySection.classList.toggle('active-company');
    document.getElementById('textArea').focus();
}
// name part end

// address part start
function toggleAddressDropdown() {
    const addressSection = document.getElementById('address1');
    addressSection.classList.toggle('active-address');
    document.getElementById('textArea1').focus();
}
function toggleCustomTextDropdown() {
    const addressSection = document.getElementById('customText1');
    addressSection.classList.toggle('active-customText');
    document.getElementById('textArea1').focus();
}
// name part end


// <!-- ********************************   Logo part Script   ************************************** -->


document.addEventListener('DOMContentLoaded', function () {
    const logoUploadContainer = document.querySelector('.upload1');
    const arrowIcon = document.getElementById('uploadArrow');
    const toggleArrow2 = document.querySelector('.uparrow');


// Toggle upload section visibility and arrow direction
logoUploadContainer.addEventListener('click', function (event) {
    event.stopPropagation();
    const uploadSection = document.querySelector('.uploadsec1');
    uploadSection.style.display = uploadSection.style.display === 'block' ? 'none' : 'block';
    toggleArrow2.src = toggleArrow2.src.includes('uparrow.png') ? './assets/images/downarrow.png' : './assets/images/uparrow.png';
    document.querySelector('[aria-expanded]').setAttribute('aria-expanded', uploadSection.style.display === 'block');
});

// Hide dropdown if clicking outside the container
document.addEventListener('click', function (event) {
    if (!logoUploadContainer.contains(event.target)) {
        const uploadSection = logoUploadContainer.querySelector('.uploadsec1');
        uploadSection.style.display = 'none';
        document.querySelector('[aria-expanded]').setAttribute('aria-expanded', 'false');
    }
});
});



// <!-- ********************************* Center image part      **************************  -->


document.addEventListener('DOMContentLoaded', function () {
    let currentLogoImage2 = null;
    const arrowIcon2 = document.getElementById('uploadArrow2');
    const fileSelectionText2 = document.getElementById('uploadText2');
    const rightSection = document.querySelector('.rightsection');
    const rightSectionImage = document.getElementById('right-section-image');
    let fileDialogOpen = false; // Flag to check if file dialog is open
    const additionalImage = document.getElementById('custom-image');
    const logoUploadContainer2 = document.querySelector('.upload2');
    const fileInputElement2 = document.getElementById('fileInput2');
    const toggleArrow2 = document.querySelector('.uparrow2');
    const uploadSection2 = document.querySelector('.upload2');
    const uploadSection2Container = document.querySelector('.uploadsec2');

    // Toggle upload dropdown visibility
    function toggleUploadDropdown2() {
        uploadSection2Container.style.display = uploadSection2Container.style.display === 'none' ? 'block' : 'none';
        toggleArrow2.src = toggleArrow2.src.includes('uparrow.png') ? './assets/images/downarrow.png' : './assets/images/uparrow.png';
    }

    // Attach the toggle function to the upload header click
    document.querySelector('.upload-header2').addEventListener('click', function (event) {
        toggleUploadDropdown2();
        event.stopPropagation();
    });

    // Close dropdown if clicked outside
    document.addEventListener('click', function (event) {
        if (!logoUploadContainer2.contains(event.target)) {
            uploadSection2Container.style.display = 'none';
            toggleArrow2.src = './assets/images/uparrow.png';
        }
    });

    uploadSection2.addEventListener('click', function (event) {
        event.stopPropagation();
    });

    // Open file input dialog only when clicking inside the upload area (excluding the default image)
    uploadSection2Container.addEventListener('click', function (event) {
            // fileDialogOpen = true;
            fileInputElement2.click();
    });    
    

    // Enable drag-and-drop functionality for the upload section
    uploadSection2.addEventListener('dragover', function (event) {
        event.preventDefault();
    });


    const logoUploadContainer3 = document.querySelector('.upload3');
    const fileInputElement3 = document.getElementById('fileInput3');
    const toggleArrow3 = document.querySelector('.uparrow3');
    const uploadSection3 = document.querySelector('.upload3');
    const uploadSection3Container = document.querySelector('.uploadsec3');

    // Toggle upload dropdown visibility
    function toggleUploadDropdown3() {
        uploadSection3Container.style.display = uploadSection3Container.style.display === 'none' ? 'block' : 'none';
        toggleArrow3.src = toggleArrow3.src.includes('uparrow.png') ? './assets/images/downarrow.png' : './assets/images/uparrow.png';
    }

    // Attach the toggle function to the upload header click
    document.querySelector('.upload-header3').addEventListener('click', function (event) {
        toggleUploadDropdown3();
        event.stopPropagation();
    });

    // Close dropdown if clicked outside
    document.addEventListener('click', function (event) {
        if (!logoUploadContainer3.contains(event.target)) {
            uploadSection3Container.style.display = 'none';
            toggleArrow3.src = './assets/images/uparrow.png';
        }
    });

    uploadSection3.addEventListener('click', function (event) {
        event.stopPropagation();
    });

    // Open file input dialog only when clicking inside the upload area (excluding the default image)
    uploadSection3Container.addEventListener('click', function (event) {
            // fileDialogOpen = true;
            fileInputElement3.click();
    });    
    

    // Enable drag-and-drop functionality for the upload section
    uploadSection3.addEventListener('dragover', function (event) {
        event.preventDefault();
    });
    
});


// <!-- *********************************  Name part Script  ********************************** -->


document.addEventListener("DOMContentLoaded", function () {
    const fontFamilySelect = document.getElementById('Font-family1');
    const fontStyleSelect = document.getElementById('font-style1');
    const numberInput = document.getElementById('numberInput1');
    const textArea = document.getElementById('textArea'); // Targeting the new textarea element
    const colorPicker = document.getElementById('color-picker1');
    const alignmentIcons = document.querySelectorAll('.alignment-icon');
    const rightSection = document.querySelector('.rightsection');

    const textOverlay = document.getElementById('companySection');
   

    function updateTextOverlay() {
        textOverlay.innerHTML = textArea.value.replace(/\n/g, '<br>') || "Your text"; // Use innerHTML to preserve newlines
    }

    // Font family change
    fontFamilySelect.addEventListener('change', function () {
        const selectedFont = fontFamilySelect.value;
        textOverlay.style.fontFamily = selectedFont;
    });

    // Font style change
    fontStyleSelect.addEventListener('change', function () {
        const styleValue = fontStyleSelect.value;

        // Reset all styles first
        textOverlay.style.fontWeight = 'normal';
        textOverlay.style.fontStyle = 'normal';
        textOverlay.style.textDecoration = 'none';

        switch (styleValue) {
            case 'bold':
                textOverlay.style.fontWeight = 'bold';
                break;
            case 'italic':
                textOverlay.style.fontStyle = 'italic';
                break;
            case 'underline':
                textOverlay.style.textDecoration = 'underline';
                break;
            case 'bold italic':
                textOverlay.style.fontWeight = 'bold';
                textOverlay.style.fontStyle = 'italic';
                break;
        }
    });

    // Font size change
    numberInput.addEventListener('input', function () {
        let fontSize = parseInt(numberInput.value);

        // Update the font size of the overlay text
        textOverlay.style.fontSize = `${fontSize}px`;
    });

    // Update overlay text when textarea content changes
    textArea.addEventListener('input', function () {
        updateTextOverlay();
    });

    // Color picker change
    // colorPicker.addEventListener('input', function () {
    //     const selectedColor = colorPicker.value;
    //     textOverlay.style.color = selectedColor;
    // });

    // Alignment icons
    // alignmentIcons.forEach(icon => {
    //     icon.addEventListener('click', function () {
    //         alignmentIcons.forEach(item => item.classList.remove('selected'));
    //         this.classList.add('selected');

    //         if (this.alt === "lefticon") {
    //             textOverlay.style.textAlign = "left";
    //         } else if (this.alt === "centericon") {
    //             textOverlay.style.textAlign = "center";
    //         } else if (this.alt === "righticon") {
    //             textOverlay.style.textAlign = "right";
    //         } else if (this.alt === "tidyupicon") {
    //             textOverlay.style.textAlign = "justify";
    //         }
    //     });
    // });

    // On page load, initialize default styles
    window.onload = function () {
        numberInput.value = 16;
        textOverlay.style.fontSize = '16px';
        textOverlay.style.fontFamily = 'Arial';
        textOverlay.style.color = '#000000';
    };
});


// <!-- *********************************  Address part Script  ********************************** -->


document.addEventListener("DOMContentLoaded", function () {
    const addressFontFamilySelect = document.getElementById('addressFont-family1');
    const addressFontStyleSelect = document.getElementById('addressfont-style1');
    const addressNumberInput = document.getElementById('addressnumberInput1');
    const addressTextArea1 = document.getElementById('textArea1');
    const addressColorPicker = document.getElementById('address-color-picker1');
    const addressAlignmentIcons1 = document.querySelectorAll('.alignment-icon');
    const addressRightSection = document.querySelector('.rightsection');

    // Create the overlay text that will display the user's address
    const addressTextOverlay = document.getElementById('addressSection');
   
    // Update font family based on user selection
    addressFontFamilySelect.addEventListener('change', function () {
        const selectedFont = addressFontFamilySelect.value;
        addressTextOverlay.style.fontFamily = selectedFont;
    });

    // Update font style (bold, italic, underline) based on user selection
    addressFontStyleSelect.addEventListener('change', function () {
        const styleValue = addressFontStyleSelect.value;
        addressTextOverlay.style.fontWeight = 'normal';
        addressTextOverlay.style.fontStyle = 'normal';
        addressTextOverlay.style.textDecoration = 'none';

        switch (styleValue) {
            case 'bold':
                addressTextOverlay.style.fontWeight = 'bold';
                break;
            case 'italic':
                addressTextOverlay.style.fontStyle = 'italic';
                break;
            case 'underline':
                addressTextOverlay.style.textDecoration = 'underline';
                break;
            case 'bold italic':
                addressTextOverlay.style.fontWeight = 'bold';
                addressTextOverlay.style.fontStyle = 'italic';
                break;
        }
    });

    // Update the font size based on user input, with a max of 10px and a min of 5px
    addressNumberInput.addEventListener('input', function () {
        let fontSize = parseInt(addressNumberInput.value);

        // Update the font size of the overlay text
        addressTextOverlay.style.fontSize = `${fontSize}px`;
    });

    // Update the overlay text based on user input from the new textArea1
    addressTextArea1.addEventListener('input', function () {
        addressTextOverlay.textContent = addressTextArea1.value || "Your Address Here"; // Using textArea1 now
        // Ensure that newline characters are respected in the overlay
        addressTextOverlay.style.whiteSpace = 'pre-line';  // This allows newlines to be displayed correctly
    });

    // Update the text color based on color picker input
    addressColorPicker.addEventListener('input', function () {
        const selectedColor = addressColorPicker.value;
        addressTextOverlay.style.color = selectedColor;
    });

    // Define the setSelected function to manage icon selection and text alignment
    function setSelected(icon) {
        // Remove the 'selected' class from all alignment icons
        addressAlignmentIcons1.forEach(item => item.classList.remove('selected'));

        // Add the 'selected' class to the clicked icon
        icon.classList.add('selected');

        // Apply text alignment based on the selected icon
        if (icon.alt === "lefticon") {
            addressTextOverlay.style.textAlign = "left";
        } else if (icon.alt === "centericon") {
            addressTextOverlay.style.textAlign = "center";
        } else if (icon.alt === "righticon") {
            addressTextOverlay.style.textAlign = "right";
        } else if (icon.alt === "tidyupicon") {
            addressTextOverlay.style.textAlign = "justify";
        }
    }

    // Attach event listeners to alignment icons
    addressAlignmentIcons1.forEach(icon => {
        icon.addEventListener('click', function () {
            setSelected(this);
        });
    });

    // Initialize default values when the page loads
    window.onload = function () {
        addressNumberInput.value = 14;
        addressTextOverlay.style.fontSize = '14px';
        addressTextOverlay.style.fontFamily = 'Arial';
        addressTextOverlay.style.color = '#FFFFFF';
    };

    document.querySelector('#exportPDF').addEventListener("click", function() {
        // Capture the content of the .rightsection div
        html2canvas(document.querySelector(".rightsection"), {
            scale: 4,
            width: document.querySelector(".rightsection").offsetWidth,
            height: document.querySelector(".rightsection").offsetHeight,
            backgroundColor: null
        }).then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            
            // Create a new jsPDF instance
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();

            // Get the width and height of the image
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            // Get the dimensions of the page (A4 size in mm)
            const pageWidth = pdf.internal.pageSize.width;
            const pageHeight = pdf.internal.pageSize.height;

            // Calculate scaling factors
            let scaleFactor = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);

            // If the image is larger than the page, fit it inside the page
            const scaledWidth = imgWidth * scaleFactor;
            const scaledHeight = imgHeight * scaleFactor;

            x = (pageWidth - scaledWidth) / 2
            y = (pageHeight - scaledHeight) / 2

            // Add image to the first page of the PDF
            pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);

            // Save the PDF to the user's computer
            pdf.save('captured_image.pdf');
        });
    });

   
  
    
  
      // *************************************************** code to change templates ************************************************
  
  
      const templateImages = document.querySelectorAll('.template-image');
      templateImages.forEach(tempImg => {
          tempImg.addEventListener("click", (e) => {
            //   templateImages.forEach(btn => btn.classList.remove('selected'));
            //   e.target.classList.add('selected');
            //   const selectedImageSrc = e.target.src;
          
            //   // Change the image in the rightsection
            //   const rightSectionImage = document.getElementById('right-section-image');
            //   rightSectionImage.src = selectedImageSrc; 
            //   console.log("template number: ", e.target.getAttribute('template-no'))
            //   changeTemplateAndAlignment(e.target.getAttribute('template-no'))
          });
      });
          
      const textSection = document.getElementById('text-section');
  
      function changeTemplateAndAlignment(templateNumber) {
          const logoImage = document.getElementById('logoImage');
          const addressText = document.getElementById('address-section');
          templateNumber = parseInt(templateNumber);
  
          switch(templateNumber) {
            case 1:
                logoImage.style.maxWidth = '100px';
                logoImage.style.top = '7%';
                addressTextOverlay.style.color = 'white';
                textSection.style.color = 'white';
                logoImage.src = './assets/images/yourLogoWhite.png';
                break;
            case 2:
                logoImage.style.top = '7%';
                logoImage.style.maxWidth = '100px';
                textSection.style.color = 'white';
                logoImage.src = './assets/images/yourLogoWhite.png';
                break;
            case 3:
                logoImage.style.maxWidth = '100px';
                logoImage.style.top = '7%';
                addressTextOverlay.style.color = 'white';
                textSection.style.color = 'white';
                logoImage.src = './assets/images/yourLogoWhite.png';
                break;
            case 4:
                logoImage.style.top = '7%';
                logoImage.style.maxWidth = '100px';
                addressTextOverlay.style.color = 'black';
                textSection.style.color = 'black';
                logoImage.src = './assets/images/logohereimage.png';
                break;
            case 5:
                logoImage.style.top = '7%';
                logoImage.style.maxWidth = '100px';
                addressTextOverlay.style.color = 'black';
                textSection.style.color = 'black';
                logoImage.src = './assets/images/logohereimage.png';
                break;
            case 6:
                logoImage.style.top = '7%';
                logoImage.style.maxWidth = '100px';
                textSection.style.color = 'white';
                addressTextOverlay.style.color = 'white';
                logoImage.src = './assets/images/yourLogoWhite.png';
                break;
            case 7:
                logoImage.style.top = '7%';
                logoImage.style.maxWidth = '100px';
                logoImage.src = './assets/images/logohereimage.png';
                break;
            case 8:
                logoImage.style.top = '7%';
                logoImage.style.maxWidth = '100px';
                logoImage.src = './assets/images/yourLogoWhite.png';
            case 9:
                logoImage.style.top = '7%';
                logoImage.style.maxWidth = '100px';
                logoImage.src = './assets/images/logohereimage.png';
                break;
            case 10:
                logoImage.style.top = '7%';
                logoImage.style.maxWidth = '100px';
                logoImage.src = './assets/images/yourLogoWhite.png';
                break;
            case 12:
                logoImage.style.top = '7%';
                logoImage.style.maxWidth = '100px';
                textSection.style.color = 'white';
                addressTextOverlay.style.color = 'black';
                break;
            case 13:
                logoImage.style.top = '7%';
                logoImage.style.maxWidth = '100px';
                textSection.style.color = 'white';
                addressTextOverlay.style.color = 'white';
                logoImage.src = './assets/images/yourLogoWhite.png';
                break;
            case 14:
                logoImage.style.maxWidth = '80px';
                logoImage.style.top = '22%';
                addressTextOverlay.style.color = 'white';
                textSection.style.color = 'white';
                logoImage.src = './assets/images/yourLogoWhite.png';
                break;
            case 15:
                logoImage.style.top = '7%';
                logoImage.style.maxWidth = '100px';
                textSection.style.color = 'white';
                addressTextOverlay.style.color = 'white'
                break;
            case 16:
                logoImage.style.top = '7%';
                logoImage.src = './assets/images/yourLogoWhite.png';
                logoImage.style.maxWidth = '100px';
                textSection.style.color = 'white';
                addressTextOverlay.style.color = 'white'
                break;
            case 17:
                logoImage.style.top = '7%';
                logoImage.src = './assets/images/logohereimage.png';
                logoImage.style.maxWidth = '100px';
                textSection.style.color = 'black';
                addressTextOverlay.style.color = 'black'
                break;
            case 18:
                logoImage.style.top = '7%';
                logoImage.style.maxWidth = '100px';
                logoImage.src = './assets/images/yourLogoWhite.png';
                textSection.style.color = 'white';
                addressTextOverlay.style.color = 'white'
            case 19:
                logoImage.style.top = '7%';
                logoImage.style.maxWidth = '100px';
                logoImage.src = './assets/images/yourLogoWhite.png';
                textSection.style.color = 'white';
                addressTextOverlay.style.color = 'white'
                break;
            case 20:
                logoImage.src = './assets/images/logohereimage.png';
                logoImage.style.maxWidth = '100px';
                logoImage.style.top = '7%';
                addressTextOverlay.style.color = 'black';
                textSection.style.color = 'black';
                break;
            case 21:
                logoImage.src = './assets/images/logohereimage.png';
                logoImage.style.maxWidth = '100px';
                logoImage.style.top = '20%';
                addressTextOverlay.style.color = 'black';
                textSection.style.color = 'black';
                break;
            case 22:
                logoImage.style.top = '7%';
                logoImage.src = './assets/images/logohereimage.png';
                logoImage.style.maxWidth = '100px';
                textSection.style.color = 'black';
                addressTextOverlay.style.color = 'white'
                break;
            case 23:
                logoImage.style.top = '7%';
                logoImage.src = './assets/images/yourLogoWhite.png';
                logoImage.style.maxWidth = '100px';
                textSection.style.color = 'white';
                addressTextOverlay.style.color = 'white'
                break;
            case 24:
                logoImage.style.top = '7%';
                logoImage.src = './assets/images/yourLogoWhite.png';
                logoImage.style.maxWidth = '100px';
                textSection.style.color = 'white';
                addressTextOverlay.style.color = 'white'
                break;
            case 25:
                logoImage.style.top = '7%';
                logoImage.src = './assets/images/logohereimage.png';
                logoImage.style.maxWidth = '100px';
                textSection.style.color = 'black';
                addressTextOverlay.style.color = 'black'
                break;
            case 26:
                logoImage.style.top = '7%';
                logoImage.src = './assets/images/logohereimage.png';
                logoImage.style.maxWidth = '100px';
                textSection.style.color = 'black';
                addressTextOverlay.style.color = 'white'
                break;
            case 27:
                logoImage.style.top = '7%';
                logoImage.src = './assets/images/yourLogoWhite.png';
                logoImage.style.maxWidth = '100px';
                textSection.style.color = 'white';
                addressTextOverlay.style.color = 'white'
                break;
            case 28:
                logoImage.style.top = '7%';
                logoImage.src = './assets/images/yourLogoWhite.png';
                logoImage.style.maxWidth = '100px';
                textSection.style.color = 'white';
                addressTextOverlay.style.color = 'white'
                break;
            case 29:
                logoImage.style.top = '7%';
                logoImage.src = './assets/images/yourLogoWhite.png';
                logoImage.style.maxWidth = '100px';
                textSection.style.color = 'white';
                addressTextOverlay.style.color = 'white'
                break;
            case 30:
                logoImage.style.top = '7%';
                logoImage.src = './assets/images/yourLogoWhite.png';
                logoImage.style.maxWidth = '100px';
                textSection.style.color = 'white';
                addressTextOverlay.style.color = 'white'
                break;
            case 31:
                logoImage.style.top = '7%';
                logoImage.src = './assets/images/yourLogoWhite.png';
                logoImage.style.maxWidth = '100px';
                textSection.style.color = 'white';
                addressTextOverlay.style.color = 'white'
                break;
            case 32:
                logoImage.style.top = '7%';
                logoImage.src = './assets/images/logohereimage.png';
                logoImage.style.maxWidth = '100px';
                textSection.style.color = 'black';
                addressTextOverlay.style.color = 'black'
                break;
            case 33:
                logoImage.style.top = '7%';
                logoImage.src = './assets/images/logohereimage.png';
                logoImage.style.maxWidth = '100px';
                textSection.style.color = 'black';
                addressTextOverlay.style.color = 'white'
                break;
            case 34:
                logoImage.style.top = '7%';
                logoImage.src = './assets/images/logohereimage.png';
                logoImage.style.maxWidth = '100px';
                textSection.style.color = 'white';
                addressTextOverlay.style.color = 'black'
                break;
            case 35:
                logoImage.style.top = '7%';
                logoImage.src = './assets/images/yourLogoWhite.png';
                logoImage.style.maxWidth = '100px';
                textSection.style.color = 'white';
                addressTextOverlay.style.color = 'black'
                break;
            case 36:
                logoImage.style.top = '7%';
                logoImage.src = './assets/images/logohereimage.png';
                logoImage.style.maxWidth = '100px';
                textSection.style.color = 'black';
                addressTextOverlay.style.color = 'white'
                break;
            case 37:
                logoImage.style.top = '7%';
                logoImage.src = './assets/images/logohereimage.png';
                logoImage.style.maxWidth = '100px';
                textSection.style.color = 'white';
                addressTextOverlay.style.color = 'white'
                break;
            default:
                logoImage.style.maxWidth = '100px';
                logoImage.style.top = '7%';
                addressTextOverlay.style.color = 'white';
                textSection.style.color = 'black';
                break;
          }
      }
  
  
     
  });
  

// function htmlToSvg(htmlElement) {
//     const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
//     let svgWidth = 0;
//     let svgHeight = 0;

//     function convertElement(element, svgParent, parentX = 0, parentY = 0) {
//         const tagName = element.tagName.toLowerCase();
//         const style = window.getComputedStyle(element);
//         const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

//         //Get boundingClientRect for more reliable positioning
//         const {left, top, width, height} = element.getBoundingClientRect();
//         const x = parentX + left;
//         const y = parentY + top;

//         rect.setAttribute('width', width);
//         rect.setAttribute('height', height);
//         rect.setAttribute('x', x);
//         rect.setAttribute('y', y);
//         rect.setAttribute('fill', style.backgroundColor);
//         svgParent.appendChild(rect);

//         // Handle text elements
//         if (element.childNodes) {
//             element.childNodes.forEach(child => {
//                 if (child.nodeType === Node.TEXT_NODE) {
//                     const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
//                     text.textContent = child.nodeValue.trim();
//                     text.setAttribute('x', x + 5);
//                     text.setAttribute('y', y + height / 2 + 5);
//                     text.setAttribute('fill', style.color);
//                     text.setAttribute('font-size', style.fontSize);
//                     svgParent.appendChild(text);
//                 }
//             });
//         }
//         // Handle images
//         if (tagName === 'img'){
//             const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
//             img.setAttribute('href', element.src);
//             img.setAttribute('x', x);
//             img.setAttribute('y', y);
//             img.setAttribute('width', width);
//             img.setAttribute('height', height);
//             svgParent.appendChild(img);
//         }

//         const transform = style.transform;
//         if (transform !== 'none') {
//             // This is a VERY simplified example.  Real transform parsing is complex!
//             const match = transform.match(/translate\(([^)]+)\)/); //only handles translate
//             if (match) {
//                 const [xOffset, yOffset] = match[1].split(',').map(Number);
//                 rect.setAttribute('transform', `translate(${xOffset}, ${yOffset})`);
//             }
//         }

//         //Recursively process children
//         element.childNodes.forEach(child => {
//             if (child.nodeType === Node.ELEMENT_NODE) {
//                 convertElement(child, svgParent, x, y);
//             }
//         });

//         svgWidth = Math.max(svgWidth, x + width);
//         svgHeight = Math.max(svgHeight, y + height);
//     }

//     convertElement(htmlElement, svg);
//     svg.setAttribute('width', svgWidth);
//     svg.setAttribute('height', svgHeight);
//     return svg;
// }




//   document.getElementById('exportSVG').addEventListener("click", function() {

//       const rightSection = document.querySelector('.rightsection');
//       if (rightSection) {
//         const svgElement = htmlToSvg(rightSection);
      
//         // Create a download link
//         const svgData = new XMLSerializer().serializeToString(svgElement);
//         const blob = new Blob([svgData], { type: 'image/svg+xml' });
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'right-section.svg';
//         a.style.display = 'none';
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         URL.revokeObjectURL(url);
//       } else {
//         console.error("Element with class '.right-section' not found.");
//       }
//   });

/************************************************************************** Fabric js code ************************************************************************************/



function toggleCustomTextDropdown() {
    const customTextSection = document.getElementById('customText1');
    customTextSection.classList.toggle('active-customText');
}