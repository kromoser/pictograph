
// handle upload button
function upload_button(el, callback) {
  var uploader = document.getElementById(el);
  var reader = new FileReader();

  reader.onload = function(e) {
    var contents = e.target.result;
    callback(contents);
  };

  uploader.addEventListener("change", handleFiles, false);

  function handleFiles() {
    var file = this.files[0];
    reader.readAsText(file);
  };
};


function createList(csvFile) {

  const graphContainer = document.querySelector('#vis-container');
  //const csvFile = document.getElementById('file-select').files[0];


  // Take CSV, split into row objects, and push them into array
    var data = d3.csvParse(csvFile) 

    console.log(data);

    const columnOne = data.columns[0];
    const columnTwo = data.columns[1];


    // Get total counts from column two for use in percentages
    const reducer = (accumulator, currentValue) => accumulator + parseInt(currentValue[columnTwo])
    const totalCount = data.reduce(reducer,0);

    data.forEach(function(element) {
      const node = document.createElement('LI');
      // Get each value to be normalized to a distribution between 1 and 20
      const symbolTotal = Math.round(element[columnTwo]/totalCount * 20)
      const label = document.createTextNode(element[columnOne] + ': ');
      const totals = document.createTextNode('Totals:' + element[columnTwo] + '/' + totalCount + ')')

      node.appendChild(label);

      console.log(symbolTotal)

      for ( let i = 0; i < symbolTotal; i++ ) {
        drawPersonSVG(node)
        //const symbol = document.createTextNode('<3')
        //node.appendChild(symbol)
      };

      node.appendChild(totals)
      graphContainer.appendChild(node)
    });

    console.log(data.reduce(reducer,0));

}

function drawPersonSVG(target) {
    d3.select(target)
      .append('svg')
      .attr('width', 24)
      .attr('height', 24)
      .append('path')
      .attr('d', 'M5,1C5,3.7 6.56,6.16 9,7.32V22H11V15H13V22H15V7.31C17.44,6.16 19,3.7 19,1H17A5,5 0 0,1 12,6A5,5 0 0,1 7,1M12,1C10.89,1 10,1.89 10,3C10,4.11 10.89,5 12,5C13.11,5 14,4.11 14,3C14,1.89 13.11,1 12,1Z')
      .style('fill', 'purple')
}
