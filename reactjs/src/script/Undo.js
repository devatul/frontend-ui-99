module.exports = {
	classSetUndo: ".setUndo",
	classGetUndo: ".getUndo",
	//config this.number of action
	//number: 20,
	//this.stack action
	stack: [],

	default: [],

	getDefaultValue: function() {
		var name = this.classSetUndo;
		this.default = [];
		this.stack = [];
		if($(name).length) {
            $(name).map(function(index, obj) {
                this.default.push({
                	id: obj.id,
                	obj: obj,
                	value: (obj.type == "checkbox" || obj.type == "radio") ? obj.checked : obj.value
                });
            }.bind(this));
        }
        console.log("default: ", this.default);
	},

	addAction: function(el) {
		var set_undo = this.classSetUndo;
		//if(this.number > 0) {
			var element_check = $.grep(this.stack, function(e) {
				return e.id == el.id;
			});
			console.log("check: ", element_check);
			if(element_check.length == 0) {
				var default_element = $.grep(this.default, function(e) {
					return e.id == el.id;
				})
				if(el.type == "checkbox" || el.type == "radio") {
					this.stack.push( {
						id: el.id,
						obj: el,
						value: (el.checked) ? false : true
					});
				} else {
					this.stack.push( {
						id: default_element[0].id,
						obj: default_element[0].obj,
						value: default_element[0].value
					});
				}
				console.log("arr: ", default_element);
			}
			//if(this.stack.length < this.number) {
				this.stack.push({
					id: el.id,
					obj: el,
					value: (el.type == "checkbox" || el.type == "radio") ? el.checked : el.value
				});
			/*} else {
				this.stack.splice(0, 1);
				this.stack.push({
					obj: el,
					value: (el.type == "checkbox" || el.type == "radio") ? el.checked : el.value
				});
			}*/
		//}
	    console.log("add: ",this.stack);
	},

	undoHandle: function(callback) {
		if(this.stack.length > 1) {
			var total = this.stack.length;
			var element = this.stack[(total - 2)];
			if(element.obj.type == "checkbox" || element.obj.type == "radio") {
				element.obj.checked = element.value;
			} else {
				element.obj.value = element.value;
				console.log("ok", element.value);
			}
			callback(element, element.value);
			this.stack.pop();
		 		
		 	console.log("sasdss: ", this.stack);
		}
	},
	setup: function(callback) {
		var set_undo = this.classSetUndo;
		var get_undo = this.classGetUndo;
		this.getDefaultValue();
		$(set_undo).on("change", function(event) {
			this.addAction(event.target);
		}.bind(this));
		$(get_undo).on("click", function() {
			this.undoHandle(callback);
		}.bind(this));
	}
}