module.exports = {
    SERVER_API: 'http://52.77.255.91/',
    // SERVER_API: 'http://54.179.166.78/',
    // SERVER_API:'http://54.254.145.121/',
    // SERVER_API: 'http://54.169.142.202',
    TIMEVALIDTOKEN: 300000,
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
    _categories: [
        {
            name: "Accounting / Tax",
            icon: 'fa-calculator'
        },
        {
            name: "Client / Customer",
            icon: 'fa-users'
        },
        {
            name: "Corporate Entity",
            icon: 'fa-university'
        },
        {
            name: "Intellectual Property",
            icon: 'fa-university'
        },
        {
            name: "Employee / Personal Data",
            icon: 'fa-male'
        },
        {
            name: "Legal / Compliance",
            icon: 'fa-balance-scale'
        },
        {
            name: "Patient Data",
            icon: 'fa-male'
        },
        {
            name: "Transaction",
            icon: 'fa-usd'
        },
        {
            name: 'Undefined',
            icon: 'fa-ban'
        },
    ],
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
            name: 'Internal Only',
            pos: 3
        },
        PUBLIC: {
            name: 'Public',
            pos: 4
        }
    },
    urgency: [
        { name: "low", class: "" },
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
    messagesError_SignIn: {
        /* ERROR_Text : "Please wrote some text"*/
        ERROR_400: "The username and password you entered don't match",
        ERROR_500_599: "Connection failed. Please retry later.",
        ERROR_: "An error occurred"
    },
    VALIDATION: {
        username: {
            required: "Please enter your user name",
            minlength: "Your username must be at least 6 characters long"
        },
        password: {
            required: "Please provide a password",
            minlength: "Your password must be at least 6 characters long"
        },

        pwd_confirm: {
            required: "Please enter the same value again"
        },
        firstname: {
            required: "Please enter your first name",
        },
        lastname: {
            required:  "Please enter your first name",
        },
        email: {
            required: "Please enter a valid email address",
        },
        company: {
            required: "Please enter your company name",
        },
        agree: {
            required: "Please accept our policy"
        },

        // Specify the validation error messages
    },
  urls: {
    LABEL_CATEGORY: "api/label/category/",
    LABEL_CONFIDENTIAL: "api/label/confidentiality/",
    LABEL_DOCTYPES: "api/label/doctypes/",
    LABEL_LAGNUAGES: "api/label/languages/",
    ROLES: "api/account/role/",
    PROFILE: "api/account/profile/",
    PHOTO: "api/account/change_photo/",
    TOKEN: "http://54.169.106.24/api-token-auth/",
    EMAIL: "api/account/change_email/",
    PASSWORD: "api/account/change_password/",
    NOTIFICATION: "api/notification/",
    DATALOSS: "api/insight/data-loss/",
    DATARISK: "api/insight/data-risk/",
    TOKENAUTH: "api/token/api-token-auth/",
    REGISTRATION: "api/account/registration/",
    REFRESHTOKEN: "api/token/api-token-refresh/",
    IAM: 'api/anomaly/iam/',
    SCAN: 'api/scan/',
    CLASSIFICATION_REVIEW: 'api/classification_review/',
    STATISTICS: 'api/group/statistics/',
    CLOUDWORDS: 'api/group/cloudwords/',
    CENTROIDS: 'api/group/centroids/',
    SAMPLES: 'api/group/samples/',
    GROUP: 'api/group/',
    GROUP_SAMPLES: 'api/group/samples/',
    ORPHAN: 'api/group/orphan',
    ORPHAN_STATISTICS: 'api/group/orphan/statistics',
    ORPHAN_CLOUDWORDS: 'api/group/orphan/cloudwords',
    ORPHAN_CENTROIDS:'api/group/orphan/centroids',
    ORPHAN_SAMPLES: 'api/group/orphan/samples',
    ORPHAN_CATEGORIES: 'api/group/orphan/categories',
    ORGANIZATION: 'api/organization/',
    SLA: 'api/sla/',
    CONFIDENTIAL: 'api/confidentiality/',
    TECH_DOMAIN: 'api/technology/domain/',
    TECH_HDPSERVER: 'api/technology/hdpserver/',
    TECH_FOLDER: 'api/technology/folder/',
    TECH_EMAILSERVER_EXCHANGE: 'api/technology/emailserver_exchange/',
  }
};
