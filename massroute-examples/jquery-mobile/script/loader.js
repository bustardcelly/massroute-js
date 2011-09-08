(function( window, doc ){
    function load( scripts ){
        var i, length;
        length = scripts.length;
        for (var i=0; i < scripts.length; i++) {
            if( /css$/.test(scripts[i]) )
            {
                doc.write("<link rel=\"stylesheet\" href=\"" + scripts[i] + "\" type=\"text/css\"/>");
            }
            else doc.write("<script src=\"" + scripts[i] + "\"><\/script>");
        };
    };
  
    load([
        "script/jquery-1.6.1.min.js",
        "style/jquery.mobile-1.0b2.min.css",
        "script/jquery.mobile-1.0b2.min.js",
        "script/jquery.tmpl.js",
        "script/models.min.js",
        "script/jquery.massroute.min.js",
        "style/massroute.css",
        "script/massroute.min.js",
    ]);    
})( this, document );