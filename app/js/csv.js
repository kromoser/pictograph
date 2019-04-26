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
      const totalsNode = document.createElement('span');

      const symbolTotal = Math.round(element[columnTwo] / symbolValue)

      const label = document.createTextNode(element[columnOne] + ': ');
      const totals = document.createTextNode('(Totals:' + element[columnTwo] + '/' + totalCount + ')')


      node.classList.add('row')
      labelNode.classList.add('row--label');
      totalsNode.classList.add('row--totals');

      labelNode.appendChild(label);
      node.appendChild(labelNode);

      for ( let i = 0; i < symbolTotal; i++ ) {
        drawPersonSVG(node)
        //const symbol = document.createTextNode('<3')
        //node.appendChild(symbol)
      };

      totalsNode.appendChild(totals)
      node.appendChild(totalsNode)
      graphContainer.appendChild(node)

      // This is for the value comparison
      const comparisonNode = document.createElement('li');
      drawPersonSVG(comparisonNode);
      comparisonContainer.appendChild(comparisonNode)


    });



    symbolKey.innerHTML = ""
    drawPersonSVG(symbolKey)
    const symbolLabelEl = document.createElement('span')
    const symbolLabelText = document.createTextNode( symbolValue + ' units')
    symbolLabelEl.appendChild(symbolLabelText)
    symbolKey.appendChild(symbolLabelEl)

    customizeLabels();
  })
}




function drawPersonSVG(target) {
    d3.select(target)
      .append('svg')
      //.attr('width', 24)
      //.attr('height', 24)
      .append('path')
      .attr('d', 'M5,1C5,3.7 6.56,6.16 9,7.32V22H11V15H13V22H15V7.31C17.44,6.16 19,3.7 19,1H17A5,5 0 0,1 12,6A5,5 0 0,1 7,1M12,1C10.89,1 10,1.89 10,3C10,4.11 10.89,5 12,5C13.11,5 14,4.11 14,3C14,1.89 13.11,1 12,1Z')
      .style('fill', 'purple')
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

function calcSymbolTotal(sumTotal) {
  const sliderVal = document.querySelector('#max-symbol-count').value
  return Math.round(sumTotal / sliderVal)
}
