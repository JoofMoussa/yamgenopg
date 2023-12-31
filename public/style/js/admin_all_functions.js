/**
 * marks all rows and selects its first checkbox inside the given element
 * the given element is usaly a table or a div containing the table or tables
 *
 * @param   container   DOM element
 */
var marked_row = new Array;

function markAllRows( container_id ) {
   var rows = document.getElementById(container_id).getElementsByTagName('tr');
   var unique_id;
   var checkbox;

   for ( var i = 0; i < rows.length; i++ ) {

	 checkbox = rows[i].getElementsByTagName( 'input' )[0];

	 if ( checkbox && checkbox.type == 'checkbox' ) {
		unique_id = checkbox.name + checkbox.value;
		if ( checkbox.disabled == false ) {
		   checkbox.checked = true;
		   if ( typeof(marked_row[unique_id]) == 'undefined' || !marked_row[unique_id] ) {
			 rows[i].className += ' marked';
			 marked_row[unique_id] = true;
		   }
		}
	 }
   }

   return true;
}

function unMarkAllRows( container_id ) {
   var rows = document.getElementById(container_id).getElementsByTagName('tr');
   var unique_id;
   var checkbox;
   for ( var i = 0; i < rows.length; i++ ) {

	 checkbox = rows[i].getElementsByTagName('input')[0];

	 if ( checkbox && checkbox.type == 'checkbox' ) {
		unique_id = checkbox.name + checkbox.value;
		checkbox.checked = false;
		rows[i].className = rows[i].className.replace(' marked', '');
		marked_row[unique_id] = false;
	 }
   }
   return true;
}

function addImagesFields(colorId, addImagesFieldsNb) {
	var html = '<table>';
	for(i=1;i<=addImagesFieldsNb;i++){
		html+='<tr><td><input type="file" name="imagecouleur'+colorId+'_'+i+'" id="imagecouleur'+colorId+'_'+i+'" /></td></tr>';
	}
	html += '</table>';

	document.getElementById('td_'+colorId).innerHTML = html;
   $("input[type=file]").each(function () {
    $(this).replaceWith("<div class=\"uploader\" id=\""+$(this).attr("name")+"\" data-name=\""+$(this).attr("name")+"\"></div>");
   });
   $(".uploader").each(function () {
    init_fineuploader($(this));
   });
}

function rpc_update_value (mode, id, value, administrer_url) {
	if (mode == "abus") {
		( function($) {
			// Mise à jour du statut d'un rapport d'abus.
			$.post(administrer_url+'/rpc_status.php', {mode: mode, value: value, id: id}, function(data){
				return true;
			});
		} ) ( jQuery )
	}
}

function change_status(mode, id, img, administrer_url, new_status) {
	if (mode == 'delivery_status') {
		( function($) {
			$.post(administrer_url+'/rpc_status.php', {mode: mode, new_status: new_status, id: id}, function(data){
				if(data.length>1) {
					// Il faut passer toutes les puces de la lignes en gris. La bonne puce sera affichée ensuite
					$(".change_status_" + id).attr('src',administrer_url+'/images/puce-blanche.gif');
					// Modification de l'image souhaité
					img.src = data;
				}
			});
		} ) ( jQuery )
	} else {
		if(img.src == administrer_url+'/images/puce-verte.gif') {
			current_status = 1;
		} else if(img.src == administrer_url+'/images/puce-blanche.gif') {
			current_status = 0;
		} else if(img.src == administrer_url+'/images/puce-orange.gif') {
			current_status = -1;
		} else {
			return false;
		}
		( function($) {
			$.post(administrer_url+'/rpc_status.php', {mode: mode, current_status: current_status, id: id}, function(data){
				if(data.length==1 || data.length==2) {
					if(data=="1") {
						img.src = administrer_url+'/images/puce-verte.gif';
					} else if(data=="-1") {
						img.src = administrer_url+'/images/puce-orange.gif';
					} else {
						img.src = administrer_url+'/images/puce-blanche.gif';
					}
				}
			});
		} ) ( jQuery )
	}
}

