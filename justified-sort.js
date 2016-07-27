document.write('<script src="justified-layout.js" type="text/javascript"></script>');

// Grid needs styling. Opacity and positioning

var JustifiedGrid = function(containerClass, itemClass, selectorClass) {
	this.container = document.getElementsByClassName(containerClass)[0];
	this.containerWidth = this.container.clientWidth;

	this.selectors = document.getElementsByClassName(selectorClass);
	for (var i = 0; i < this.selectors.length; i++) {
		var category = this.selectors[i].getAttribute('data-category');
		this.selectors[i].addEventListener("click", this.sortByCategory.bind(this, category));
	}

	this.itemObjects = [];
	this.itemNodes = [];

	var items = document.getElementsByClassName(itemClass);
	for (var i = 0; i < items.length; i++) {
		this.itemNodes[i] = items[i];
		this.itemNodes[i].style.position = "absolute";
		this.itemObjects[i] = new GridItem(items[i], i);
	}

	this.setSelectedItems([]);
	window.addEventListener("resize", this.renderIfNecessary.bind(this))
}

var test = function() {
	console.log("testinnnnnng");
}

JustifiedGrid.prototype.setSelectedItems = function(sortedItems) {
	this.selectedItems = sortedItems;

	this.indexes = this.selectedItems.map(function(item) {
		return item.index;
	});

	this.ratios = sortedItems.map(function(item) {
		return parseFloat(item.aspectRatio);
	});
}

var GridItem = function(item, index) {
	this.index = index;

	// Create GridItem with an attribute of each class that returns the position value or null
	this.classes = {};
	var classes = item.getAttribute('class').split(" ");
	for (var i = 0; i < classes.length; i++) {
		this.classes[classes[i]] = item.getAttribute("data-" + classes[i]) || null;
	}

	// Grab given aspect ratio
	this.aspectRatio = item.getAttribute('data-aspect-ratio');

	// Get aspect ratio by find the image, loading it with JavaScript, and getting widtha and height
	// There is an issue with how slowly this loads. When sort is called immediately, ratios 
	// have not yet been rendered.
	// var source = item.querySelector('img').getAttribute('src');
	// var img = new Image();
	// var thisGridItem = this;	
	// img.onload = function() {
	// 	thisGridItem.aspectRatio = this.width / this.height;
	// }
	// img.src = source;
}

JustifiedGrid.prototype.sortByCategory = function(category) {
	var filteredItems = this.itemObjects.filter(function(item) {
		return item.classes[category] !== undefined;
	});

	var sortedItems = filteredItems.sort(function(item) {
		return item.classes[category];
	});

	this.setSelectedItems(sortedItems);
	this.renderItems();
}

JustifiedGrid.prototype.renderIfNecessary = function() {
	if (this.containerWidth !== this.container.clientWidth) {
		this.renderItems();
	}
}

JustifiedGrid.prototype.renderItems = function() {
	this.containerWidth = this.container.clientWidth;

	var layoutGeometry = require('justified-layout')(this.ratios, {containerWidth: this.containerWidth});

	// Display none to begin
	for (var i = 0; i < this.itemNodes.length; i++) {
		this.itemNodes[i].style.display = "none";
	}

	this.container.style.height = layoutGeometry.containerHeight;

	for (var i = 0; i < layoutGeometry.boxes.length; i++) {
		var itemNode = this.itemNodes[this.indexes[i]];
		var box = layoutGeometry.boxes[i];
		itemNode.style.display = "";
		itemNode.style.height = box.height;
		itemNode.style.left = box.left;
		itemNode.style.top = box.top;
		itemNode.style.width = box.width;
	}
}