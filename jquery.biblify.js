(function($) {

    $.fn.biblify = function(options) {

		options = options || {};
		options.content = options.content || '<a class="bible" href="http://www.biblegateway.com/passage/?version=AKJV&search={url}" title="Read {tooltip} on BibleGateway.com" target="_blank">{display}</a>';
		
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
		
        var regex = /(<=^|[ ]*)((1[ ]*[cjkpst]|2[ ]*[cjkpst]|3[ ]*j|a[cm]|co|d[ae]|e[cpsxz]|g[ae]|h[aeo]|is|j[aeou]|l[aekuv]|m[ai]|n[aeu]|ob|p[hrs]|r[eou]|song[ ]*[o]?[f]?[ ]*|ti|z[ae])[a-z]{0,12})([ ]*)([0-9])+[,v\.\-: ]*([0-9]+)[,\- ]*([0-9]*)|([0-9])/ig;

        return this.each( function() {
            var content = $(this).html();

            var m = regex.exec(content);

            if (m != null) {
				$(this).html(content.replace(regex,
						function ($1, $2, $3, $4, $5, $6, $7, $8) {
							var spacer = $2;
							var book = $3;
							var chapter = $6;
							var versestart = $7;
							var verseend = $8;
							
							var urlref, textref, displayref = '';
							
							if (book && chapter) {
								urlref = book + options.url.chapter + chapter;
								displayref = book + options.display.chapter + chapter;
								textref = book + options.tooltip.chapter + chapter;
							}
							if (versestart && verseend) {
								urlref += options.url.verse + versestart + options.url.range + verseend;
								displayref += options.display.verseplural + versestart + options.display.range + verseend;
								textref += options.tooltip.verseplural + versestart + options.tooltip.range + verseend;
							}
							else if (versestart)
							{
								urlref += options.url.verse + versestart;
								displayref += options.display.verse + versestart
								textref += options.tooltip.verse + versestart;
							}
							
							urlref = encodeURI(urlref);
							
							var content = options.content.replace('{url}', urlref).replace('{tooltip}', textref).replace('{display}', displayref);
							
							return spacer + content;
						}
					));
            }
        });
    }

}(jQuery));
