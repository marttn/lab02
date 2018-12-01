let _makeHtml = ({
	id,
	name,
	image_url,
	price
}) => {
	let $product = $(`<div class="product" data-product-id="${id}">`);
	$product.append($(`<img src="${image_url}" alt="${name}" class="product-image">`));
	$product.append($(`<span class="product-title">`).text(name));
	$product.append($(`<span class="product-price">`).text(price));
	return $product;
};

module.exports = _makeHtml;