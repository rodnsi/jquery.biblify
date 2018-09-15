jquery.biblify
==============

A dead simple jQuery plugin which will automatically detect text Bible references and enclose them with custom HTML. 

A typical use case is a blog citing many Bible references. Creating links to read a passage on a third-party website can be onerous: this plugin will detect references and create the links for you. It'll even tidy up the links into a standard format!

Usage
-----
First, include `jquery.biblify.js` in your page. Make sure you have also included jQuery.

```html
    <script type="text/javascript" src="http://code.jquery.com/jquery-2.1.0.min.js"></script>
    <script type="text/javascript" src="jquery.biblify.js"></script>
```

Next, somewhere in the page or a script you will need to add some code to find the text you want to bible-ify. Here, we find all references in the page:

```javascript
$(document).ready(
  function () {
    $("body").biblify();
  });
```

It's best to restrict the target of the `biblify` operation to the smallest possible area. Here we only run `biblify` over the element with ID "main":

```javascript
  $("#main").biblify();
```

Options
-------

You can modify the behaviour of the `biblify` operation by passing different options to the function. Simply create an object and set the properties on it that you want to modify. In this example, Bible references are wrapped in a `<cite>` tag.

```javascript
  var options = {
    content: '<cite>{display}</cite>'
  };
  
  $("blockquote").biblify(options);
```

There are four tokens that can be used in the content tag. Each represents a different format of the Bible reference.

  1. `{url}` Will be replaced by the Bible reference following "URL" formatting options.
  2. `{tooltip}` will be replaced by more verbose tooltip formatting options.
  3. `{display}` will be replaced by a reformatted reference formatting options intended to be displayed to the end user.
  4. `{version}` Will be replaced by the wanted Bible version.
 
These would typically be used together to wrap Bible references in a hyperlink:  

```javascript
  var options = {
    content: '<a href="http://site?ref={url}&ver={version}" title="{tooltip}">{display}</a>'
  };
  
  $("#main p").biblify(options);
```

By default the plugin will create hyperlinks to [BibleGateway.com](http://www.biblegateway.com). A complete list of options can be found below. Note that these are the default values used if the options aren't supplied:

```javascript
  var options = {
    content: '<a class="bible" href="http://www.biblegateway.com/passage/?version={version}&search={url}" title="{tooltip}" target="_blank">{display}</a>',
    
      // Default bible version
      version: 'AKJV',

      // Default single verse URL format: "[BOOK][CHAPTER]:[VERSE]"
      // Default verse range URL format: "[BOOK][CHAPTER]:[VERSE]-[VERSE]"
      url: {
        chapter: '',
        verse: ':',
        range: '-'
      },
      
      // Default single verse display format: "[BOOK] [CHAPTER]v[VERSE]"
      // Default verse range display format: "[BOOK] [CHAPTER]v[VERSE]-[VERSE]"
      display: {
        chapter: ' ',
        verse: 'v',
        verseplural: 'v',
        range: '-'
      },
      
      // Default single verse tooltip format: "[BOOK] chapter [CHAPTER] verse [VERSE]"
      // Default verse range tooltip format: "[BOOK] chapter [CHAPTER] verses [VERSE] to [VERSE]"
      tooltip: {
        chapter: ' chapter ',
        verse: ' verse ',
        verseplural: ' verses ',
        range: ' to '
      }
    };
    
  $(".main").biblify(options);
```

Future
------
 * Rip out code so that it runs server-side in NodeJS. Create a [Ghost](http://ghost.org) plugin.
 * Optionally replace detected Bible book abbreviations with full names.
 * Ignore references to non-existent passages.
 * Handle complex references, e.g. "Genesis 1 v 3-4, 6 & 8"
 * Detect Bible version text and allow this to be plugged into the replacement HTML.
