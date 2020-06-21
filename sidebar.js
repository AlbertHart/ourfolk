


if (typeof(sb_prefix) == "undefined")
    sb_prefix = "";

if (window.location.href.indexOf("alhartapps") >= 0)
    sb_prefix = "https://ourfolkgen.com/ourfolk/";

    elt = document.getElementById('sidebar');
    elt.innerHTML = `
<!--sidebar start-->
<aside>
  <div id="sidebar"  class="nav-collapse ">
      <!-- sidebar menu start-->
      <ul class="sidebar-menu" id="nav-accordion">
          <li>
              <a href ="` + sb_prefix + `families.htm">
                  <i class="fa fa-heart"></i>
                  <span>Home</span>
              </a>
          </li>
          <li>
                <a href ="` + sb_prefix + `search.htm">
                    <i class="fa  fa-list-ol"></i>
                    <span>Search Names</span>
                </a>
            </li>

            <li>
                <a href ="` + sb_prefix + `castles.htm">
                    <i class="fa fa-book"></i>
                    <span>Castles</span>
                </a>
            </li>

        <li>
            <a href ="` + sb_prefix + `resources.htm">
                <i class="fa fa-book"></i>
                <span>Resources</span>
            </a>
        </li>

        <li>
            <a href ="` + sb_prefix + `./indices/index_a_1.htm">
                <i class="fa fa-book"></i>
                <span>Index</span>
            </a>
        </li>


        <li class="sub-menu">
              <a href="javascript:;" ></a>
                  <i class="fa fa-eye"></i>
                  <span>Hart / Kimball</span>
              </a>
              <ul class="sub">

                  <li><a href="` + sb_prefix + `ged_person.htm?id=1">Albert Douglass Hart, Jr</a></li>
                  <li><a href="` + sb_prefix + `ged_person.htm?id=2">Sally Johnston Kimball</a></li>
                  <li><a href="` + sb_prefix + `ged_person.htm?id=11">Richard Dixon Hart</a></li>
                  <li><a href="` + sb_prefix + `ged_person.htm?id=134">Carol Jean Hobbs</a></li>

                  <li><a href="` + sb_prefix + `ged_person.htm?id=8">Albert Douglass Hart, Sr</a></li>
                  <li><a href="` + sb_prefix + `ged_person.htm?id=9">Ruth Amelia Bibbins</a></li>

                  <li><a href="` + sb_prefix + `ged_person.htm?id=5">Paul Earle Kimball</a></li>
                  <li><a href="` + sb_prefix + `ged_person.htm?id=6"> Dorothy Adams Johnston</a></li>

                  <li><a href="` + sb_prefix + `ged_person.htm?id=7366">Carl Wilbur Hobbs</a></li>
                  <li><a href="` + sb_prefix + `ged_person.htm?id=8651">Edna Sharp</a></li>


            </ul>
        </li>

        <li class="sub-menu">
        <a href="javascript:;" ></a>
            <i class="fa fa-eye"></i>
            <span>Smith / West</span>
        </a>
        <ul class="sub">
            <li><a href="` + sb_prefix + `ged_person.htm?id=125"> James Melvin Smith</a></li> 
            <li><a href="` + sb_prefix + `ged_person.htm?id=10">Barbara Jean Hart</a></li>

            <li><a href="` + sb_prefix + `ged_person.htm?id=2390">Clarence Raymond Smith</a></li> 
            <li><a href="` + sb_prefix + `ged_person.htm?id=2391">Chloe Olivia West</a></li> 

            <li><a href="` + sb_prefix + `ged_person.htm?id=8">Albert Douglass Hart, Sr</a></li>
            <li><a href="` + sb_prefix + `ged_person.htm?id=9">Ruth Amelia Bibbins</a></li>
            </ul>
            </li>


        <li class="sub-menu">
              <a href="javascript:;" ></a>
                  <i class="fa fa-eye"></i>
                  <span>Erikson / Kimball</span>
              </a>
              <ul class="sub">

              <li><a href="` + sb_prefix + `ged_person.htm?id=7">Susan May Kimball</a></li> 
              <li><a href="` + sb_prefix + `ged_person.htm?id=438">Jon Edward Erikson</a></li> 

              <li><a href="` + sb_prefix + `ged_person.htm?id=5">Paul Earle Kimball</a></li>
              <li><a href="` + sb_prefix + `ged_person.htm?id=6">Dorothy Adams Johnston </a></li>

              <li><a href="` + sb_prefix + `ged_person.htm?id=440">Oscar Walter Erikson</a></li> 
              <li><a href="` + sb_prefix + `ged_person.htm?id=441">Dorothy Helen Ferguson</a></li> 

            </ul>
        </li>

        <li class="sub-menu">
        <a href="javascript:;" ></a>
            <i class="fa fa-eye"></i>
            <span>Kimball / Bush</span>
        </a>
        <ul class="sub">

        <li><a href="` + sb_prefix + `ged_person.htm?id=460">James Morton Kimball</a></li> 
        <li><a href="` + sb_prefix + `ged_person.htm?id=461">Cindy Sue Bush</a></li> 
        <li><a href="` + sb_prefix + `ged_person.htm?id=5">Paul Earle Kimball</a></li>
        <li><a href="` + sb_prefix + `ged_person.htm?id=479">Margaret Buchanan Morton</a></li>
        <li><a href="` + sb_prefix + `ged_person.htm?id=2082">Woodrow Leon Bush</a></li> 
        <li><a href="` + sb_prefix + `ged_person.htm?id=2086">Alice Lorene Marker</a></li> 

      </ul>

      <li class="sub-menu">
        <a href="javascript:;" ></a>
            <i class="fa fa-eye"></i>
            <span>Johnston / Adams</span>
        </a>
        <ul class="sub">

        
        <li><a href="` + sb_prefix + `ged_person.htm?id=6">Dorothy Adams Johnston</a></li>
        <li><a href="` + sb_prefix + `ged_person.htm?id=5">Paul Earle Kimball</a></li>

        <li><a href="` + sb_prefix + `ged_person.htm?id=431">Henry Adams Johnston</a></li>
        <li><a href="` + sb_prefix + `ged_person.htm?id=431">Jane Johnson Winfield</a></li>

        <li><a href="` + sb_prefix + `ged_person.htm?id=468">Samuel A. Johnston Jr.</a></li>
        <li><a href="` + sb_prefix + `ged_person.htm?id=469">Stella M Adams</a></li>

        <li><a href="` + sb_prefix + `ged_person.htm?id=644">Samuel A. Johnston Sr.</a></li>
        <li><a href="` + sb_prefix + `ged_person.htm?id=427">Henry Clay Adams Sr.</a></li>

      </ul>
  </li>


    


      </ul>
      <!-- sidebar menu end-->
`;

function get_footer()
    {
        sfooter = `
        <br>The <a href='https://ourfolkgen.com/'><i>Our Folk</i> Genealogy Pages</a>
            were compiled by <b>Albert Douglass Hart, Jr.</b> 
            based on the original "<b><i>Our Folk</i></b>" 
            <br>compiled by <b>Albert Thomas Hart</b> in 1972 
            with help from <b>Albert Douglass Hart Sr</b>, <b?Cara Hart</b> and lots of other family members.
           <br>
        <p>To report errors or omissions, request information or share sources or photos, 
            <br>Please send an email to 
            <a href="mailto:info1@ourfolkgen.com?subject=Our%20Folk%20web%20site:" class="link">
                Albert D. Hart, Jr
            </a>.
            
            `;

        return(sfooter);
    }
    
    var do_footer_count = 0;
    function do_footer()
    {
        console.log(get_self(do_footer_count));
        sfooter = "";


        do_footer_count++;

        sfooter += get_footer();
        
    
        
        sfooter += "<br>";

        elt = document.getElementById("footer");
        if (elt)
            elt.innerHTML = sfooter;

        //document.writeln(sfooter);

    }
