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
  html += '\t\t<canvas height="150"></canvas>';
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
