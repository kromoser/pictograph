const fileInput = document.getElementById('file-select')
const rangeSlider = document.getElementById('max-symbol-count')

//Listen to change on file-select input and process the data in the file
fileInput.addEventListener('change', processCSV)
rangeSlider.addEventListener('input', processCSV)

//Get uploaded CSV and parse it so d3 can use it
function readFile(file, callbackFn) {
  const reader = new FileReader();
  reader.onload = callbackFn
  reader.readAsText(file)
}

// Process the uploaded CSV with d3
function processCSV() {
  const selectedColor = document.querySelector('#color-selector').value;
  const uploadedFile = fileInput.files[0]
  readFile(uploadedFile, function(e) {
    const graphContainer = document.querySelector('#vis-container');
    const comparisonContainer = document.querySelector('#unit-comparison');
    graphContainer.innerHTML = '';
    comparisonContainer.innerHTML = '';

    // Take CSV, split into row objects, and push them into array. This is the data
    var data = d3.csvParse(e.target.result)

    const columnOne = data.columns[0];
    const columnTwo = data.columns[1];

    // Get total counts from column two for use in percentages
    const reducer = (accumulator, currentValue) => accumulator + parseInt(currentValue[columnTwo])
    const totalCount = data.reduce(reducer,0);

    const symbolKey = document.querySelector('#symbol-value')

    // This is the number of units equal to one icon.
    const symbolValue = calcSymbolTotal(totalCount)


    data.forEach(function(element) {
      // This is for the actual values
      const node = document.createElement('li');
      const labelNode = document.createElement('div');
      const svgContainer = document.createElement('div');
      const totalsNode = document.createElement('span');

      const symbolTotal = Math.round(element[columnTwo] / symbolValue)
      const symbolRemainder = ( element[columnTwo] % symbolValue ) / symbolValue;

      //console.log(symbolRemainder)

      const label = document.createTextNode(element[columnOne] + ': ');
      const totals = document.createTextNode('Total: ' + element[columnTwo] + '/' + totalCount )


      node.classList.add('row')
      labelNode.classList.add('row--label');
      svgContainer.classList.add('svg--container')
      totalsNode.classList.add('row--totals');

      labelNode.appendChild(label);
      node.appendChild(labelNode);
      node.appendChild(svgContainer);

      for ( let i = 0; i < symbolTotal + 1; i++ ) {
        drawPersonSVG(svgContainer,selectedColor)
        //const symbol = document.createTextNode('<3')
        //node.appendChild(symbol)
      };

      totalsNode.appendChild(totals)
      svgContainer.appendChild(totalsNode)
      graphContainer.appendChild(node)

      // This is for the value comparison
      const comparisonNode = document.createElement('li');
      const comparisonSVGContainer = document.createElement('div');
      const comparisonUnitsSpan = document.createElement('span');
      const comparisonLabel = document.createTextNode('For every 1 unit');
      //const comparisonUnitsLabel = document.createTextNode(' unit');

      drawPersonSVG(comparisonSVGContainer,selectedColor);

      // Set the clip path on the last SVG path according to the remainder calculated above. This creates the partial person graphic.
        const lastSVG = node.querySelector('#vis-container svg:last-of-type');

        if ( symbolRemainder ) {

          const lastSVGPath = node.querySelector('#vis-container svg:last-of-type path');
          const fullSVGPath = lastSVG.cloneNode(true);
          fullSVGPath.style.opacity = '0.25';
          lastSVG.appendChild(fullSVGPath);
          lastSVGPath.style.clipPath = `inset(${100 - symbolRemainder * 100}% 0 0 0)`;
          //console.log(lastSVG)
        } else {
            lastSVG.style.display = 'none';
        }

      comparisonNode.appendChild(comparisonSVGContainer)
      comparisonContainer.appendChild(comparisonNode)

      comparisonNode.appendChild(comparisonLabel);
      //comparisonUnitsSpan.appendChild(comparisonUnitsLabel);
      comparisonNode.appendChild(comparisonUnitsSpan);




    });



    symbolKey.innerHTML = ""
    drawPersonSVG(symbolKey, document.querySelector('#color-selector').value)
    const symbolLabelEl = document.createElement('span')
    const symbolLabelText = document.createTextNode( symbolValue + ' units')
    symbolLabelEl.appendChild(symbolLabelText)
    symbolKey.appendChild(symbolLabelEl)

    customizeLabels();
  })
}




function drawPersonSVG(target,selectedColor) {
    d3.select(target)
      .append('svg')
      .attr('viewBox', '0 0 24 24')
      //.attr('height', 24)
      .append('path')
      .attr('d', 'M5,1C5,3.7 6.56,6.16 9,7.32V22H11V15H13V22H15V7.31C17.44,6.16 19,3.7 19,1H17A5,5 0 0,1 12,6A5,5 0 0,1 7,1M12,1C10.89,1 10,1.89 10,3C10,4.11 10.89,5 12,5C13.11,5 14,4.11 14,3C14,1.89 13.11,1 12,1Z')
      .style('fill', selectedColor)
}

function toggleTotals() {
  const totalsCheckbox = document.getElementById('totals-label')
  const totalsLabels = document.querySelectorAll('.row--totals')
    if ( totalsCheckbox.checked ) {
      totalsLabels.forEach(function(element) {
        element.style.display = 'initial';
      })
    } else {
      totalsLabels.forEach(function(element) {
        element.style.display = 'none';
      })
    }
}

function toggleRightColumn() {
  const columnCheckbox = document.getElementById('right-column-toggle')
  const rightColumn = document.querySelector('#unit-comparison')
    if ( columnCheckbox.checked ) {
      rightColumn.style.display = 'initial';

    } else {
      rightColumn.style.display = 'none';
    }
}

function customizeLabels() {
  const graphTitle = document.querySelector('h3')
  const labels = document.querySelectorAll('.row--label')
  const keyText = document.querySelector('#symbol-value span')
  graphTitle.style.display = 'initial'
  labels.forEach(function(element) {
    clickDetector(element)
  })
  clickDetector(keyText)
  clickDetector(graphTitle)

}

function clickDetector(element) {
  window.addEventListener('click', function(event){
    if (element.contains(event.target)){
      event.target.setAttribute('contenteditable', true)
      event.target.classList.add('editing')
    } else{
      element.setAttribute('contenteditable', false)
      element.classList.remove('editing')
    };
  })
}

function changeSVGColor() {
  const colorSelector = document.querySelector('#color-selector');
  const selectedColor = colorSelector.value
  const allPaths = document.querySelectorAll('path');
  allPaths.forEach(function(path) {
    path.style.fill = selectedColor;
  })
}



function calcSymbolTotal(sumTotal) {
  const sliderVal = document.querySelector('#max-symbol-count').value
  return Math.round(sumTotal / sliderVal)
}
