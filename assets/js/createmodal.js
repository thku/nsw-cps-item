function createModal(header, description, approve, cssclass, image) {
  // last params are optional
  if((!cssclass) || (cssclass === null)) {
    cssclass = "";
  } else {
    cssclass += " ";
  }

  if(!image) {
    image = null;
  }

  modals = '<div class="ui ' + cssclass + 'modal">\n';
  modals += '<h2 class="header">' + header + '</h2>';
  modals += '<div class="';

  if(image !== null) {
    modals += 'image content">\n';
    modals += '<div class="ui medium image">\n';
    modals += '<img src="' + image + '" />\n</div>\n';
  } else {
    modals += 'content">\n';
  }

  modals += '<div class="description">' + description + '</div>\n';
  modals += '</div>\n';
  modals += '<div class="actions">\n';
  modals += '<div class="ui positive button">' + approve + '</div>\n';
  modals += '</div>\n</div>';

  return modals;
}
