/* Embed media if it matches any of the following:
 * 1. Is a Youtube link
 * 2. Is a Vimeo link
 * 3. Is a general link
 * 4. Is a file with a jpg|jpeg|png|gif extension
 */

var serviceDefault = 'web';
var serviceImage = /(jpg)|(jpeg)|(png)|(gif)$/i;
var serviceVimeo = /vimeo/i;
var serviceYoutube = /(youtube)|(youtu\.be)/i;
var videoHeight = 281;
var videoWidth = 500;


exports.generate = function(content) {
  // parse the current url to determine where to process it.
  this.parseUrl = function(media) {
    var result = '';
    var url = media.split('/');
    var protocol = url[0].toLowerCase();

    // get rid of any html
    media = media.replace(/<(?:.|\n)*?>/gm, '');

    if(protocol === 'http:' || protocol === 'https:') {
      // this is a link, so let's do some more analysis
      try {
        if(media.match(serviceYoutube)) {
          var youtubeId = url[url.length - 1].split('v=')[1].split('&')[0];
          result = '<iframe width="' + videoWidth + '" height="' + videoHeight + '" ' +
                   'src="http://www.youtube.com/embed/' + youtubeId + '" frameborder="0" ' +
                   'allowfullscreen></iframe>';

        } else if(media.match(serviceVimeo)) {
          var vimeoId = url[url.length - 1];
          result = '<iframe src="http://player.vimeo.com/video/' + vimeoId + '" ' +
                   'width="' + videoWidth + '" height="' + videoHeight + '" frameborder="0" ' +
                   'webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';

        } else if(media.match(serviceImage)) {
          result = '<img src="' + media + '" width="100%">';

        } else {
          result = '<a href="' + media + '" target="_blank">' + media + '</a>'; 
        }
      } catch(e) {
        // Invalid link attempt, falling back to regular text
        result = media;
      }
    } else {
      result = media;
    }

    return result;
  }

  // break the string up by spaces
  var newContent = '';
  var contentArray = content.split(' ');
  
  for(var i=0; i < contentArray.length; i++) {
    newContent += ' ' + this.parseUrl(contentArray[i]);
  }

  return newContent;
};
