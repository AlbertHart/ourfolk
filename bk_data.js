
console.log("IN bk_data.js");

const CODE_NONE =  (-1);



const MAX_INDIVIDUAL = 20000;
const MAX_FAMILY = 10000;
const MAX_SPOUSE = 16;
const MAX_CHILD = 32;
const MAX_OBJS = 40	;
const MAX_FAMILY_LINKS = 100;



const GED_NONE = 0;
const GED_GENCIRCLES= 1;
const GED_WFT = 2;






const UNKNOWN = 0;
const MALE = 1;
const FEMALE = 2;


const CHILD_TYPE_UNKNOWN = 0;
const CHILD_WITH_CHILDREN = 1;
const CHILD_WITH_OTHER_FAMILY = 2;
const CHILD_WITH_NEW_FAMILY = 3;
const CHILD_WITH_OTHER_FAMILY_AND_MULTIPLE_SPOUSES = 4;
const CHILD_NO_CHILDREN = 5;


const NOTE_START = 0;	// start a new note
const NOTE_FLUSH = 1;	// flush any partial notes
const NOTE_SINGLE = 2; // place note and flush
const NOTE_CHECK = 3;	// make sure notes are flushed



var fam_data;
var table_data;

var ind_data


function clear_ind_data()
{
    var iptr = {};
	iptr.code = CODE_NONE;
	iptr.processed = false;
	iptr.record_used = false;
	iptr.added_to_gen_table = false;
	//iptr.CLEAR_VAR(family_spouse);
	iptr.family_child = CODE_NONE;
	iptr.object_count = -1;
	iptr.spouse_count = 0;
	iptr.image_link_count = 0;
	iptr.male_descendant = false;
	iptr.gender = UNKNOWN;
	iptr.child_type = CHILD_TYPE_UNKNOWN;
	iptr.husbands_code = CODE_NONE;
	iptr.ancestor_bitmap = 0;
	iptr.descendant_mask = 0;
	iptr.do_reference = false;
	iptr.new_family = false;
	iptr.treat_as_living = false;


	iptr.full_name = "";
	iptr.given_name = "";
	iptr.nick_name = "";
	iptr.also_known_as = "";
	iptr.salutation = "";
	iptr.last_name = "";
	iptr.prefix = "";
	iptr.suffix = "";
	iptr.birth.clear();
	iptr.baptism.clear();
	iptr.immigration.clear();
	iptr.death.clear();
	iptr.burial.clear();
	iptr.family_name = "";
	iptr.individual_html_file = "";
	iptr.reference_html_file = "";
	iptr.//husbands_family_name = "";
	iptr.//husbands_html_file = "";
	iptr.occ = ""; 

    return(iptr);

 }

	function He_She(iptr) 
	{
		if (iptr.SEX == "F")
			return("She");
		return("He");
	}
	function he_she(iptr) 
	{
		if (iptr.SEX == "F")
			return("she");
		return("he");
	}
	function his_her(iptr) 
	{
		if (iptr.SEX == "F")
			return("her");
		return("his");
    }


    function scan_at(sval)
    {
        // 2 SOUR @S561@
        ipos = sval.indexOf("@");
        if (ipos < 0)
            return(-1);
        sval2 = sval.substr(ipos + 2); // skip letter after @
        ipos2 = sval2.indexOf("@");
        if (ipos2 >= 0)
            sval2 = sval2.substr(0, ipos2);
        ival = Number(sval2);
        console.log("scan_at: %s --> %s", sval, ival);
        return(ival);
	}
	


	// get value, or if it has been made into an object, get the 'value' or the object
    function get_ged_value(ged_object)
    {

        if (typeof(ged_object) == "string")
		   return(ged_object);
		value = ged_object.value;
        if (typeof(value) == "string")
		   return(value);
		console.log("Could not get value: %s", ged_object)
        return(value);
	}
	
	function get_values_array(object)
    {
        // return an array of one or more values
        if (Array.isArray(object))
        {
            object_array = object;
        }
        else if (object)
        {
            object_array = [object];
        }
        else
        {
            object_array = [];  // none found
        }
        return(object_array);
	}

	
	
	




function clear_fam_data()
{
    var fptr = {};

	pptr.scode = CODE_NONE;
    pptr.code = CODE_NONE;
    pptr.husb_code = CODE_NONE;
    pptr.wife_code = CODE_NONE;
    pptr.child_code = -1;
    pptr.child_count = 0;
    pptr.added_to_gen_table = false;
    pptr.marriage_used = 0;


    return(fptr);
}




// Indexes are sorted in this order of importance
// index_entry_type

	const MAIN_INDEX = 0;
	const CHILD_INDEX = 1;
	const SPOUSE_INDEX = 2;
	const NOTES_INDEX = 3;	// not currently used
	const NO_INDEX = 4;


// en_index_sort_code

	// 0-26 represent a to z
	const SPECIAL_UNKNOWN = -1;
	const SPECIAL_NONE = 27;
	const SPECIAL_DE = 28;
	const SPECIAL_OF = 29;
	const SPECIAL_COUNT = 30;	// count of names to track

var letter_used = Array(30);


// class index_data
var index_count = 0;
var index_ref = 0;
function clear_index_data()
{

    var index_data = {};


	index_data.reference_code = CODE_NONE;
	index_data.rentry_type = NO_INDEX;
	index_data.rancestor_bitmap = 0;
	index_data.rsurname_count = 0;
	index_data.rsort_code = SPECIAL_UNKNOWN;

    return (index_data);
}




