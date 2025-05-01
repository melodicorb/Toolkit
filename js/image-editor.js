// Ultimate Student Toolkit - Image Editor

document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // DOM Elements
    const canvas = document.getElementById('image-canvas');
    const imageUpload = document.getElementById('image-upload');
    const uploadImageBtn = document.getElementById('upload-image');
    const saveImageBtn = document.getElementById('save-image');
    const resetImageBtn = document.getElementById('reset-image');
    const cropToolBtn = document.getElementById('crop-tool');
    const resizeToolBtn = document.getElementById('resize-tool');
    const rotateLeftBtn = document.getElementById('rotate-left');
    const rotateRightBtn = document.getElementById('rotate-right');
    const flipHBtn = document.getElementById('flip-h');
    const flipVBtn = document.getElementById('flip-v');
    const filterSelect = document.getElementById('filter-select');
    const textToolBtn = document.getElementById('text-tool');
    const drawToolBtn = document.getElementById('draw-tool');
    const colorPicker = document.getElementById('color-picker');
    const initialInstructions = document.getElementById('initial-instructions');
    
    // Resize Modal Elements
    const resizeModal = document.getElementById('resize-modal');
    const widthInput = document.getElementById('width-input');
    const heightInput = document.getElementById('height-input');
    const maintainAspect = document.getElementById('maintain-aspect');
    const cancelResizeBtn = document.getElementById('cancel-resize');
    const applyResizeBtn = document.getElementById('apply-resize');
    
    // Text Editor Elements
    const textEditor = document.getElementById('text-editor');
    const textInput = document.getElementById('text-input');
    const fontFamily = document.getElementById('font-family');
    const fontSize = document.getElementById('font-size');
    const cancelTextBtn = document.getElementById('cancel-text');
    const addTextBtn = document.getElementById('add-text');
    
    // Filter Adjustment Elements
    const filterAdjustment = document.getElementById('filter-adjustment');
    const filterValue = document.getElementById('filter-value');
    const cancelFilterBtn = document.getElementById('cancel-filter');
    const applyFilterBtn = document.getElementById('apply-filter');
    
    // Initialize Fabric.js canvas
    const fabricCanvas = new fabric.Canvas('image-canvas', {
        width: canvas.parentElement.clientWidth,
        height: canvas.parentElement.clientHeight,
        backgroundColor: '#f3f4f6'
    });
    
    // Variables for image state
    let originalImage = null;
    let currentImage = null;
    let imageWidth = 0;
    let imageHeight = 0;
    let aspectRatio = 1;
    let cropper = null;
    let currentFilter = 'none';
    let isDrawingMode = false;
    
    // Initialize brush
    fabricCanvas.freeDrawingBrush.color = colorPicker.value;
    fabricCanvas.freeDrawingBrush.width = 5;
    
    // Upload image button click
    uploadImageBtn.addEventListener('click', () => {
        imageUpload.click();
    });
    
    // Handle image upload
    imageUpload.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                // Load image into fabric canvas
                fabric.Image.fromURL(event.target.result, (img) => {
                    // Clear canvas
                    fabricCanvas.clear();
                    
                    // Save original image for reset
                    originalImage = img;
                    
                    // Resize image to fit canvas while maintaining aspect ratio
                    const canvasWidth = fabricCanvas.width;
                    const canvasHeight = fabricCanvas.height;
                    
                    imageWidth = img.width;
                    imageHeight = img.height;
                    aspectRatio = imageWidth / imageHeight;
                    
                    let newWidth = imageWidth;
                    let newHeight = imageHeight;
                    
                    if (imageWidth > canvasWidth) {
                        newWidth = canvasWidth - 40; // Padding
                        newHeight = newWidth / aspectRatio;
                    }
                    
                    if (newHeight > canvasHeight) {
                        newHeight = canvasHeight - 40; // Padding
                        newWidth = newHeight * aspectRatio;
                    }
                    
                    img.set({
                        scaleX: newWidth / imageWidth,
                        scaleY: newHeight / imageHeight,
                        left: (canvasWidth - newWidth) / 2,
                        top: (canvasHeight - newHeight) / 2,
                        selectable: true
                    });
                    
                    // Add image to canvas
                    fabricCanvas.add(img);
                    fabricCanvas.setActiveObject(img);
                    currentImage = img;
                    
                    // Hide instructions and enable tools
                    initialInstructions.classList.add('hidden');
                    enableTools();
                });
            };
            
            reader.readAsDataURL(e.target.files[0]);
        }
    });
    
    // Save image
    saveImageBtn.addEventListener('click', () => {
        if (!currentImage) return;
        
        // Convert canvas to data URL
        const dataURL = fabricCanvas.toDataURL({
            format: 'png',
            quality: 1
        });
        
        // Create download link
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'edited-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    
    // Reset image
    resetImageBtn.addEventListener('click', () => {
        if (!originalImage || !currentImage) return;
        
        // Confirm reset
        if (confirm('Are you sure you want to reset the image? All edits will be lost.')) {
            // Clear canvas
            fabricCanvas.clear();
            
            // Clone original image
            originalImage.clone((cloned) => {
                // Resize image to fit canvas while maintaining aspect ratio
                const canvasWidth = fabricCanvas.width;
                const canvasHeight = fabricCanvas.height;
                
                let newWidth = imageWidth;
                let newHeight = imageHeight;
                
                if (imageWidth > canvasWidth) {
                    newWidth = canvasWidth - 40; // Padding
                    newHeight = newWidth / aspectRatio;
                }
                
                if (newHeight > canvasHeight) {
                    newHeight = canvasHeight - 40; // Padding
                    newWidth = newHeight * aspectRatio;
                }
                
                cloned.set({
                    scaleX: newWidth / imageWidth,
                    scaleY: newHeight / imageHeight,
                    left: (canvasWidth - newWidth) / 2,
                    top: (canvasHeight - newHeight) / 2,
                    selectable: true
                });
                
                // Add image to canvas
                fabricCanvas.add(cloned);
                fabricCanvas.setActiveObject(cloned);
                currentImage = cloned;
                
                // Reset filter
                filterSelect.value = 'none';
                currentFilter = 'none';
            });
        }
    });
    
    // Crop tool
    cropToolBtn.addEventListener('click', () => {
        if (!currentImage) return;
        
        // Get image element
        const imgElement = currentImage.getElement();
        
        // Create a temporary container for the cropper
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        container.style.zIndex = '1000';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        
        // Create image element for cropper
        const img = document.createElement('img');
        img.src = imgElement.src;
        img.style.maxWidth = '80%';
        img.style.maxHeight = '80%';
        container.appendChild(img);
        
        // Add container to body
        document.body.appendChild(container);
        
        // Initialize cropper
        cropper = new Cropper(img, {
            viewMode: 1,
            dragMode: 'move',
            aspectRatio: NaN,
            autoCropArea: 0.8,
            restore: false,
            guides: true,
            center: true,
            highlight: false,
            cropBoxMovable: true,
            cropBoxResizable: true,
            toggleDragModeOnDblclick: false,
            ready: function() {
                // Add buttons
                const buttonContainer = document.createElement('div');
                buttonContainer.style.position = 'absolute';
                buttonContainer.style.bottom = '20px';
                buttonContainer.style.left = '0';
                buttonContainer.style.right = '0';
                buttonContainer.style.display = 'flex';
                buttonContainer.style.justifyContent = 'center';
                buttonContainer.style.gap = '10px';
                
                const cancelBtn = document.createElement('button');
                cancelBtn.textContent = 'Cancel';
                cancelBtn.className = 'px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition duration-300';
                cancelBtn.addEventListener('click', () => {
                    cropper.destroy();
                    document.body.removeChild(container);
                });
                
                const applyBtn = document.createElement('button');
                applyBtn.textContent = 'Apply';
                applyBtn.className = 'px-3 py-1 bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white rounded-md hover:from-fuchsia-600 hover:to-violet-700 transition duration-300';
                applyBtn.addEventListener('click', () => {
                    // Get cropped canvas
                    const croppedCanvas = cropper.getCroppedCanvas();
                    
                    // Convert to data URL
                    const dataURL = croppedCanvas.toDataURL('image/png');
                    
                    // Create new image from data URL
                    fabric.Image.fromURL(dataURL, (img) => {
                        // Clear canvas
                        fabricCanvas.clear();
                        
                        // Resize image to fit canvas while maintaining aspect ratio
                        const canvasWidth = fabricCanvas.width;
                        const canvasHeight = fabricCanvas.height;
                        
                        const newImageWidth = img.width;
                        const newImageHeight = img.height;
                        const newAspectRatio = newImageWidth / newImageHeight;
                        
                        let newWidth = newImageWidth;
                        let newHeight = newImageHeight;
                        
                        if (newImageWidth > canvasWidth) {
                            newWidth = canvasWidth - 40; // Padding
                            newHeight = newWidth / newAspectRatio;
                        }
                        
                        if (newHeight > canvasHeight) {
                            newHeight = canvasHeight - 40; // Padding
                            newWidth = newHeight * newAspectRatio;
                        }
                        
                        img.set({
                            scaleX: newWidth / newImageWidth,
                            scaleY: newHeight / newImageHeight,
                            left: (canvasWidth - newWidth) / 2,
                            top: (canvasHeight - newHeight) / 2,
                            selectable: true
                        });
                        
                        // Add image to canvas
                        fabricCanvas.add(img);
                        fabricCanvas.setActiveObject(img);
                        currentImage = img;
                    });
                    
                    // Destroy cropper and remove container
                    cropper.destroy();
                    document.body.removeChild(container);
                });
                
                buttonContainer.appendChild(cancelBtn);
                buttonContainer.appendChild(applyBtn);
                container.appendChild(buttonContainer);
            }
        });
    });
    
    // Resize tool
    resizeToolBtn.addEventListener('click', () => {
        if (!currentImage) return;
        
        // Get current image dimensions
        const width = Math.round(currentImage.width * currentImage.scaleX);
        const height = Math.round(currentImage.height * currentImage.scaleY);
        
        // Set input values
        widthInput.value = width;
        heightInput.value = height;
        
        // Show resize modal
        resizeModal.classList.remove('hidden');
    });
    
    // Width input change
    widthInput.addEventListener('input', () => {
        if (maintainAspect.checked) {
            const width = parseInt(widthInput.value);
            heightInput.value = Math.round(width / aspectRatio);
        }
    });
    
    // Height input change
    heightInput.addEventListener('input', () => {
        if (maintainAspect.checked) {
            const height = parseInt(heightInput.value);
            widthInput.value = Math.round(height * aspectRatio);
        }
    });
    
    // Cancel resize
    cancelResizeBtn.addEventListener('click', () => {
        resizeModal.classList.add('hidden');
    });
    
    // Apply resize
    applyResizeBtn.addEventListener('click', () => {
        if (!currentImage) return;
        
        // Get new dimensions
        const newWidth = parseInt(widthInput.value);
        const newHeight = parseInt(heightInput.value);
        
        if (newWidth <= 0 || newHeight <= 0) {
            alert('Width and height must be greater than 0');
            return;
        }
        
        // Resize image
        currentImage.set({
            scaleX: newWidth / currentImage.width,
            scaleY: newHeight / currentImage.height
        });
        
        // Update canvas
        fabricCanvas.renderAll();
        
        // Hide resize modal
        resizeModal.classList.add('hidden');
    });
    
    // Rotate left
    rotateLeftBtn.addEventListener('click', () => {
        if (!currentImage) return;
        
        // Rotate image
        currentImage.rotate(currentImage.angle - 90);
        
        // Update canvas
        fabricCanvas.renderAll();
    });
    
    // Rotate right
    rotateRightBtn.addEventListener('click', () => {
        if (!currentImage) return;
        
        // Rotate image
        currentImage.rotate(currentImage.angle + 90);
        
        // Update canvas
        fabricCanvas.renderAll();
    });
    
    // Flip horizontal
    flipHBtn.addEventListener('click', () => {
        if (!currentImage) return;
        
        // Flip image
        currentImage.set('flipX', !currentImage.flipX);
        
        // Update canvas
        fabricCanvas.renderAll();
    });
    
    // Flip vertical
    flipVBtn.addEventListener('click', () => {
        if (!currentImage) return;
        
        // Flip image
        currentImage.set('flipY', !currentImage.flipY);
        
        // Update canvas
        fabricCanvas.renderAll();
    });
    
    // Filter select change
    filterSelect.addEventListener('change', () => {
        if (!currentImage) return;
        
        // Get selected filter
        const filter = filterSelect.value;
        currentFilter = filter;
        
        // Apply filter
        applyFilter(filter);
    });
    
    // Apply filter
    function applyFilter(filter) {
        if (!currentImage) return;
        
        // Remove existing filters
        currentImage.filters = [];
        
        // Apply selected filter
        if (filter === 'grayscale') {
            currentImage.filters.push(new fabric.Image.filters.Grayscale());
        } else if (filter === 'sepia') {
            currentImage.filters.push(new fabric.Image.filters.Sepia());
        } else if (filter === 'invert') {
            currentImage.filters.push(new fabric.Image.filters.Invert());
        } else if (filter === 'brightness') {
            // Show filter adjustment
            filterValue.value = 50; // Default value
            filterAdjustment.classList.remove('hidden');
            return;
        } else if (filter === 'contrast') {
            // Show filter adjustment
            filterValue.value = 50; // Default value
            filterAdjustment.classList.remove('hidden');
            return;
        } else if (filter === 'saturation') {
            // Show filter adjustment
            filterValue.value = 50; // Default value
            filterAdjustment.classList.remove('hidden');
            return;
        }
        
        // Apply filters
        currentImage.applyFilters();
        fabricCanvas.renderAll();
    }
    
    // Cancel filter
    cancelFilterBtn.addEventListener('click', () => {
        filterAdjustment.classList.add('hidden');
        filterSelect.value = 'none';
        currentFilter = 'none';
        
        // Remove filters
        if (currentImage) {
            currentImage.filters = [];
            currentImage.applyFilters();
            fabricCanvas.renderAll();
        }
    });
    
    // Apply filter adjustment
    applyFilterBtn.addEventListener('click', () => {
        if (!currentImage) return;
        
        // Get filter value
        const value = parseInt(filterValue.value);
        const normalizedValue = (value - 50) / 50; // Convert to range -1 to 1
        
        // Apply filter based on current filter
        if (currentFilter === 'brightness') {
            currentImage.filters.push(new fabric.Image.filters.Brightness({
                brightness: normalizedValue
            }));
        } else if (currentFilter === 'contrast') {
            currentImage.filters.push(new fabric.Image.filters.Contrast({
                contrast: normalizedValue * 2 // Range -2 to 2
            }));
        } else if (currentFilter === 'saturation') {
            currentImage.filters.push(new fabric.Image.filters.Saturation({
                saturation: normalizedValue * 2 // Range -2 to 2
            }));
        }
        
        // Apply filters
        currentImage.applyFilters();
        fabricCanvas.renderAll();
        
        // Hide filter adjustment
        filterAdjustment.classList.add('hidden');
    });
    
    // Text tool
    textToolBtn.addEventListener('click', () => {
        // Show text editor
        textEditor.classList.remove('hidden');
    });
    
    // Cancel text
    cancelTextBtn.addEventListener('click', () => {
        textInput.value = '';
        textEditor.classList.add('hidden');
    });
    
    // Add text
    addTextBtn.addEventListener('click', () => {
        const text = textInput.value.trim();
        if (!text) return;
        
        // Create text object
        const textObj = new fabric.Text(text, {
            left: fabricCanvas.width / 2,
            top: fabricCanvas.height / 2,
            fontFamily: fontFamily.value,
            fontSize: parseInt(fontSize.value),
            fill: colorPicker.value,
            originX: 'center',
            originY: 'center',
            selectable: true
        });
        
        // Add text to canvas
        fabricCanvas.add(textObj);
        fabricCanvas.setActiveObject(textObj);
        
        // Reset and hide text editor
        textInput.value = '';
        textEditor.classList.add('hidden');
    });
    
    // Draw tool
    drawToolBtn.addEventListener('click', () => {
        // Toggle drawing mode
        isDrawingMode = !isDrawingMode;
        fabricCanvas.isDrawingMode = isDrawingMode;
        
        // Update button style
        if (isDrawingMode) {
            drawToolBtn.classList.add('bg-gray-200');
        } else {
            drawToolBtn.classList.remove('bg-gray-200');
        }
    });
    
    // Color picker change
    colorPicker.addEventListener('input', () => {
        // Update brush color
        fabricCanvas.freeDrawingBrush.color = colorPicker.value;
    });
    
    // Enable tools
    function enableTools() {
        saveImageBtn.disabled = false;
        resetImageBtn.disabled = false;
        cropToolBtn.disabled = false;
        resizeToolBtn.disabled = false;
        rotateLeftBtn.disabled = false;
        rotateRightBtn.disabled = false;
        flipHBtn.disabled = false;
        flipVBtn.disabled = false;
        filterSelect.disabled = false;
        textToolBtn.disabled = false;
        drawToolBtn.disabled = false;
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Update canvas dimensions
        fabricCanvas.setWidth(canvas.parentElement.clientWidth);
        fabricCanvas.setHeight(canvas.parentElement.clientHeight);
        fabricCanvas.renderAll();
        
        // Recenter image if exists
        if (currentImage) {
            currentImage.center();
            fabricCanvas.renderAll();
        }
    });
});