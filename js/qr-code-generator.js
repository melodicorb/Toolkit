// Ultimate Student Toolkit - QR Code Generator

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const qrTypeSelect = document.getElementById('qr-type');
    const dynamicFields = document.getElementById('dynamic-fields');
    const qrSizeSelect = document.getElementById('qr-size');
    const qrColorInput = document.getElementById('qr-color');
    const generateQrBtn = document.getElementById('generate-qr-btn');
    const qrPlaceholder = document.getElementById('qr-placeholder');
    const qrCodeContainer = document.getElementById('qr-code-container');
    const qrCodeDiv = document.getElementById('qr-code');
    const downloadQrBtn = document.getElementById('download-qr-btn');
    const printQrBtn = document.getElementById('print-qr-btn');
    
    // Event Listeners
    qrTypeSelect.addEventListener('change', updateDynamicFields);
    generateQrBtn.addEventListener('click', generateQRCode);
    downloadQrBtn.addEventListener('click', downloadQRCode);
    printQrBtn.addEventListener('click', printQRCode);
    
    // Initialize with URL fields (default)
    updateDynamicFields();
    
    // Update input fields based on QR code type
    function updateDynamicFields() {
        const qrType = qrTypeSelect.value;
        let fieldsHTML = '';
        
        switch(qrType) {
            case 'url':
                fieldsHTML = `
                    <div id="url-fields">
                        <label for="url-input" class="block text-sm font-medium text-gray-700 mb-1">Enter URL</label>
                        <input type="url" id="url-input" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="https://example.com">
                    </div>
                `;
                break;
                
            case 'text':
                fieldsHTML = `
                    <div id="text-fields">
                        <label for="text-input" class="block text-sm font-medium text-gray-700 mb-1">Enter Text</label>
                        <textarea id="text-input" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your text here"></textarea>
                    </div>
                `;
                break;
                
            case 'email':
                fieldsHTML = `
                    <div id="email-fields" class="space-y-3">
                        <div>
                            <label for="email-address" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input type="email" id="email-address" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="example@email.com">
                        </div>
                        <div>
                            <label for="email-subject" class="block text-sm font-medium text-gray-700 mb-1">Subject (Optional)</label>
                            <input type="text" id="email-subject" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Email subject">
                        </div>
                        <div>
                            <label for="email-body" class="block text-sm font-medium text-gray-700 mb-1">Body (Optional)</label>
                            <textarea id="email-body" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Email body"></textarea>
                        </div>
                    </div>
                `;
                break;
                
            case 'phone':
                fieldsHTML = `
                    <div id="phone-fields">
                        <label for="phone-input" class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input type="tel" id="phone-input" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="+1234567890">
                    </div>
                `;
                break;
                
            case 'sms':
                fieldsHTML = `
                    <div id="sms-fields" class="space-y-3">
                        <div>
                            <label for="sms-number" class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input type="tel" id="sms-number" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="+1234567890">
                        </div>
                        <div>
                            <label for="sms-message" class="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                            <textarea id="sms-message" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Your message here"></textarea>
                        </div>
                    </div>
                `;
                break;
                
            case 'vcard':
                fieldsHTML = `
                    <div id="vcard-fields" class="space-y-3">
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label for="vcard-firstname" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input type="text" id="vcard-firstname" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                            <div>
                                <label for="vcard-lastname" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input type="text" id="vcard-lastname" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            </div>
                        </div>
                        <div>
                            <label for="vcard-phone" class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input type="tel" id="vcard-phone" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label for="vcard-email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" id="vcard-email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label for="vcard-org" class="block text-sm font-medium text-gray-700 mb-1">Organization (Optional)</label>
                            <input type="text" id="vcard-org" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label for="vcard-url" class="block text-sm font-medium text-gray-700 mb-1">Website (Optional)</label>
                            <input type="url" id="vcard-url" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="https://example.com">
                        </div>
                    </div>
                `;
                break;
                
            case 'wifi':
                fieldsHTML = `
                    <div id="wifi-fields" class="space-y-3">
                        <div>
                            <label for="wifi-ssid" class="block text-sm font-medium text-gray-700 mb-1">Network Name (SSID)</label>
                            <input type="text" id="wifi-ssid" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label for="wifi-type" class="block text-sm font-medium text-gray-700 mb-1">Security Type</label>
                            <select id="wifi-type" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="WPA">WPA/WPA2</option>
                                <option value="WEP">WEP</option>
                                <option value="nopass">No Password</option>
                            </select>
                        </div>
                        <div id="wifi-password-container">
                            <label for="wifi-password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type="password" id="wifi-password" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <div class="flex items-center mt-1">
                                <input type="checkbox" id="show-password" class="mr-2">
                                <label for="show-password" class="text-sm text-gray-600">Show password</label>
                            </div>
                        </div>
                        <div>
                            <div class="flex items-center">
                                <input type="checkbox" id="wifi-hidden" class="mr-2">
                                <label for="wifi-hidden" class="text-sm text-gray-700">Hidden network</label>
                            </div>
                        </div>
                    </div>
                `;
                break;
        }
        
        dynamicFields.innerHTML = fieldsHTML;
        
        // Add event listener for show password checkbox if it exists
        const showPasswordCheckbox = document.getElementById('show-password');
        const wifiPasswordInput = document.getElementById('wifi-password');
        const wifiTypeSelect = document.getElementById('wifi-type');
        
        if (showPasswordCheckbox && wifiPasswordInput) {
            showPasswordCheckbox.addEventListener('change', () => {
                wifiPasswordInput.type = showPasswordCheckbox.checked ? 'text' : 'password';
            });
        }
        
        // Hide password field if no password is selected
        if (wifiTypeSelect) {
            const passwordContainer = document.getElementById('wifi-password-container');
            wifiTypeSelect.addEventListener('change', () => {
                passwordContainer.style.display = wifiTypeSelect.value === 'nopass' ? 'none' : 'block';
            });
        }
    }
    
    // Generate QR Code
    function generateQRCode() {
        const qrType = qrTypeSelect.value;
        const qrSize = parseInt(qrSizeSelect.value);
        const qrColor = qrColorInput.value;
        
        let qrData = '';
        let isValid = true;
        let errorMessage = '';
        
        // Get data based on QR type
        switch(qrType) {
            case 'url':
                const urlInput = document.getElementById('url-input');
                if (!urlInput.value) {
                    isValid = false;
                    errorMessage = 'Please enter a URL';
                } else {
                    qrData = urlInput.value;
                    // Add http:// if not present
                    if (!/^https?:\/\//i.test(qrData)) {
                        qrData = 'http://' + qrData;
                    }
                }
                break;
                
            case 'text':
                const textInput = document.getElementById('text-input');
                if (!textInput.value) {
                    isValid = false;
                    errorMessage = 'Please enter some text';
                } else {
                    qrData = textInput.value;
                }
                break;
                
            case 'email':
                const emailAddress = document.getElementById('email-address');
                const emailSubject = document.getElementById('email-subject');
                const emailBody = document.getElementById('email-body');
                
                if (!emailAddress.value) {
                    isValid = false;
                    errorMessage = 'Please enter an email address';
                } else {
                    qrData = `mailto:${emailAddress.value}`;
                    
                    // Add subject and body if provided
                    const params = [];
                    if (emailSubject.value) params.push(`subject=${encodeURIComponent(emailSubject.value)}`);
                    if (emailBody.value) params.push(`body=${encodeURIComponent(emailBody.value)}`);
                    
                    if (params.length > 0) {
                        qrData += '?' + params.join('&');
                    }
                }
                break;
                
            case 'phone':
                const phoneInput = document.getElementById('phone-input');
                if (!phoneInput.value) {
                    isValid = false;
                    errorMessage = 'Please enter a phone number';
                } else {
                    qrData = `tel:${phoneInput.value}`;
                }
                break;
                
            case 'sms':
                const smsNumber = document.getElementById('sms-number');
                const smsMessage = document.getElementById('sms-message');
                
                if (!smsNumber.value) {
                    isValid = false;
                    errorMessage = 'Please enter a phone number';
                } else {
                    qrData = `smsto:${smsNumber.value}`;
                    if (smsMessage.value) {
                        qrData += `:${smsMessage.value}`;
                    }
                }
                break;
                
            case 'vcard':
                const firstName = document.getElementById('vcard-firstname').value;
                const lastName = document.getElementById('vcard-lastname').value;
                const phone = document.getElementById('vcard-phone').value;
                const email = document.getElementById('vcard-email').value;
                const org = document.getElementById('vcard-org').value;
                const url = document.getElementById('vcard-url').value;
                
                if (!firstName || !lastName || !phone || !email) {
                    isValid = false;
                    errorMessage = 'Please fill in all required fields (First Name, Last Name, Phone, Email)';
                } else {
                    // Create vCard format
                    qrData = 'BEGIN:VCARD\n';
                    qrData += 'VERSION:3.0\n';
                    qrData += `N:${lastName};${firstName}\n`;
                    qrData += `FN:${firstName} ${lastName}\n`;
                    qrData += `TEL:${phone}\n`;
                    qrData += `EMAIL:${email}\n`;
                    if (org) qrData += `ORG:${org}\n`;
                    if (url) qrData += `URL:${url}\n`;
                    qrData += 'END:VCARD';
                }
                break;
                
            case 'wifi':
                const ssid = document.getElementById('wifi-ssid').value;
                const type = document.getElementById('wifi-type').value;
                const password = document.getElementById('wifi-password')?.value || '';
                const hidden = document.getElementById('wifi-hidden').checked;
                
                if (!ssid) {
                    isValid = false;
                    errorMessage = 'Please enter a network name (SSID)';
                } else if (type !== 'nopass' && !password) {
                    isValid = false;
                    errorMessage = 'Please enter a password for the secured network';
                } else {
                    // Create WiFi format
                    qrData = 'WIFI:';
                    qrData += `S:${ssid};`;
                    qrData += `T:${type};`;
                    if (type !== 'nopass') qrData += `P:${password};`;
                    if (hidden) qrData += 'H:true;';
                    qrData += ';';
                }
                break;
        }
        
        // Generate QR code if data is valid
        if (isValid) {
            // Create QR code using qrcode-generator library
            const typeNumber = 0; // Auto-detect
            const errorCorrectionLevel = 'L'; // Low
            const qr = qrcode(typeNumber, errorCorrectionLevel);
            qr.addData(qrData);
            qr.make();
            
            // Create SVG
            const svgString = qr.createSvgTag({
                scalable: true,
                margin: 4,
                cellSize: qrSize / qr.getModuleCount(),
                color: qrColor
            });
            
            // Display QR code
            qrCodeDiv.innerHTML = svgString;
            qrPlaceholder.style.display = 'none';
            qrCodeContainer.style.display = 'flex';
            
            // Store QR data for download
            qrCodeDiv.dataset.qrData = qrData;
        } else {
            // Show error message
            qrPlaceholder.innerHTML = `
                <i class="fas fa-exclamation-circle text-5xl text-red-300 mb-4"></i>
                <p class="text-red-500 text-center">${errorMessage}</p>
            `;
            qrPlaceholder.style.display = 'flex';
            qrCodeContainer.style.display = 'none';
        }
    }
    
    // Download QR Code as PNG
    function downloadQRCode() {
        const svg = qrCodeDiv.querySelector('svg');
        if (!svg) return;
        
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = parseInt(qrSizeSelect.value);
        
        // Set canvas size
        canvas.width = size;
        canvas.height = size;
        
        // Create an image from the SVG
        const img = new Image();
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(svgBlob);
        
        img.onload = function() {
            // Draw the image on the canvas
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, size, size);
            ctx.drawImage(img, 0, 0, size, size);
            
            // Convert canvas to blob
            canvas.toBlob(function(blob) {
                // Create download link
                const downloadLink = document.createElement('a');
                downloadLink.download = 'qrcode.png';
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.click();
                
                // Clean up
                URL.revokeObjectURL(downloadLink.href);
            });
            
            // Clean up
            URL.revokeObjectURL(url);
        };
        
        img.src = url;
    }
    
    // Print QR Code
    function printQRCode() {
        const svg = qrCodeDiv.querySelector('svg');
        if (!svg) return;
        
        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        
        // Get QR data and type
        const qrData = qrCodeDiv.dataset.qrData || '';
        const qrType = qrTypeSelect.value;
        
        // Create a title based on QR type
        let title = 'QR Code';
        switch(qrType) {
            case 'url': title = 'URL QR Code'; break;
            case 'text': title = 'Text QR Code'; break;
            case 'email': title = 'Email QR Code'; break;
            case 'phone': title = 'Phone QR Code'; break;
            case 'sms': title = 'SMS QR Code'; break;
            case 'vcard': title = 'Contact QR Code'; break;
            case 'wifi': title = 'WiFi QR Code'; break;
        }
        
        // Create print content
        const svgData = new XMLSerializer().serializeToString(svg);
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        text-align: center;
                        padding: 20px;
                    }
                    .qr-container {
                        margin: 20px auto;
                        max-width: 500px;
                    }
                    svg {
                        max-width: 100%;
                        height: auto;
                    }
                    .info {
                        margin-top: 20px;
                        color: #666;
                        font-size: 14px;
                    }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                <div class="qr-container">
                    ${svgData}
                </div>
                <div class="info">
                    <p>Generated with Ultimate Student Toolkit</p>
                </div>
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            window.close();
                        }, 500);
                    };
                </script>
            </body>
            </html>
        `;
        
        // Write to the new window and trigger print
        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();
    }
});