function update_price(object, id, administrer_url) {
	object.disabled = true;
	( function($) {
		$.post(administrer_url+'/rpc_price.php', {price: object.value, id: id}, function(data){
			if(data.length!=2) {
				object.style.color = 'red';
			}
			object.disabled = false;
		});
	} ) ( jQuery )
	return true;
}

function update_supplier(object, id, administrer_url) {
	object.disabled = true;
	select = document.getElementById("societe");
	id_supplier = $("#societe"+id).val();
	( function($) {
		$.post(administrer_url+'/rpc_supplier.php', {id_utilisateur: id_supplier, id: id}, function(data){
			if(data.length!=2) {
				object.style.color = 'red';
			}
			object.disabled = false;
		});
	} ) ( jQuery )
	return true;
}

function update_reference(object, id, administrer_url) {
	object.disabled = true;
	( function($) {
		$.post(administrer_url+'/rpc_reference.php', {reference: object.value, id: id}, function(data){
			if(data.length!=2) {
				object.style.color = 'red';
			}
			object.disabled = false;
		});
	} ) ( jQuery )
	return true;
}

function row_calculate(id, mode){
	var price = getPriceInCurrency(id);
	var product = getInfosByName("product["+id+"]")[0].options[getInfosByName("product["+id+"]")[0].selectedIndex].value;
	if(product==="others" || product===""){
		// Taxes par défaut pour l'utilisateur si produit de type "other"
		var tva_percentage = product_taxes[0];
	}else{
		var tva_percentage = product_taxes[product];
	}
	var ht = (parseFloat(price)-parseFloat(getInfosByName("reduction_amount["+id+"]")[0].value))* parseInt(getInfosByName("quantity["+id+"]")[0].value);
	// vérifie la quantité saisie, quantite à 0 par défaut : l' id correspond au numéro de la ligne de produit
	if(isFinite(parseInt(getInfosByName("quantity["+id+"]")[0].value)) && parseInt(getInfosByName("quantity["+id+"]")[0].value)>=0){
		getInfosByName("quantity["+id+"]")[0].value = parseInt(getInfosByName("quantity["+id+"]")[0].value);
	}else{
		getInfosByName("quantity["+id+"]")[0].value = 0;
	}
	// calcule la réduction : l'id correspond au numéro de la ligne de produit
	if(mode=='percentage' && getInfosByName("reduction_percentage["+id+"]")[0].value!="" && isFinite(parseFloat(getInfosByName("reduction_percentage["+id+"]")[0].value)) && getInfosByName("reduction_percentage["+id+"]")[0].value>0 && getInfosByName("reduction_percentage["+id+"]")[0].value<=100){
		getInfosByName("reduction_amount["+id+"]")[0].value= numberFormat((parseFloat(price)*getInfosByName("reduction_percentage["+id+"]")[0].value/100), 2);
	}else if(getInfosByName("reduction_amount["+id+"]")[0].value!="" && isFinite(parseFloat(getInfosByName("reduction_amount["+id+"]")[0].value)) && getInfosByName("reduction_amount["+id+"]")[0].value>0 && getInfosByName("reduction_amount["+id+"]")[0].value<=parseFloat(price)*parseInt(getInfosByName("quantity["+id+"]")[0].value)){
		getInfosByName("reduction_percentage["+id+"]")[0].value= numberFormat((getInfosByName("reduction_amount["+id+"]")[0].value)/ parseFloat(price)*100, 2);
	}else {
		getInfosByName("reduction_amount["+id+"]")[0].value=0;
		getInfosByName("reduction_percentage["+id+"]")[0].value=0;
	}
	getInfosByName("ht["+id+"]")[0].innerHTML = numberFormat(ht, 2);
	getInfosByName("tva_percentage["+id+"]")[0].innerHTML = numberFormat(tva_percentage,2);
	getInfosByName("ttc["+id+"]")[0].innerHTML = numberFormat(ht*(1+tva_percentage/100),2);
}


