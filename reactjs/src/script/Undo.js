module.exports = {
	//config this.number of action
	number: 15,
	//this.stack action
	stack: [{ context: null, value: null }],

	addAction: function(element) {
		var value = null;
		if(element.type == "checkbox" || element.type == "radio") {
			if(this.stack.length > 2 && this.stack[this.stack.lenth-2].context != element) {
				this.stack.push({
			        context: element,
			        value: !element.value
			    });
			}
			value = element.checked;
		} else {
			if(this.stack.length > 2 && this.stack[this.stack.lenth-2].context != element && (element.value.length == 1)) {
				this.stack.push({
			        context: element,
			        value: null  
			    });
			}
			value = element.value;
		}
		if(this.number > 0) {
			if(this.stack.length < this.number) {
				this.stack.push({
			        context: element,
			        value: value
			    });
			} else {
				this.stack.splice(0, 1);
				this.stack.push({
			        context: element,
			        value: value
			    });
			}
		}
		if(this.stack[0].context == null) {
			this.stack[0].context = this.stack[1].context;
			this.stack[0].value = value;
		}
	    console.log("add: ",this.stack);
	},
	undoHandle: function() {
		if(this.stack[this.stack.length-2].context.type == "checkbox" || this.stack[this.stack.length-1].context.type == "radio") {
			this.stack[this.stack.length-2].context.checked = this.stack[this.stack.length-2].value;
		} else {
			this.stack[this.stack.length-2].context.value = this.stack[this.stack.length-2].value;
		}
	 	this.stack.pop();
	}
}