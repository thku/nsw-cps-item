$(document).ready(function () {
  // explanation
  $.each(config.explanation, function(index, explanation) {
    // create a modal
    modals = createModal(explanation.header, explanation.description, explanation.approve, ('no-' + index), explanation.image);

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
      $('.ui.modal.no-' + index).modal('attach events', '.ui.modal.no-' + (index - 1) + ' .button');
    }
  });

  // prepare time
  var initialstart = 0;
  var start = initialstart;

  // start time on last modal approve
  $('.ui.modal').last().modal({
    onApprove: function() {
      initialstart = Math.round(Date.now() / 1000);
      start = initialstart;

      // see if a timeout per round is required and implement it
      if(config.properties.limits.tpr !== null) {
        var roundTimeout = setTimeout(triggerClick, (config.properties.limits.tpr * 1000));
      }

      // see if general timeout
      if(config.properties.limits.time !== null) {
        var overallTimeout = setTimeout(triggerClick, (config.properties.limits.time * 1000))
      }
    }
  });

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

      // adjust size
      canvas.width("100%");

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
  $('#cpsform .ui.button').val(config.properties.approve);

  // live input change
  $('.cards .card input[type="range"]').on("input", function () {
    $(this).parent('.extra.content').find('.info .value').html($(this).val());
  });

  // button submission
  $('#cpsform .ui.button').click(function () {
    // get time
    overalltime = Math.round(Date.now() / 1000) - initialstart;

    // stop timeout if existant
    if(typeof roundTimeout != 'undefined') {
      clearTimeout(roundTimeout);
    }

    // update round
    round++;

    // interrupt if limits are reached
    if(((config.properties.limits.rounds !== null) && (round > config.properties.limits.rounds))
      || ((config.properties.limits.time !== null) && (overalltime >= config.properties.limits.time))) {
      // skip testing

      // create modal
      modals = createModal(config.final.header, config.final.description, config.final.approve, 'final', config.final.image);
      $('body').append(modals);
      $('.ui.modal.final').modal({
        closable: false,
        blurring: true,
        onShow: function() {
          // clear round timeout
          if(typeof roundTimeout != 'undefined') {
            clearTimeout(roundTimeout);
          }

          // clear overall timeout
          if(typeof overallTimeout != 'undefined') {
            clearTimeout(overallTimeout);
          }
        },
        onApprove: function() {
          location.reload();
        }
      }).modal('show');
    }

    // see if a timeout per round is required and implement it
    if(config.properties.limits.tpr !== null) {
      roundTimeout = setTimeout(triggerClick, (config.properties.limits.tpr * 1000));
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

      // update start time
      start = Math.round(Date.now() / 1000);

      // update graph
      graphs[item.variable].data.datasets[0].data.push(result);
      graphs[item.variable].data.labels.push(round);
      graphs[item.variable].update();
    })
  });
});
