


function createList() {

  const graphContainer = document.querySelector('#vis-container');

  // Take CSV, split into row objects, and push them into array
  d3.csv('/app/csv/test.csv').then(function(data) {

    console.log(data);

    const columnOne = data.columns[0];
    const columnTwo = data.columns[1];


    // Get total counts from column two for use in percentages
    const reducer = (accumulator, currentValue) => accumulator + parseInt(currentValue[columnTwo])
    const totalCount = data.reduce(reducer,0);

    data.forEach(function(element) {
      const node = document.createElement('LI');
      // Get each value to be normalized to a distribution between 1 and 10
      const text = document.createTextNode(element[columnOne] + ': ' + (parseInt(element[columnTwo])/totalCount * 10) + ' (Totals:' + element[columnTwo] + '/' + totalCount + ')');
      node.appendChild(text);
      graphContainer.appendChild(node)
    });

    console.log(data.reduce(reducer,0));
  });
}
