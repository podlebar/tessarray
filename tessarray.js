// ------ Flickr Justified Layout ------
// Copyright 2016 Yahoo Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

require=function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){"use strict";var merge=require("merge");var Row=module.exports=function(params){this.top=params.top;this.left=params.left;this.width=params.width;this.spacing=params.spacing;this.targetRowHeight=params.targetRowHeight;this.targetRowHeightTolerance=params.targetRowHeightTolerance;this.minAspectRatio=this.width/params.targetRowHeight*(1-params.targetRowHeightTolerance);this.maxAspectRatio=this.width/params.targetRowHeight*(1+params.targetRowHeightTolerance);this.edgeCaseMinRowHeight=params.edgeCaseMinRowHeight||Number.NEGATIVE_INFINITY;this.edgeCaseMaxRowHeight=params.edgeCaseMaxRowHeight||Number.POSITIVE_INFINITY;this.rightToLeft=params.rightToLeft;this.isBreakoutRow=params.isBreakoutRow;this.items=[];this.height=0};Row.prototype={addItem:function addItem(itemData){var newItems=this.items.concat(itemData),rowWidthWithoutSpacing=this.width-(newItems.length-1)*this.spacing,newAspectRatio=newItems.reduce(function(sum,item){return sum+item.aspectRatio},0),targetAspectRatio=rowWidthWithoutSpacing/this.targetRowHeight,previousRowWidthWithoutSpacing,previousAspectRatio,previousTargetAspectRatio;if(this.isBreakoutRow){if(this.items.length===0){if(itemData.aspectRatio>=1){this.items.push(itemData);this.completeLayout(rowWidthWithoutSpacing/itemData.aspectRatio);return true}}}if(newAspectRatio===0){return false}if(newAspectRatio<this.minAspectRatio){this.items.push(merge(itemData));return true}else if(newAspectRatio>this.maxAspectRatio){if(this.items.length===0){this.items.push(merge(itemData));this.completeLayout(rowWidthWithoutSpacing/newAspectRatio);return true}previousRowWidthWithoutSpacing=this.width-(this.items.length-1)*this.spacing;previousAspectRatio=this.items.reduce(function(sum,item){return sum+item.aspectRatio},0);previousTargetAspectRatio=previousRowWidthWithoutSpacing/this.targetRowHeight;if(Math.abs(newAspectRatio-targetAspectRatio)>Math.abs(previousAspectRatio-previousTargetAspectRatio)){this.completeLayout(previousRowWidthWithoutSpacing/previousAspectRatio);return false}else{this.items.push(merge(itemData));this.completeLayout(rowWidthWithoutSpacing/newAspectRatio);return true}}else{this.items.push(merge(itemData));this.completeLayout(rowWidthWithoutSpacing/newAspectRatio);return true}},isLayoutComplete:function isLayoutComplete(){return this.height>0},completeLayout:function completeLayout(newHeight,justify){var itemWidthSum=this.rightToLeft?-this.left:this.left,rowWidthWithoutSpacing=this.width-(this.items.length-1)*this.spacing,clampedToNativeRatio,roundedHeight,clampedHeight,errorWidthPerItem,roundedCumulativeErrors,singleItemGeometry,self=this;if(typeof justify==="undefined"){justify=true}roundedHeight=Math.round(newHeight);clampedHeight=Math.max(this.edgeCaseMinRowHeight,Math.min(roundedHeight,this.edgeCaseMaxRowHeight));if(roundedHeight!==clampedHeight){this.height=clampedHeight;clampedToNativeRatio=rowWidthWithoutSpacing/clampedHeight/(rowWidthWithoutSpacing/roundedHeight)}else{this.height=roundedHeight;clampedToNativeRatio=1}this.items.forEach(function(item,i){item.top=self.top;item.width=Math.round(item.aspectRatio*self.height*clampedToNativeRatio);item.height=self.height;if(self.rightToLeft){item.left=self.width-itemWidthSum-item.width}else{item.left=itemWidthSum}itemWidthSum+=item.width+self.spacing});if(justify){if(!this.rightToLeft){itemWidthSum-=this.spacing+this.left}errorWidthPerItem=(itemWidthSum-this.width)/this.items.length;roundedCumulativeErrors=this.items.map(function(item,i){return Math.round((i+1)*errorWidthPerItem)});if(this.items.length===1){singleItemGeometry=this.items[0];singleItemGeometry.width-=Math.round(errorWidthPerItem);if(this.rightToLeft){singleItemGeometry.left+=Math.round(errorWidthPerItem)}}else{this.items.forEach(function(item,i){if(i>0){item.left-=roundedCumulativeErrors[i-1];item.width-=roundedCumulativeErrors[i]-roundedCumulativeErrors[i-1]}else{item.width-=roundedCumulativeErrors[i]}})}}},forceComplete:function forceComplete(fitToWidth,rowHeight){var rowWidthWithoutSpacing=this.width-(this.items.length-1)*this.spacing,currentAspectRatio=this.items.reduce(function(sum,item){return sum+item.aspectRatio},0);if(typeof rowHeight==="number"){this.completeLayout(rowHeight,false)}else if(fitToWidth){this.completeLayout(rowWidthWithoutSpacing/currentAspectRatio)}else{this.completeLayout(this.targetRowHeight,false)}},getItems:function getItems(){return this.items}}},{merge:2}],2:[function(require,module,exports){(function(isNode){var Public=function(clone){return merge(clone===true,false,arguments)},publicName="merge";Public.recursive=function(clone){return merge(clone===true,true,arguments)};Public.clone=function(input){var output=input,type=typeOf(input),index,size;if(type==="array"){output=[];size=input.length;for(index=0;index<size;++index)output[index]=Public.clone(input[index])}else if(type==="object"){output={};for(index in input)output[index]=Public.clone(input[index])}return output};function merge_recursive(base,extend){if(typeOf(base)!=="object")return extend;for(var key in extend){if(typeOf(base[key])==="object"&&typeOf(extend[key])==="object"){base[key]=merge_recursive(base[key],extend[key])}else{base[key]=extend[key]}}return base}function merge(clone,recursive,argv){var result=argv[0],size=argv.length;if(clone||typeOf(result)!=="object")result={};for(var index=0;index<size;++index){var item=argv[index],type=typeOf(item);if(type!=="object")continue;for(var key in item){var sitem=clone?Public.clone(item[key]):item[key];if(recursive){result[key]=merge_recursive(result[key],sitem)}else{result[key]=sitem}}}return result}function typeOf(input){return{}.toString.call(input).slice(8,-1).toLowerCase()}if(isNode){module.exports=Public}else{window[publicName]=Public}})(typeof module==="object"&&module&&typeof module.exports==="object"&&module.exports)},{}],"justified-layout":[function(require,module,exports){"use strict";var merge=require("merge"),Row=require("./row"),layoutConfig={},layoutData={},currentRow=false;module.exports=function(input){var config=arguments.length<=1||arguments[1]===undefined?{}:arguments[1];var defaults={containerWidth:1060,containerPadding:10,boxSpacing:10,targetRowHeight:320,targetRowHeightTolerance:.25,maxNumRows:Number.POSITIVE_INFINITY,forceAspectRatio:false,showWidows:true,fullWidthBreakoutRowCadence:false};layoutConfig=merge(defaults,config);var containerPadding={};var boxSpacing={};containerPadding.top=!isNaN(parseFloat(layoutConfig.containerPadding.top))?layoutConfig.containerPadding.top:layoutConfig.containerPadding;containerPadding.right=!isNaN(parseFloat(layoutConfig.containerPadding.right))?layoutConfig.containerPadding.right:layoutConfig.containerPadding;containerPadding.bottom=!isNaN(parseFloat(layoutConfig.containerPadding.bottom))?layoutConfig.containerPadding.bottom:layoutConfig.containerPadding;containerPadding.left=!isNaN(parseFloat(layoutConfig.containerPadding.left))?layoutConfig.containerPadding.left:layoutConfig.containerPadding;boxSpacing.horizontal=!isNaN(parseFloat(layoutConfig.boxSpacing.horizontal))?layoutConfig.boxSpacing.horizontal:layoutConfig.boxSpacing;boxSpacing.vertical=!isNaN(parseFloat(layoutConfig.boxSpacing.vertical))?layoutConfig.boxSpacing.vertical:layoutConfig.boxSpacing;layoutConfig.containerPadding=containerPadding;layoutConfig.boxSpacing=boxSpacing;layoutData._layoutItems=[];layoutData._awakeItems=[];layoutData._inViewportItems=[];layoutData._leadingOrphans=[];layoutData._trailingOrphans=[];layoutData._containerHeight=layoutConfig.containerPadding.top;layoutData._rows=[];layoutData._orphans=[];return computeLayout(input.map(function(item){if(item.width&&item.width){return{aspectRatio:item.width/item.height}}else{return{aspectRatio:item}}}))};function computeLayout(itemLayoutData){var notAddedNotComplete,laidOutItems=[],itemAdded,currentRow,nextToLastRowHeight;if(layoutConfig.forceAspectRatio){itemLayoutData.forEach(function(itemData){itemData.forcedAspectRatio=true;itemData.aspectRatio=layoutConfig.forceAspectRatio})}itemLayoutData.some(function(itemData,i){notAddedNotComplete=false;if(!currentRow){currentRow=createNewRow()}itemAdded=currentRow.addItem(itemData);if(currentRow.isLayoutComplete()){laidOutItems=laidOutItems.concat(addRow(currentRow));if(layoutData._rows.length>=layoutConfig.maxNumRows){currentRow=null;return true}currentRow=createNewRow();if(!itemAdded){itemAdded=currentRow.addItem(itemData);if(currentRow.isLayoutComplete()){laidOutItems=laidOutItems.concat(addRow(currentRow));if(layoutData._rows.length>=layoutConfig.maxNumRows){currentRow=null;return true}currentRow=createNewRow()}else if(!itemAdded){notAddedNotComplete=true}}}else{if(!itemAdded){notAddedNotComplete=true}}});if(currentRow&&currentRow.getItems().length&&layoutConfig.showWidows){if(layoutData._rows.length){if(layoutData._rows[layoutData._rows.length-1].isBreakoutRow){nextToLastRowHeight=layoutData._rows[layoutData._rows.length-1].targetRowHeight}else{nextToLastRowHeight=layoutData._rows[layoutData._rows.length-1].height}currentRow.forceComplete(false,nextToLastRowHeight||layoutConfig.targetRowHeight)}else{currentRow.forceComplete(false)}laidOutItems=laidOutItems.concat(addRow(currentRow))}layoutData._containerHeight=layoutData._containerHeight-layoutConfig.boxSpacing.vertical;layoutData._containerHeight=layoutData._containerHeight+layoutConfig.containerPadding.bottom;return{containerHeight:layoutData._containerHeight,boxes:layoutData._layoutItems}}function createNewRow(){if(layoutConfig.fullWidthBreakoutRowCadence!==false){if((layoutData._rows.length+1)%layoutConfig.fullWidthBreakoutRowCadence===0){var isBreakoutRow=true}}return new Row({top:layoutData._containerHeight,left:layoutConfig.containerPadding.left,width:layoutConfig.containerWidth-layoutConfig.containerPadding.left-layoutConfig.containerPadding.right,spacing:layoutConfig.boxSpacing.horizontal,targetRowHeight:layoutConfig.targetRowHeight,targetRowHeightTolerance:layoutConfig.targetRowHeightTolerance,edgeCaseMinRowHeight:.5*layoutConfig.targetRowHeight,edgeCaseMaxRowHeight:2*layoutConfig.targetRowHeight,rightToLeft:false,isBreakoutRow:isBreakoutRow})}function addRow(row){layoutData._rows.push(row);layoutData._layoutItems=layoutData._layoutItems.concat(row.getItems());layoutData._containerHeight+=row.height+layoutConfig.boxSpacing.vertical;return row.items}},{"./row":1,merge:2}]},{},[]);
// ------ Flickr Justified Layout ------

