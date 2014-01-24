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

Next, somewhere in the page or a script you will need to add some code to find the text you want to bible-ify. Here, we find all text in the page:

```javascript
  $("body").biblify();
```

It's best to restrict the target of the biblify operation to the smallest possible area. Here we only run biblify over the element with ID "main":

```javascript
  $("#main").biblify();
```

Future
------
 * Rip out code so that it runs server-side in NodeJS. Create a [Ghost](http://ghost.org) plugin.
