"use strict";

function createList() {
  var graphContainer = document.querySelector('#vis-container'); // Take CSV, split into row objects, and push them into array

  d3.csv('/app/csv/test.csv').then(function (data) {
    console.log(data);
    var columnOne = data.columns[0];
    var columnTwo = data.columns[1];
    data.forEach(function (element) {
      var node = document.createElement('LI');
      var text = document.createTextNode(element[columnOne] + ': ' + element[columnTwo]);
      node.appendChild(text);
      graphContainer.appendChild(node);
    });
  });
}
//# sourceMappingURL=all.js.map
