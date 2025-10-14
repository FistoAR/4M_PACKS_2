$(document).ready(function () {

    $('#templateDesignButton').click(function() {
        window.location.href = './index.html';
    });

        
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    let getBackgroundNumber = "0";
    let pdfImageBackground = "pdf_watermark.webp";

    let tapColor = "#FFFFFF";



    if (localStorage.getItem('verificationCode') === '121212') {
        // If code is found in localStorage, no need to show the popup
        $('#popup').hide();
        $('#overlay').hide();
    } else {
        // Show popup and overlay when the code is not in localStorage
        $('#popup').fadeIn();
        $('#overlay').fadeIn();
    }

    // When user submits the code
    window.submitCode = function () {
        const code = $('#codeInput').val();
        if (code === '121212') {
            // Correct code entered, save it in localStorage and close the popup
            localStorage.setItem('verificationCode', '121212');
            closePopup();
        } else {
            // If code is incorrect, show an alert and keep the popup open
            alert("Incorrect code. Please try again.");
        }
    };

    // Function to close the popup
    window.closePopup = function () {
        const code = $('#codeInput').val();
        if (!code || code !== '121212') {
            window.close(); // Automatically close the tab if no or incorrect code entered
        } else {
            $('#popup').fadeOut();
            $('#overlay').fadeOut();
        }
    };

    // Prevent page unload if the popup is still open
    $(window).on('beforeunload', function () {
        if ($('#popup').is(':visible')) {
            return "You have a pending popup!";
        }
    });

    $('#bottleTop').on('input', function() {
        var colorValue = $(this).val(); // Get the selected color value
        $('#hexCode').val(colorValue); // Update the HEX code display

        tapColor = colorValue;
        // Call the function with the selected color value
        changeTopColor2(colorValue);
    });

    $('#hexCode').on('input', function() {
        // Get the value from the hexCode input
        var colorValue = $(this).val();
        
        // Set the value of bottleTop input to match the hex color code
        $('#bottleTop').val(colorValue);
        
        // Trigger the input listener for bottleTop
        $('#bottleTop').trigger('input');
      });
      $('#hexCode').on('click', function() {
        // Select the text inside the hexCode input field
        this.select();
      });
      
      
      
    var uploadedImage = null;  // Global variable to store the image

    // const modelViewer = $('#modelViewer');
    const modelViewer = document.getElementById('modelViewer');

    modelViewer.addEventListener('load', () => {
        $('#loadingSpinner').hide();
    });

    // Open file manager when the upload arrow or header is clicked
    // changeTopColor2("#ff0000");
    document.getElementById('uploadsec2').addEventListener("click", function() {

        $('#fileInput2').click();
    });
    // $('#uploadsec2').click(function () {
    //     $('#fileInput2').click();
    // });

    // Handle file selection (from file input)
    $('#fileInput2').change(function (e) {
        var file = e.target.files[0];
        if (file) {
            console.log(file);  // Log the file object
            uploadedImage = file;  // Store the image in the global variable

            // Clear the file input after uploading
            $('#fileInput2').val('');

            // Create an image URL and pass it to apply_texture
            var reader = new FileReader();
            reader.onload = function (event) {
                var imageDataUrl = event.target.result;
                apply_texture(imageDataUrl);  // Pass image data URL to apply_texture
            };
            reader.readAsDataURL(file);  // Read the file as a data URL
            closeDropdown();
        }
    });

    // Drag-and-drop functionality
    $('#uploadsec2').on('dragover', function (e) {
        e.preventDefault();
        $(this).addClass('dragover');  // Optional: add dragover style
    }).on('dragleave', function () {
        $(this).removeClass('dragover');  // Optional: remove dragover style
    }).on('drop', function (e) {
        e.preventDefault();
        var file = e.originalEvent.dataTransfer.files[0];
        if (file) {
            console.log(file);  // Log the file object
            uploadedImage = file;  // Store the image in the global variable

            // Create an image URL and pass it to apply_texture
            var reader = new FileReader();
            reader.onload = function (event) {
                var imageDataUrl = event.target.result;
                apply_texture(imageDataUrl);  // Pass image data URL to apply_texture
            };
            reader.readAsDataURL(file);  // Read the file as a data URL
            closeDropdown();
        }
    });


    function closeDropdown() {
        var $uploadSec2 = $('#uploadsec2');
        var isVisible = $uploadSec2.is(':visible');

        $uploadSec2.toggle();

        // Update the aria-expanded attribute
        $('#uploadHeader2').attr('aria-expanded', !isVisible);

        // Rotate the arrow image based on the visibility
        var $arrow = $('.uparrow2');
        if (isVisible) {
            $arrow.css('transform', 'rotate(180deg)'); // Arrow pointing up
        } else {
            $arrow.css('transform', 'rotate(0deg)'); // Arrow pointing down
        }
    }

    // Optional: Add a dragover style to indicate that files can be dropped
    $('#uploadsec2').css({
        'border': '2px dashed #ccc',
        'min-height': '100px',
        'text-align': 'center',
        'padding': '20px'
    });

    $('#uploadHeader2').click(function () {
        var $uploadSec2 = $('#uploadsec2');
        var isVisible = $uploadSec2.is(':visible');

        // Toggle the visibility of the section
        $uploadSec2.toggle();

        // Update the aria-expanded attribute
        $('#uploadHeader2').attr('aria-expanded', !isVisible);

        // Rotate the arrow image based on the visibility
        var $arrow = $('.uparrow2');
        if (isVisible) {
            $arrow.css('transform', 'rotate(180deg)'); // Arrow pointing up
        } else {
            $arrow.css('transform', 'rotate(0deg)'); // Arrow pointing down
        }
    });

    let imageExistingData  = null;
    function apply_texture(uploadImage) {
        try {
            // Ensure the model is fully loaded before applying the texture    

            imageExistingData = uploadImage;

            // Check if modelViewer is defined and has at least 3 materials
            if (modelViewer && modelViewer.model && modelViewer.model.materials.length > 2) {
                // Specify the material name you want to change
                var targetMaterialName = 'Texture';

                // Find the material by name
                var targetMaterial = modelViewer.model.materials.find(function (material) {
                    return material.name === targetMaterialName;
                });

                if (targetMaterial) {
                    // Assuming createTexture is a valid method of modelViewer
                    modelViewer.createTexture(uploadImage).then(function (texture) {
                        // Apply the texture to the baseColorTexture of the target material
                        targetMaterial.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
                        
                        sendLabelEmail();
                    }).catch(function (error) {
                        console.error("Error creating texture:", error);
                    });
                } else {
                    console.error("Material '" + targetMaterialName + "' not found.");
                }
            } else {
                console.error("Model doesn't have enough materials or modelViewer is not defined.");
            }
        } catch (error) {
            console.error("Error applying texture:", error);
        }
    }

    function sendLabelEmail() {
        const formData = new FormData();
        const userDetails = JSON.parse(localStorage.getItem('userDetails'));
        formData.append('labelImage', imageExistingData);  // Assuming imgData contains the base64-encoded image
        formData.append('name', userDetails.name);
        formData.append('mobile', userDetails.mobile);
        formData.append('email', userDetails.email);

        fetch('https://www.popularwater.in/app/assets/php/sendImage.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Image sent successfully!');
                } else {
                    console.error('Error sending image:', data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // change bottle image
    $('.bottleChangeButton').click(function() {
        // Get the model src from the clicked button's model-src attribute
        var modelSrc = $(this).attr('model-src');
        // var tapColor = $(this).attr('data-color');

        // Find the model-viewer element and update its src attribute
        $('model-viewer').attr('src', modelSrc);

        // Optionally, you can add active class to the clicked button and remove it from others
        $('.bottleChangeButton').removeClass('active');
        $(this).addClass('active');

        $('.bottleChangeButton img').removeClass('active');
        $(this).find('img').addClass('active');


        $('#loadingSpinner').show();
    

        modelViewer.addEventListener('load', () => {
            $('#loadingSpinner').hide();

            if (imageExistingData !== '' && imageExistingData !== null) {
                apply_texture(imageExistingData);
            }
            if (tapColor !== null) {
                changeTopColor2(tapColor);
            }
            // changeTopColor2(tapColor);
        });
    });

    $('.backgroundChangeButtons').click(function() {
        // Get the src of the clicked button's image
        var imageSrc = $(this).find('img').attr('src');
        var stoneImagesrc = $(this).find('img').attr('stone-image');
        var customClass = $(this).find('img').attr('custom-class');
        var rightImgClass = $(this).find('img').attr('right-img-class');

        var img = new Image();
        img.src = imageSrc;
    
        // Set the imageSrc as the background of the target element (for example, a div with class 'background-element')
        // $('.logoSection').css('background-image', 'url(' + imageSrc + ')');
        var img2 = new Image();
        img2.src = stoneImagesrc;

        img.onload = function() {
            // Set the imageSrc as the background of the target element (for example, a div with class 'background-element')
            $('.logoSection').css('background-image', 'url(' + imageSrc + ')');
        }
  
        img2.onload = function() {
            // Set the imageSrc as the background of the target element (for example, a div with class 'background-element')
            // $('.logoSection').css('background-image', 'url(' + imageSrc + ')');
            $('.stone-img-bg img').attr('src', stoneImagesrc);
        }

        // $('.stone-img-bg img').attr('src', stoneImagesrc);
    
        $('.stone-img-bg').removeClass().addClass('stone-img-bg').addClass(customClass);
        $('.right-img-bg').removeClass().addClass('right-img-bg').addClass(rightImgClass);
        // Add the 'active' class to the clicked button and remove it from others
        $('.backgroundChangeButtons').removeClass('active');
        $(this).addClass('active');

        var imageId = $(this).find('img').attr('id');

        switch(imageId) {
             case 'bgImage1':
                 getBackgroundNumber = "1";
                 pdfImageBackground = "pdf_watermark.webp";
                 break;
             case 'bgImage2':
                 getBackgroundNumber = "2";
                 pdfImageBackground = "pdfImage2.webp";
                 break;
             case 'bgImage3':
                 getBackgroundNumber = "3";
                 pdfImageBackground = "pdfImage3.webp";
                 break;
             case 'bgImage4':
                 getBackgroundNumber = "4";
                 pdfImageBackground = "pdfImage4.webp";
                 break;
             case 'bgImage5':
                 getBackgroundNumber = "5";
                 pdfImageBackground = "pdfImage5.webp";
                 break;
             default: 
                 getBackgroundNumber = "1";
                 pdfImageBackground = "pdf_watermark.webp";
                 break;
         }
    });

    const pdfButton = $('#exportPDFButton');
    const pdfModal = $('.pdf-modal');
    const pdfModalPopup = $('.pdf-modal-popup');
    const confirmBtn = $('#confirmBtn');
    const cancelBtn = $('#cancelBtn');

    pdfButton.on('click', function() {
        pdfModalPopup.css('display', 'flex');
        // screenshotFunction();  // Uncomment if needed
        // pdfModal.css('visibility', 'visible');
    });

    confirmBtn.on('click', function() {
        // Proceed with screenshot function if user confirms
        pdfModalPopup.css('display', 'none'); // Hide the modal after confirmation
        pdfModal.css('visibility', 'visible');
        screenshotFunction();
    });

    cancelBtn.on('click', function() {
        // Hide the modal without doing anything
        pdfModalPopup.css('display', 'none');
    });

    
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

    const screenWidth = window.innerWidth;
    if (screenWidth <= 900) {
        enlargedWidth = 1750; // Adjust as needed for better quality
        enlargedHeight = 1750;
    }
    
    if (screenWidth <= 600) {
        enlargedWidth = 2500; // Adjust as needed for better quality
        enlargedHeight = 2500;
    }
     
    if (screenWidth >= 1374 && screenWidth <= 1379) {
        enlargedWidth = 2000; // Adjust as needed for better quality
        enlargedHeight = 2000;
    }

    if (bScreenWidth >= 1065 && bScreenWidth <= 1075) {
        enlargedWidth = 1750; 
        enlargedHeight = 1750;
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
            format: 'png',
            multiplier: window.devicePixelRatio * 5 // High resolution for better quality (consider device pixel ratio)
        });

        // Create an Image element for the background image (watermark)
        let backgroundImage = new Image();
        backgroundImage.crossOrigin = 'anonymous'; // Set crossOrigin if images are from different origins
        backgroundImage.src = secondImageUrl;

        // After both images have loaded
        Promise.all([
            new Promise(resolve => {
                screenshot.onload = resolve;
            }),
            new Promise(resolve => {
                backgroundImage.onload = resolve;
            })
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
            let imgHeight = imgWidth / aspectRatio;  // Maintain aspect ratio for height

            // Get the screen width to determine the scaling factor

            let scalingFactor = 1;
            let extendingFactor = 1;

            // Apply different scaling factors based on screen width
            if (screenWidth >= 1200) {
                // PC range (larger screens)
                scalingFactor = 2; // For PC, use a 70% scaling factor
                extendingFactor = 5;
            } else if (screenWidth >= 600 && screenWidth < 1200) {
                // Tablet range (medium screens)
                scalingFactor = 2; // For tablets, use a larger scaling factor
                extendingFactor = 2;
            } else {
                // Mobile range (small screens)
                scalingFactor = 2; // For mobile, use a larger scaling factor
                extendingFactor = 1.5;

            }

            if (screenWidth >= 1065 && screenWidth <= 1075) {
                scalingFactor = 2;
                extendingFactor = 2;
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
            doc.addImage(backgroundImage, 'WEBP', 0, 0, A4_WIDTH, A4_HEIGHT); // A4 size as background

            let increasedOffset = 0;
            if (screenWidth >= 600 && screenWidth < 1200) increasedOffset += 25;
            if (screenWidth >= 765 && screenWidth <= 767) increasedOffset = 0;
            if (screenWidth >= 1065 && screenWidth <= 1075) increasedOffset = 0;

            // Calculate the X and Y position for centering the image (with offset)
            const centerX = (A4_WIDTH - imgWidth) / 2;
            const offsetY = 20 + increasedOffset; // You can change this value to adjust how much to move down
            let centerY = (A4_HEIGHT - imgHeight) / 2 + offsetY; // Apply the offset

            // Add the screenshot image to the PDF (centered with slight offset)
            let finalXPosition = centerX;
            let finalYPosition = centerY;

            // finalXPosition = centerX + 50 ;
            finalXPosition = (screenWidth <= 600) ? 8 : centerX;
            finalYPosition = (screenWidth <= 600) ? (centerY) : centerY;

            doc.addImage(screenshot, 'PNG', finalXPosition, finalYPosition, imgWidth, imgHeight);

            // Save the generated PDF with the image
            doc.save('exported_output.pdf');

            const pdfBlob = doc.output('blob');

            // Prepare the form data to send the PDF to the server
            const userDetails = JSON.parse(localStorage.getItem('userDetails'));

            const formData = new FormData();
            formData.append('pdfFile', pdfBlob, 'exported_output.pdf');
            formData.append('labelImage', imageExistingData); // Append image data as labelImage

            if (userDetails && userDetails.name && userDetails.mobile && userDetails.email) {
                formData.append('name', userDetails.name);  // Append user name
                formData.append('mobile', userDetails.mobile);  // Append user mobile
                formData.append('email', userDetails.email);  // Append user email
            }


            // Send the PDF to the PHP server using fetch
            fetch('https://www.popularwater.in/app/assets/php/sendEmail.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // console.log('PDF sent successfully!');
                } else {
                    console.error('Error sending PDF:', data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

            // Revert to the original size
            modelViewer.style.width = originalWidth + "px";
            modelViewer.style.height = originalHeight + "px";

            // pdfModal.style.visibility = 'hidden';
            pdfModal.css('visibility', 'hidden');
        });
    }, 100); // Adjust the delay if needed to allow time for rendering
}

    $('#exportGLBButton').click(function(){ 
        exportGLB();
    });


    function changeTopColor2(colorValue) {
        // console.log("input value : ", colorValue);
        if (modelViewer.model.materials.length >= 2) {
            // Specify the material name you want to change
            const targetMaterialName = 'Top';
    
            // Find the material by name
            const targetMaterial = modelViewer.model.materials.find(material => material.name === targetMaterialName);
            targetMaterial.pbrMetallicRoughness.baseColorTexture.setTexture(null);
    
            if (targetMaterial) {
                // Change the base color to a new value
    
    
                targetMaterial.pbrMetallicRoughness.baseColorTexture.setTexture(null);
    
                targetMaterial.setAlphaMode('OPAQUE');
                targetMaterial.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]);
                targetMaterial.pbrMetallicRoughness.setBaseColorFactor(colorValue); // White color
                targetMaterial.pbrMetallicRoughness.setRoughnessFactor(0.5); // Adjust roughness value
                targetMaterial.pbrMetallicRoughness.setMetallicFactor(0.2);
    
            } else {
                console.error(`Material with name '${targetMaterialName}' not found.`);
            }
        }
    }

async function exportGLB() {
    const glTF = await modelViewer.exportScene();
    const file = new File([glTF], "vtech-bottle-3d-output.glb");
    const link = document.createElement("a");
    link.download = file.name;
    link.href = URL.createObjectURL(file);
    link.click();

    const formData = new FormData();
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    formData.append('glbFile', file);
    formData.append('name', userDetails.name);
    formData.append('mobile', userDetails.mobile);
    formData.append('email', userDetails.email);

    try {
        const response = await fetch('https://www.popularwater.in/app/assets/php/sendEmailGLB.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            // console.log('File sent successfully!');
        } else {
            console.error('Error sending file:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

});