// Affiche le prix correspondant au produit saisi : l'id correspond au numéro de la ligne de produit
function getPriceProduct(id){
	var product;
	product = getInfosByName("product["+id+"]")[0].options[getInfosByName("product["+id+"]")[0].selectedIndex].value;
	// si un produit a été choisi

	if(product==""){
		if(getInfosByName("newProduct["+id+"]")[0].innerHTML===""){
			getInfosByName("price["+id+"]")[0].innerHTML ="0.00"; // remise à 0 du prix
			getInfosByName("quantity["+id+"]")[0].value ="0"; // remise à 0 de la quantité
			getInfosByName("ht["+id+"]")[0].innerHTML="0.00";
			getInfosByName("tva_percentage["+id+"]")[0].innerHTML="0.00";
			getInfosByName("ttc["+id+"]")[0].innerHTML="0.00";
		}
	}else if(product==="others"){
		if(getInfosByName("newProduct["+id+"]")[0].innerHTML===""){
			// creation des nouveaux champs de texte
			var inputProduct ="<input type=\"text\" onkeyup=\"row_calculate("+id+", 'percentage'); calculate();\" id=\"ie_inputProduct["+id+"]\" name=\"inputProduct["+id+"]\" size=\"34\" />";
			var inputPrice = "<input type=\"text\" onkeyup=\"row_calculate("+id+", 'percentage'); calculate();\" id=\"ie_inputPrice["+id+"]\" name=\"inputPrice["+id+"]\" value=\"0\" size=\"4\" />";
			getInfosByName("newProduct["+id+"]")[0].innerHTML =inputProduct;
			getInfosByName("newPrice["+id+"]")[0].innerHTML = inputPrice;
			getInfosByName("price["+id+"]")[0].innerHTML =""; // remise à 0 du prix
			getInfosByName("quantity["+id+"]")[0].value ="0"; // remise à 0 de la quantité
			getInfosByName("ht["+id+"]")[0].innerHTML="0.00";
			getInfosByName("tva_percentage["+id+"]")[0].innerHTML="0.00";
			getInfosByName("ttc["+id+"]")[0].innerHTML="0.00";
		}
	}else {
		if(getInfosByName("newProduct["+id+"]")[0].innerHTML!==""){
			getInfosByName("newProduct["+id+"]")[0].innerHTML="";
			getInfosByName("newPrice["+id+"]")[0].innerHTML="";
		}
		getInfosByName("price["+id+"]")[0].innerHTML = product_prices[product];
		getInfosByName("tva_percentage["+id+"]")[0].innerHTML = product_taxes[product];
	}
	row_calculate(id, 'percentage');
}


