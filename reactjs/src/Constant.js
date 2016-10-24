module.exports = {
	SERVER_API:'http://54.179.166.78/',
	// SERVER_API:'http://54.254.145.121/',
	// SERVER_API: 'http://54.169.142.202',
	TIMEVALIDTOKEN :300000,
	scan: {
		IS_NO_SCAN: 'no scan',
		IS_SCANING: 'in progress',
		IS_COMPLETED: 'completed'
	},
	role: {
		RISK_LEAD: 'risk_lead',
		IS_ADMIN: 'admin',
		IS_1ST: 'doc_owner',
		IS_2ND: 'risk_officer',
		IS_3RD: 'audit',
	},
	progressBar: {
		danger: "progress-bar-danger",
		warning: "progress-bar-warning",
		success: "progress-bar-success"
	},
	progressValue: {
		level1: 30,
		level2: 50
	},
	icons: {
		accounting: { name: "Accounting / Tax", class:'fa-calculator'},
		client: { name: "Client / Customer", class:'fa-users'},
		corporate: { name: "Corporate Entity", class:'fa-university'},
		employee: { name: "Employee", class:'fa-male'},
		legal: { name: "Legal / Compliance", class:'fa-balance-scale'},
		transaction: { name: "Transaction", class:'fa-usd'}
	},
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