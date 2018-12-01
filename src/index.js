import './scss/main.scss';

import $ from 'jquery';
window.$ = $;

import _makeProduct from './modules/product-html';
import _makeCategory from './modules/category-html';
import _makebasketProduct from './modules/basket-product-html';
import _makeSelectedProduct from './modules/selected-product-html';


	$.ajax({
	url: 'https://nit.tron.net.ua/api/product/list',
	method: 'get', dataType: 'json',
	success: (json) => {
		window.category = {id:1, name:"All", description:"All products"};
		upProd();
		temp();
	},
	error: (error) => { console.err(error); }
});	


function temp () {

window.basket = [];

$('.show-basket').click(() => {
	updatebasketProducts();
	$('.basket').addClass('visible');
});

$(document).keydown(e => {
    if( e.keyCode === 27 ) {
        $('.full-product .close-btn, .basket .close-btn').click();
    }
});
}


	$('.category-list').empty();
	let allprod =  {id:1, name:"All", description:"All products"};

			let cat = _makeCategory(allprod);


				$(cat).click(function() {

					$('.category.selected').removeClass("selected");
					window.category = allprod;
					
					$(`[data-category-id="${window.category.id}"`).addClass("selected");
					upProd();
				});

				if(allprod.id == 1) {
					$(cat).addClass("selected");
				}

				$('.category-list').append(cat);


	$.ajax({
		url: 'https://nit.tron.net.ua/api/category/list',
		method: 'get',
		dataType: 'json',
		success: function(json) {
			console.log(json);
			json.forEach(category => {
				if(category.id == 1) return;
				let categoryHTML = _makeCategory(category);

				$(categoryHTML).click(function() {

					$('.category.selected').removeClass("selected");
					window.category = category;
					
					$(`[data-category-id="${window.category.id}"`).addClass("selected");
					upProd();
				});

				if(category.id == window.category.id) {
					$(categoryHTML).addClass("selected");
				}

				$('.category-list').append(categoryHTML);
			});

		},
		error: (err) => console.log(err)
	});


function upProd() {
	$('.product-grid').empty();
	if(!window.category || window.category.id == 1) {
		$.ajax({
			url: `https://nit.tron.net.ua/api/product/list`,
			method: 'get', dataType: 'json',
			success: (json) => {
				json.forEach(product => {
					let productHTML = _makeProduct(product);
					$(productHTML).click(() => upSelProd(product));
					$('.product-grid').append(productHTML);
				});
			},
			error: (err) => console.log(err)
		});
	} else {
		$.ajax({
			url: `https://nit.tron.net.ua/api/product/list/category/${window.category.id}`,
			method: 'get', dataType: 'json',
			success: (json) => {
				json.forEach(product => {
					let productHTML = _makeProduct(product);
					$(productHTML).click(() => upSelProd(product));
					$('.product-grid').append(productHTML);
				});
			},
			error: (err) => console.log(err)
		});

	}
}

function updatebasketProducts() {
	$('.basket > .basket-product-list').empty();

	$('.basket .close-btn').click(() => {
		$('.basket.visible').removeClass('visible');
	});

	window.basket.forEach(product => {
		let $basketProduct = _makebasketProduct(product); 
		$($basketProduct).find('.basket-product-remove-from-basket').click(() => {
			let index = window.basket.indexOf(product);
			if (index > -1) {
			 	window.basket.splice(index, 1);
			}
			updatebasketProducts();
		});
		$('.basket-product-list').append($basketProduct);
	});

	$('.product-buy').text("Купити " + toPay() + "грн.");
	$('.product-buy').click(function() {
		console.log("CLICK");
		let products = {};
		for(let i = 0; i < window.basket.length; i++) {
			let id = window.basket[i].id;
			if(products[id] != undefined) {
				products[id]++;
			} else if(products[id] == undefined){
				products[id] = 1;
			}
		}

		let obj = {
				"token": "K0p6XXhFmSBt5FYxL5e6",
				"name": $('#name').val(),
				"phone": $('#phone').val(),
				"email": $('#email').val(),
				"products": products
			};

		console.log("BEFORE POST");

		$.post("https://nit.tron.net.ua/api/order/add", obj
			, function(json) {
				$('.basket.visible').removeClass("visible");
			});

		$('.basket.visible').removeClass("visible");
	});

	
}

var upSelProd = function (product) {
	let selectedProduct = _makeSelectedProduct(product); 
	$('.full-product').addClass("visible");
	$('.full-product').empty().append(selectedProduct);

	$('.full-product.visible .close-btn').click(() => {
		$('.full-product.visible').removeClass('visible');
	});

	$('.full-product.visible .selected-product-add-to-basket').click(() => {
		window.basket.push(product);
		$('.full-product.visible').removeClass('visible');
	});
};


var toPay = () => {
	return window.basket.reduce((a, b) => {
		return +a + +(b.special_price != null ? +b.special_price : +b.price);
	}, 0);
};