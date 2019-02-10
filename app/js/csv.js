


function createList() {

  const graphContainer = document.querySelector('#vis-container');

  // Take CSV, split into row objects, and push them into array
  d3.csv('/app/csv/test.csv').then(function(data) {

    console.log(data);

    const columnOne = data.columns[0];
    const columnTwo = data.columns[1];
    data.forEach(function(element) {
      const node = document.createElement('LI');
      const text = document.createTextNode(element[columnOne] + ': ' + element[columnTwo]);
      node.appendChild(text);
      graphContainer.appendChild(node)
    });
  });
}
