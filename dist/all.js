"use strict";

function createList() {
  var graphContainer = document.querySelector('#vis-container'); // Take CSV, split into row objects, and push them into array

  d3.csv('/app/csv/test.csv').then(function (data) {
    console.log(data);
    var columnOne = data.columns[0];
    var columnTwo = data.columns[1]; // Get total counts from column two for use in percentages

    var reducer = function reducer(accumulator, currentValue) {
      return accumulator + parseInt(currentValue[columnTwo]);
    };

    var totalCount = data.reduce(reducer, 0);
    data.forEach(function (element) {
      var node = document.createElement('LI'); // Get each value to be normalized to a distribution between 1 and 10

      var text = document.createTextNode(element[columnOne] + ': ' + parseInt(element[columnTwo]) / totalCount * 10 + ' (Totals:' + element[columnTwo] + '/' + totalCount + ')');
      node.appendChild(text);
      graphContainer.appendChild(node);
    });
    console.log(data.reduce(reducer, 0));
  });
}
//# sourceMappingURL=all.js.map
