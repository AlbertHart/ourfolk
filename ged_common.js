
console.log("IN ged_common.js");


var image_path = "https://ourfolkgen.com/images";
var resource_path = "https://ourfolkgen.com/resources";
var do_throw = false;
var do_process_ged_file = true; // do do_process() in hart-ged.js unless this is set to false

function get_cache_string()
{
    var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();


    var sret = sprintf("?v=%04d%02d%02d",  year, month, day);
    return(sret);
}

function load_js_files()
{
    console.log(get_self());

    document.writeln("<x></x>\n");
    // they should reload once per day
    
    console.log("Calling load ged_read.js");
    load_js_file("ged_read.js");
    console.log("Calling load hart-ged.js");
    load_js_file("hart-ged.js");
}

// see if this avoids cache once per day
// .js script is loaded after page is loaded
// and then executes process_ged_file()
function load_js_file(js_file)
{
    console.log(get_self(js_file));
    

    var script = document.createElement("script");  
    script.type = "text/javascript";  
    script.src = js_file + get_cache_string();
    console.log("CACHE: %s", script.src);
    
    
    if (document.body)
    {   
        
        document.body.appendChild(script);  
    }
    else
    {
        throw("***** Cannot appendChild() *****");
    }
}