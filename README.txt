README.txt for CKEditor Notion Paste HTML module
---------------------------------------------

CONTENTS OF THIS FILE
---------------------

 * Introduction
 * Requirements
 * Installation
 * Configuration


INTRODUCTION
------------

Notion Paste HTML module allows to paste content from Notion and maintain original structure and formatting.
After exporting the content from Notion in form of HTML, you can simply paste it to CKEditor.

When the module is enabled, It also adds the Notion toolbar button which makes it possible to paste exported HTML.


REQUIREMENTS
------------

* CKEditor
* Plupload integration


INSTALLATION
------------

 * Install as you would normally install a contributed Drupal module.
   See: https://www.drupal.org/node/895232 for further information.


CONFIGURATION
-------------

  * After installing, go to: Admin->Configuration->Content Authoring->CKEditor.

  * Edit any of the CKEditor profile for which you want to have the Notion feature enabled and go to Editor appearance.

  * Check the checkbox besides ```Plugin pastefromnotion: Format notion HTML.```

  * From the Available buttons, drag drop the Notion button to the Current toolbar.

  * Save the settings.

**Upload exported images from Notion HTML**

  * Go to Admin->Content->Notion Images Upload.

  * A form opens where you can upload the images which are downloaded as part of Notion HTML export.
