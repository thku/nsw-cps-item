function calcItem(item) {
  if(item.type == "input") {
    // check if card already exists or return default
    if($('#wrapper input[name="' + item.variable + '"]').length) {
      result = $('#wrapper input[name="' + item.variable + '"]').val();
    } else {
      result = item.attributes.default;
    }
  } else {
    // get formula
    var formula = item.attributes.formula;

    // get current values of input and prepare values of output variables
    $.each(config.items, function(index, element) {
      variable = new RegExp(element.variable, 'g');

      if(element.type == "input") {
        formula = formula.replace(variable, calcItem(element));
      } else {
        // check if element already exists
        if($('#wrapper input[name="' + element.variable + '"]').length) {
          formula = formula.replace(variable, $('#wrapper input[name="' + element.variable + '"]').val());
        } else {
          formula = formula.replace(variable, element.attributes.default);
        }
      }
    });

    // prepare output variable
    result = eval(formula);
  }

  // check limits
  if((item.attributes.max !== null) && (result > item.attributes.max)) {
    result = item.attributes.max;
  } else if ((item.attributes.min !== null) && (result < item.attributes.min)) {
    result = item.attributes.min;
  }

  // return result
  return result;
}
