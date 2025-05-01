// Ultimate Student Toolkit - File Converter

document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // DOM Elements - File Upload
    const fileDropArea = document.getElementById('file-drop-area');
    const fileInput = document.getElementById('file-input');
    const browseFilesBtn = document.getElementById('browse-files-btn');
    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const removeFileBtn = document.getElementById('remove-file-btn');
    
    // DOM Elements - Conversion Options
    const conversionType = document.getElementById('conversion-type');
    const outputFormat = document.getElementById('output-format');
    const additionalOptions = document.getElementById('additional-options');
    const imageOptions = document.getElementById('image-options');
    const imageQuality = document.getElementById('image-quality');
    const convertBtn = document.getElementById('convert-btn');
    
    // DOM Elements - Conversion Status
    const initialState = document.getElementById('initial-state');
    const processingState = document.getElementById('processing-state');
    const successState = document.getElementById('success-state');
    const errorState = document.getElementById('error-state');
    const errorMessage = document.getElementById('error-message');
    const downloadBtn = document.getElementById('download-btn');
    
    // Variables
    let selectedFile = null;
    let convertedFile = null;
    
    // Format options for different conversion types
    const formatOptions = {
        document: [
            { value: 'pdf', label: 'PDF (.pdf)' },
            { value: 'docx', label: 'Word (.docx)' },
            { value: 'txt', label: 'Text (.txt)' },
            { value: 'rtf', label: 'Rich Text (.rtf)' },
            { value: 'html', label: 'HTML (.html)' },
            { value: 'md', label: 'Markdown (.md)' }
        ],
        image: [
            { value: 'jpg', label: 'JPEG (.jpg)' },
            { value: 'png', label: 'PNG (.png)' },
            { value: 'gif', label: 'GIF (.gif)' },
            { value: 'bmp', label: 'BMP (.bmp)' },
            { value: 'tiff', label: 'TIFF (.tiff)' },
            { value: 'webp', label: 'WebP (.webp)' }
        ],
        audio: [
            { value: 'mp3', label: 'MP3 (.mp3)' },
            { value: 'wav', label: 'WAV (.wav)' },
            { value: 'aac', label: 'AAC (.aac)' },
            { value: 'flac', label: 'FLAC (.flac)' },
            { value: 'ogg', label: 'OGG (.ogg)' },
            { value: 'm4a', label: 'M4A (.m4a)' }
        ],
        video: [
            { value: 'mp4', label: 'MP4 (.mp4)' },
            { value: 'avi', label: 'AVI (.avi)' },
            { value: 'mov', label: 'MOV (.mov)' },
            { value: 'mkv', label: 'MKV (.mkv)' },
            { value: 'webm', label: 'WebM (.webm)' },
            { value: 'flv', label: 'FLV (.flv)' }
        ]
    };
    
    // Event Listeners
    browseFilesBtn.addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', handleFileSelect);
    
    fileDropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileDropArea.classList.add('border-blue-500');
    });
    
    fileDropArea.addEventListener('dragleave', () => {
        fileDropArea.classList.remove('border-blue-500');
    });
    
    fileDropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileDropArea.classList.remove('border-blue-500');
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelect(e);
        }
    });
    
    removeFileBtn.addEventListener('click', () => {
        resetFileSelection();
    });
    
    conversionType.addEventListener('change', updateFormatOptions);
    
    convertBtn.addEventListener('click', convertFile);
    
    downloadBtn.addEventListener('click', downloadConvertedFile);
    
    // Functions
    function handleFileSelect(e) {
        const file = e.target.files[0] || e.dataTransfer.files[0];
        
        if (file) {
            selectedFile = file;
            
            // Display file info
            fileName.textContent = file.name;
            fileSize.textContent = formatFileSize(file.size);
            fileInfo.classList.remove('hidden');
            
            // Enable conversion type selection
            conversionType.disabled = false;
            
            // Auto-select conversion type based on file extension
            const fileExtension = file.name.split('.').pop().toLowerCase();
            selectConversionTypeByExtension(fileExtension);
            
            // Update UI
            showState('initial');
        }
    }
    
    function selectConversionTypeByExtension(extension) {
        // Document formats
        if (['pdf', 'docx', 'doc', 'txt', 'rtf', 'html', 'md'].includes(extension)) {
            conversionType.value = 'document';
        }
        // Image formats
        else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp'].includes(extension)) {
            conversionType.value = 'image';
        }
        // Audio formats
        else if (['mp3', 'wav', 'aac', 'flac', 'ogg', 'm4a'].includes(extension)) {
            conversionType.value = 'audio';
        }
        // Video formats
        else if (['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv'].includes(extension)) {
            conversionType.value = 'video';
        }
        
        updateFormatOptions();
    }
    
    function updateFormatOptions() {
        const selectedType = conversionType.value;
        
        // Clear current options
        outputFormat.innerHTML = '<option value="">Select output format</option>';
        
        if (selectedType) {
            // Add format options based on selected type
            formatOptions[selectedType].forEach(format => {
                const option = document.createElement('option');
                option.value = format.value;
                option.textContent = format.label;
                outputFormat.appendChild(option);
            });
            
            // Enable output format selection
            outputFormat.disabled = false;
            
            // Show/hide additional options
            additionalOptions.classList.remove('hidden');
            
            if (selectedType === 'image') {
                imageOptions.classList.remove('hidden');
            } else {
                imageOptions.classList.add('hidden');
            }
        } else {
            // Disable output format selection
            outputFormat.disabled = true;
            additionalOptions.classList.add('hidden');
        }
        
        updateConvertButton();
    }
    
    function updateConvertButton() {
        // Enable convert button if file, conversion type, and output format are selected
        if (selectedFile && conversionType.value && outputFormat.value) {
            convertBtn.disabled = false;
        } else {
            convertBtn.disabled = true;
        }
    }
    
    function resetFileSelection() {
        selectedFile = null;
        fileInput.value = '';
        fileInfo.classList.add('hidden');
        conversionType.value = '';
        conversionType.disabled = true;
        outputFormat.value = '';
        outputFormat.disabled = true;
        additionalOptions.classList.add('hidden');
        convertBtn.disabled = true;
        showState('initial');
    }
    
    function convertFile() {
        if (!selectedFile) return;
        
        // Show processing state
        showState('processing');
        
        // Get selected options
        const selectedType = conversionType.value;
        const selectedFormat = outputFormat.value;
        
        // Simulate conversion process (in a real app, this would use actual conversion libraries)
        setTimeout(() => {
            try {
                // For demonstration purposes, we're just simulating a successful conversion
                // In a real application, you would use appropriate libraries for each conversion type
                
                // Simulate conversion success (90% of the time)
                if (Math.random() < 0.9) {
                    // Create a dummy converted file (in a real app, this would be the actual converted file)
                    convertedFile = new Blob([selectedFile], { type: getMimeType(selectedFormat) });
                    
                    // Show success state
                    showState('success');
                } else {
                    // Simulate conversion error
                    throw new Error('Conversion failed due to unsupported features in the source file.');
                }
            } catch (error) {
                // Show error state
                errorMessage.textContent = error.message;
                showState('error');
            }
        }, 2000); // Simulate processing time
    }
    
    function downloadConvertedFile() {
        if (!convertedFile) return;
        
        // Get original filename without extension
        const originalName = selectedFile.name.split('.').slice(0, -1).join('.');
        const newExtension = outputFormat.value;
        
        // Create download link
        saveAs(convertedFile, `${originalName}.${newExtension}`);
    }
    
    function showState(state) {
        // Hide all states
        initialState.classList.add('hidden');
        processingState.classList.add('hidden');
        successState.classList.add('hidden');
        errorState.classList.add('hidden');
        
        // Show selected state
        switch (state) {
            case 'initial':
                initialState.classList.remove('hidden');
                break;
            case 'processing':
                processingState.classList.remove('hidden');
                break;
            case 'success':
                successState.classList.remove('hidden');
                break;
            case 'error':
                errorState.classList.remove('hidden');
                break;
        }
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    function getMimeType(format) {
        // Return appropriate MIME type based on format
        const mimeTypes = {
            // Document formats
            'pdf': 'application/pdf',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'txt': 'text/plain',
            'rtf': 'application/rtf',
            'html': 'text/html',
            'md': 'text/markdown',
            
            // Image formats
            'jpg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'bmp': 'image/bmp',
            'tiff': 'image/tiff',
            'webp': 'image/webp',
            
            // Audio formats
            'mp3': 'audio/mpeg',
            'wav': 'audio/wav',
            'aac': 'audio/aac',
            'flac': 'audio/flac',
            'ogg': 'audio/ogg',
            'm4a': 'audio/m4a',
            
            // Video formats
            'mp4': 'video/mp4',
            'avi': 'video/x-msvideo',
            'mov': 'video/quicktime',
            'mkv': 'video/x-matroska',
            'webm': 'video/webm',
            'flv': 'video/x-flv'
        };
        
        return mimeTypes[format] || 'application/octet-stream';
    }
    
    // Initialize UI
    outputFormat.addEventListener('change', updateConvertButton);
});