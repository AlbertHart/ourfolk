
console.log("IN ged_read.js");


var lines_to_read;
var show_all;
 var ged_source;
 var ged_lines;
 var json_string;
 var json_code;
     
var show_bad;   // show lines which cannot br read
 
var image_path = "https://ourfolkgen.com/images";
var resource_path = "https://ourfolkgen.com/resources";

if (document.location.href.startsWith("file:"))
{
    image_path = "file:///Users/alhart/Dropbox/_VC_Production/ourfolkgen.com-html/images";
    // ADH - need to decide if we want to work on resources in Production or Development
    resource_path = "file:///Users/alhart/Dropbox/_VC_Development/ourfolkgen.com-html/ourfolk_additional/resources";
    do_throw = true;
}

 //read_ged_file();

 var ged_objects = {};
 // objects by level
 var objects = [];      // current object at each level
 var last_keys = [];    // last key used at each level
 var last_indices = []; // for array entries
var single_record;  // to process a single record

var images_used = {};

 var ged_line;

 

var source_ids = [];
var source_notes = {};

var gallery_image_count = 0;
var gallery_image_max = 8;

 //read_ged();

 function throw_stop(swho)
    {
        console.log(get_self(swho));
        if (do_throw)
        	throw("DO STOP");
    }




 function do_stringify()
 {
    json_string = JSON.stringify(ged_objects);
    //console.log("AFTER STRINGIFY json_string.length: %s", json_string.length);

 }

 var storage_key = "ged_json";
 function save_to_local_storage()
 {
     json_string = JSON.stringify(ged_objects);
    //console.log("AFTER STRINGIFY json_string.length: %s", json_string.length);
    localStorage.setItem(storage_key, json_string);
 }

 function get_json_from_local_storage()
 {
     json_string = localStorage.getItem(storage_key);
     console.log("json_string.length: %s", json_string.length);
     ged_objects = JSON.parse(json_string);
 }

 var js1;
 var jo1;
 function test()
 {
     js1 = JSON.stringify(ged_objects["@NI1@"]);
     //console.log("JS1: %s", js1);
     jo1 = JSON.parse(js1);
 }

 // from https://code.sololearn.com/Wde1it1cKxXk/#js
 // with some modification to process json properly
 function save_json_data(json_object, fileName) 
 {
 var a = document.createElement("a");
 document.body.appendChild(a);
 a.style = "display: none";

 // save as a string so we can reload it
 json_string = JSON.stringify(json_object);



 json_code = `
     var json_string;
     function get_json_string()
     {
     json_string = ` + 
     
     "`" + json_string + "`" + `;
     }
     `;

 console.log("json_string.length: %s", json_string.length);
 console.log("json_code.length: %s", json_code.length);

 // try this
 //str = JSON.stringify(obj);
 //bytes = new TextEncoder().encode(json_code);
 blob = new Blob([json_code], {
     type: "application/json;charset=utf-8"});


 //var blob = new Blob([json_code], {type: "text/plain;charset=utf-8"});
 var url = window.URL.createObjectURL(blob);
 a.href = url;
 a.download = fileName;
 a.click();
 window.URL.revokeObjectURL(url);

}


   
    var object2;
    function show_object(object, full, level)
    {
        var full = true;
        if (!level)
            level = 0;

        var sindent = "";
       
        sindent = "\n--------".substr(0, level*2 + 3);
        var sret = "";
        object2 = object;
        if (object == null)
        {
            sret += "(null)";
        }
        else if (typeof(object) == "undefined")
        {
            sret += "(undefined))";
        }
        else if (Array.isArray(object))
        {
            sret += sprintf("ARRAY");
            if (full)
            {
                for (var ii = 0; ii < object.length; ii++)
                {
                    sret += sindent + sprintf("[%s]: %s", ii, show_object(object[ii], full, level+1));
                }
            }
        }
        else if (typeof(object) == "object")
        {
            var keys = Object.keys(object);
            var key0 = keys[0];
            var value = object[key0];
            if (full)
            {
                sret += sprintf("OBJECT:");
                for (var ii = 0; ii < keys.length; ii++)
                {
                    sret += sindent + sprintf("%s: %s", keys[ii], show_object(object[keys[ii]], full, level+1));
                }
            }
            else
            {
                sret += sprintf("Object keys: %s: [%s]: %s", keys.length, key0, show_object(value, full, level+1));
            }
          
        }
        else if (typeof(object) == "string")
        {
            sret += sprintf("STRING: '%s'", object);
        }
        else
        {
            sret += sprintf("%s: '%s'", typeof(object), object);
        }
        return(sret);
    }

    function show_level_object(ilev)
    {
        //if (!objects[ilev])
        //   throw(sprintf("No objects[%s]", ilev));

        sret = sprintf("SHOW_LEVEL_OBJECT: objects[%s]: ", ilev);
        if (!objects[ilev])
        {
            sret += sprintf("No objects at level: %s", ilev);
        }
        else if (typeof(objects[ilev]) == "object")
        {
            key = Object.keys(objects[ilev])[0];
            value = objects[ilev][key];
            sret += sprintf("%s: %s", key, value);
        }
        else
        {
            sret += sprintf("%s: %s", typeof(objects[ilev]), objects[ilev]);
        }
        sret += sprintf(" last_key: %s last_index: %s", last_keys[ilev], last_indices[ilev]);
        //console.log("IN %s: %s", sret);
        return(sret);
    }

    function show_level_objects()
    {
        for (ii = 0; ii < objects.length; ii++)
        {
            if (objects[ii])
                console.log("%s last_key: %s", show_level_object(ii), last_keys[ii]);
        }
    }

    function clear_objects(ilev)
    {
        //console.log(get_self(ilev));
        
        if (objects)
            objects.length = ilev;

        if (last_keys)
            last_keys.length = ilev;
        if (last_indices)
            last_indices.length = ilev;
        
        if (last_codes)
            last_codes.length = ilev;


        
    }

    function what_is(sobject, object)
    {
        //console.log(get_self(sobject));
        sret = sobject + " IS: " + typeof(object);
        if (Array.isArray(object))
        {
            sret += " - ARRAY OF " + typeof(object[0]) + "s";
        }
        if (typeof(object) == "string")
            sret += sprintf(": '%s'", object);
        sret += "\n== " + show_object(object) + "\n\n";
        return(sret);
    }

    var new_container;
    var container_level;
    var container_code;
    var container;
    var cpntainer_object;
    var base_level;
    var base_code;
    var base_container;
    var base_object;
    function add_code_to_string(ilev, scode, sval)
    {
        if (show_all)
            console.log(get_self(ilev, scode, sval));
        do_stop = true; // stop the first time for each case

        clear_objects[ilev];

        container_level = ilev-1;
        container_code = last_codes[container_level];
        container = objects[container_level];
        container_object = container[container_code];

        


        base_level = ilev-2;
        base_code = last_codes[base_level];
        base_container = objects[base_level];
        base_object = base_container[base_code];

        if (show_all)
        {
            console.log("CURRENT CONTAINER: %s", show_object(container));
            console.log("CURRENT CONTAINER OBJECT: code: %s %s", container_code, show_object(container_object));

            console.log("BASE CONTAINER: %s", show_object(base_container));
            console.log("BASE OBJECT: code: %s %s", base_code, show_object(base_object));
        }

        
        //

        if (show_all)
            console.log("container_code: %s base_code: %s scode: %s", container_code, base_code, scode);
        if (container_code == scode)
        {
            // if container_code == scode - start an array - or add to array

            if (Array.isArray(container_object))
            {
                // find last element of array and call ourselves again
                last_element = container_object[container_object.length - 1];
                if (Array.isArray(last_element))
                {
                    if (do_throw) throw("cannot process nested arrays");
                }
                if (typeof(last_element) == "object")
                {
                    // add new object to array
                    if (show_all)
                        console.log("Add new object to array");
                    if (sval !=  "")
                        container_object.push({value: sval}); // start new object with a value
                    else
                        container_object.push({});  // new empty object
                }
                else (typeof(last_element) == "string")
                {
                    if (show_all)
                        console.log("Add new string to array");
                    container_object.push(sval);
                }
            }
            else if (typeof(container_object) == "object")
            {
                if (show_all)
                    console.log("Start new array of objects");
                container_object = [container_object];
                if (sval !=  "")
                    container_object.push({value: sval}); // start new object with a value
                else
                    container_object.push({});  // new empty object
            }
            else if (typeof(container_object) == "string")
            {
                if (show_all)
                    console.log("Start new array of objects");
                container_object = [container_object];
                container_object.push(sval);  // new empty object
            }
        }
        else
        {
            // different codes
            // add to base


            if (Array.isArray(base_container))
            {
                last_element = base_container[base_container.length - 1];
                if (Array.isArray(last_element))
                {
                    if (do_throw) throw("cannot process nested arrays");
                }
                else if (typeof(last_element) == "object")
                {
                    // add new object to array
                    if (show_all)
                        console.log("Add new code to array");
                    last_element[scode] = sval;
                    objects[ilev-1] = last_element;
                    last_codes[ilev-1] = scode;
                    do_stop = false;
                }
                else if (typeof(last_element) == "string")
                {
                    if (show_all)
                        console.log("convert array string to object");
                    last_element = {value: last_element};
                    last_element[scode] = val;
                    objects[ilev-1] = last_element;
                    last_codes[ilev-1] = scode;
                }
            }
            else if (typeof(base_object) == "object")
            {
                // add code to object
                if (show_all)
                    console.log("Add scode: %s to base_object -  sval: %s", scode, sval);
                base_object[scode] = sval;
                objects[ilev-1] = base_object;
                last_codes[ilev-1] = scode;
                objects[ilev] = base_object[scode];
                do_stop = false;
            }
            else if (typeof(base_object) == "string")
            {
                // turn string into an object
                if (show_all)
                    console.log("convert base_object string to object and add scode: %s. sval: %s", scode, sval);
                base_container[base_code] = {value: base_container[base_code]};
                base_container[base_code][scode] = sval; 
                base_object = base_container[base_code]; 
                objects[ilev-1] = base_object;
                last_codes[ilev-1] = scode;
                objects[ilev] = base_object[scode];
                do_stop = false;
            }
            else
            {
                if (do_throw) throw("bad base_container type: " + typeof(base_container));
            }
        }

        new_container = container;
        if (show_all)
        {
            console.log("NEW CONTAINER: %s", show_object(container));
            console.log("NEW BASE CONTAINER: %s", show_object(base_container));
        }
        if (do_stop)
            throw("STOP");

    }

