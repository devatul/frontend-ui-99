module.exports = {
	SERVER_API:'http://54.254.145.121/',
	TIMEVALIDTOKEN :300000,
	scan: {
		IS_NO_SCAN: 'no scan',
		IS_SCANING: 'in progress',
		IS_COMPLETED: 'completed'
	},
	role: {
		IS_1ST: 'doc_owner',
		IS_ADMIN: 'risk_lead',
		IS_2ND: 'risk_officer',
		IS_3RD: 'audit',
	},
	progressBar: {
		level1: "progress-bar-danger",
		level2: "progress-bar-warning",
		level3: "progress-bar-success"
	},
	progressValue: {
		level1: 30,
		level2: 80
	}
	,
	iconCategories:
	[
		{ name:"Accounting/Tax", class:'fa-calculator'},
		{ name:"Corporate Entity", class:'fa-university'},
		{ name:"Client/Customer", class:'fa-users'},
		{ name:"Employee", class:'fa-male'},
		{ name:"Legal/Compliance", class:'fa-balance-scale'},
		{ name:"Transaction", class:'fa-usd'}
	],
	urgency: [
		{ name: "low",  class: ""},
		{ name: "high", class: "fa-clock-o only" },
		{ name: "very high", class: "fa-clock-o" }
	],
	status: [
		{normal: { name: "normal", color: "#999"} },
		
		{editing: {name: "editing", color: "#ffc200"} },
		
		{accept: {name: "accept", color: "#4fca9d"} },
		
		{reject: {name: "reject", color: "#ff2d00"} }
	]
};