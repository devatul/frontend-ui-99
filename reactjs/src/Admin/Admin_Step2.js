import React, { Component, propTypes } from 'react';
import { render } from 'react-dom';
import update from 'react-addons-update';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import { makeRequest } from '../utils/http';;
import _ from 'lodash';
import 'jquery';
import template from './Admin_Step2.rt';

var Admin_Step2 = React.createClass({
    getInitialState() {
        return {
            complete: 0,
            cycleProgress: 'progress-radial progress-0',
            readOnly: false,
            readOnly1: false,
            readOnly2: false,
            readOnly3: false,
            add_DomainDetails: [{ key: 0 }],
            add_Folder: [],
            add_Server: [],
            add_Server_Administrator: [{}],
            count: 0,
            DomainDetails : {} ,
            folder : [] ,
            emailserve : {},
            hdpServer : []
        }
    },
    componentDidMount() {
        this.getDomainDetails();
        this.getFolder();
        this.getEmailserve();
    },
    getValueInputDomain(event, name) {
        let data_submit = _.cloneDeep(this.state.DomainDetails),
            value = typeof event === 'string' ? event : event.target.value;

        data_submit = _.assignIn(data_submit, {
            [name]: value,
        });

        this.setState({ DomainDetails: data_submit });
    },
    getValueInputDomainAdmin(event, name) {
        let data_submit = _.cloneDeep(this.state.DomainDetails),
            _name = _.split(name , ' ' , 2),
            value = typeof event === 'string' ? event : event.target.value;

        data_submit.administrators[parseInt(_name[1])][(_name[0])] = value

        this.setState({ DomainDetails: data_submit });
    },
    getValueInputEmailserve(event, name) {
        let data_submit = _.cloneDeep(this.state.emailserve),
            value = typeof event === 'string' ? event : event.target.value;

        data_submit = _.assignIn(data_submit, {
            [name]: value,
        });

        this.setState({ emailserve: data_submit });
    },

    getDomainDetails() {
        return makeRequest({
            path: 'api/technology/domain/',
            success: (data) => {
                this.setState({ DomainDetails: data });
            }
        });
    },
    getHDPServer() {
        return makeRequest({
            path: 'api/technology/hdpserver/',
            success: (data) => {
                this.setState({ hdpServer: data });
            }
        });
    },
    getFolder() {
        return makeRequest({
            path: 'api/technology/folder/',
            success: (data) => {
                this.setState({ folder: data });
            }
        });
    },
    getEmailserve() {
        return makeRequest({
            path: 'api/technology/emailserver_exchange/',
            success: (data) => {
                let datas =  {
                              "name": "Mail Server Exchange",
                              "email": "mail_server@exchange.com",
                              "username": "mail_exchange",
                              "password": "mail_exchange",
                              "internal_url": "http://mail@exchange.com",
                              "external_url": "http://mail@exchange.com",
                              "internet_proxy": [
                                {
                                  "name": "Internet Proxy",
                                  "username": "inet_proxy",
                                  "password": "inet_proxy",
                                  "server_name": "Internet Proxy Server",
                                  "share_name": "Internet Proxy Server",
                                  "business_unit": "Business Unit",
                                  "department": "T",
                                  "team": "IT Team"
                                }
                              ]
                            }
                this.setState({ emailserve: datas });
            }
        });
    },
    putDomain() {
        return makeRequest({
            path: 'api/technology/domain/',
            method: 'PUT',
            params: JSON.stringify(this.state.DomainDetails),
            success: (data) => {}
        });
    },
    putFolder() {
        return makeRequest({
            path: 'api/technology/folder/',
            method: 'PUT',
            params: JSON.stringify(this.state.folder),
            success: (data) => {}
        });
    },
    clickValidate_step1() {
        this.putDomain();
        $("#block1").find("input").prop('disabled', true);
        $("#block1").find("a").css('pointer-events', 'none');

        this.setState({ complete: 1, readOnly: true })
    },

    validate_step2() {
        this.putFolder();
        $("#block2").find("input").prop('disabled', true);
        $("#block2").find("a").css('pointer-events', 'none');

        this.setState({ complete: 2, readOnly1: true })
    },

    validate_step3() {
        $("#block3").find("input").prop('disabled', true);
        $("#block3").find("select").attr("disabled", true);

        this.setState({ complete: 3, readOnly2: true })
    },

    add(value) {
        if (value == 1) {
            let addNew = {  "name" : null ,
                            "email" : null },
                domain = _.cloneDeep(this.state.DomainDetails);
                domain.administrators = _.concat(domain.administrators , addNew)
            this.setState({ DomainDetails: domain });
        }

        if (value == 2) {
            let addNew = { key: this.state.add_Folder.length };
            this.setState({ add_Folder: _.concat(addNew, this.state.add_Folder) });
        }

        if (value == 3) {
            let addNew = { key: this.state.add_Server.length };
            this.setState({ add_Server: _.concat(addNew, this.state.add_Server) });
        }

        if (value == 4) {
            let addNew = { key: this.state.add_Server_Administrator.length };
            this.setState({ add_Server_Administrator: _.concat(addNew, this.state.add_Server_Administrator) });
        }
    },

    addAdmin(value) {},

    editButton(value, readOnly) {
        if (value == 1) {
            this.setState({ readOnly: false });
            $("#block1").find("input").prop('disabled', false);
            $("#block1").find("a").css('pointer-events', 'auto');

            if (!readOnly) {
                this.putDomain();
                $("#block1").find("input").prop('disabled', true);
                $("#block1").find("a").css('pointer-events', 'none');
                this.setState({ readOnly: true });
            }
        }

        if (value == 2) {
            $("#block2").find("input").prop('disabled', false);
            $("#block2").find("a").css('pointer-events', 'auto');
            this.setState({ readOnly1: false });

            if (!readOnly) {
                this.putFolder();
                $("#block2").find("input").prop('disabled', true);
                $("#block2").find("a").css('pointer-events', 'none');
                this.setState({ readOnly1: true });
            }
        }

        if (value == 3) {
            this.setState({ readOnly2: false });
            $("#block3").find("input").prop('disabled', false);
            $("#block3").find("select").attr("disabled", false);

            if (!readOnly) {
                $("#block3").find("input").prop('disabled', true);
                $("#block3").find("select").attr("disabled", true);
                this.setState({ readOnly2: true });
            }
        }

        if (value == 4) {
            $("#block4").find("input").prop('disabled', false);
            this.setState({ readOnly3: false });

            if (!readOnly) {
                $("#block4").find("input").prop('disabled', true);
                this.setState({ readOnly3: true });
            }
        }
    },

    nextStep() {
        this.setState({ complete: 4, readOnly3: true });

        $(window).scrollTop(0);

        $("#block4").find("input").prop('disabled', true);

        this.props.nextStep(3);
    },

    render: template
});

module.exports = Admin_Step2;
