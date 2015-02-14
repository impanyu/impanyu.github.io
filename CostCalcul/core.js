
//all definitions in myspace
(function(myspace) {


	        myspace.ajax = {}; //map ajax namespace
           myspace.ajax.get = function(url, callback){
             var xmlhttp;
           // compatible with IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function(){
           if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
                callback(xmlhttp.responseText);
           }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
	
			//Recipe object constructor
			myspace.Recipe = function(name,ingredients) {
				this.name=name;
				this.ingredients=ingredients;
				this.render=function(){
                      var productItem=document.createElement("p");
                      var numberBox=document.createElement("input");

                      productItem.innerHTML=this.name;
                 

                      numberBox.type="text";
                      numberBox.size="5";
                       //numberBox.setAttribute("id",name);
                       numberBox.id=name;
                      document.getElementById("recipe").appendChild(productItem);
                      document.getElementById("recipe").appendChild(numberBox);
				};
			};
			
			//Product object constructor
			myspace.Product = function(name,cost,per,supplier) { 
				this.name = name;
				this.cost = cost;
				this.per = per;
				this.supplier = supplier;			
			}
	
})(window.myspace = window.myspace || {});



