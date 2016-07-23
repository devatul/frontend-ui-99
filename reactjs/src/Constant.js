module.exports = {
	SERVER_API:'http://54.251.148.133/',
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
		level2: 60
	}
	,
	iconCategories:
	[
		{ name:"accounting/tax", class:'fa-calculator'},
		{ name:"corporate entity", class:'fa-university'},
		{ name:"client/customer", class:'fa-users'},
		{ name:"employee", class:'fa-male'},
		{ name:"legal", class:'fa-balance-scale'},
		{ name:"transaction", class:'fa-usd'}
	],
	urgency: [
		{ name: "low",  class: ""},
		{ name: "high", class: "fa-clock-o only" },
		{ name: "very high", class: "fa-clock-o" }
	]
};