// Execute tous les calculs pour toutes les lignes de produits
function calculate(){
	getInfosByName("form_currency_rate")[0].innerHTML=currency_rates[getInfosByName("form_currency")[0].value];
	var ht_total = 0;
	var tva_total = 0;
	var ttc_total = 0;
	for(var id=0;id<document.getElementById("product_lines_count").value; id++){
		var this_product = getInfosByName("product["+id+"]")[0].options[getInfosByName("product["+id+"]")[0].selectedIndex].value;
		if(this_product=="others" && getInfosByName("currency["+id+"]")[0].innerHTML!=getInfosByName("form_currency")[0].value){
			// Conversion des prix de "autres" entre 2 devises
			getInfosByName("inputPrice["+id+"]")[0].value=getInfosByName("inputPrice["+id+"]")[0].value*currency_rates[getInfosByName("form_currency")[0].value]/currency_rates[getInfosByName("currency["+id+"]")[0].innerHTML]
		}
		getInfosByName("currency["+id+"]")[0].innerHTML=getInfosByName("form_currency")[0].value;
		getInfosByName("reduction_amount_currency["+id+"]")[0].innerHTML=getInfosByName("form_currency")[0].value;
		getInfosByName("ht_currency["+id+"]")[0].innerHTML=getInfosByName("form_currency")[0].value;
		getInfosByName("ttc_currency["+id+"]")[0].innerHTML=getInfosByName("form_currency")[0].value;
		if(this_product!="" && this_product!="others"){
			getInfosByName("price["+id+"]")[0].innerHTML = numberFormat(product_prices[this_product]*getInfosByName("form_currency_rate")[0].innerHTML,2);
		}
		row_calculate(id, 'amount');
		ht_total += parseFloat(getInfosByName("ht["+id+"]")[0].firstChild.nodeValue);
		tva_total += parseFloat(getInfosByName("tva_percentage["+id+"]")[0].innerHTML)*parseFloat(getInfosByName("ht["+id+"]")[0].firstChild.nodeValue)/100;
		ttc_total += parseFloat(getInfosByName("ttc["+id+"]")[0].firstChild.nodeValue);
	}
	document.getElementById("ht_total").innerHTML = numberFormat(ht_total,2)+' '+getInfosByName("form_currency")[0].value;
	document.getElementById("tva_total").innerHTML = numberFormat(tva_total,2)+' '+getInfosByName("form_currency")[0].value;
	document.getElementById("ttc_total").innerHTML = numberFormat(ttc_total,2)+' '+getInfosByName("form_currency")[0].value;
}

function Compter(Target, max, nomchamp)
{
    StrLen = Target.value.length
    if (StrLen > max )
    {
        Target.value = Target.value.substring(0,max);
        CharsLeft = max;
    } else {
        CharsLeft = StrLen;
    }
    nomchamp.value = max - CharsLeft;
}

function get_partial_amount_link(this_link) {
	var new_amount = document.getElementById('bdc_partial').value;
	document.getElementById('partial_amount_link').href = this_link+new_amount;
}

function display_input2_element(select_item_id)
{
	var choix = document.getElementById(select_item_id);
	if(choix) {
		if(choix.value == "3" || choix.value == "5" || choix.value == "6" || choix.value == "7")
		{
			document.getElementById(select_item_id+"_input2_span").style.display = "inline";
		}
		else
		{
			if(choix.value == ""){
				document.getElementById(select_item_id+"_input1").value = "";
				document.getElementById(select_item_id+"_input2").value = "";
			}
			document.getElementById(select_item_id+"_input2_span").style.display = "none";
		}
	}
}

function show_date3(select_item_id, date_item_id) {
	var choix = document.getElementById(select_item_id);
	if(choix.value == "3" || choix.value == "5" || choix.value == "6" || choix.value == "7")
	{
		document.getElementById(date_item_id).style.display = "inline";
	}
	else
	{
		if(choix.value == ""){
			document.getElementById("status_date_id").value = "";
			document.getElementById("status_date2_id").value = "";
		}
		document.getElementById(date_item_id).style.display = "none";
	}
}

(function($) {
   $(document).ready(function() {
		// Autocomplete
		bind_search_autocomplete("search_products_list", "rpc.php", false);
	});
})(jQuery);

function add_categories_list_line(id, nom, user_id, str_add_line,id_category) {
	this_line_html=new_category_line_html;
	document.getElementById("nb_categories").value++;
	this_line_id=document.getElementById("nb_categories").value;
	
	$("#dynamic_categories_lines").append(this_line_html.replace(/\[i\]/g, this_line_id).replace(/\[id\]/g, id).replace(/\[nom\]/g, nom).replace(/\[user_id\]/g, user_id).replace(/\[id_category\]/g, id_category));

	document.getElementById("categories_suggestions_input").value="";
	$("#categories_suggestions").show();
	$("#categories_suggestions").html("<p class=\"alert alert-success\">" + str_add_line + "</div>");
}

function delete_categories_list_line(id) {
	document.getElementById("categories_line"+id).style.display="none";
	document.getElementById("categories_line"+id).outerHTML="";
}




