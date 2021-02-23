(function () {

  /**
   * @file Plugin for pasting content from notion retaining the formatting.
   */
  CKEDITOR.plugins.add('pastefromnotion', {
    init: function (editor) {
      /******* Dialog Starts *********/
      editor.addCommand('pasteFromNotionDialog', new CKEDITOR.dialogCommand('pasteFromNotionDialog'));
      editor.ui.addButton('PasteFromNotion', {
        label: 'Paste From Notion',
        command: 'pasteFromNotionDialog',
        icon: this.path + 'icons/notion.png'
      });
      editor.addContentsCss(this.path + 'styles/custom.css');
      CKEDITOR.dialog.add('pasteFromNotionDialog', this.path + 'dialogs/pastefromnotion.js');
      /******* Dialog Ends *********/

    }, // init ends.

  });
})();
