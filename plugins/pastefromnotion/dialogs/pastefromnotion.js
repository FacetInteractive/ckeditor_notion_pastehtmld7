CKEDITOR.dialog.add('pasteFromNotionDialog', function (editor) {
  return {
    title: Drupal.t('Paste from Notion Dialog'),
    minWidth: 400,
    minHeight: 200,
    contents: [
      {
        id: 'pasteFromNotion',
        label: Drupal.t('Add HTML from Notion'),
        title: Drupal.t('Add HTML from Notion'),
        elements:
          [
            {
              id: 'notion_html',
              type: 'textarea',
              rows: 9,
              label: Drupal.t('Paste HTML here'),
              validate: CKEDITOR.dialog.validate.notEmpty("HTML field cannot be empty.")
            },
            {
              id: 'img_path',
              type: 'text',
              label: Drupal.t('Base path to the images'),
              default: '/sites/default/files/notion',
            },
            {
              id: 'h_tags',
              type: 'checkbox',
              label: Drupal.t('Downgrade <\h> tags i.e h1 to h2, so on and so forth.')
            },
            {
              id: 'replace_icons',
              type: 'checkbox',
              label: Drupal.t('Replace span with class icon to "Note".')
            },
            {
              id: 'nav_tags',
              type: 'checkbox',
              label: Drupal.t('Delete all nav tags.')
            },
            {
              id: 'fig_tag',
              type: 'checkbox',
              label: Drupal.t('Delete first figure tag from HTML i.e. Promotional tag.')
            },
            {
              id: 'notion_links',
              type: 'checkbox',
              label: Drupal.t('Delete notion hyperlinks.')
            }
          ]
      }
    ],
    onOk: function () {
      var editor = this.getParentEditor(),
        content = this.getValueOf('pasteFromNotion', 'notion_html'),
        selectedFilters = {
          'img_path': this.getValueOf('pasteFromNotion', 'img_path'),
          'h_tags': this.getValueOf('pasteFromNotion', 'h_tags'),
          'replace_icons': this.getValueOf('pasteFromNotion', 'replace_icons'),
          'nav_tags': this.getValueOf('pasteFromNotion', 'nav_tags'),
          'fig_tag': this.getValueOf('pasteFromNotion', 'fig_tag'),
          'notion_links': this.getValueOf('pasteFromNotion', 'notion_links'),
        };
      if (content.length > 0) {
        var el = document.createElement('html');
        el.innerHTML = content;
        var finalHTML = modifyHTML(el, selectedFilters),
          realElement = CKEDITOR.dom.element.createFromHtml('<div class="notion_html_embed"></div>');
        // Just paste the non-notion HTML without any formatting.
        finalHTML[0] ? realElement.setHtml(finalHTML[0].outerHTML) : realElement.setHtml(content);
        editor.insertElement(realElement);
      }
    }
  };
});

/*
Format the HTML as per the configurations selected by user.
 */
function modifyHTML(element, selectedFilters) {
  var articleHTML = element.getElementsByTagName('article');
  if (articleHTML[0]) {
    if (selectedFilters.img_path) {
      // Get all the image tags from the HTML.
      var img = articleHTML[0].getElementsByTagName('img'),
        // Regular expression to match absolute url.
        urlPattern = new RegExp('^(?:[a-z]+:)?//', 'i');

      for (const [key, item] of Object.entries(img)) {
        var imgSrc = item.getAttribute('src');
        // If the img src url is relative, proceed.
        if (!urlPattern.test(imgSrc)) {
          var n = imgSrc.lastIndexOf('/'),
            fileName = imgSrc.substring(n + 1);
          // Update the img source url to the path where images reside.
          img[key].setAttribute('src', selectedFilters.img_path + '/' + fileName);
        }
      }
    }

    // Get the HTML from end of </header> to end of </article>.
    var articleInnerHTML = articleHTML[0].innerHTML,
      startPos = articleInnerHTML.indexOf("</header>") + "</header>".length,
      inner = articleInnerHTML.substring(startPos).trim();
    // Replace tabs, newlines, extra spaces with single space in the content.
    inner = inner.replace(/\s\s+/g, ' ');
    // Replace the checkbox with HTML input.
    inner = inner.replace(/<div class="checkbox checkbox-off"><\/div>/g, '<input type="checkbox">');
    // Replace the icons with "Note" text.
    if (selectedFilters.replace_icons) {
      inner = inner.replace(/<span class="icon">(.+?)<\/span>/g, '<strong>NOTE:</strong> ');
      // @todo remove inline width 100%.
    }
    // Downgrade the h tags.
    if (selectedFilters.h_tags) {
      inner = inner.replace(/<h3/g, '<h4');
      inner = inner.replace(/<h2/g, '<h3');
      inner = inner.replace(/<h1/g, '<h2');
    }
    // Remove the empty p tags with new line and spaces.
    inner = inner.replace(/<p\b[^>]*>[\n\s]+<\/p>/ig, '');
    // Remove extra spaces between tags.
    inner = inner.replace(/\>\s+\</ig, '><');
    // Delete all the nav tags from HTML.
    inner = selectedFilters.nav_tags ?
      inner.replace(/(<nav\b[^<>]*>)((.|\n)*?)(<\/nav>)/ig, '') : inner;
    // Delete first figure tag from HTML (Promotional tag).
    inner = selectedFilters.fig_tag ?
      inner.replace(/(<figure\b[^<>]*>)((.|\n)*?)(<\/figure>)/, '') : inner;
    // Delete the notion links.
    inner = selectedFilters.notion_links ?
      inner.replace(/<figure(?=[^>]*class="link-to-page")(.+?)<\/figure>/ig, '') : inner;

    // Update the HTML with the modifications.
    articleHTML[0].innerHTML = inner;
  }
  return articleHTML;
}
