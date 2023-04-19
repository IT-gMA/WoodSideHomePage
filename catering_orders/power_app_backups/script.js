$(document).ready(function (){
    const _catering_menu_uid = new URLSearchParams(window.location.search).get("id");
    console.log(`_catering_menu_uid: ${_catering_menu_uid}`);
    console.log("starting");
var userId = '{{user.id}}';
console.log(userId);

$("#Navigate").hide();
$("#Catering").hide();
(function(webapi, $){
        function safeAjax(ajaxOptions) {
            var deferredAjax = $.Deferred();
    
            shell.getTokenDeferred().done(function (token) {
                // add headers for AJAX
                if (!ajaxOptions.headers) {
                    $.extend(ajaxOptions, {
                        headers: {
                            "__RequestVerificationToken": token
                        }
                    }); 
                } else {
                    ajaxOptions.headers["__RequestVerificationToken"] = token;
                }
                $.ajax(ajaxOptions)
                    .done(function(data, textStatus, jqXHR) {
                        validateLoginSession(data, textStatus, jqXHR, deferredAjax.resolve);
                    }).fail(deferredAjax.reject); //AJAX
            }).fail(function () {
                deferredAjax.rejectWith(this, arguments); // on token failure pass the token AJAX and args
            });
    
            return deferredAjax.promise();  
        }
        webapi.safeAjax = safeAjax;
    })(window.webapi = window.webapi || {}, jQuery)

webapi.safeAjax({
            type: "GET",
            //url: "https://servicemanagementdev.powerappsportals.com/_api/prg_cateringcarts?$select=prg_cateringitemdescription&$filter=(contains(prg_orderstatus,'1') and (_prg_loggedservicecontact_value  eq " + userId + "))&$count=true",
            url: "/_api/prg_cateringcarts?$select=prg_cateringitemdescription&$filter=(contains(prg_orderstatus,'1') and (_prg_loggedservicecontact_value  eq " + userId + "))&$count=true",
            contentType: "application/json",
            accept: "application/json;odata=verbose",
            success: function (res, status, xhr) {
            
             console.log( res.value.length);  
    
                if (res.value.length > 1 ) {
                $('#Catering').click();
                }
				else {
					$("#Navigate").show();
					}

}
});
$(".entity-grid").on("loaded", function () {

$(this).children(".view-grid").find("tr").each(function (){
//          console.log($(this));
        var cateringitemdescription_main = $(this).find("td[data-attribute='prg_cateringitemdescription']");
        var priceperunit_main = $(this).find("td[data-attribute='prg_priceperunit']");
        var unit_main = $(this).find("td[data-attribute='prg_unit']");
        var menusection_main = $(this).find("td[data-attribute='prg_menusection']");
        var minimumorderquantity_main = $(this).find("td[data-attribute='prg_minimumorderquantity']");
        var menu_main = $(this).find("td[data-attribute='prg_menutype']");
        var user_main = ("{{user.id}}");
        var user_ins = "/contacts("+user_main+")"
        
//  console.log(user_main);
        if(cateringitemdescription_main.length>0)
        {
        var cateringitemdescription = cateringitemdescription_main[0].innerText;
//      console.log(cateringitemdescription_main[0].attributes);
        var priceperunit = priceperunit_main[0].innerText;
        var menusection = menusection_main[0].innerText;
        var unit = unit_main[0].innerText;
        var menu = menu_main[0].innerText;
        var minimumorderquantity = minimumorderquantity_main[0].innerText;
//  console.log(priceperunit);  
        thisArray = JSON.stringify({
            "prg_cateringitemdescription": cateringitemdescription,
            "prg_priceperunit": Number(priceperunit),
            "prg_unit": unit,
            "prg_menu_name": menu,
            "prg_menusection": menusection,
            "prg_minimumorderquantity": Number(minimumorderquantity),
            "prg_LoggedServiceContact@odata.bind":user_ins,
            "prg_orderstatus": "1"
            })
//          console.log(thisArray);
            
    webapi.safeAjax({
            type: "POST",
            url: "/_api/prg_cateringcarts",
            contentType: "application/json",
            data: thisArray,
            success: function (res, status, xhr) {
}
});
        };
      });
   });
});
