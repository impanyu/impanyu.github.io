//
// The following is deemed a model solution for a1 - it does solve all
// requirements while maintaining complete separation from the actual data
// downloaded. It is therefor completely dynamic, provided the JSON follows
// the same schema containing the product/recipe/supplier types.
//
// This assignment only uses technology and methods described in class. It uses
// jquery to make certain loops easier to read and ajax easier too.
//
// By building this solution in a way that is generic, making extensive use of maps, lists and loops -
// you can see how the amount of code is reduced. There are <200 lines of
// javascript for the entire assignment.

(function (a1, $, undefined) { //namespace - very important

//master lists of all data available or used for calculations
a1.recipes = {};
a1.suppliers = {};
a1.products = {};
a1.bakedRecipes = [];

//1. An entry point funtion for implementation of our engine
a1.start = function(hookElementSelection, dataurlForJsonFile) {

	//resetting data in case this isnt the first
	//run through - depending on page design it might get
	//called more than once, so we should be safe
	a1.products = {};
	a1.recipes = {};
	a1.suppliers = {};
	a1.bakedRecipes = [];

	//make an ajax call and wait for success
	$.ajax({url:dataurlForJsonFile}).success(function(data) {
		console.info("hello");
        $("#loading").fadeIn(2000);
		//get the recipe data
		parseJSONData(data);
		$("#loading").fadeOut(2000,function(){

		//put the recipes on the page
		$.each(a1.recipes, function(i, recipe) {
			recipe.render(hookElementSelection);
		});
		renderCalculator(hookElementSelection); //add in the final calculation logic
		$("#cakeHook").slideDown(2000);
	   });

		
	});
};


//2. A generic function that splits out the two parts of the JSON we
//can assume are always there, recipes and products - notice these are the only hard coded elements
//of the JSON present in the code
var parseJSONData = function(data) {
	var products = data[0]["products"]
	parseJSONProducts(products);
	var recipes = data[0]["recipes"]
	parseJSONRecipes(recipes);
}

//3. a specialized function just for pulling product data
var parseJSONProducts = function(productsJSONData)
{
	$.each(productsJSONData, function(i,product) {
		if (!a1.suppliers[product.supplier])
		{
			a1.suppliers[product.supplier] = new a1.Supplier(product.supplier); //build an object using definition
		}
		a1.products[product.name] = new a1.Product(product.name, product.cost, product.per, a1.suppliers[product.supplier]) //build and object using definition
	});
}

//4. A specialized function just for pulling recipe data
var parseJSONRecipes = function(recipesJSONData)
{
	$.each(recipesJSONData, function(i,recipe) {
		var ingredients = [];
		//there are a few ways to do this, this is the simplist way
		//to convert a random collection of names to a list of objects
		//in undergradate this is simplier because we arent using
		//object definitions and can use the map as-is
		//note: this schema allows multiple batches of ingredients - we will only support 1 batch initially - ingredients[0]
		for (ingredient in recipe.ingredients[0]) //loop through all keys
		{
			ingredients.push({ingredient:a1.products[ingredient],amount:recipe.ingredients[0][ingredient]}) //build an object using definition
		}
		a1.recipes[recipe.name] = new a1.Recipe(recipe.name, ingredients);
	});
}

//5. function to create a button to calculate cost
//this could be a function on an object, but we only use it
//once so is fine to leave as a function within the namespace
var renderCalculator = function(base) {
	var costHTML = $("<button>Calculate Weekly Total</button>");
	var resultsHTML = $("<div id='results'></div>");
	costHTML.on("click", function(event) {
		//total everything

		//grab all inputs on page
		$(".recipeSelector").each(function(i,input) {
			if (input.value > 0)
			{
				//figure out how many recipes were made
				a1.bakedRecipes.push({recipe:a1.recipes[input.id],amount:input.value});
			}
		});

		//print out required total information
		resultsHTML.empty(); //delete old info
		calculateAndPrintTotals(resultsHTML);
		$("#results").slideDown(2000);
		$(".recipe").slideUp(2000);		

	});
	base.append(costHTML);
	base.append(resultsHTML);
}

//6. function to print out all html related to getting the total and separation of products
//on to the screen. It makes use of the same rendering functions that the recipe used
var calculateAndPrintTotals= function(base) {
	//basic total
	var total = 0;

	//split title (graduate)
	var ingredientTotals = {};

	//look at what we are making
	$.each(a1.bakedRecipes, function(i,recipeListing) {
		total += recipeListing.recipe.total(recipeListing.amount, ingredientTotals); //ask for money total and also total all ingredients used //later only needed for graduate
	});

	//basic total
	var totalHTML = $("<h1>Total Cost: $" + total.toFixed(2) +  "</h1>"); //tofixed is a number function to give exactly 2 decimal places
	base.append(totalHTML);

	//graduate extension
	splitTotalsAndPrint(base, ingredientTotals);
}

// 6b. Graduate section - this is tricky to do in so few lines - but completely possible
// we want to take the ingredient totals and split them per
// supplier - in other lanauges we might have a groupBy function
// but with javascript we do not, and thus group all ingredients by supplier below
//
var splitTotalsAndPrint = function(base, ingredientTotals)
{
	var supplierTotals = {};
	$.each(ingredientTotals, function(i,ingredientTotal) {
		if (!supplierTotals[ingredientTotal.ingredient.supplier.name]) 
		{
			supplierTotals[ingredientTotal.ingredient.supplier.name] = [];	
		}
		supplierTotals[ingredientTotal.ingredient.supplier.name].push(ingredientTotal);
	});

	//for every supplier - calculate its total and then grab all ingredients
	//and add them
	for (supplierName in supplierTotals) {
		var supplierTotalCost = 0;
		var ingredientHTML = $("<div class='ingres'></div>");
		//for every ingredient that supplier has
		$.each(supplierTotals[supplierName], function(j, ingredientTotal) {
			supplierTotalCost += ingredientTotal.amount * ingredientTotal.ingredient.cost;
			ingredientTotal.ingredient.render(ingredientHTML,ingredientTotal.amount);
		});

		//build html from the result
		var finalHTML = $("<div class='supplieringres'></div>");
		var supplierHTML = $("<h2>" + supplierName + "</h2>");
		var supplierTotalHTML = $("<span> Supplier Cost: $" + supplierTotalCost.toFixed(2) + "</span>");
		finalHTML.append(supplierHTML);
		finalHTML.append(supplierTotalHTML);
		finalHTML.append(ingredientHTML);
		base.append(finalHTML);
	};
}

//7. Reusable object definition for products
a1.Product = function(name,cost,per,supplier) {
	this.name = name;
	this.cost = cost;
	this.per = per;
	this.supplier = supplier; //a link to a supplier

	// turn this object into html - with a specific amount
	this.render = function(base, amount) {
		var nameHTML = $("<h3>" + amount+ " " + this.per + " " +  this.name + "</h3>");
		var costHTML = $("<span>($" + this.cost + " per " + this.per + ")</span>");
		var supplierHTML = $("<div></div>");
		this.supplier.render(supplierHTML);
		var finalHTML = $("<div class='ingre'></div>");
		finalHTML.append(nameHTML);
		finalHTML.append(costHTML);
		finalHTML.append(supplierHTML);
		base.append(finalHTML);
	};
};

//8. Reusable object definition for recipes
a1.Recipe = function(name, ingredients ) {
	this.name = name;
	this.ingredients = ingredients; //a array of listings, link to ingredients and amounts

	// turn this object into html
	this.render = function(base) {
		var nameHTML = $("<h2>" + this.name + "</h2>");
		var labelHTML = $("<label for='"+this.name+"'>How many " + this.name + " recipes to be baked?</label>"); //add a input element
		var inputHTML = $("<input type='number' class='recipeSelector' id='" + this.name +"'></input>"); //add a input element
		var ingredientsHTML = $("<div class='ingres'></div>");
		$.each(ingredients, function(i,ingredientListing) {
			ingredientListing.ingredient.render(ingredientsHTML, ingredientListing.amount); //
		});
		var finalHTML = $("<div class='recipe'></div>");
		finalHTML.append(inputHTML);
		finalHTML.append(labelHTML);
		finalHTML.append(nameHTML);
		finalHTML.append(ingredientsHTML);
		base.append(finalHTML);
	};

	//calculate cost of a recipe that is used a certain amount, and 
	//total ingredients into a map to be used for collation later
	this.total = function(amount, ingredientTotals)
	{
		ingredientTotals = ingredientTotals || {}
		amount = amount || 1 //1 if not defined
		var total = 0;
		$.each(this.ingredients, function(i, listing) {
			total += listing.amount * listing.ingredient.cost;
			//graduate extension to calculate total of ingredients/suppliers
			//we will total ingredients and then use their definitions to figure out suppliers
			if (!ingredientTotals[listing.ingredient.name])
			{
				ingredientTotals[listing.ingredient.name] = {ingredient:listing.ingredient,amount:0}; //create empty entry if not there already
			}
			ingredientTotals[listing.ingredient.name].amount += listing.amount*amount; //add an ingredient amount
		});
		return total*amount;
	};
};

//9. Reusable object definition for suppliers
a1.Supplier = function(name) {
	this.name = name;
	this.render = function(base) {
		var nameHTML = $("<h4 >" + this.name + "</h4>");
		var finalHTML = $("<div class='sup'></div>");
		finalHTML.append(nameHTML);
		base.append(finalHTML);
	};
};

})(window.a1 = window.a1 || {}, jQuery) //namespace protects the jQuery $ and the 'undefined' value

//FINAL NOTES:
//To be truly enterprise grade this code would need additional error handling
//we will cover hardening strategies at a later stage