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
	_categories: {
		ACCOUNTING: {
			name: "Accounting / Tax",
			icon:'fa-calculator'
		},
		CLIENT: {
			name: "Client / Customer",
			icon:'fa-users'
		},
		CORPORATE: {
			name: "Corporate Entity",
			icon:'fa-university'
		},
		EMPLOYEE: {
			name: "Employee / Personal Data",
			icon:'fa-male'
		},
		LEGAL: {
			name: "Legal / Compliance",
			icon:'fa-balance-scale'
		},
		TRANSACTION: {
			name: "Transaction",
			icon:'fa-usd'
		},
		UNDEFINED: {
			name: 'Undefined',
			icon: 'fa-ban'
		},
	},
	_confidentialities: {
		BANKING: {
			name: 'Banking Secrecy',
			pos: 0
		},
		SECRET: {
			name: 'Secret',
			pos: 1
		},
		CONFIDENTIAL: {
			name: 'Confidential',
			pos: 2
		},
		INTERNAL: {
			name: 'Internal',
			pos: 3
		},
		PUBLIC: {
			name: 'Public',
			pos: 4
		}
	},
	urgency: [
		{ name: "low",  class: ""},
		{ name: "high", class: "fa-clock-o only" },
		{ name: "very high", class: "fa-clock-o" }
	],
	status: {
		EDITING: {
			name: 'editing',
			color: '#ffc200'
		},
		ACCEPTED: {
			name: 'accepted',
			color: '#4fca9d'
		}
	},
	fetching: {
		START: 0.3,
		STARTED: 0.6,
		SUCCESS: 1,
		ERROR: -1
	},
    messagesError_SignIn : {
       /* ERROR_Text : "Please wrote some text"*/
        ERROR_400 : "The username and password you entered don't match" ,
        ERROR_500_599 : "Connection failed. Please retry later." ,
        ERROR_ : "An error occurred"
    },
	urls: {
		CATEGORY: "api/label/category/",
		CONFIDENTIAL: "api/label/confidentiality/",
		DOCTYPES: "api/label/doctypes/",
		LAGNUAGES: "api/label/languages/",
		ROLES: "api/account/role/",
		PROFILE: "api/account/profile/",
		PHOTO: "api/account/change_photo/",
		TOKEN: "http://54.169.106.24/api-token-auth/",
		EMAIL: "api/account/change_email/",
		PASSWORD: "api/account/change_password/",
		NOTIFICATION: "api/notification/",
		DATALOSE: "api/insight/data-loss/",
		DATARISK: "api/insight/data-risk/"
	}
};
