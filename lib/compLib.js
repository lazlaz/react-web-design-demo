$(function() {
	loadComponentTree();
});

function loadComponentTree() {
	$.ajax({
		type : "GET",
		url : "./json/tree.json",
		data : {},
		dataType : "text",
		success : function(data) {
			var tree = $.parseJSON(data);
			var root = tree.data;
			for (var i = 0; i<root.length; i++) {
				
			}
			console.log(tree);
		},
		error : function(e) {
			console.error(e);
		}
	});
	$("#componentTree")
}