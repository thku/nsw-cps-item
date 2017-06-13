function createItemCard(item, html) {
  // make html argument optional
  if(!html) {
    var html = "";
  }

  // create HTML code
  html += '<div id="item-' + item.variable + '" class="ui card">\n';
  html += '\t<div class="content">\n';
  html += '\t\t<h2 class="header">' + item.name + '</h2>\n';
  html += '\t</div>\n\t<div class="content">\n';
  html += '\t\t<canvas width="200" height="150"></canvas>';
  html += '\t</div>\n';
  html += '\t<div class="extra content">\n';

  html += '\t\t<input name="' + item.variable + '" type="';
  // if input variable type
  if(item.type == "input") {
    html += 'range" min="' + item.attributes.min;
    html += '" max="' + item.attributes.max + '" value="';
    html += calcItem(item) + '" step="' + item.attributes.round;
  } else {
    html += 'hidden" value="' + calcItem(item) + '"';
  }

  html += '" />\n';

  html += '\t\t<div class="info">\n';
  html += '\t\t\t<span class="value">';
  html +=  calcItem(item);
  html += '</span>\n';
  html += '\t\t\t<span class="unit">' + item.attributes.unit + '</span>\n';
  html += '\t\t</div>\n\t</div>\n</div>\n';

  return html;
}

function calcItem(item) {
  if(item.type == "input") {
    // check if card already exists or return default
    if($('#wrapper input[name="' + item.variable + '"]').length) {
      return $('#wrapper input[name="' + item.variable + '"]').val();
    } else {
      return item.attributes.default;
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
    return eval(formula);
  }
}

$(document).ready(function () {
  // explanation
  $.each(config.explanation, function(index, explanation) {
    // create a modal

    modals = '<div class="ui no-' + index + ' modal">\n';
    modals += '<h2 class="header"></h2>';
    modals += '<div class="';

    if(explanation.image != null) {
      modals += 'image content">\n';
      modals += '<div class="ui medium image"></div>\n';
    } else {
      modals += 'content">\n';
    }

    modals += '<div class="description"></div>\n';
    modals += '</div>\n';
    modals += '<div class="actions">\n';
    modals += '<div class="ui positive button"></div>\n';
    modals += '</div>\n</div>';

    // add to HTML
    $('body').append(modals);

    // general modal settings
    $('.ui.modal').modal({
      closable: false,
      blurring: true
    });

    if(index == 0) {
      $('.ui.modal.no-' + index).modal('show');
    } else {
      $('.ui.modal.no-' + index).modal('attach events', '.ui.modal.no-' + --index + ' .button');
    }
  });

  // add text
  $('.ui.modal .header').html(config.explanation[0].header);
  $('.ui.modal .content .ui.image').html(config.explanation.image);
  $('.ui.modal .content .description').html(config.explanation.description);
  $('.ui.modal .actions .positive.button').prepend(config.explanation.approve);

  // prepare round
  var round = 0;

  // prepare graphs
  graphs = {};

  // initiate items
  $.each(config.items, function(index, item) {
      $('#wrapper.ui.cards').append(createItemCard(item));

      // create graph
      // get canvas
      canvas = $('#item-' + item.variable + ' canvas');

      // set graph
      graphs[item.variable] = new Chart(canvas.get(0).getContext("2d"), {
          type: 'line',
  				data: {	// data
  					labels: [round],
  					datasets: [{
  						fill: false,
  						lineTension: 0.1,
  						backgroundColor: "rgba(75,192,192,0.4)",
  						borderColor: "rgb(0, 0, 0)",
  						borderCapStyle: 'butt',
  						borderDash: [],
  						borderDashOffset: 0.0,
  						borderJoinStyle: 'miter',
  						pointRadius: 0,
  						data:[calcItem(item)]
  					}]
  				},
  				options: {	// options
  					legend: {display: false},
  					tooltips: {enabled: false},
  					scales: {
  						yAxes: [{
  							display: false
  						}],
  						xAxes: [{
  							display: false
  						}]
  					},
  					showLines: true
  				}
        }
      );
  });

  // add submit button value
  $('#cpsform .ui.button').val(config.properties.submit);

  // live input change
  $('.cards .card input[type="range"]').on("input", function () {
    $(this).parent('.extra.content').find('.info .value').html($(this).val());
  });

  // button submission
  $('#cpsform .ui.button').click(function () {
    // update round
    round++;

    if(round > config.properties.limits.rounds)
    {
      // skip testing
    }

    $.each(config.items, function(index, item) {
      result = calcItem(item);

      // set result
      $('#wrapper input[name="' + item.variable + '"]').val(result);

      // update display
      if(item.type == "output") {
        $('#wrapper #item-' + item.variable + " .value").html(result);
      } else {
        $('#wrapper input[name="' + item.variable + '"]').trigger('input');
      }

      // update graph
      graphs[item.variable].data.datasets[0].data.push(result);
      graphs[item.variable].data.labels.push(round);
      graphs[item.variable].update();
    })
  });
});