var Tessarray = function(boxClass, options) {
	// Set default values for options
	this.options = options || {};
	this.setOptionValue("containerClass", false);
	this.setOptionValue("selectorClass", false);
	this.setOptionValue("defaultCategory", false);
	this.setOptionValue("resize", true);
	this.setOptionValue("flickr", {});

	// For each box, create an object that contains the data, and a reference to the node
	this.boxObjects = [];
	this.boxNodes = [];
	this.dimensionsLoaded = [];
	this.loadNecessary = false;
	var boxes = document.getElementsByClassName(boxClass);
	for (var i = 0; i < boxes.length; i++) {
		this.boxNodes[i] = boxes[i];
		this.boxNodes[i].style.position = "absolute";
		this.boxNodes[i].style.opacity = 0;
		this.boxObjects[i] = new TessarrayBox(boxes[i], i, this);
		this.boxNodes[i].style.transition = "transform .25s ease-in, height .25s ease-in, left .25s ease-in, top .25s ease-in, width .25s ease-in, opacity .25s ease-in"
	}

	// Check if user specified containerWidth
	this.specifiedContainerWidth = !!this.options.flickr.containerWidth;

	// If containerClass is given
	if (this.options.containerClass) {
		this.container = document.getElementsByClassName(this.options.containerClass)[0];
		this.setContainerWidth();

		// Gives container relative positioning if it has none
		if (this.container.style.position === "") {
			this.container.style.position = "relative";
		}

		// Resize container upon window size change if container size is modified
		if (this.options.resize) {
			this.setSelectedBoxes([]);
			window.addEventListener("resize", this.renderIfNecessary.bind(this))
		}
	}

	// If given selectorClass is given, bind selectors
	if (this.options.selectorClass) {
		this.selectors = document.getElementsByClassName(this.options.selectorClass);
		for (var i = 0; i < this.selectors.length; i++) {
			var category = this.selectors[i].getAttribute('data-category');
			this.selectors[i].addEventListener("click", this.sortByCategory.bind(this, category));
		}
	}

	// Load immediately if dimensions do not need to be rendered from images
	if (!this.loadNecessary) {
		this.initialRender();
	}
}

