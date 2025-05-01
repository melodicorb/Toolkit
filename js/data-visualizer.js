// Ultimate Student Toolkit - Data Visualizer

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chartTitle = document.getElementById('chart-title');
    const chartType = document.getElementById('chart-type');
    const manualInputBtn = document.getElementById('manual-input-btn');
    const csvUploadBtn = document.getElementById('csv-upload-btn');
    const manualInputContainer = document.getElementById('manual-input-container');
    const csvUploadContainer = document.getElementById('csv-upload-container');
    const addDataRowBtn = document.getElementById('add-data-row');
    const dataRows = document.getElementById('data-rows');
    const generateChartBtn = document.getElementById('generate-chart-btn');
    const chartContainer = document.getElementById('chart-container');
    const downloadChartBtn = document.getElementById('download-chart');
    const saveChartBtn = document.getElementById('save-chart');
    const csvFile = document.getElementById('csv-file');
    const csvFilename = document.getElementById('csv-filename');
    const csvRows = document.getElementById('csv-rows');
    const csvPreview = document.getElementById('csv-preview');
    const colorScheme = document.getElementById('color-scheme');
    const backgroundColor = document.getElementById('background-color');
    const fontSize = document.getElementById('font-size');
    const showLegend = document.getElementById('show-legend');
    const showGrid = document.getElementById('show-grid');
    const enableAnimation = document.getElementById('enable-animation');
    const enableTooltips = document.getElementById('enable-tooltips');
    const savedCharts = document.getElementById('saved-charts');
    const clearSavedChartsBtn = document.getElementById('clear-saved-charts');
    
    // Chart instance
    let currentChart = null;
    
    // Color schemes
    const colorSchemes = {
        default: ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'],
        pastel: ['#c1d3fe', '#ccabd8', '#e8c6c0', '#f0e0a2', '#bfe5d9', '#fedcba', '#c6def1', '#dbcdf0', '#f2c6de', '#c9e4de'],
        vibrant: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'],
        monochrome: ['#0d0887', '#41049d', '#6a00a8', '#8f0da4', '#b12a90', '#cc4778', '#e16462', '#f2844b', '#fca636', '#fcce25'],
        gradient: ['#3b82f6', '#4f46e5', '#7c3aed', '#9333ea', '#c026d3', '#db2777', '#e11d48', '#f97316', '#eab308', '#84cc16']
    };
    
    // Initialize event listeners
    function init() {
        // Toggle between manual input and CSV upload
        manualInputBtn.addEventListener('click', () => {
            manualInputBtn.classList.add('active', 'bg-blue-100', 'text-blue-800');
            manualInputBtn.classList.remove('bg-gray-100', 'text-gray-800');
            csvUploadBtn.classList.remove('active', 'bg-blue-100', 'text-blue-800');
            csvUploadBtn.classList.add('bg-gray-100', 'text-gray-800');
            manualInputContainer.classList.remove('hidden');
            csvUploadContainer.classList.add('hidden');
        });
        
        csvUploadBtn.addEventListener('click', () => {
            csvUploadBtn.classList.add('active', 'bg-blue-100', 'text-blue-800');
            csvUploadBtn.classList.remove('bg-gray-100', 'text-gray-800');
            manualInputBtn.classList.remove('active', 'bg-blue-100', 'text-blue-800');
            manualInputBtn.classList.add('bg-gray-100', 'text-gray-800');
            csvUploadContainer.classList.remove('hidden');
            manualInputContainer.classList.add('hidden');
        });
        
        // Add data row
        addDataRowBtn.addEventListener('click', addDataRow);
        
        // Generate chart
        generateChartBtn.addEventListener('click', generateChart);
        
        // CSV file upload
        csvFile.addEventListener('change', handleCSVUpload);
        
        // Chart customization
        colorScheme.addEventListener('change', updateChart);
        backgroundColor.addEventListener('change', updateChart);
        fontSize.addEventListener('input', updateChart);
        showLegend.addEventListener('change', updateChart);
        showGrid.addEventListener('change', updateChart);
        enableAnimation.addEventListener('change', updateChart);
        enableTooltips.addEventListener('change', updateChart);
        
        // Chart actions
        downloadChartBtn.addEventListener('click', downloadChart);
        saveChartBtn.addEventListener('click', saveChart);
        clearSavedChartsBtn.addEventListener('click', clearSavedCharts);
        
        // Chart type change
        chartType.addEventListener('change', updateChartType);
        
        // Load saved charts
        loadSavedCharts();
    }
    
    // Add a new data row
    function addDataRow() {
        const newRow = document.createElement('div');
        newRow.className = 'data-row flex space-x-2';
        newRow.innerHTML = `
            <input type="text" class="label-input w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Label">
            <input type="number" class="value-input w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Value">
            <button class="remove-row px-2 py-2 text-red-500 hover:text-red-700 transition duration-300">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add event listener to remove button
        const removeBtn = newRow.querySelector('.remove-row');
        removeBtn.addEventListener('click', () => {
            newRow.remove();
        });
        
        dataRows.appendChild(newRow);
    }
    
    // Handle CSV file upload
    function handleCSVUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Update file info
        csvFilename.textContent = file.name;
        csvPreview.classList.remove('hidden');
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const contents = e.target.result;
            const data = parseCSV(contents);
            csvRows.textContent = data.length;
        };
        reader.readAsText(file);
    }
    
    // Parse CSV data
    function parseCSV(text) {
        const lines = text.split('\n');
        const data = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                const values = line.split(',');
                if (values.length >= 2) {
                    data.push({
                        label: values[0].trim(),
                        value: parseFloat(values[1].trim())
                    });
                }
            }
        }
        
        return data;
    }
    
    // Generate chart
    function generateChart() {
        // Get chart data
        let chartData;
        
        if (manualInputContainer.classList.contains('hidden')) {
            // CSV data
            if (!csvFile.files[0]) {
                alert('Please upload a CSV file');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const contents = e.target.result;
                chartData = parseCSV(contents);
                createChart(chartData);
            };
            reader.readAsText(csvFile.files[0]);
        } else {
            // Manual data
            chartData = [];
            const rows = dataRows.querySelectorAll('.data-row');
            
            for (const row of rows) {
                const label = row.querySelector('.label-input').value.trim();
                const value = parseFloat(row.querySelector('.value-input').value);
                
                if (label && !isNaN(value)) {
                    chartData.push({ label, value });
                }
            }
            
            if (chartData.length === 0) {
                alert('Please enter at least one valid data point');
                return;
            }
            
            createChart(chartData);
        }
    }
    
    // Create chart
    function createChart(data) {
        // Clear previous chart
        if (currentChart) {
            currentChart.destroy();
        }
        
        // Clear chart container
        chartContainer.innerHTML = '<canvas id="chart-canvas"></canvas>';
        const canvas = document.getElementById('chart-canvas');
        
        // Prepare data for Chart.js
        const labels = data.map(item => item.label);
        const values = data.map(item => item.value);
        const colors = getColors();
        
        // Chart configuration
        const type = chartType.value;
        const title = chartTitle.value || 'Chart';
        const showLegendValue = showLegend.checked;
        const showGridValue = showGrid.checked;
        const animationValue = enableAnimation.checked;
        const tooltipsValue = enableTooltips.checked;
        const fontSizeValue = parseInt(fontSize.value);
        
        // Create dataset based on chart type
        let dataset;
        if (type === 'pie' || type === 'doughnut' || type === 'polarArea') {
            dataset = {
                label: title,
                data: values,
                backgroundColor: colors,
                borderColor: 'white',
                borderWidth: 1
            };
        } else if (type === 'scatter') {
            // For scatter plot, we need x and y values
            const points = data.map((item, index) => ({
                x: index + 1,
                y: item.value
            }));
            
            dataset = {
                label: title,
                data: points,
                backgroundColor: colors[0],
                borderColor: colors[0],
                pointBackgroundColor: colors,
                pointBorderColor: 'white',
                pointRadius: 6,
                pointHoverRadius: 8
            };
        } else {
            dataset = {
                label: title,
                data: values,
                backgroundColor: type === 'line' ? 'rgba(75, 192, 192, 0.2)' : colors,
                borderColor: type === 'line' ? colors[0] : colors,
                borderWidth: 2,
                tension: 0.1
            };
        }
        
        // Chart options
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: showLegendValue,
                    position: 'top',
                    labels: {
                        font: {
                            size: fontSizeValue
                        }
                    }
                },
                tooltip: {
                    enabled: tooltipsValue
                },
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: fontSizeValue + 4
                    }
                }
            },
            animation: {
                duration: animationValue ? 1000 : 0
            },
            scales: {
                x: {
                    display: type !== 'pie' && type !== 'doughnut' && type !== 'polarArea',
                    grid: {
                        display: showGridValue
                    },
                    ticks: {
                        font: {
                            size: fontSizeValue
                        }
                    }
                },
                y: {
                    display: type !== 'pie' && type !== 'doughnut' && type !== 'polarArea',
                    grid: {
                        display: showGridValue
                    },
                    ticks: {
                        font: {
                            size: fontSizeValue
                        }
                    }
                }
            }
        };
        
        // Create chart
        currentChart = new Chart(canvas, {
            type: type,
            data: {
                labels: type === 'scatter' ? null : labels,
                datasets: [dataset]
            },
            options: options
        });
        
        // Enable buttons
        downloadChartBtn.disabled = false;
        saveChartBtn.disabled = false;
    }
    
    // Update chart based on customization options
    function updateChart() {
        if (!currentChart) return;
        
        // Get current data
        const data = currentChart.data.datasets[0].data;
        const labels = currentChart.data.labels;
        
        // Recreate chart with new options
        currentChart.destroy();
        
        // Prepare data
        const chartData = [];
        if (labels) {
            for (let i = 0; i < labels.length; i++) {
                chartData.push({
                    label: labels[i],
                    value: data[i]
                });
            }
        } else {
            // For scatter plot
            for (let i = 0; i < data.length; i++) {
                chartData.push({
                    label: `Point ${i+1}`,
                    value: data[i].y
                });
            }
        }
        
        createChart(chartData);
    }
    
    // Update chart type
    function updateChartType() {
        if (!currentChart) return;
        updateChart();
    }
    
    // Get colors based on selected scheme
    function getColors() {
        return colorSchemes[colorScheme.value] || colorSchemes.default;
    }
    
    // Download chart as image
    function downloadChart() {
        if (!currentChart) return;
        
        const canvas = document.getElementById('chart-canvas');
        const image = canvas.toDataURL('image/png');
        
        const link = document.createElement('a');
        link.href = image;
        link.download = `${chartTitle.value || 'chart'}.png`;
        link.click();
    }
    
    // Save chart to local storage
    function saveChart() {
        if (!currentChart) return;
        
        const canvas = document.getElementById('chart-canvas');
        const image = canvas.toDataURL('image/png');
        
        // Get chart data
        const chartData = {
            id: Date.now(),
            title: chartTitle.value || 'Untitled Chart',
            type: chartType.value,
            image: image,
            date: new Date().toLocaleString()
        };
        
        // Get existing saved charts
        let savedChartsData = JSON.parse(localStorage.getItem('savedCharts')) || [];
        
        // Add new chart
        savedChartsData.push(chartData);
        
        // Save to local storage
        localStorage.setItem('savedCharts', JSON.stringify(savedChartsData));
        
        // Update UI
        loadSavedCharts();
        
        // Show confirmation
        alert('Chart saved successfully!');
    }
    
    // Load saved charts from local storage
    function loadSavedCharts() {
        const savedChartsData = JSON.parse(localStorage.getItem('savedCharts')) || [];
        
        if (savedChartsData.length === 0) {
            savedCharts.innerHTML = `
                <div class="text-center text-gray-500 py-4 col-span-full">
                    <p>No charts saved yet</p>
                    <p class="text-sm">Your saved charts will appear here</p>
                </div>
            `;
            return;
        }
        
        // Clear container
        savedCharts.innerHTML = '';
        
        // Add saved charts
        savedChartsData.forEach(chart => {
            const chartElement = document.createElement('div');
            chartElement.className = 'bg-white rounded-lg shadow-md overflow-hidden';
            chartElement.innerHTML = `
                <div class="p-3 border-b border-gray-200">
                    <h4 class="font-medium text-gray-800">${chart.title}</h4>
                    <p class="text-xs text-gray-500">${chart.date}</p>
                </div>
                <div class="p-2">
                    <img src="${chart.image}" alt="${chart.title}" class="w-full h-32 object-contain">
                </div>
                <div class="p-3 bg-gray-50 flex justify-between">
                    <button class="load-chart text-sm text-blue-600 hover:text-blue-800" data-id="${chart.id}">
                        <i class="fas fa-edit mr-1"></i>Load
                    </button>
                    <button class="delete-chart text-sm text-red-600 hover:text-red-800" data-id="${chart.id}">
                        <i class="fas fa-trash mr-1"></i>Delete
                    </button>
                </div>
            `;
            
            // Add event listeners
            const loadBtn = chartElement.querySelector('.load-chart');
            loadBtn.addEventListener('click', () => loadChart(chart.id));
            
            const deleteBtn = chartElement.querySelector('.delete-chart');
            deleteBtn.addEventListener('click', () => deleteChart(chart.id));
            
            savedCharts.appendChild(chartElement);
        });
    }
    
    // Load a saved chart
    function loadChart(id) {
        const savedChartsData = JSON.parse(localStorage.getItem('savedCharts')) || [];
        const chart = savedChartsData.find(chart => chart.id === id);
        
        if (!chart) return;
        
        // Set chart options
        chartTitle.value = chart.title;
        chartType.value = chart.type;
        
        // TODO: Load actual data points (would require storing data in localStorage)
        alert('Chart loaded! Note: Only chart type and title are restored. Data points need to be re-entered.');
    }
    
    // Delete a saved chart
    function deleteChart(id) {
        if (!confirm('Are you sure you want to delete this chart?')) return;
        
        let savedChartsData = JSON.parse(localStorage.getItem('savedCharts')) || [];
        savedChartsData = savedChartsData.filter(chart => chart.id !== id);
        
        localStorage.setItem('savedCharts', JSON.stringify(savedChartsData));
        loadSavedCharts();
    }
    
    // Clear all saved charts
    function clearSavedCharts() {
        if (!confirm('Are you sure you want to clear all saved charts?')) return;
        
        localStorage.removeItem('savedCharts');
        loadSavedCharts();
    }
    
    // Initialize
    init();
});