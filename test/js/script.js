var add = function(a,b) {
  return a + b;
};

var subtract = function(a,b) {
  return a - b;
};

var multiply = function (a,b) {
  return a * b;
};

var divide = function (a,b) {
  var result = null;
  (b === 0) ? result = NaN : result = a / b;
  return result;
};