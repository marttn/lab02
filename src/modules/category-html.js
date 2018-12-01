let _makeHtml = ({
	id,
	name,
	description
}) => {
	let $category = $(`<div class="category" data-category-id="${id}">`);
	$category.append($(`<span class="category-name">`).text(name));
	return $category;
};

module.exports = _makeHtml;