Tessarray.prototype.initialRender = function() {
	// If selectors are being used and there is a defaultCategory, render that category
	if (this.options.selectorClass && this.options.defaultCategory) {
		this.sortByCategory(this.options.defaultCategory);
	// Else, render every box
	} else {
		this.setSelectedBoxes(this.boxObjects);
		this.renderBoxes();
	}
}

// This sets default values for options, checks against undefined rather than falsey
Tessarray.prototype.setOptionValue = function(key, defaultValue) {
	if (this.options[key] === undefined) {
		this.options[key] = defaultValue;
	}
}

// Update container width if it was not specified in flickr options
Tessarray.prototype.setContainerWidth = function() {
	if ((!this.specifiedContainerWidth) && (this.options.containerClass)) {
		this.options.flickr.containerWidth = this.container.clientWidth;
	}
}

// This function grabs the necessary information of the selectedBoxes (ratio and index),
// while maintaining the selectedBoxes attribute for readability. This should be called
// every time this.selectedBoxes is edited.
Tessarray.prototype.setSelectedBoxes = function(sortedBoxes) {
	this.selectedBoxes = sortedBoxes;

	this.oldIndexes = this.indexes;

	this.indexes = this.selectedBoxes.map(function(box) {
		return box.index;
	});

	this.ratios = sortedBoxes.map(function(box) {
		return parseFloat(box.aspectRatio);
	});
}