var old_value;
var new_array;

var lines_read = 0;
var ged_line;
var ged_line_read;
var last_codes = [];



console.log("DEFINING read_ged_file");

function read_ged_file()
{
    if (!ged_source)
    {
        console.log("ged_source not set");
        return;
    }

    if (!lines_to_read)
        lines_to_read = 999999;

    var ipos;
    
    if (typeof(show_all) == "undefined")
        show_all = false;
    console.log("SHOW_ALL: %s", show_all);

    // ilev scode sval
    var scode = "";
    var sval = "";

    single_record_processed = false;
    in_skip = false;
    

    var last_ilev;
    var last_object;

    last_codes = [];

    
    // convert get data to array
    ged_lines = ged_source.split("\n");
    //console.log("ged_lines: %s", ged_lines.length);

    for (iline = 0; iline < ged_lines.length; iline++)
    {
        if (lines_read > lines_to_read)
        {
            throw("MAX LINES READ");
        }

        ged_line = ged_lines[iline];
        ged_line_read = ged_line;

        if (!in_skip && show_all) // || (iline % 10000) == 0)
        {
            //console.log("***LINE %s. %s",iline, ged_line);
        }

        if (ged_line.length < 4)
            continue;

        
            
        // ilev scode sval
        ilev = -1;
        scode = "";
        sval = "";
        ipos = ged_line.indexOf(" ");
        if (ipos != 1)
        {
            if (show_bad)
                console.log("BAD IPOS: %s. %s",iline, ged_line);
            continue;
        }
        if (ipos >= 0)
        {
            ilev = Number(ged_line.substr(0, ipos));
            ged_line = ged_line.substr(ipos+1);

            ipos2 = ged_line.indexOf(" ");
            if (ipos2 >= 0)
            {
                scode = ged_line.substr(0, ipos2);
                sval = ged_line.substr(ipos2 + 1);
            }
            else
            {
                scode = ged_line;
                sval = "";
            }
        }


        sval = sval.trim();
        sval = sval.replace(/"/g, "'");
        sval = sval.replace(/\\/g, "/");

        sval1 = sval;
        //sval = sval.replace(/\\u000b/, "");
        //console.log("ILEV: %s SCODE: '%s' SVAL: '%s'", ilev, scode, sval);
        // remove any non-standard ascii characters
        //sval = sval.replace(/\v/g, " ");
        //sval = sval.replace(/[^\x00-\x7F]/g, " ");
        //sval = sval.replace(/[\u{0080}-\u{FFFF}]/gu," ");
        
        
        sval = sval.trim();

        if (sval1 != sval)
        {
            if (show_all)
                console.log("SVAL CHANGED: ILEV: %s SCODE: '%s' SVAL: '%s'\n    OLD: '%s'", ilev, scode, sval, sval1);
        }
        //console.log("ILEV: %s SCODE: '%s' SVAL: '%s'", ilev, scode, sval);
        if (scode == "")
        {
            if (do_throw) throw("SCODE not found: " + ged_line);
        }

        // we cannot save the whole ged to local storage.
        // only read some,for a while
        if (iline > lines_to_read)
        {
            throw("ILINE BREAK at " + iline);
            break;  // for testing
        }

    

        /***
            0 HEAD
            1 SOUR AncestQuest
            2 NAME Ancestral Quest
            2 VERS 16.0.2
            2 CORP Incline Software, LC
            3 ADDR PO Box 95543
            4 CONT South Jordan, UT 84095
            4 CONT USA
            1 DEST Ancestral Quest
            1 DATE 3 DEC 2019
            2 TIME 12:31:57
            1 FILE ourfolk-2020.ged
            1 GEDC
            2 VERS 5.5.1
            2 FORM LINEAGE-LINKED
            1 CHAR UTF-8
            0 @I1@ INDI
            1 NAME Albert Douglass /Hart/
            2 NSFX Jr
            1 TITL Jr
            1 SEX M
            1 BIRT
            2 DATE 16 APR 1947
            2 PLAC Chicago, Ill
            1 _UID B531D95EE8952F4ABBC767BA3BA16CC4C24A
            1 FAMS @F1@
            1 FAMC @F2@
            1 OCCU Computer Programmer
            1 EVEN GMS9-B3X
            2 TYPE FamilySearch ID 
            1 NOTE graduated from Wabash College - BA Math 1968, Indiana University MA Mat
            2 CONC h 1971.
            2 CONT On the winning (3 man) team of the first two sessions of the "Indiana Col
            2 CONC lege Mathematics Competition" in 1966 and 1967.
            2 CONT 
            2 CONT #box  ICMC Winning Teams
        ***/

        if (in_skip && ilev > 0)
            continue;

        // here we have ilev, scode and value
        //console.log(" * ILEV: %s SCODE: %s SVAL: %s", ilev, scode, sval);

        if (!in_skip && show_all)
        {
            console.log("GED_OBJECTS: %s", show_object(ged_objects));

            for (var ii = 0; ii < objects.length; ii++)
            {
                console.log("OBJECTS[%s] %s", ii, show_object(objects[ii]));
            }
            for (var ii = 0; ii < last_codes.length; ii++)
            {
                console.log("LAST_CODES[%s] %s", ii, last_codes[ii]);
            }
        }

        if (!in_skip && show_all) // || (iline % 10000) == 0)
        {
            console.log("***LINE %s. %s",iline, ged_line_read);
        }

        if (ilev == 0)
        {
            //if (show_all)
            //   console.log("ILEV: %s SCODE: %s SVAL: %s", ilev, scode, sval);
            // main objects
            if (ilev = 0 && sval == "")
                sval = scode;   // for HEAD


            if (single_record && single_record !=  "")
            {
                
                if (single_record_processed)
                {
                    console.log("Break after single record");
                    throw("Break after single record");
                    break;
                }
                if (scode == single_record)
                {
                    // process this record
                    console.log("Start single record - end skip");
                    in_skip = false;
                    single_record_processed = true;
                }
                else
                {
                    //console.log("START SKIP");
                    in_skip = true;
                    continue;
                }

            }

            
            if (ged_objects[scode])
            {
                if (scode != "_EVENT_DEFN")
                    console.log("Duplicate level0 object: " + scode + " " + sval);
            }
            // start new level 0 object

            clear_objects(0);
            ged_objects[scode] = {code: scode, id: get_id(scode), type: sval}; // make into object
            if (show_all)
                       console.log("SET ged_objects[%s]: %s", scode, show_object(ged_objects[scode]));
            
            objects[0] = ged_objects[scode];
            if (scode.substr(0,2) == "@I")
                iptr = ged_objects[scode];

            last_codes = [];
            last_codes[ilev] = scode;  // if we need to convert string to object
            if (show_all)
                console.log("SET last_codes[ilev: %s]: %s", ilev, last_codes[ilev]);


            lines_read++;
            last_ilev = 0;
            if (show_all)
                       console.log("NEW OBJECT 0: %s", show_level_object(0));
            continue;

        }

        lines_read++;

        // 2 CORP Incline Software, LC
        // 3 ADDR PO Box 95543
        // 4 CONT South Jordan, UT 84095
        // 4 CONT USA
        // 1 DEST Ancestral Quest

        if (scode == "CONC" && sval.substr(0,1) == "#")
            scode = "CONT"; // sometimes thay added these a CONC

        if (scode == "CONC")
        {
            // add to last string.
            if (show_all)
            {
                console.log("ilev-1: %s objects[ilev-1: %s]: %s", ilev-1, ilev-1, show_object(objects[ilev-1]));
            }
            if (objects[ilev-1])
            {
                if (show_all)
                    console.log("typeof(objects[ilev-1: %s][last_codes[ilev-1: %s]]): %s", ilev-1, last_codes[ilev-1], typeof(objects[ilev-1][last_codes[ilev-1]]));
            
                if (typeof(objects[ilev-1][last_codes[ilev-1]]) == "string")
                {
                    objects[ilev-1][last_codes[ilev-1]] += sval;
                    objects[ilev] = objects[ilev-1][last_codes[ilev-1]];
                    //console.log("CONC to STRING: %s", objects[ilev])
                    continue;
                }
                if (Array.isArray(objects[ilev-1][last_codes[ilev-1]]))
                {
                    // append to top of array
                    array = objects[ilev-1][last_codes[ilev-1]];
                    array[array.length-1] += sval;
                    objects[ilev] = array[array.length-1];
                    //console.log("CONC in ARRAY: %s", objects[ilev])
                    continue;
                }
            }
            // Note has CONC a level higher
            if (show_all)
                console.log("ilev-2: %s objects[ilev-2: %s]: %s", ilev-2, ilev-2, show_object(objects[ilev-2]));
            if (typeof(objects[ilev-2][last_codes[ilev-2]]) == "string")
            {
                objects[ilev-2][last_codes[ilev-2]] += sval;
                objects[ilev-1] = objects[ilev-2][last_codes[ilev-2]];
                //console.log("CONC to previous level: %s", objects[ilev-1])
                continue;
            }

            // check for CONC in array object
            // LAST_CODES[0] OBJE
            // LAST_CODES[1] array.NOTE
            // ***LINE 8595. 3 CONC s Old Place has drawn the attention of visitors and restaurant connoisseu
            if (last_codes[ilev-2].substr(0,5) == "array")
            {
                array_code = last_codes[ilev-2].substr(6);
                array = objects[ilev-2];
                last_element = array[array.length-1];
                last_element[array_code] += sval;
                if (show_all)
                    console.log("ARRAY CONC: %s", last_element[array_code]);
                continue;

            }
            if (do_throw) throw("CONC not processed");
        }


        // start new object at ilev-1;
        if (show_all)
                console.log("ilev-1: %s %s", ilev-1, what_is("objects[ilev-1]", objects[ilev-1]));
  
        if (typeof(objects[ilev-1][scode]) != "undefined")
        {
            if (show_all)
                console.log("Additional entry with same scode");
            // we already have this code - make it an array
            // same code - make an array
            if (typeof(objects[ilev-1][scode]) == "string")
            { 
                // create new array of strings
                if (show_all)
                       console.log("create new array of strings: ilev: %s scode: %s sval: %s", ilev, scode, sval);

                // need to patch previous level to array
                old_value = objects[ilev-1][scode];
                
                objects[ilev-1][scode] = [old_value];// make into array
                objects[ilev] = objects[ilev-1][scode];  // is array now
                objects[ilev].push(sval); // push new value
                continue;
            }

            if (Array.isArray(objects[ilev-1][scode]) || typeof(objects[ilev-1][scode]) == "array")
            {
                if (show_all)
                       console.log("add to array: typeof; %s", typeof(objects[ilev-1][scode][0]));
                if (typeof(objects[ilev-1][scode][0]) == "string")
                {
                    if (show_all)
                        console.log("add to array as string: ilev: %s scode: %s sval: %s", ilev, scode, sval);
                    objects[ilev-1][scode].push(sval);
                    continue;
                }
                if (Array.isArray(objects[ilev-1][scode][0]))
                {
                    if (do_throw) throw("Array of Arrays");
                }
                if (typeof(objects[ilev-1][scode][0]) == "object")
                {
                    if (show_all)
                       console.log("PUSH to array as object: %s: value = %s", scode, sval);
                    objects[ilev-1][scode].push({value: sval});
                    continue;
                }
                // we dont handle arrays of arrays yet
                if (do_throw) throw("UNKNOWN ARRAY ELEMENT");
                
            }

            if (typeof(objects[ilev-1][scode]) == "object")
            {
                if (show_all)
                       console.log("create new array of objects: ilev: %s scode: %s sval: %s", ilev, scode, sval);
                if (show_all)
                       console.log("CURRENT objects[ilev-1: %s][scode: %s]: %s", ilev-1, scode, show_object(objects[ilev-1][scode]));

                objects[ilev-1][scode] = [objects[ilev-1][scode]]; // make into array
                if (show_all)
                       console.log("AFTER MAKE ARRAY objects[ilev-1: %s][scode: %s]: %s", ilev-1, scode, show_object(objects[ilev-1][scode]));
                clear_objects(ilev);
                objects[ilev] = objects[ilev-1][scode];
                objects[ilev].push({value: sval});
                if (show_all)
                       console.log("ILEV AFTER PUSH ilev: %s %s", ilev, scode, show_object(objects[ilev]));

                if (show_all)
                       console.log("ILEV-1 AFTER PUSH ilev-1: %s %s", ilev-1, scode, show_object(objects[ilev-1]));

                continue;
            }
        
            if (do_throw)  throw("BAD OBJECT TYPE");
        }

        // add as new scode
        if (show_all)
        {
            console.log("[SCODE]: %s is not defined yet.", scode);
        }
        
        if (show_all)
                console.log("ilev-1: %s %s", ilev-1, what_is("objects[ilev-1]", objects[ilev-1]));

        if (typeof(objects[ilev-1]) == "string")
        {
            // turn string into an object
            if (show_all)
                       console.log("### create new object from string ###: ilev: %s scode: %s sval: %s", ilev, scode, sval);

            if (show_all)
                       console.log("CALL add_code_to_string: objects[ilev-2: %s][last_codes[ilev-2: %s]]", ilev-2, last_codes[ilev-2]);

            add_code_to_string(ilev, scode, sval);


       

            continue;

        }
        if (Array.isArray(objects[ilev-1]))
        {
            // add to array element
            if (show_all)
                console.log("objects[ilev-1] IS AN ARRAY");

            // get last object
            last_element = objects[ilev-1][objects[ilev-1].length-1];
            if (show_all)
                console.log("LAST ELEMENT IN ARRAY: %s", what_is("last_element", last_element));
            
            if (Array.isArray(last_element))
            {
                if (do_throw) throw("We do not handle nested arrays yet");
            }
            if (typeof(last_element) == "string")
            {
                // make it an object
                
                last_element = {value: last_element};
                if (show_all)
                console.log("CREATE OBJECT");
                // fall throung to add new string
            }
            if (typeof(objects[ilev-1]) == "object")
            {
                // add to last_element
                last_element[scode] = sval;
                if (show_all)
                    console.log("AFTER ADD TO LAST_ELEMENT: %s", show_object(last_element));
                //console.log("NEW objects[ilev-1][objects[ilev-1].length-1]: %s", show_object(objects[ilev-1][objects[ilev-1].length-1]));
                last_codes[ilev-1] = "array." + scode;
                clear_objects(ilev);
                objects[ilev] = sval;   // just the string
                if (show_all)
                    console.log("SET last_codes[ilev-1: %s]: %s sval: %s", ilev-1, last_codes[ilev-1], sval);
                continue;
            }

        }
        if (typeof(objects[ilev-1]) == "object")
        {
            // see if the code is defined already
            if (show_all)
                       console.log("objects[ilev-1: %s][scode: %s]", ilev-1, scode, objects[ilev-1][scode]);
            if (show_all)
                       console.log("add to object: objects[ilev-1: %s][scode: %s] %s", ilev-1, scode, sval);
            objects[ilev-1][scode] = sval;   // start as string
            last_codes[ilev-1] = scode;
            if (show_all)
                       console.log("SET last_codes[ilev-1: %s]: %s sval: %s", ilev-1, last_codes[ilev-1], sval);
            if (show_all)
                       console.log("NEW objects[ilev-1: %s][scode: %s]: %s", ilev-1, scode, objects[ilev-1][scode]);
            clear_objects(ilev);
            objects[ilev] = sval; // just the string
    
            last_ilev = ilev;


            continue;
        }
    
        if (do_throw) throw("BAD OBJECT TYPE");


        
    }
}



    // get first image for anestors or descendants
    // this will get #image, but not #document
function get_first_image(image_person, swhere, relationship, use_note_images)
{
    console.log(get_self(iptr.code, iptr.full_name, swhere, use_note_images));

    // find first image in notes
    // #image or #obje


    //console.log("image_person.OBJE: %s", image_person.OBJE);

    // first check OBJE
    if (image_person.OBJE)
    {
        var obje_array = get_values_array(image_person.OBJE); // array of one or more values

        //console.log("OBJE length: %s", obje_array.length);

        for (var ii = 0; ii < obje_array.length; ii++)
        {
            
            obje = obje_array[ii];
            //console.log("ii: %s obje.FILE: %s", ii, obje.FILE);
            if (obje.FILE)
            {
                // FILE D:/Dropbox/_VP_Images/ourfolk/images/johnston/dorothy-johnston1930.jpg
                //image_file = obje.FILE;

                image_file = update_image_path(obje.FILE);

                //console.log("ii: %s image_file: %s", ii, image_file);

                image_caption = relationship;

                if (obje.TITL)
                {
                    image_caption = relationship + " - " + obje.TITL;
                }
                if (obje.NOTE)
                {
                    image_caption += " - " + get_notes(obje);
                    //console.log("IMAGE_NOTES: %s", image_caption);
                }

                //console.log("image_caption: %s", image_caption);
                if (make_single_image(image_file, image_caption, swhere, image_person))
                    return(true);
                //console.log("ii: %s SKIPPED", ii);

            }
        }
    }

        // get first image from NOTE
        if (!image_person.NOTE)
        return(false);

    notes = image_person.NOTE;
    if (!notes)
    {
        console.log("image_person.NOTE not found: %s", image_person.NOTE);
        return(false);
    }

    if (!notes.CONT)
        return(false);

    
    in_note_image= false;
    in_note_obje= false;
    image_file = "";
    image_caption = relationship;


    cont_array = get_values_array(notes.CONT); // array of one or more values
    for (var icont_line = 0; icont_line < cont_array.length; icont_line++)
    {

        note = cont_array[icont_line].trim();
        //console.log("icont_line: %s note: '%s'", icont_line, note);

        // [xxx] puts the name in bold
        note0 = note;


        // 1 CONT #image hart/rich-barb-doug.jpg Hart family children - Rich, Barb, Doug (Al).
        // 1 CONT (at 10738 S, Talman Avenue about 1954)
        // 1 CONT
        //console.log("in_note_image: %s note: %s): %s", in_note_image, note);
        note = note.replace("#imagelink", "#image");
        if (use_note_images && note.start_with("#image"))
        {   
            //console.log("NOTE IMAGE (skip) %s", note);
            style = "";
            ipos = note.indexOf(" ");
            if (ipos >= 0)
                image_file = note.substr(ipos).trim();



            image_caption = relationship;
            ipos = image_file.indexOf(" ");
            if (ipos >= 0)
            {
                image_caption = image_file.substr(ipos);
                image_file = image_file.substr(0, ipos);
            }
            // some of these were mispelled
            image_file = update_image_path(image_file);
            
            simg_html = sprintf("<img class=image_note src='%s' %s />", image_file, style)
            
            in_note_image = "Line: " + icont_line + " " + note;
            //console.log("START IMAGE: %s", image_file);
            
            continue;
        }


        if (in_note_image !=  "")
        {
            //console.log("in_note_image: %s: NOTE: '%s'", in_note_image, note);
            if (note == "" || note.start_with("#/image") || note.start_with("#/document"))
            {
                in_note_image= false; 

                make_single_image(image_file, image_caption, swhere, image_person);
                return(true);

            }
            else
            {
                image_caption += " - " + note;
                console.log("APPEND to image_caption: %s", image_caption);
                continue;
            }
        }


        // 0: "#obje D:/Dropbox/_VP_Images/ourfolk/images/hart/al-jr.jpg"
        // 1: "#obje_title Albert D. Hart, Jr<br>1947-"
        // 2: "#/obje"

        if (note.start_with("#obje "))
        { 
            console.log("#obje: %s", note);
            in_note_obje = "Line: " + icont_line + " " + note;
            image_file = note.substr(6);
            image_caption = relationship;
            
            continue;
        }

        if (in_note_obje !=  "")
        {
            if (note.start_with("#obje_title"))
            {
                image_caption += note.substr(10);
                console.log("APPEND to image_caption: %s", image_caption);
            }
            if (note.start_with("#obje_conc"))
            {
                image_caption += note.substr(9);
                console.log("APPEND to image_caption: %s", image_caption);
            }

            if (note.start_with("#/obje"))
            { 
                in_note_obje= false;
                if (make_single_image(image_file, image_caption, swhere, image_person))
                    return(true);

            }
            else
            {
                
                continue;
            }
        }

    }
    return(false);

}

function make_single_image(image_file, image_caption, swhere, image_person)
{
    console.log(get_self(image_file, image_caption, swhere, image_person.full_name));
    // FILE D:/Dropbox/_VP_Images/ourfolk/images/johnston/dorothy-johnston1930.jpg


    image_file = update_image_path(image_file);

    if (images_used[image_file])
    {
        //console.log("SKIP IMAGE: make_single_image: %s", image_file);
        return(false);
    }
    if (show_all)
        console.log("Set images_used: %s", image_file);

    images_used[image_file] = true;

        if (swhere == "gallery"  || swhere == "gallery_person" )
        {
            simage_html = "";



            simage_html += `<div class="col-3 image_box">\n`;

            simage_html += sprintf("<div class=image_header>%s</div>\n", image_person.full_name);
            //simage_html += "BR1<br clear=all>\n";
            

            simage_html += sprintf(`<a href="" onClick="show_overlay('%s', '%s'); return false;">
                <img class="overlay_image" src="%s" style="width: 100%%;"> 
            </a> \n`, image_file, image_caption, image_file);

            //simage_html += "BR2<br clear=all>\n";
            
            simage_html += sprintf(`<img class=left_icon src='%s/enlarge_icon.png' width=30 title="enlarge image" onclick="show_overlay('%s', '%s');" />\n`,
                    image_path, image_file, image_caption);
                    simage_html += sprintf(`<img class=left_icon src='%s/open_icon.jpg' width=30 title="open %s" onclick="load_person_page('%s');" />\n`,
                        image_path, image_person.full_name, image_person.id);  
            simage_html += sprintf("%s", image_caption);   
            simage_html += "</div>";  
    
            if (swhere == "gallery_person" && gallery_image_count >= gallery_image_max)
            {
                sgallery2 += simage_html;
                if (show_all)
                    console.log("Add to gallery 2");
            }
            else
            {
                sgallery += simage_html;
                if (show_all)
                    console.log("Add to gallery 1");
            }

            gallery_image_count++;
            return(true);
            
        }
        if (swhere == "column")
        {


                sgallery += sprintf(`

                <div class="col-12 ">           
                <hr>
                    <img src="%s" style="width: 100%%;"> 
                    <br>%s
                    </div>
                \n`, image_file, image_caption);
            return(true);
            
        }
        else if (swhere == "left")
        {  
            simg_html = sprintf("<img src='%s' style='float: left; width: 100%%; padding:2px; ' />", image_file);
            //console.log("ADD to sleft: %s", simg_html);
            sleft += simg_html;
            if (image_caption !=  "")
                sleft += sprintf(" - %s</br>\n", image_caption);
            return(true);;
        }
        else if (swhere == "div")
        {  
            simg_html = sprintf("<img src='%s' style='float: left; width: 100%%; padding:2px; ' />", image_file);
            //console.log("ADD to sdiv: %s", simg_html);
            sdiv += simg_html;
            if (image_caption !=  "")
                sdiv += sprintf(" - %s</br>\n", image_caption);
            return(true);;
        }
}


function get_images(iptr, swhere, relationship, imax)
{


    if (!iptr.OBJE)
        return(false);
    
        
    if (show_all)
        console.log(get_self(iptr.full_name, swhere, relationship, imax));
    var obje_array = get_values_array(iptr.OBJE); // array of one or more values

    iout = 0;

    for (var image_line = 0; image_line < obje_array.length; image_line++)
    {


        obje = obje_array[image_line];



        if (obje.FILE)
        {
    
            // FILE D:/Dropbox/_VP_Images/ourfolk/images/johnston/dorothy-johnston1930.jpg
            image_file = update_image_path(obje.FILE);
            if (obje.TITL)
                image_caption = relationship + " - " + obje.TITL;
            else
                image_caption = relationship;

            console.log("image_caption: %s", image_caption);
            
            if (obje.NOTE)
            {
                image_caption += get_notes(obje);
                //console.log("IMAGE_NOTES: %s", image_caption);
            }

            if (images_used[image_file])
            {
                //console.log("SKIP IMAGE: %s", image_file);
                continue;
            }

            //console.log("Set images_used: %s", obje.FILE);
            images_used[obje.FILE] = true;
            //console.log("Set images_used: %s", image_file);
            images_used[image_file] = true;


            simg_html = sprintf("<img class=image src='%s' />", image_file)
            simg_html += sprintf("<center>%s</center>", image_caption);


            
                

            if (swhere == "gallery" || swhere == "gallery_person")
            {
                
                //console.log("Add to gallery: %s", image_file);
                simage_html = sprintf(`

                    <div class="col-3 ">
                            
                    <a href="" onClick="show_overlay('%s', '%s'); return false;">
                        <img class="overlay_image" src="%s" style="width: 100%%;">
                    </a>
                        
                        <br>%s

                        </div>
                    \n`, image_file, obje.TITL, image_file, image_caption);

                if (swhere == "gallery_person" && gallery_image_count >= gallery_image_max)
                {
                    sgallery2 += simage_html;
                    //console.log("Add to gallery 2");
                }
                else
                {
                    sgallery += simage_html;
                    //console.log("Add to gallery 1");
                }

                gallery_image_count++;
                
            }
            else if (swhere == "left")
            {  
                simg_html = sprintf("<img src='%s' style='float: left; width: 25%%; padding:2px; ' />", image_file);
                //console.log("Add to left: %s", simg_html);
                sleft += simg_html;

            }
            iout++;
            if (iout >= imax)
                break;

        }
    }


    return(true);

}

function show_overlay(image, text) {

    console.log(get_self(image, text));

        var overlay_div1 = document.getElementById("overlay_div1"); // full div
        var overlay_div2 = document.getElementById("overlay_div2"); // image html

        overlay_div1.addEventListener('click', function(event) {
        //console.log("LISTENER OVERLAY: %s", overlay_div1.style.visibility);
        overlay_div1.style.visibility = "hidden";
        }, false);

    
        overlay_div1.style.visibility = "visible";
        
        overlay_div2.innerHTML = `<br>\n`;
        overlay_div2.innerHTML += sprintf(`<br><img src= '%s' class="img-responsive overlay_image" />`, image);
    overlay_div2.innerHTML += sprintf(`<br><img class=left_icon src='%s/shrink_icon.png' width=30 
                                style="vertical-align:top;" />\n`,
                image_path, image_file, image_caption);
    
        overlay_div2.innerHTML += "<b>" + text + "</b></br>";


    }
    function is_minor(iptr)
    {
        // dont show information for minors     
        if (!iptr.BIRT)
            return(false);         
        birth_year = get_numeric_year(iptr.BIRT.DATE)

        current_year = new Date().getFullYear();

        if (current_year < birth_year + 18)
            return(true);
        return(false);
    }

    function load_person_page(id)
    {

        surl = "ged_person.htm?id=" + id;
        console.log("SURL: %s", surl);
        window.location.href = surl;
        return(false);

    }


    var names_array;
    var ged_name;
    var peson_object;

function get_last_name(person_object)
{
    last_name = "";

    var names_array = get_values_array(person_object.NAME); // get one or more names as an array

    if (names_array.length <= 0)
        return(last_name);

    ged_name = get_ged_value(names_array[0]);
        
    ipos = ged_name.indexOf("/(");

    if (ipos >= 0)
    {   
        // wife with no known last name
        last_name = "";				
    }
    else
    {
        ipos = ged_name.indexOf('/');
        if (ipos >= 0)
        {
            // Last name is marked with /xxx/
            last_name = ged_name.substr(ipos+1);
            ipos = last_name.indexOf("/");
            if (ipos >= 0)
                last_name = last_name.substr(0, ipos);
            last_name.trim();	
            // Make sure little words are lower case
            if (last_name.start_with("De "))
                last_name = "de " + last_name.substr(3);
            if (last_name.start_with("Of "))
                last_name = "of " + last_name.substr(3);
            if (last_name.start_with("Von "))
                last_name = "von " + last_name.substr(4);
            
        }
        else
        {
            // No /xxx/ found - no last name
            last_name == "";	
        }
    }
    return(last_name);
}

function get_person(code)
{
    //console.log(get_self(code));
    // get records and make names
    person_object = ged_objects[code];
    if (!person_object)
    {
        console.log("person not found: %s", code);
        return(person_object);
    }


    person_object.treat_as_living = is_minor(person_object);
    //console.log("%s treat_as_living: %s", person_object.NAME, person_object.treat_as_living);
    if (false && person_object.treat_as_living)
    {
        person_object.full_name = "Living";
        person_object.salutation = "Living";
        person_object.given_name = "Living";		
        person_object.last_name = "Living";
        console.log("person not found: %s", code);
        return(person_object);	
    }
    
    person_object.last_name = get_last_name(person_object);
    
    // NAME:
    // NSFX: "Sr"
    // value: "Albert Douglass /Hart/"
    // scan off last name
    var names_array = get_values_array(person_object.NAME); // get one or more names as an array

    
    person_object.married_name = "";
    if (names_array.length > 0)
    {
        ged_name = get_ged_value(names_array[0]);
        person_object.prefix = names_array[0].PRFX;
        person_object.suffix = names_array[0].NSFX;
        person_object.nick_name = names_array[0].NICK;
        person_object.married_name = names_array[0]._MARNM; // override in Gedcom
    }

    
    ipos = ged_name.indexOf("/(");
    //if (person_object.code == "@I10082@")
    //    console.log("%s %s",person_object.code,ged_name);
    if (ipos >= 0)
    {            
        // wife with no known last name
        person_object.given_name = ged_name.substr(0, ipos);							
    }
    else
    {
        ipos = ged_name.indexOf('/');
        if (ipos >= 0)
        {
            // Last name is marked with /xxx/
            person_object.given_name = ged_name.substr(0, ipos);         
        }
        else
        {
            // No /xxx/ found - no last name
            
            person_object.given_name = ged_name;		

        }
    }

    person_object.given_name.trim();	
    ipos = person_object.given_name.indexOf(' ');
    if (ipos >= 0)
        salutation = person_object.given_name.substr(0, ipos);
    else
        salutation = person_object.given_name;
    
    if (person_object.prefix && person_object.prefix !=  "")
    {
        salutation = person_object.prefix + ' ' + salutation;
    }
    if (person_object.suffix && person_object.suffix !=  "")
    {
        salutation = salutation + ' ' + person_object.suffix;
    }
    person_object.salutation = salutation;

    full_name = "";
    if (person_object.prefix && person_object.prefix !=  "")
    {
        full_name = person_object.prefix + ' ';
    }
    full_name += person_object.given_name;
    if (person_object.nick_name && person_object.nick_name !=  "")
        full_name += "\"" + person_object.nick_name + "\" ";

    if (person_object.last_name && person_object.last_name !=  "")
        full_name += person_object.last_name;
    
    if (person_object.suffix && person_object.suffix !=  "")
        full_name += ", " + person_object.suffix;
    
    //console.log("GET_PERSON: %s %s", person_object.id, person_object.full_name);

    if (person_object.SEX == "F")
    {
        // 2 _MARNM Hart
        if (person_object.married_name)
        {
            if (person_object.married_name != last_name)
            {
                full_name = full_name + " (" + person_object.married_name + ")"; 
            }
        }
        else
        {
            var fams_array = get_values_array(person_object.FAMS); // array of one or more values

            if (fams_array.length > 0)
            {
                fams = fams_array[fams_array.length - 1];
                fptr = ged_objects[fams];
                spouse_code = get_spouse_code(person_object, fptr);
                if (spouse_code)
                {
                    var spouse_record = ged_objects[spouse_code];
                    spouse_last_name = get_last_name(spouse_record);
                    if (spouse_last_name != person_object.last_name)
                        full_name = full_name + " (" + spouse_last_name + ")";
                    //console.log("full_name: %s", full_name);
                }
            }
        }
    }

    person_object.full_name = full_name;

    return(person_object);
}



function do_spouse(fams, ifam)
{
    console.log(get_self(fams, ifam));
    fptr = ged_objects[fams];
    if (!fptr)
    {
        console.log("FAMILY NOT FOUND: %s", fams);
        return;
    }
    
    var spouse_record = get_spouse_record(iptr, fptr);
    if (!spouse_record)
        return(spouse_record);
    
    sleft += sprintf("<br>%s was married to ", iptr.salutation);
    sleft += output_fullname(spouse_record,"LINK_MARRIAGE","NO_ANCHOR","name","NO_SPACE", "NO_INDEX");



    if (fptr.MARR)
    {


        if (fptr.MARR.DATE)
            sleft += " on <b>" + fptr.MARR.DATE + "</b>";
        if (fptr.MARR.PLAC)
            sleft += " in <b>" + fptr.MARR.PLAC + "</b>";
    }
    sleft += ".<br>\n";



    sleft += show_dates(spouse_record);

    if (spouse_record.FAMC)
        sleft += get_parents(spouse_record, false);

    //if (ifam > 0)
        sleft += sprintf("<a href='#CH%s'><b>View Family Chart</b></a>", ifam);

    sleft += "<br>\n";

    return(spouse_record);


}







function show_dates(iptr)
{
    //console.log(get_self(iptr.full_name));
    /***
     * BIRT:
        DATE: "16 Apr 1947"
        PLAC: "Chicago, Ill"
    ***/
    sdates = "";

    sout = false;

    if (iptr.treat_as_living)
            return("");

    
    if (iptr.BIRT)
    {

        

        sdates += " " + iptr.salutation + " was born ";
        if (iptr.BIRT.DATE)
            sdates += " on <b>" + iptr.BIRT.DATE + "</b> ";
        if (iptr.BIRT.PLAC)
            sdates += " in <b>" + iptr.BIRT.PLAC + "</b> ";
        
        sdates += get_sources(iptr.BIRT);
        sout = true;
    }

    if (iptr.DEAT)
    {
        if (sout)
            sdates += " and died ";
        else
            sdates +=  " " + iptr.salutation + " died ";
        if (iptr.DEAT.DATE)
        {
            sdates += " on <b>" + iptr.DEAT.DATE + "</b> ";
            
            if (iptr.BIRT)
            {
                years = get_years_between_dates(iptr.BIRT, iptr.DEAT);
                if (years >= 0)
                    sdates += sprintf(" (age: %s)", years);
            }
        }
        if (iptr.DEAT.PLAC)
            sdates += " in <b>" + iptr.DEAT.PLAC + "</b> ";
        
        sdates += get_sources(iptr.DEAT);
        
        sout = true;

    }

    if (iptr.BURI)
    {
        if (sout)
            sdates += " and was buried ";
        else
            sdates +=  " " + iptr.salutation + "  was buried ";
        

        if (iptr.BURI.DATE)
            sdates += " on <b> " + iptr.BURI.DATE + "</b> ";
        if (iptr.BURI.PLAC)
            sdates += " in <b> " + iptr.BURI.PLAC + "</b> ";
        
        sdates += get_sources(iptr.BURI);
        
    }
    if (sout)
        sdates += ".<br>\n";
    return (sdates);
}

var dptr;
function get_short_full_dates(iptr)
{
    sdates = "";
    dptr = iptr;
    

    if (iptr.treat_as_living)
        return(sdates);

    bdate = null;
    ddate = null;
    if (iptr.BIRT && iptr.BIRT.DATE)
        bdate = iptr.BIRT.DATE;
    if (iptr.DEAT && iptr.DEAT.DATE)
        ddate = iptr.DEAT.DATE;


    if (bdate && ddate)
    {
        sdates = bdate + " - " + ddate;
        if (!iptr.DEAT.DATE && do_throw)
            throw("DEAD.DATE");
    }
    else if (bdate)
    {      
        sdates = "B: " + bdate;
    }
    else if (ddate)
    {
        sdates = "D: " + ddate;
    }
    //console.log(get_self(sdates));
    return(sdates);
}


function get_years_from_dates(iptr)
{
    //console.log(get_self(iptr.full_name));
    sdates = "";
    dptr = iptr;
    

    if (iptr.treat_as_living)
        return(sdates);

    bdate = null;
    ddate = null;
    if (iptr.BIRT && iptr.BIRT.DATE)
        bdate = get_numeric_year(iptr.BIRT.DATE);
    if (iptr.DEAT && iptr.DEAT.DATE)
        ddate = get_numeric_year(iptr.DEAT.DATE);   
    //console.log("bdate: %s ddate: %s", bdate, ddate);

    if (bdate && ddate)
    {
        sdates = " (" + bdate + " - " + ddate + ")";
        if (!iptr.DEAT.DATE && do_throw)
            throw("DEAD.DATE");
    }
    else if (bdate)
    {      
        sdates = " (B: " + bdate + ")";
    }
    else if (ddate)
    {
        sdates = " (D: " + ddate + ")";
    }

    //console.log("SDATES: %s", sdates);
    return(sdates);
}



var month_no = {    
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
    Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
    JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
    JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12
};

// passed GED date format
function get_numeric_year(date0)
{
    //console.log(get_self(date0));
    if (!date0)
        return(0);
    year = 0;
    var date = date0.trim();

    
        
    // 1 NOV 1982

    if (strncmp(date,"ABT",3) == 0)
    {
        year = date.Mid(3);
    }
    else if (strncmp(date,"BEF",3) == 0)
    {
        year = date.Mid(3);
    }
    else if (strncmp(date,"AFT",3) == 0)
    {
        year = date.Mid(3);
    }
    else
    {

        
        // try to parse  year from date
        var ipos = date.Find(" ");
        if (ipos >= 0)
        {
            date = date.Mid(ipos+1);
            date = date.trim();
            ipos = date.Find(" ");
            if (ipos >= 0)
            {
                    month = date.substr(0, ipos);
                    year = date.Mid(ipos+1);
            }
        }
    }

    if (year)
        nyear = Number(year);
    else
        nyear = Number(date);
    //console.log("YEAR: %s NYEAR: %s", year, nyear);
    return(nyear);
    
}



function get_years_between_dates(date1, date2)
{
    day1 = get_year_day(date1.DATE);
    if (day1 < 0)
        return(-1);
    day2 = get_year_day(date2.DATE);
    if (day2 < 0)
        return(-1);
    year1 = get_numeric_year(date1.DATE);
    year2 = get_numeric_year(date2.DATE);
    years = year2 - year1;
    if (day2 < day1)
        years--;
    //console.log("year1: %s day1: %s year2: %s day2: %s years: %s", year1, day1, year2, day2, years);
    return(years);
    
}

function get_year_day(date0)
{
    //console.log(get_self(date0));
    days = -1;
    if (!date0)
        return(days);
    var date = date0.trim();

    if (!date0)
        return(days);

    // 1 NOV 1982

    if (strncmp(date,"ABT",3) == 0)
    {
        days = -1;
    }
    else if (strncmp(date,"BEF",3) == 0)
    {
        days = -1;
    }
    else if (strncmp(date,"AFT",3) == 0)
    {
        days = -1;
    }
    else
    {
        

        var ipos1 = date.Find(" ");
        if (ipos1 >= 0)
        {
            day = date.substr(0, ipos1);
            //console.log("date: %s ipos1: %s day: %s", 
            //        date, ipos1, day);

            date2 = date.Mid(ipos1+1);
            date2 = date2.trim();
            ipos2 = date2.Find(" ");
            if (ipos2 >= 0)
            {
                month = date2.substr(0, ipos2);
                days = (month_no[month] - 1) * 30 + Number(day);
                //console.log("date2: %s ipos2: %s month: %s days: %s", 
                //    date2, ipos2, month, days);
            }
        }
    }
    //console.log("DAYS: %s", days);
    return(days);

}

function in_array(array, value)
{
    for (var ii = 0; ii < array.length; ii++)
    {
        if (array[ii] == value)
        {
        //if (value == "@I7341@")
            console.log("ALREADY IN ARRAY: %s", value);
        
            return(ii);
        }
    }

    
    
    if (value == "@I7341@")
        console.log("NOT IN ARRAY: %s", value);
    return(-1);
}


function add_to_array(array, value)
{
    if (in_array(array, value) < 0)
    {
        if (value == "@I7341@")
                console.log("PUSH: %s", value);
        array.push(value);
    }
}

function get_parents(iptr, show_grandparents, prefix)
{
    var sparents = "";
    if (iptr.FAMC)
    {    
        famc = iptr.FAMC;
        pptr = ged_objects[famc];

        
        if (!pptr)
        {
            console.log("PPTR not found: %s", iptr.FAMC);
            return("");
        }

        if (!iptr.DEAT)
            iswas = "is";
        else
            iswas = "was";

        if (pptr.HUSB || pptr.WIFE)
        {
            /* anounce that parents exist */
            if (prefix)
                sparents += "<b>" + prefix + "</b> ";
            else if (iptr.SEX == "F")
                sparents += sprintf(" %s %s the daughter of ", He_She(iptr), iswas);
            else
                sparents += sprintf(" %s %s the son of ",He_She(iptr), iswas);
        }


        fthout = false;
        mthout = false;
        if (pptr.HUSB)
        {
            fathers_record = get_person(pptr.HUSB);
            fathers_record.record_used = true;	// used as parent
            fthout = true;
        }
        if (pptr.WIFE)
        {
            mothers_record = get_person(pptr.WIFE);

            mothers_record.record_used = true;	//  used as parent
            mthout = true;
        }

        if (fthout && mthout)
        {
            /* output both father and mother */
            sparents += output_fullname(fathers_record,"LINK_MARRIAGE", "NO_ANCHOR","name","NO_SPACE", "NO_INDEX");
            sdates = get_short_full_dates(fathers_record);
            if (sdates !=  "")
                sparents += " <b>(" + sdates + ")</b>";
            sparents += sprintf(" and ");
            sparents += output_fullname(mothers_record,"LINK_MARRIAGE","NO_ANCHOR","name","NO_SPACE", "NO_INDEX");
            sdates = get_short_full_dates(mothers_record);
            if (sdates !=  "")
                sparents += " <b>(" + sdates + ")</b>";
        }
        else if (fthout)
        {
            /* father only */
            sparents += output_fullname(fathers_record,"LINK_MARRIAGE","NO_ANCHOR","name","NO_SPACE", "NO_INDEX");
            sdates = get_short_full_dates(fathers_record);
            if (sdates !=  "")
                sparents += " <b>(" + sdates + ")</b>";
        }
        else if (mthout)
        {
            /* mother only */
            sparents += output_fullname(mothers_record,"LINK_MARRIAGE","NO_ANCHOR","name","NO_SPACE", "NO_INDEX");
            sdates = get_short_full_dates(mothers_record);
            if (sdates !=  "")
                sparents += " <b>(" + sdates + ")</b>";
        }
        sparents += sprintf(".<br>\n");

        if (show_grandparents)
        {
            //sparents += "<br><b>Grand Parents</b><br>";
            //console.log("pptr.HUSB: %s pptr.WIFE: %s", pptr.HUSB, pptr.WIFE);
            if (pptr.HUSB)
            {
                sparents += get_parents(fathers_record, false, "Grand Parents:");
            }
            if (pptr.WIFE)
            {
                sparents += get_parents(mothers_record, false, "Grand Parents:");
            }
        }

        //console.log("famc: %s SPARENTS: %s", famc, sparents);
    }
    
    return (sparents);
}

var thumbnail_pct = 33;
var ntptr;
var notes;
var snotes;
var image_caption;
function do_notes(iptr)
{
    if (show_all)
        console.log(get_self(iptr.code, iptr.full_name));
    ntptr = iptr;

    console.log("DO NOTES: %s %s", ntptr.code, ntptr.NAME);

    snotes = "";


    note_entry = ntptr.NOTE;
    if (note_entry || ntptr.SOUR)
    {
        

        stitle = "Notes for " + ntptr.full_name;

        

        if (ntptr.NOTE)
            snotes2 = get_notes(ntptr, stitle);
        sources = get_sources(ntptr);

        if (snotes !=  "")
        {
            snotes =  "<table class=note_table border=1 align=center width='100%'\n";
            snotes += sprintf("<tr><th colspan=99>%s</th></tr>\n", stitle);
            snotes += "<tr><td>";
            snotes += snotes2;
            snotes += sources;
            snotes += "<br>";
            snotes += "</td></tr></table><br>";
        }
        else if (sources !=  "")
            snotes = sources;

    }

    return(snotes);
}

var expand_no = 1;
var nobj;
function get_notes(note_entry, stitle)
{
    if (show_all)
        console.log(get_self(note_entry.code, stitle));
    nobj = note_entry;

    in_note_box = "";
    in_note_quote = "";
    in_note_list = "";
    in_note_census = "";
    in_note_table = "";
    in_note_image = "";
    in_note_obje = "";

    snotes = "";
    //snotes += sprintf("<br>");
    simg_html = "";
    image_caption = "";

    if (note_entry.NOTE)
    {
        base_entry = note_entry.NOTE;
    }
    else if (note_entry.TEXT)
    {
        base_entry = note_entry.TEXT;
    }
    else
    {
        console.log("No note in note_entry: %s", note_entry.code);
        throw_stop("NO NOTES");
        return("");
    }


    cont_array = get_values_array(base_entry.CONT); // array of one or more values

    // -1 is for value not in array
    for (var icont_line = -2; icont_line < cont_array.length; icont_line++)
    {

        if (icont_line == -2)
        {
            if (typeof(base_entry) != "string")
                continue;
            
            note = base_entry;
            if (show_all)
                console.log("note_entry string: %s", note);
            
        }
        else if (icont_line == -1)
        {
            if (!base_entry.value)
                continue;
            note = base_entry.value;
            //console.log("note_entry.value: %s", note);
        }
        else
            note = cont_array[icont_line].trim();

        // [xxx] puts the name in bold
        note0 = note;
        ipos1 = note.indexOf("[");
        while (ipos1 >= 0)
        {
            if (ipos1 >= 0)
            {
                ipos2 = note.indexOf("]", ipos1 + 1);
                if (ipos2 < 0)
                {
                    console.log("NO IPOS2: %s", note);
                    break;
                }
                note = note.substr(0, ipos1) +
                    "<font class=\"name\">" + note.substr(ipos1+1, ipos2 - ipos1 - 1) + "</font>" +
                    note.substr(ipos2 +1);
                //console.log("ipos1: %s ipos2: %s\n    note0: %s\n    note: %s", ipos1, ipos2, note0, note);
                ipos1 = note.indexOf("[");
                continue;
            }
            throw_stop("BAD IPOS1: " + note);
        }

        // just find http: and https: directly
        note = note.replace(/#http/g, "");
        note = note.replace(/#html/g, "");
        ipos = note.indexOf("http");
        if (ipos >= 0)
        {
            note_left = note.substr(0, ipos);
            note_link = note.substr(ipos);
            note_right = "";

            ipos2 = note_link.indexOf(" ");
            if (ipos2 >= 0)
            {
                note_right = note_link.substr(ipos2);
                note_link = note_link.substr(0, ipos2);
            }
            note = sprintf("%s <a href='%s' target=_blank ><b>%s</b></a> %s", note_left, note_link, note_link, note_right);
        }

        // check for ends of groups

        // stop if blank line after #image
        //console.log("in_note_image: %s note: %s", in_note_image, note);

        // skip: 1 NOTE MARRIAGE: 1  REFN
        if (note.start_with("MARRIAGE: 1  REFN"))
        {
            //console.log("Skip Marriage note: %s", note);
            continue;
        }
        // 1 NOTE MARRIAGE: _UIDF7C046288D0ED5118AD39DD190EF31345528
        if (note.start_with("MARRIAGE: _UID"))
        {
            //console.log("Skip Marriage note: %s", note);
            continue;
        }
        // Ancestral File Number:
        if (note.start_with("Ancestral File Number:"))
        {
            //console.log("Skip Marriage note: %s", note);
            continue;
        }

        if (note.start_with("#/image"))
        {   
            if (in_note_image !=  "")
                end_note_image(simg_html, image_caption);
                in_note_image = "";
            continue;
        }
        if (in_note_image !=  "")
        {
            // end image info with a blank line
            if (note == "")
            { 
                //console.log("CALL end_note_image");
                end_note_image(simg_html, image_caption);
                in_note_image = "";
                continue;
            }
        }
        if (note.start_with("#/box"))
        {   
            if (in_note_box !=  "")
                end_note_box();
            //console.log("icont_line: %s %s", icont_line, note);
            in_note_box = "";
            continue;
        }
        if (note.start_with("#/quote"))
        {   
            if (in_note_quote !=  "")
                end_note_box();
            in_note_quote = "";
            continue;
        }
        if (note.start_with("#/list"))
        {   
            if (in_note_list !=  "")
                end_note_box();
            in_note_list = "";
            continue;
        }
        if (note.start_with("#/census"))
        {   
            if (in_note_census !=  "")
                end_note_box();
            in_note_census = "";
            //console.log("Clear in_note_census");
            continue;
        }
        if (note.start_with("#/table"))
        {   
            if (in_note_table !=  "")
                end_note_box();
            in_note_table = "";
            //console.log("Clear in_note_table");
            continue;
        }
        if (note.start_with("#/obje"))
        { 
            in_note_obje = "";

            // FILE D:/Dropbox/_VP_Images/ourfolk/images/johnston/dorothy-johnston1930.jpg
            image_file = uodate_image_path(obje_file);
            //console.log("#/obje image_file: %s", image_file);  

            sgallery += sprintf(`
            <div class="col-6 ">     

                <img src="%s" style="width: 100%%;">
                <br>%s
                </div>
            \n`, image_file, obje_title);
        }
        if (note.start_with("#/"))
        {
            if (do_throw) throw("Unknown END: " + note);
        }

        //console.log("in_note_image: %s note: %s", in_note_image, note);
        // #imagelink should just be #image
        note = note.replace("#imagelink", "#image");

        if (note.start_with("#document") || note.start_with("#image"))
        {
            console.log("DOCUMENT: %s", note);

            style = "";
            pct = "100";

            spct = note.substr(9,3);
            if (spct.substr(0,1) == "_")
            {
                pct = spct.substr(1,2);
            }
            else if (spct.substr(0,1) >= '0' && spct.substr(0,1) <= '9')
            {
                pct = spct.substr(0,2);
            }
            if (pct < thumbnail_pct)
                pct = thumbnail_pct;
            tpct = Math.floor(pct * thumbnail_pct / 100);
            if (tpct < thumbnail_pct)
                tpct = thumbnail_pct;
            spct = sprintf("%d%%", pct);
            stpct = sprintf("%d%%", tpct);
            sthumb_pct = sprintf("%d%%", pct);
            //console.log("note: %s pct: %s spct: %s stpct: %s", note, pct, spct, stpct);

            item = "";
            ipos1 = note.indexOf("'");
            if (ipos1 >= 0)
            {
                // some file names are in quotes (" or ' both work)
                ipos2 = note.indexOf("'", ipos1+1);
                if (ipos2 > 0)
                {
                    item = note.substr(ipos1+2, ipos2 - ipos1 - 2);
                    item = encodeURI(item); // replaces spaces
                    description = note.substr(ipos2 + 2);
                    description = description.trim();
                    console.log("ITEM: '%s' DESCRIPTION: %s", item, description);
                }
            }
            
            if (item == "")
            {
                ipos1 = note.indexOf(" ");
                ipos2 = note.indexOf(" ", ipos1+1);
                if (ipos2 >= 0)
                {
                    item = note.substr(ipos1+1, ipos2 - ipos1);
                    description = note.substr(ipos2 + 1);
                    console.log("ITEM: '%s' DESCRIPTION: %s", item, description);
                }
                else
                {
                    item = note.substr(ipos1+1);
                    description = "";
                    console.log("ITEM: '%s' DESCRIPTION: %s", item, description);
                }
            }

            //

            item_lower = item.toLowerCase();
            if (item_lower.indexOf(".htm") >= 0)
            {
                if (item_lower.substr(0,4) != "http" && item_lower.substr(0,2) != "..")
                    item = resource_path + "/" + item;
                snotes += sprintf("<ol><a href='%s'>%s</a></ol>\n", item, description);

                snotes += sprintf("<br><a href='%s'>%s</a><br>", item, item);
            }
            else if (item_lower.indexOf(".jpg") >= 0 || item_lower.indexOf(".png") >= 0)
            {
                if (item_lower.substr(0,4) != "http" && item_lower.substr(0,2) != "..")
                {
                    if (item_lower.indexOf("/") >= 0)
                        item = image_path + "/" + item;
                    else
                    item = resource_path + "/" + item;
                }

                snotes += "<br><table class=subtable border='0' cellpadding='2' align='center'  width=98%>\n";
                    
                if (description !=  "")
                {
                    snotes += sprintf("<tr><td align='center' width='100%%'><font class='heading'>%s</font></td></tr>\n", description);
                    
                }

                
            
                src = item;
                if (item_lower.substr(0,4) != "http" && item_lower.substr(0,2) != "..")
                {
                    if (item_lower.indexOf("/") >= 0)
                        src = image_path + "/" + item;
                    else
                        src = resource_path + "/" + item;
                }

                snotes += "<tr><td ><center>";
                snotes += sprintf("<img id=enlarge_%s class=left_icon src='%s/enlarge_icon.png' width=30 onclick='enlarge_image(%s);' />\n", expand_no, image_path, expand_no);

                simage = sprintf("<img id=image_%s  src='%s' style='max-width: %s; width: 100%%; object-fit: contain;' onclick='enlarge_image(%s);'/><br>\n", expand_no, item, stpct, expand_no);
                console.log("SIMAGE: \b%s", simage);
                snotes += simage;

                snotes += "</td></tr></table><br>\n";
                expand_no++;
        


            }
            
            continue;
        }

    
        
        if (note.start_with("xx #image"))
        {       

            
            style = "";
            pct = 100;
            ipos = note.indexOf(" ");
            if (ipos >= 0)
            {
                image_file = note.substr(ipos).trim();
                if (note.start_with("#image") && ipos > 6)
                {
                    pct = note.substr(6, ipos - 6);
                    style = sprintf("style='width: %s%%;'", pct);
                }

            }

            
            image_caption = "";
            ipos = image_file.indexOf(" ");
            if (ipos >= 0)
            {
                image_caption = image_file.substr(ipos);
                image_file = image_file.substr(0, ipos);
            }
            // some of these were mispelled
            //console.log("IMAGE FILE: %s", image_file);
            image_file = update_image_path(image_file);
        
            //console.log("image_file: %s", sweb, image_file);
            
            simg_html = sprintf("<img class=image_note src='%s' %s />", image_file, style);
            
            in_note_image = "Line: " + icont_line + " " + note;
            //console.log("START IMAGE: %s", image_file);s
            continue;
        }

        


        if (in_note_image != "")
        {
            image_caption += " " + note;
            //console.log("APPEND to image_caption: %s", image_caption);
            continue;
        }


        if (note.start_with("#box"))
        {   
            //console.log("NOTE: %s in_note_box: %s icont_line: %s %s", note, in_note_box, icont_line);
            if (in_note_box != "" || in_note_quote != "" || in_note_image != "" || in_note_list != "" ||
                in_note_obje != "" || in_note_census != "" || in_note_table)
                if (do_throw) throw(sprintf("# item not closed at line: %s at line: %s: %s", 
                    in_note_box + in_note_image + in_note_list + in_note_obje + in_note_census + in_note_table, + icont_line, note));
            stitle = note.substr(4);
            start_note_box("box", stitle);
            in_note_box = "Line: " + icont_line + " " + note;
            //console.log("NEW in_note_box: %s icont_line: %s", in_note_box, icont_line);
            continue;
        }

        if (note.start_with("#quote"))
        {   
            if (in_note_quote != "")
                if (do_throw) throw(sprintf("# item not closed at line: %s at line: %s: %s", 
                    in_note_quote, icont_line, note));
            stitle = note.skip_start();
            start_note_box("quote", stitle);
            in_note_quote = "Line: " + icont_line + " " + note;
            continue;
        }


        


        //  new line for each entry
        if (note.start_with("#list"))
        {     
            if (in_note_box != "" || in_note_image != "" || in_note_list != "" || in_note_obje != "" ||
                in_note_census != "" || in_note_table != "")
                if (do_throw) throw(sprintf("# item not closed at line: %s at line: %s: %s", 
                in_note_box + in_note_image + in_note_list + in_note_obje + in_note_census + in_note_table, + icont_line, icont_line, note));
            stitle = note.substr(5);
            start_note_box("list", stitle);
            in_note_list = "Line: " + icont_line + " " + note;
            continue;
        }

        if (in_note_list !=  "")
        {
            ipos = note.indexOf(":");
            if (ipos > 0)
            {
                s1 = note.substr(0, ipos);
                s2 = note.substr(ipos)
                snotes += sprintf("<b>%s</b>%s<br>", s1, s2);
            }
            else    
                    snotes += sprintf("%s<br>\n", note);
            continue;
        }


        if (note.start_with("#census"))
        {     
            if (in_note_box != "" || in_note_image != "" || in_note_list != "" || in_note_obje != "" ||
                in_note_census != "" || in_note_table != "")
                if (do_throw) throw(sprintf("# item not closed at line: %s at line: %s: %s", 
                    in_note_box + in_note_image + in_note_list + in_note_obje + in_note_census + in_note_table, + icont_line, icont_line, note));
            stitle = "Census: " + note.substr(7);
            start_note_box("census", stitle);
            in_note_census = "Line: " + icont_line + " " + note;
            //console.log("Set in_note_census: %s", note);
            continue;
        }

        if (note.start_with("#table"))
        {     
            if (in_note_box != "" || in_note_image != "" || in_note_list != "" || in_note_obje != "" ||
                in_note_census != "" || in_note_table != "")
                if (do_throw) throw(sprintf("# item not closed at line: %s at line: %s: %s", 
                    in_note_box + in_note_image + in_note_list + in_note_obje + in_note_census + in_note_table, + icont_line, icont_line, note));
            stitle = note.substr(7);
            start_note_box("table", stitle);
            in_note_table = "Line: " + icont_line + " " + note;
            //console.log("Set in_note_table: %s", note);
            continue;
        }


        if (note.substr(0,3) == "#ch")
        {
            // get number of columns for table
            // #ch Name;Relation;age;born in;father born in;mother born in;occupation;type of company
            header = note.substr(4);
            columns = header.split(";");
            snotes += "<tr>";
            for (jj = 0; jj < columns.length; jj++)
            {
                shead = columns[jj];
                if (shead == "occupation")
                    shead = "Occ.";
                if (shead == "Relation")
                    shead = "Rel";
                snotes += sprintf("<td><b>%s</b></td>", shead);
            }
            snotes += "</tr>\n";
            continue;


        }

        if (in_note_census != "")
        {
            note = note.replace(/:;/g, ";");
            note = note.replace(/:/g, ";");
            columns = note.split(";");
            snotes += "<tr>";
            for (jj = 0; jj < columns.length; jj++)
            {
                snotes += sprintf("<td>%s</td>", columns[jj]);
            }
            snotes += "</tr>\n";
            continue;
        }

        if (in_note_table != "")
        {
            note = note.replace(/:;/g, ";");
            note = note.replace(/:/g, ";");
            columns = note.split(";");
            snotes += "<tr>";
            for (jj = 0; jj < columns.length; jj++)
            {
                snotes += sprintf("<td>%s</td>", columns[jj]);
            }
            snotes += "</tr>\n";
            continue;
        }



        // 1 CONT #image hart/rich-barb-doug.jpg Hart family children - Rich, Barb, Doug (Al).
        // 1 CONT (at 10738 S, Talman Avenue about 1954)
        // 1 CONT

        if (note.start_with("#resource"))
        {

            ipos1 = note.indexOf(" ");
            ipos2 = note.indexOf(" ", ipos1+1);
            item = note.substr(ipos1+1, ipos2 - ipos1);
            description = note.substr(ipos2 + 1);
            console.log("NOTE: %s\nDOCUMENT item: %s description: %s", note, item, description);

            item_lower = item.toLowerCase();
            if (item_lower.indexOf(".htm") >= 0)
            {
                if (item_lower.substr(0,4) != "http" && item_lower.substr(0,2) != "..")
                    item = resource_path + "/" + item;
                
                snotes += "<br><table class=subtable border='0' cellpadding='2' align='center'  width=98%%>\n";
                    
                snotes += sprintf("<tr><td align='center' width='100%%'><font class='heading'>Resource Materials</font></td></tr>\n", description);

                // ADH - we need: load image on demand
                snotes += sprintf("<tr><td ><center><a href='%s' target=_blank>View: %s ", item, description);
                snotes += sprintf(" <img src='%s/link_icon.png' width=30 />", image_path);
                snotes += "</center><br></td></tr>\n";
                snotes += "</table><br>\n";
            }
            else if (item_lower.indexOf(".jpg") >= 0 || item_lower.indexOf(".png") >= 0)
            {
                if (item_lower.substr(0,4) != "http" && item_lower.substr(0,2) != "..")
                {
                    if (item_lower.indexOf("/") >= 0)
                        item = image_path + "/" + item;
                    else
                        item = resource_path + "/" + item;  // ADH - keep only this path
                }

                snotes += "<br><table class=subtable border='0' cellpadding='2' align='center'  width=98%%>\n";
                    
                if (description !=  "")
                {
                    snotes += sprintf("<tr><td align='center' width='100%%'><font class='heading'>%s</font></td></tr>\n", description);
                    
                }


                ipos = item.lastIndexOf(".");
                if (ipos >= 0)
                {
                    surl = item.substr(0, ipos) + ".htm";
                    //console.log("item: %s\nsurl: %s", item, surl);
                }

                
                snotes += "<tr><td><center>";
                snotes += sprintf("<a href='%s' target=_blank>", surl);
                snotes += sprintf("<img class=left_icon src='%s/enlarge_icon.png' width=30 ' />\n", image_path);
                
                snotes += sprintf("<img src='%s' style='max-width: %s%%;'></center>\n", item, thumbnail_pct);
                snotes += "</a></td></tr></table><br>\n";

            }
            
            continue;
        }

        

        

        // 0: "#obje D:/Dropbox/_VP_Images/ourfolk/images/hart/al-jr.jpg"
        // 1: "#obje_title Albert D. Hart, Jr<br>1947-"
        // 2: "#/obje"

        if (note.start_with("#obje "))
        {   
            if (in_note_box != "" || in_note_image != "" || in_note_list != "" || in_note_obje != "" || 
                in_note_census != "" || in_not_table != "")
                if (do_throw) throw(sprintf("# item not closed at line: %s at line: %s: %s", 
                    in_note_box + in_note_image + in_note_list + in_note_obje + in_note_census + in_note_table, + icont_line, icont_line, note));
            in_note_obje = "Line: " + icont_line + " " + note;
            obje_file = note.substr(6);
            obje_title = "";
        }
        if (in_note_obje != "")
        {
            if (note.start_with("#obje_title"))
            {
                obje_title += note.substr(10);
            }
            if (note.start_with("#obje_conc"))
            {
                obje_title += note.substr(9);
            }
        }

        if (in_note_box !=  "")
        {
                snotes += sprintf("%s\n", note);
            if (note.substr(note.length-1) == ".")
                    snotes += "<br><br>";
            continue;
        }
        

        if (note == "")
            snotes += "<br><br>";
        else 
            snotes += sprintf(" %s<br>", note);



    }
    if (in_note_box != "")
        end_note_box();

    if (in_note_image != "")
    { 
        end_note_image(simg_html, image_caption);
        in_note_image = "";
    }

    //console.log("SNOTES: %s", snotes);
    //console.log("icont_line: %s END of notes", icont_line);
    in_note_box = "";

    

    return(snotes);
}

function start_note_box(type, stitle)
{
    sclass = "note_" + type;

    sbackground = "";
    if (type == "census")
    {
        //simage = image_path + "/backgrounds/old-dark-brown-paper.jpg";
        simage = image_path + "/backgrounds/Brown-Background.jpg";
        sbackground = " style='background-image: url(\"" + simage + "\")'; ";
        //console.log("simage: %s\nsbackground: %s", simage, sbackground);
    }
    else if (type == "table")
    {
        //simage = image_path + "/backgrounds/old-dark-brown-paper.jpg";
        simage = image_path + "/backgrounds/parchment-small.jpg";
        sbackground = " style='background-image: url(\"" + simage + "\")'; color: #0000ff ";
        //console.log("simage: %s\nsbackground: %s", simage, sbackground);
    }

    //console.log(get_self(type, stitle));
    snotes += sprintf("<p> </p><table class='%s' border=1 align='center' %s>\n",
        sclass, sbackground);
    if (stitle !=  "")
        snotes += sprintf("<tr><th colspan=99>%s</th></tr>\n", stitle);
    snotes += "<tr><td>";
}
function end_note_box()
{
    //console.log(get_self());
    snotes += "</td></tr></table><p> </p>\n";

}



function enlarge_image(no)
{
    id = "image_" + no;
    elt = document.getElementById(id);
    id2 = "enlarge_" + no;
    elt2 = document.getElementById(id2);

    if (elt.style["max-width"] == "95%")
    {
        elt.style["max-width"] = sprintf("%s%%", thumbnail_pct);
        elt2.src = image_path + "/enlarge_icon.png";
    }
    else 
    {
        if (typeof(resources) != "undefined")
            elt.src = resources[no].src;    // from resources.htm
        elt.style["max-width"] = "95%";
        elt2.src = image_path + "/shrink_icon.png";
    }

}


var source_object;
function get_sources(source_record)
{
    //console.log(get_self(source_record.code));
    if (!source_record.SOUR)
        return("");
    
    sarray = get_values_array(source_record.SOUR); // array of one or more values

    if (sarray.length > 1)
        sources = " <b>Sources:</b> ";
    else
        sources = " <b>Source:</b> ";
    for (is = 0; is < sarray.length; is++)
    {
        source_object = sarray[is];
        skey = get_ged_value(source_object);
        ipos = in_array(source_ids, skey);
        if (ipos < 0)
        {
            ipos = source_ids.push(skey) - 1;
            //console.log("PUSH source_ids: %s %s", ipos, skey);
        }

        source_note = "";
        // PAGE, DATA, NOTE
        if (source_object.PAGE)
            source_note += sprintf("%s<br>\n", get_ged_value(source_object.PAGE));
        if (source_object.DATA)
        {
            source_note += source_object.DATA.TEXT + "<br>\n";
        }
        if (source_object.NOTE)
        {
            source_note +=   get_notes(source_object, "");
        }
        source_notes[skey] = source_note;

        //console.log("IS: %s SKEY: %s ipos: %s", is, skey, ipos);
        sources += sprintf(" <a href=#%s>(%s)</a> ", skey, ipos+1)

    }
    //sources += "<br>\n";
    sources += "\n";

    //console.log("SOURCES: %s", sources);
    return(sources);

    
}

function get_id(scode)
{
    sid = scode;

    ipos = sid.indexOf("@I");
    if (ipos >= 0)
        sid = sid.substr(ipos+2);
    ipos2 = sid.indexOf("@");
    if (ipos2 >= 0)
        sid = sid.substr(0, ipos2);
    //console.log("ipos: %s ipos2: %s sid: %s", ipos, ipos2, sid);
    return(sid);
}

function update_image_path(image_file)
{
    //image_file = image_file.replace(/.*web\//, image_path + "/");
    if (image_file.indexOf("/images") < 0)
    {
        image_file = image_path + "/" + image_file;
    }
    else 
    {
        image_file = image_file.replace(/.*\/images/, image_path + "");
    }
    
    image_file = image_file.replace("handyside", "handasyde");


    return(image_file);
}

page_url = "ged_person.htm";

function output_fullname(iptr, link_code,  anchor,  font_class, do_space, itype)
{
    
    /* was a name passed */
    if (iptr.full_name == "")
        return;	

    sout = "";
    


    
    
    // link to another page
    sout += sprintf(" <a href=\"%s?id=%s\">", page_url, iptr.id);

    sout += sprintf("<font class=\"%s\">%s</font>", font_class, iptr.full_name);

    sout += sprintf("</a> ");

    

    return(sout);

    
}



function end_note_image(simg_html, image_caption)
{
    //console.log(get_self(simg_html, image_caption));

    in_note_image = "";
    if (images_used[simg_html])
    {
        //console.log("SKIP IMAGE: %s", simg_html);
        return(false);
    }
    
    snotes += "<br clear=all>";
    snotes += "<center><div class=image_div >";
    //console.log("Add to notes: %s", simg_html);
    snotes += simg_html;
    if (image_caption !=  "")
    {
        snotes += "<br clear=all>";
        snotes += "<center>" + image_caption + "</center><br>";
    }
    snotes += "</div></center>"
    snotes += "<br clear=all>";



}

function get_spouse_code(iptr, fptr)
{
    spouse_code = "";
    if (iptr.SEX == "M")
        spouse_code = fptr.WIFE;
    else
        spouse_code = fptr.HUSB;
    return(spouse_code);
}

function get_spouse_record(iptr, fptr)
{
    var spouse_record = null;
    spouse_code  = get_spouse_code(iptr, fptr)
    if (spouse_code)
    {
        var spouse_record = get_person(spouse_code);
    }
    return(spouse_record);
}

function husband_wife(spouse_record)
{
    if (spouse_record.SEX == "F")
        return("Wife");
    else if (spouse_record.SEX == "M")
        return("Husband");
    else 
        return("Spouse");
}

function son_daughter(child_record)
{
    if (child_record.SEX == "F")
        return("Daughter");
    else if (child_record.SEX == "M")
        return("Son");
    else 
        return("Child");
}

function do_header(iptr)
{
    sheader = sprintf(`<table bgcolor=d0e0e0 align=center  width=100%%>
        <tr><td valign=top width=300>
        <img src="%s/our-folk.jpg" width="300" height="90"></img> </td>
        <td valign=top>

        <table width=100%% >
            <tr><td align=left><font class="title">Hart Family Genealogy</font></td></td></tr></table>`, image_path);
    

    
    sheader += `<br><a href="index.htm" class="toplinks"><i>Our Folk</i></a> Home Page
        - Index of <a href="ged_browse.htm" class="toplinks">Names and Surnames</a> - Additional <a href=resource_path + "/index.htm" class="toplinks">Resource Materials</a></td></tr>
        </table>`;

    return(sheader);

}

console.log("Extra line to slow it down the first time");
console.log("END ged_read.js");