function clear_castle_data()
{
    var castle_data = {};
    castle_data.date = null;	// year of birth of owner of castle
	castle_data.code = CODE_NONE;	// code number of owner
	castle_data.name = "";	// castle name
	castle_data.file_name = "";	// image name
	castle_data.small_name = "";	// name of standard size file
	castle_data.note = "";	// other information

    return (castle_data);
}

function clear_mayflower_data()
{
    var mayflower_data = {};
	mayflower_data.date = null;	// year of birth of owner of castle
	mayflower_data.code = CODE_NONE;	// code number of owner
	mayflower_data.name = "";

	return(mayflower_data);
}

function clear_king_data()
{
    var king_data = {};
	king_data.date = null;	// year of birth of owner of castle
	king_data.code = CODE_NONE;	// code number of owner
	king_data.name = "";

	return(king_data);
}


var roman = [
    "","i.","ii.","iii.","iv.","v.",
	 "vi.","vii.","viii.","ix.","x.",
	 "xi.","xii.","xiii.","xiv","xv.",
	 "xvi.","xvii.","xviii.","ixx.","xx.",
	 "xxi.","xxii.","xxiii.","xxiv","xxv.",
	 "xxvi.","xxvii.","xxviii.","xixx.","xxx.",
	 "xxxi.","xxxii.","xxxiii.","xxxiv","xxxv.",
	 "xxxvi.","xxxvii.","xxxviii.","xxxix.","xc."];

var ordinal = [ 
	"","First","Second","Third","Fourth",
	 "Fifth","Sixth","Seventh","Eighth","Ninth",
	 "Tenth","Eleventh","Twelth","Thirteenth",
	 "Fourteenth","Fifteenth","Sixteenth","Seventeenth",
	 "Eighteenth","Nineteenth","Twentieth",
	"Twenty First",
	"Twenty Second",
	"Twenty Third",
	"Twenty Fourth",
	"Twenty Fifth",
	"Twenty Sixth",
	"Twenty Seventh",
	"Twenty Eighth",
	"Twenty Ninth",
	"Thirtieth",
	"Thirty First",
	"Thirty Second",
	"Thirty Third",
	"Thirty Fourth",
	"Thirty Fifth",
	"Thirty Sixth",
	"Thirty Seventh",
	"Thirty Eighth",
    "Thirty Ninth"];
    


/* name output codes */
// enum name_output

const NAMOUT_NONE = 0;	/* no name output - for first line */
const NAMOUT_FIRST = 1;
const NAMOUT_HE = 2;
const NAMOUT_AND = 3;

const FALSE = true;
const TRUE = false;




// enum anchor_codes

const DO_ANCHOR = 1;
const NO_ANCHOR = 0;



// enum table_mode_mode

const TABLE_NONE = "None";
const TABLE_BOX = "BOX";
const TABLE_TABLE = "TABLE";
const TABLE_CENSUS ="CENSUS";
const TABLE_LIST = "LIST";

function clear_table_data()
{
    var table_data = {};

    table_data.mode = TABLE_NONE;
    table_data.columns = 1;
    table_data.percentage = 80;
    table_data.last_name = "";
    table_data.head = "";
    table_data.tail = "";
    table_data.table_notes.clear();
    table_data.has_header = false;

    return(table_data);
}
	



// for notes
var last_line_blank;

var namout;	/* has message line name been output */

// information on family being processed
var current_family;
var current_html;

// these are kept track of per pass
var person_used = [];	/* tag which numbers have been output */
var child_used = [];	// tag for children used


var messknt;	/* lines output in last messout */

var ged_file_read;


//enum space_mode

	const DO_SPACE = 1;
	const NO_SPACE = 0;









var debug;


var famold;


var bkchild;



// table to mark ancestor classes
function clear_ancestor_class()
{

	var ancestor_class = {};

	ancestor_class.descendant_count = 0;
	ancestor_class.multiple_used = false;
    ancestor_class.descendant_cross_reference = null;
    
    return ancestor_class();

}



function clea_top_family(branch, fam, cd)
{
    top_family = {};

	top_family.branch_name = branch;
	top_family.family = fam;
	top_family.html_file = html_process(fam);	 // file name
	top_family.code = cd;

    return(top_family);

}


// enum direct_status

 const NOT_DIRECT = 0
 const IS_DIRECT = 1;
 const BRANCH = 2;	// direct ancester and new branch


function make_source_object(scode)
{
    var source_object = {code: scode};
	source_object.title = "";
	source_object.author = "";
	source_object.publ = "";
	source_object.text = "";
	source_object.publ_paren = "N";
	source_object.titl_italic = "N";
	source_object.note = "";

    return(source_object);
}









var top_families = [];	// room for families
var family_count;



function clear_cl_image_link()
{
    image_link = {};

	image_link.code = 0;	// individual code
	image_link.sub_code = 0;	// image number withing individual
	image_link.link = "";	// address to link
	image_link.full_image = "";	// address to image
	image_link.small_image = "";
	image_link.image_web_path = "";	// http path to image
	image_link.vignette_web_path = "";	// http path to small version
	image_link.vignette_disk_path = "";	// location to create vignette on local disk
	image_link.text = "";	// text to identify image
    
    return image_link;
}


var ind_elts;	// number of elementso
var fam_elts;
var base_path;	// contains htm, sources, images, etc.

// enum inon_format

	const INON_FULL = 0;
	const INON_SHORT = 1;