var TessarrayBox = function(box, index, tessarray) {
	this.index = index;
	this.tessarray = tessarray;

	// Create TessarrayBox with an attribute of each class that returns the position value or null
	this.classes = {};
	var classes = box.getAttribute('class').split(" ");
	for (var i = 0; i < classes.length; i++) {
		this.classes[classes[i]] = box.getAttribute("data-" + classes[i]) || null;
	}

	// Get aspect ratio
	if (box.getAttribute('data-aspect-ratio')) {
		this.aspectRatio = parseFloat(box.getAttribute('data-aspect-ratio'));
	} else if (box.getAttribute('data-height') && box.getAttribute('data-width')) {
		this.aspectRatio = parseFloat(box.getAttribute('data-height')) / parseFloat(box.getAttribute('data-width'));
	} else {
		// Else, get aspect ratio by find the image, loading it with JavaScript, and getting width and height
		tessarray.loadNecessary = true;
		tessarray.dimensionsLoaded[index] = false; 
		var source = box.querySelector('img').getAttribute('src');
		var img = new Image();
		var thisBox = this;
		img.onload = function() {
			thisBox.aspectRatio = this.width / this.height;
			tessarray.confirmLoad(index);
		}
		img.src = source;
	}
}

Tessarray.prototype.confirmLoad = function(index) {
	this.dimensionsLoaded[index] = true;
	if (this.deterimineIfBoxesLoaded()) {
		this.initialRender();
	}
}
 
Tessarray.prototype.sortByCategory = function(category) {
	var filteredBoxes = this.boxObjects.filter(function(box) {
		return box.classes[category] !== undefined;
	});

	var sortedBoxes = filteredBoxes.sort(function(box) {
		return box.classes[category];
	});

	this.setSelectedBoxes(sortedBoxes);
	this.renderBoxes();
}

// Rerenders the boxes if the container width has not been specified and container width has changed since last render
Tessarray.prototype.renderIfNecessary = function() {
	if ((!this.specifiedContainerWidth) && (this.options.flickr.containerWidth !== this.container.clientWidth)) {
		this.renderBoxes();
	}
}

Tessarray.prototype.deterimineIfBoxesLoaded = function() {
	for (var i = 0; i < this.dimensionsLoaded.length; i++) {
		if (this.dimensionsLoaded[i] === false) {
			return false;
		}
	}
	return true;
}

Tessarray.prototype.renderBoxes = function() {

	this.setContainerWidth();

	var layoutGeometry = require('justified-layout')(this.ratios, this.options.flickr);

	for (var i = 0; i < this.boxNodes.length; i++) {
		var boxNode = this.boxNodes[i];
		if (this.indexes.includes(i)) {
			var box = layoutGeometry.boxes[this.indexes.indexOf(i)];
			if (box === undefined) {
				boxNode.style.transform = "scale(0)";
			} else {
				boxNode.style.transform = "scale(1)";
				boxNode.style.opacity = 1;
				boxNode.style.height = box.height;
				boxNode.style.left = box.left;
				boxNode.style.top = box.top;
				boxNode.style.width = box.width;
			}
		} else if (this.oldIndexes.includes(i)) {
			boxNode.style.transform = "scale(0)";
		} 
	}	
}