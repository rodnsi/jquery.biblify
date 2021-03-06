(function($) {

    $.fn.biblify = function(options) {

		options = options || {};
		options.content = options.content || '<a class="bible" href="http://www.biblegateway.com/passage/?version={version}&search={url}" title="Read {tooltip} on BibleGateway.com" target="_blank">{display}</a>';
		
		options.url = options.url || {};
		options.url.href = options.url.href || '';
		options.url.chapter = options.url.chapter || '';
		options.url.verse = options.url.verse || ':';
		options.url.range = options.url.range || '-';
		
		options.display = options.display || {};
		options.display.chapter = options.display.chapter || ' ';
		options.display.verse = options.display.verse || 'v';
		options.display.verseplural = options.display.verseplural || 'v';
		options.display.range = options.display.range || '-';
		
		options.tooltip = options.tooltip || {};
		options.tooltip.chapter = options.tooltip.chapter || ' chapter ';
		options.tooltip.verse = options.tooltip.verse || ' verse ';
		options.tooltip.verseplural = options.tooltip.verseplural || ' verses ';
		options.tooltip.range = options.tooltip.range || ' to ';
		
		options.version = options.version || 'AKJV';

		var regex = /(<=^|[ ]*)((1[ ]*[cjkprst]|2[ ]*[cjkprst]|3[ ]*j|a[bgcmp]|co|cantiques?[ ]+des[ ]+|d[ae]|e[cpsxz]|g[ae]|h[aeoé]|is|j[aeoué]|l[aekuvé]|m[ai]|n[aeoué]|o[b|s]|p[hirs]|r[eou]|sop|song[ ]*[o]?[f]?[ ]*|ti|z[ae])[a-zéèëï]{0,14})([ ]*)([0-9]+)([,v\.\-: ]+)([0-9]+)([,\- ]*)([0-9]*)|([0-9])/ig;
		
		function fixup(text) {
			var m = regex.exec(text);

			if (m !== null) {
				return text.replace(regex,
						function ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) {
							var spacer = ($2 === undefined) ? '': $2;
							var book = $3;
							var chapter = $6;
							var versestart = $8;
							var verseend = $10;
							var endspacer = '';
							
							if (book !== undefined && chapter !== undefined && versestart !== undefined)
							{
								var urlref, textref, displayref, version = '';
								
								urlref = book + options.url.chapter + chapter;
								displayref = book + options.display.chapter + chapter;
								textref = book + options.tooltip.chapter + chapter;
								version = options.version;
								if (versestart && verseend) {
									urlref += options.url.verse + versestart + options.url.range + verseend;
									displayref += options.display.verseplural + versestart + options.display.range + verseend;
									textref += options.tooltip.verseplural + versestart + options.tooltip.range + verseend;
								}
								else if (versestart)
								{
									urlref += options.url.verse + versestart;
									displayref += options.display.verse + versestart;
									textref += options.tooltip.verse + versestart;
									endspacer = $9;
								}
								
								urlref = encodeURI(urlref.toLowerCase().replace('é', 'e').replace('è', 'e').replace('ë', 'e').replace('ï', 'i'));
								
								var content = options.content.replace('{url}', urlref).replace('{tooltip}', textref).replace('{display}', displayref).replace('{version}', version) + endspacer;
								
								return spacer + content;
							}
							
							return $1;
						}
					);
			}
			
			return false;
			
		}
		
		function removeNode(node) {
			if (node.remove) {
				node.remove();
			}
			else if (node.removeNode) {
				node.removeNode();
			}
		}
		
		function getTextNodesIn(node, includeWhitespaceNodes) {
			var textNodes = [], nonWhitespaceMatcher = /\S/;

			function getTextNodes(node) {
				
				// If the node is a link, skip it. We don't wan to start creating links
				// within links. TODO: should be able to pass an array of tags to ignore.
				if (node.tagName === 'A' || node.tagName === 'a') {
					return;
				}
					
				if (node.nodeType === 3) {
					if (node.length > 0 && nonWhitespaceMatcher.test(node.nodeValue)) {
						
						var html = fixup(node.nodeValue);
						if (html !== undefined && html)
						{
							// If it's a text node with a Bible reference, return the node and the markup
							// we intend to replace it with. This will later be appended with data about
							// how to insert the HTML (complicated, because we're in a text node, not a
							// DOM element).
							return { node: node, markup: html };
						}
					}
				} else {
					
					var replacements = [];
					for (var i = 0, len = node.childNodes.length; i < len; ++i) {
						
						var replacement = getTextNodes(node.childNodes[i]);
						if (replacement) {
							
							// If we were returned a replacement operation, we need to figure out
							// how to switch out the text node for HTML.
							if (node.childNodes.length === 1)
							{
								// We're swapping the whole element content (easy!)
								replacement.type = 'all';
								replacement.editNode = node;
								replacements.push(replacement);
							}
							else if (i > 0)
							{
								// There's a previous sibling element, so we can use it with
								// an insert-after operation, then clear the original text node.
								replacement.type = 'after';
								replacement.editNode = node.childNodes[i-1];
								replacements.push(replacement);
							}
							else if (i < node.childNodes.length - 1)
							{
								// There's a subsequent sibling element which we can use with an
								// insert-before operation and clearing the original node.
								replacement.type = 'before';
								replacement.editNode = node.childNodes[i+1];
								replacements.push(replacement);
							}
							
						}
					}
					
					// Loop through the cached operations. These couldn't have been done 
					// inline because we'd be changing the DOM elements that we were recursing
					// through. Switch on the appropriate operation, and update markup.
					if (replacements.length > 0) {
						for (var j = 0; j<replacements.length; j++) {
							switch (replacements[j].type)
							{
								case 'all':
									replacements[j].editNode.insertAdjacentHTML('afterbegin', replacements[j].markup);
									removeNode(replacements[j].node);
									break;
								case 'after':
									replacements[j].editNode.insertAdjacentHTML('afterend', replacements[j].markup);
									removeNode(replacements[j].node);
									break;
								case 'before':
									replacements[j].editNode.insertAdjacentHTML('beforebegin', replacements[j].markup);
									removeNode(replacements[j].node);
									break;
							}
						}
					}
				}
			}

			getTextNodes(node);
		}
		
		return this.each( function() {
				getTextNodesIn(this);
			});
	};

}(jQuery));
