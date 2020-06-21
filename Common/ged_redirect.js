
    var url_vars = [];
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) 
    {
        url_vars[key] = value;
    });


    // if called with #, just redirect
    id = window.location.href.split("#")[1];
    if (id)
    {
        id = id.replace("name", "");
        surl = "https://ourfolkgen.com/ged_person.htm?id=" + id;
        console.log("PRESON URL: %s", surl);
        if (!url_vars.no_redirect)
            document.location.href = surl;
    }
    else
    {
        // load page for family
        url = window.location.href
        filename = url.substring(url.lastIndexOf('/')+1);
        // smith_11.htm is still family smith
        file2 = filename.replace(/_[0-9]+\.htm/, ".htm")
        family = file2.substr(0, file2.lastIndexOf("."));
     
        surl = "https://ourfolkgen.com/descendants.htm?family=" + family;
        console.log("DESCENDANTS URL: %s", surl);
        if (!url_vars.no_redirect)
            document.location.href = surl;
        
    }
    