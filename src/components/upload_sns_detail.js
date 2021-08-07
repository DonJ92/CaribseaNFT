import React from 'react';
import Web3 from 'web3';
import '../styles/style.css';
import {AddClass, ChangeClass} from '../js/common';
import axios from 'axios';
import config, { chain_id } from '../globals/config';
import CONST from '../globals/constants';
import ERC721 from '../contract/ERC721.json';
import ERC1155 from '../contract/ERC1155.json';
import * as API from '../adapter/api';
import support_networks from '../globals/support_networks';
import network_util from '../common/network_util';
import $ from 'jquery';
import provider_util from '../common/provider_util';
import base64 from 'base-64';
import { withTranslation } from 'react-i18next';

import icon_art from '../img/upload/art.png';
import icon_sns from '../img/upload/sns.png';
import icon_asset from '../img/upload/assets.png';
import icon_manga from '../img/upload/manga.png';
import icon_photograph from '../img/upload/photograph.png';

import icon_twitter from '../img/upload/twitter.png';
import icon_youtube from '../img/upload/youtube.png';
import icon_tiktok from '../img/upload/tiktok.png';
import icon_insta from '../img/upload/instagram.png';

var switch_btn_text = "Switch to Multiple";

class UploadSNSDetail extends React.Component {
    constructor(props) {
        super(props);

        // var script = document.createElement('script');
        // script.src = './js/page/upload-item.js';
        // script.async = true;
        // document.body.appendChild(script);

        ChangeClass('upload');
        AddClass('has-popup');

        this.state = {
            address: null,
            balance: 0,
            selected_asset: 'BNB',
            preview_png: config.preview_url + "default_token.png",
            previewName: "Amazing Digital Art",
            collections: [],
            contract_address: null,
            selected_collection: 1,
            show_loading: true,
            show_sell_notice: true,
            sell_type: CONST.token_status.FIXED_PRICE,
            sell_price: 0,
            contract_id: null,
            protocol_type: CONST.protocol_type.ERC1155,
            erc1155_token_id: null,
            chain_id: support_networks.ETHEREUM,
            name: '',
            description: '',
            image_url: '',
        };

        const { t } = this.props;

        switch_btn_text = this.props.type == CONST.token_type.SINGLE? t("Switch to Multiple"): t("Switch to Single");
    }

    componentDidMount() {
        this.getContent();
        this.showLoading();
        this.getAccounts();
        this.getCollection();
    }

    getContent() {
        if (this.props.sns_type == CONST.sns_type.TWITTER) {
            axios.get(config.cors_url + config.twitter_api_url+'2/tweets/'+ this.props.id + '?tweet.fields=attachments,created_at,entities,text,withheld&expansions=attachments.media_keys,author_id&media.fields=preview_image_url,url&user.fields=username', {
                headers: {
                  'Authorization': 'Bearer ' + config.twitter_bearer_token,
                  "Access-Control-Allow-Origin": "*",
                  'Access-Control-Allow-Methods': 'GET',
                  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
                  }
                })
                .then((res) => {
                  if (res.data) {
                    console.log(res.data);

//                    var json_desc = "type:" + CONST.sns_type.TWITTER + ", id:" + res.data.data.id + ", creator:" + res.data.includes.users[0].username;
                    var json_desc = JSON.stringify({'type':CONST.sns_type.TWITTER, 'id':res.data.data.id, 'creator':res.data.includes.users[0].username});
        
                    this.setState({
                        name: "Tweet-" + res.data.data.id ,
                        description: base64.encode(json_desc),
                        previewName: "Tweet-" + res.data.data.id
                    });
        
                    if (res.data.includes.media) {
                        if (res.data.includes.media[0].type == 'video')
                            this.setState({
                                image_url: res.data.includes.media[0].preview_image_url,
                            });
                        else
                            this.setState({
                                image_url: res.data.includes.media[0].url,
                            });
                    } else {
                      this.setState({
                        image_url: process.env.PUBLIC_URL ? process.env.PUBLIC_URL : config.host_url + "/img/twitter.png",
                      });
                    }
                  }

                  this.onFileUpload();
                  this.handleCollectionSelected(5);

                  document.getElementById("name").value = this.state.name;
                  document.getElementById("description").value = this.state.description;
                })
                .catch((err) => {
                    alert('Can not get Tweet Content');
                    console.log(err);
                });
        } else if(this.props.sns_type == CONST.sns_type.YOUTUBE) {
            axios.get(config.youtube_api_url+'youtube/v3/videos?part=snippet&id='+ this.props.id +'&key=' + config.google_api_key, {
                headers: {
                    'Authorization': 'Bearer ' + this.props.token,
                    'Accept': 'application/json',
                }
            })
            .then((res) => {
                if (res.data) {

//                    var json_desc = "type:" + CONST.sns_type.YOUTUBE + ", id:" + res.data.items[0].id + ", title:" + res.data.items[0].snippet.title + ",description:" + res.data.items[0].snippet.description;
                    var json_desc = JSON.stringify({'type':CONST.sns_type.YOUTUBE, 'id':res.data.items[0].id});

                    this.setState({
                        name: "Youtube-" + res.data.items[0].id,
                        description: base64.encode(json_desc),
                        previewName: "Youtube-" + res.data.items[0].id,
                        image_url: res.data.items[0].snippet.thumbnails.standard.url,
                    });
                }

                this.onFileUpload();
                this.handleCollectionSelected(5);

                document.getElementById("name").value = this.state.name;
                document.getElementById("description").value = this.state.description;
            })
            .catch((err) => {
                console.log(err);
                this.hideLoading();
            })
        }
    }

    showLoading() {
        this.setState({
            show_loading: true
        });

        $("#loading-popup").fadeIn(100);
    }

    hideLoading() {
        this.setState({
            show_loading: false
        });

        $("#loading-popup").fadeOut(100);
    }

    async getAccounts() {
        const { t } = this.props;
        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        web3.eth.getAccounts((error,result) => {
            if (error) {
                console.log(error);
                alert(t('Please connect the wallet'));

                this.hideLoading();
            } else {
                if (result.length < 1) {
                    alert(t('Please connect the wallet'));

                    this.hideLoading();
                } else {
                    this.setState({address: result[0]});

                    API.get_profile(this.state.address)
                    .then((res) => {
                        if (res.result == false || res.profile == null) {
                            alert(t("Not registered user. Please register."));
                            window.location = config.host_url + "/edit_profile";
                        }

                        this.hideLoading();
                    })
                }
            }
        });
    }

    getCollection() {
        axios.get(config.backend_url + "/get_collection")
        .then((res) => {
            if (res.data.result) {
                this.setState({collections: res.data.collections});
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }

    onDeployResponse(newContractInstance) {
        console.log(newContractInstance.options.address); // instance with the new contract address
        this.state.contract_address = newContractInstance.options.address;

        API.add_token({
            deployer: this.state.address,
            name: document.getElementById("name").value,
            description: document.getElementById("description").value,
            fee_percentage: document.getElementById("percentage").value,
            contract_address: newContractInstance.options.address,
            collection: this.state.selected_collection,
            copies: document.getElementById("copies").value,
        }, this.state.chain_id)
        .then((res) => {console.log(res);
            if (res.result == true) {
                var deployBtn = document.getElementById("deploy_token");
                var mintBtn = document.getElementById("mint_token");

                deployBtn.classList.add("btn-ready");
                mintBtn.classList.remove("btn-ready");
            }

            this.hideLoading();
        });
    }

    async deployToken() {
        const { t } = this.props;
        if (!this.isElementEnabled("deploy_token")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!await this.isCorrectNetwork()) return;

        this.showLoading();

        var deployer = this.state.address;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        const NFT = new web3.eth.Contract(ERC721.abi);

        var name = document.getElementById("name").value;
        var description = document.getElementById("description").value;
        var percentage = document.getElementById("percentage").value;
        var copies = document.getElementById("copies").value;

        var NFTTx = NFT.deploy({
            data: '0x' + ERC721.data.bytecode.object,
            arguments: [name, name, percentage, copies],
        });

        NFTTx.send({
            from: this.state.address,
        })
        .on('error', () => this.callbackError(t('An error occured while deploying token.')))
        .on('transactionHash', function(transactionHash){  })
        .on('receipt', function(receipt){            
        })
        .on('confirmation', function(confirmationNumber, receipt){  })
        .then((newContractInstance) => {
            this.onDeployResponse(newContractInstance);
        });
    }

    callbackError(msg) {
        alert(msg);

        this.hideLoading();
    }

    async mintAll() {
        const { t } = this.props;

        if (!this.isElementEnabled("mint_token")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!await this.isCorrectNetwork()) return;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        this.showLoading();

        const web3 = new Web3(provider);
        
        var previewPaths = this.state.preview_png.split("/");

        const NFT = new web3.eth.Contract(ERC721.abi, this.state.contract_address);

        var metadata = {
            url: config.token_url + previewPaths[previewPaths.length - 1],
            description: document.getElementById("description").value
        };

        NFT.methods.mintAll(metadata).send({from: this.state.address})
        .on('error', () => this.callbackError(t('An error occured while minting tokens.')))
        .on('receipt', function(receipt){
            console.log(receipt);
        })
        .then((res) => {
            console.log(res);

            API.mint_token(this.state.contract_address, metadata, this.state.chain_id)
            .then((res) => {
                console.log(res);
                window.location = config.host_url + "/profile/" + this.state.address;
            });
        });
    }

    async isConnected() {
        const { t } = this.props;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        var accounts = await web3.eth.getAccounts();
        if (accounts.length == 0) {
            alert(t("Please connect the wallet"));
            return false;
        }
        return true;
    }

    handleThumbnail() {
        var thumbnail = document.getElementById("thumbnail");
        thumbnail.click();
    }

    onFileUpload() {
        var backend_url = config.backend_url + "/get_image_from_url/" + base64.encode(this.state.image_url) + "/" + this.state.address;
        
        // Request made to the backend api 
        // Send formData object 
        axios.get(backend_url)
        .then((res) => {
            if (res.data.result) {
                this.setState({preview_png: config.preview_url + res.data.filename});
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }

    onFileChanged=event=>{
        const formData = new FormData(); 
     
        // Update the formData object 
        formData.append( 
            "myFile", 
            event.target.files[0], 
            this.state.address + ".png"
        ); 
        
        // Request made to the backend api 
        // Send formData object 
        axios.post(config.backend_url + "/upload_preview", formData)
        .then((res) => {
            if (res.data.result) {
                this.setState({preview_png: config.preview_url + res.data.file_name});
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }

    onNameChanged = event=>{
        this.setState({previewName: event.target.value});
    }

    isElementEnabled(id) {
        var element = document.getElementById(id);
        if (element.classList.contains("btn-ready")) {
            return false;
        }
        return true;
    }

    async uploadImg() {
        const { t } = this.props;

        if (!this.isElementEnabled("upload_token_img")) {
            return false;
        }

        if (this.state.preview_png.includes("null_")) {
            alert(t('Please connect the wallet'));
            return;
        }

        if (!(await this.isCorrectNetwork())) return;

        this.showLoading();

        var previewPaths = this.state.preview_png.split("/");
        
        axios.get(config.backend_url + "/upload_token_img/" + previewPaths[previewPaths.length - 1])
        .then((res) => {console.log(res);
            if (res.data.result == true) {
                if (this.state.protocol_type == CONST.protocol_type.ERC721) {
                    var uploadBtn = document.getElementById("upload_token_img");
                    var deployBtn = document.getElementById("deploy_token");

                    uploadBtn.classList.add("btn-ready");
                    deployBtn.classList.remove("btn-ready");
                } else {
                    var uploadBtn = document.getElementById("upload_erc1155_token_img");
                    var mintBtn = document.getElementById("mint_erc1155_token");

                    uploadBtn.classList.add("btn-ready");
                    mintBtn.classList.remove("btn-ready");
                }

                this.hideLoading();
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }

    handleSwith() {
        if (this.props.type == CONST.token_type.SINGLE) {
            window.location = config.host_url + "/upload/detail/" + CONST.token_type.MULTIPLE;
        } else {
            window.location = config.host_url + "/upload/detail/" + CONST.token_type.SINGLE;
        }
    }

    handleCollectionSelected(index) {
        this.setState({
            selected_collection: index
        });
    }

    handleProtocolType() {
        if (this.state.protocol_type == CONST.protocol_type.ERC1155) {
            this.setState({
                protocol_type: CONST.protocol_type.ERC721
            });

            document.getElementById("chk-erc1155").checked = false;
            document.getElementById("chk-erc721").checked = true;
        } else {
            this.setState({
                protocol_type: CONST.protocol_type.ERC1155
            });

            document.getElementById("chk-erc1155").checked = true;
            document.getElementById("chk-erc721").checked = false;
        }
    }

    handleChainType() {
        if (this.state.chain_id == support_networks.ETHEREUM) {
            this.setState({
                chain_id: support_networks.BSC
            });

            document.getElementById("chk-ethereum").checked = false;
            document.getElementById("chk-bsc").checked = true;
        } else {
            this.setState({
                chain_id: support_networks.ETHEREUM
            });

            document.getElementById("chk-ethereum").checked = true;
            document.getElementById("chk-bsc").checked = false;
        }
    }

    async isValidInput() {
        const { t } = this.props;

        var name = document.getElementById("name").value;
        var description = document.getElementById("description").value;
        var preview_png = document.getElementById("preview_png").src;
        var percentage = document.getElementById("percentage").value;
        var copies = document.getElementById("copies").value;
        
        if (name == "") {
            alert(t("Please input name."));
            return false;
        }

        if (description == "") {
            alert(t("Please input description."));
            return false;
        }

        if (isNaN(copies) || copies <= 0) {
            alert(t("Please input valid copies."));
            return false;
        }

        if (preview_png.includes("default_token.png")) {
            alert(t("Please select token image."));
            return false;
        }

        if (percentage != parseInt(percentage)) {
            alert(t("Fee percentage must be integer."));
            return false;
        }

        if (percentage > 30) {
            alert(t("Maximum fee percentage is 30%."));
            return false;
        }

        if (copies != parseInt(copies)) {
            alert(t("Copies must be integer."));
            return false;
        }

        if (!(await this.isCorrectNetwork())) return false;
        return true;
    }

    handleClosePopup() {
        $(".popup").fadeOut(100);
    }

    async handleCreateItem() {
        if (!(await this.isValidInput())) return;

        if (this.state.protocol_type == CONST.protocol_type.ERC721) {
            $("#erc721_popup").fadeIn(100);
        } else {
            $("#erc1155_popup").fadeIn(100);
        }
    }

    async deployERC1155Token() {
        const { t } = this.props;

        var name = document.getElementById("name").value;
        var description = document.getElementById("description").value;
        var preview_png = document.getElementById("preview_png").src;
        var copies = document.getElementById("copies").value;
        var fee_percentage = document.getElementById("percentage").value;
        var tokenId = Date.now();

        this.setState({
            erc1155_token_id: tokenId
        });

        var token = {
            deployer: this.state.address,
            name: name,
            description: description,
            fee_percentage: fee_percentage,
            contract_address: network_util.get_erc1155(this.state.chain_id),
            token_id: tokenId,
            collection: this.state.selected_collection,
            copies: copies
        };

        if (!this.isElementEnabled("mint_erc1155_token")) {
            return false;
        }

        if (!await this.isConnected()) return;
        
        var previewPaths = this.state.preview_png.split("/");

        if (!(await this.isCorrectNetwork())) return;

        this.showLoading();

        var provider = await provider_util.get_current_provider();
        var web3 = new Web3(provider);

        const NFT = new web3.eth.Contract(ERC1155, network_util.get_erc1155(this.state.chain_id));

        var metadata = {
            url: config.token_url + previewPaths[previewPaths.length - 1],
            description: document.getElementById("description").value,
            name: name
        };

        var distributions = [{
            recipient: this.state.address,
            value: 100
        }];

        NFT.methods.mint(tokenId, [[this.state.address, 100]], copies, JSON.stringify(metadata)).send({from: this.state.address})
        .on('error', () => this.callbackError(t('An error occured while minting tokens.')))
        .on('receipt', function(receipt){
            console.log(receipt);
        })
        .then((res) => {
            console.log(res);

            API.add_erc1155_token(token, metadata, this.state.chain_id)
            .then((res) => {
                console.log(res);
                if (res.result) {
                    var mintBtn = document.getElementById("mint_erc1155_token");
                    var feeBtn = document.getElementById("set_erc1155_fee");
    
                    mintBtn.classList.add("btn-ready");
                    feeBtn.classList.remove("btn-ready");

                    this.hideLoading();
                } else {
                    this.callbackError(t('An error occured while minting tokens.'));
                }
            });
        });
    }

    async setERC1155TokenFee() {
        const { t } = this.props;
        var fee_percentage = document.getElementById("percentage").value;

        if (!this.isElementEnabled("set_erc1155_fee")) {
            return false;
        }

        if (!await this.isConnected()) return;

        if (!(await this.isCorrectNetwork())) return;

        this.showLoading();

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        const NFT = new web3.eth.Contract(ERC1155, network_util.get_erc1155(this.state.chain_id));

        NFT.methods.setCopyRightFee(this.state.erc1155_token_id, fee_percentage).send({from: this.state.address})
        .on('error', () => this.callbackError(t('An error occured while setting fee of tokens.')))
        .on('receipt', function(receipt){
            console.log(receipt);
        })
        .then((res) => {
            console.log(res);

            window.location = config.host_url + "/profile/" + this.state.address;
        });
    }

    async isCorrectNetwork() {
        const { t } = this.props;

        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);

        var chain_id = await web3.eth.net.getId();
        if (chain_id != this.state.chain_id) {
            alert(t('Please select correct network.'));
            return false;
        }

        return true;
    }

    render() {
        const { t } = this.props;

        var style_hidden = {display: 'none'};
        var style_selected = {
            borderWidth: '2px',
            borderColor: 'darkgray',
            borderStyle: 'solid'
        };

        return (
            <div>
                <section id="upload-item-content" className="upload-item-content">
                    <div className="content">
                        <div className="upload-item-content-wrapper">
                            <main>
                                <div className="uic-main-head">
                                    <h2 className="uic-main-head-ttl">{this.props.type == CONST.token_type.SINGLE? t("Create single collectible"): t("Create multiple collectible")}</h2>
                                    <a className="btn btn-h48 btn-switch-mode" onClick={() => this.handleSwith()}><span className="txt">{switch_btn_text}</span></a>
                                </div>

                                <div className="uic-main-body">
                                    <div className="uic-main-item mb-40">
                                        <p className="uic-main-item-ttl">{t("Upload file")}</p>
                                        <p className="uic-main-item-txt">{t("Drag or choose your file to upload")}</p>
                                        <div className="uic-main-item-field-upload mt-16" onClick={this.handleThumbnail}>
                                            <div className="uic-main-item-field-upload-inner">
                                                <div className="uic-main-item-field-upload-icon">
                                                    <i className="fas fa-file-upload"></i>
                                                </div>
                                                <p className="uic-main-item-field-upload-txt">{t('Please select image file.')}</p>
                                                <input id="thumbnail" accept="image/*" type="file" style={{display: "none"}} onChange={this.onFileChanged}/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="uic-main-item uic-main-item-detail">
                                        <p className="uic-main-item-ttl">{t('Item Details')}</p>
                                        <div className="uic-main-item-field-detail">
                                            <p className="uic-main-item-field-detail-ttl">{t('ITEM NAME')}</p>
                                            <input id="name" type="text" placeholder="e.g. &#34;Art that expresses the universe&#34;" onChange={this.onNameChanged}/>
                                        </div>
                                        <div className="uic-main-item-field-detail">
                                            <p className="uic-main-item-field-detail-ttl">{t('DESCRIPTION')}</p>
                                            <textarea disabled id="description" type="text" placeholder="e.g. &#34;This is a Non Fungible Token of art that geometrically represents the universe.&#8230;&#34;"/>
                                        </div>
                                        <div className="uic-main-item-field-detail">
                                            <div className="uic-main-item-field-detail-row">
                                                <div className="uic-main-item-field-detail-col">
                                                    <p className="uic-main-item-field-detail-ttl">{t('Fee Percentage')}</p>
                                                    <div className="fee-percentage">
                                                        <input id="percentage" type="number" defaultValue="1" min="0" max="30"/>
                                                        <p>%</p>
                                                    </div>
                                                </div>
                                                <div className="uic-main-item-field-detail-col" style={this.props.type == CONST.token_type.SINGLE? style_hidden: {}}>
                                                    <p className="uic-main-item-field-detail-ttl">{t('Copies')}</p>
                                                    <input id="copies" type="number" min="1" defaultValue="1" placeholder="e.g. Copies"/>
                                                </div>
                                                {/* <div className="uic-main-item-field-detail-col">
                                                    <p className="uic-main-item-field-detail-ttl">PROPERIE</p>
                                                    <input type="text" placeholder="e.g. Propertie"/>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="uic-main-item">
                                        <p className="uic-main-item-ttl">{t('ERC/BEP 1155 Token')}</p>
                                        <p className="uic-main-item-txt">{t('You will create your nft token using ERC/BEP 1155 token protocol.')}</p>
                                        <div className="uic-main-item-field-check">
                                            <input id="chk-erc1155" type="checkbox" defaultChecked={this.state.protocol_type == CONST.protocol_type.ERC1155} onClick={() => this.handleProtocolType()}/>
                                            <label htmlFor="chk-erc1155"></label>
                                        </div>
                                    </div>

                                    <div className="uic-main-item">
                                        <p className="uic-main-item-ttl">{t('ERC/BEP 721 Token')}</p>
                                        <p className="uic-main-item-txt">{t('You will create your nft token using ERC/BEP 721 token protocol.')}</p>
                                        <div className="uic-main-item-field-check">
                                            <input id="chk-erc721" type="checkbox" defaultChecked={this.state.protocol_type == CONST.protocol_type.ERC721} onClick={() => this.handleProtocolType()}/>
                                            <label htmlFor="chk-erc721"></label>
                                        </div>
                                    </div>

                                    <div className="uic-main-item">
                                        <p className="uic-main-item-ttl">Ethereum</p>
                                        <p className="uic-main-item-txt">{t('You will create your nft token on ethereum.')}</p>
                                        <div className="uic-main-item-field-check">
                                            <input id="chk-ethereum" type="checkbox" defaultChecked={this.state.chain_id == support_networks.ETHEREUM} onClick={() => this.handleChainType()}/>
                                            <label htmlFor="chk-ethereum"></label>
                                        </div>
                                    </div>

                                    <div className="uic-main-item">
                                        <p className="uic-main-item-ttl">Binance Smart Chain</p>
                                        <p className="uic-main-item-txt">{t('You will create your nft token on binance smart chain.')}</p>
                                        <div className="uic-main-item-field-check">
                                            <input id="chk-bsc" type="checkbox" defaultChecked={this.state.chain_id == support_networks.BSC} onClick={() => this.handleChainType()}/>
                                            <label htmlFor="chk-bsc"></label>
                                        </div>
                                    </div>

                                    {/* <div className="uic-main-item">
                                        <p className="uic-main-item-ttl">Unlock once purchased</p>
                                        <p className="uic-main-item-txt">Content will be unlocked after successful transaction</p>
                                        <div className="uic-main-item-field-check">
                                            <input id="uic-chk-03" type="checkbox" />
                                            <label htmlFor="uic-chk-03"></label>
                                        </div>
                                    </div> */}

                                    <div className="uic-main-item mb-40">
                                        <p className="uic-main-item-ttl">{t('Choose collection')}</p>
                                        <p className="uic-main-item-txt">{t('Choose an existing collection.')}</p>
                                        <div className="uic-main-item-field-collection-wrapper">
                                            <div className="uic-main-item-field-collection">
                                                {/* <div className="uic-main-item-field-collection-item">
                                                    <div className="uic-main-item-field-collection-item-icon cat-01"><i className="fas fa-plus"></i></div>
                                                    <p className="uic-main-item-field-collection-item-txt">Create<br/>collection</p>
                                                </div> */}
                                                {
                                                    this.state.collections.map((item, index) => {
                                                        var collection_img = icon_art;

                                                        switch(index) {
                                                            case 0: 
                                                                collection_img = icon_art;
                                                                break;
                                                            case 1: 
                                                                collection_img = icon_photograph;
                                                                break;
                                                            case 2: 
                                                                collection_img = icon_asset;
                                                                break;
                                                            case 3: 
                                                                collection_img = icon_manga;
                                                                break;
                                                            case 4: 
                                                                collection_img = icon_sns;
                                                                break;
                                                        }

                                                        return (
                                                            <div className="uic-main-item-field-collection-item" style={this.state.selected_collection == index + 1? style_selected: {}} onClick={() => this.handleCollectionSelected(index + 1)}>
                                                                <div className="uic-main-item-field-collection-item-icon">
                                                                    <img src={collection_img} />
                                                                </div>
                                                                <p className="uic-main-item-field-collection-item-txt">{item.name}</p>
                                                            </div>
                                                        )
                                                    })
                                                }
                                                {/* <div className="uic-main-item-field-collection-item" style={this.state.selected_collection == 1? style_selected: {}} onClick={() => this.handleCollectionSelected(1)}>
                                                    <div className="uic-main-item-field-collection-item-icon cat-02"></div>
                                                    <p className="uic-main-item-field-collection-item-txt">{this.state.collections.length == 0? "Crypto Legen - Professor": this.state.collections[0].name}</p>
                                                </div>
                                                <div className="uic-main-item-field-collection-item" style={this.state.selected_collection == 2? style_selected: {}} onClick={() => this.handleCollectionSelected(2)}>
                                                    <div className="uic-main-item-field-collection-item-icon cat-03"></div>
                                                    <p className="uic-main-item-field-collection-item-txt">{this.state.collections.length == 0? "Crypto Legen - Professor": this.state.collections[1].name}</p>
                                                </div>
                                                <div className="uic-main-item-field-collection-item" style={this.state.selected_collection == 3? style_selected: {}} onClick={() => this.handleCollectionSelected(3)}>
                                                    <div className="uic-main-item-field-collection-item-icon cat-04"></div>
                                                    <p className="uic-main-item-field-collection-item-txt">{this.state.collections.length == 0? "Legend Photography": this.state.collections[2].name}</p>
                                                </div> */}
                                            </div>
                                        </div>

                                        <div className="uic-main-item-field-collection-wrapper">
                                            <div className="uic-main-item-field-collection">
                                                <a className="uic-main-item-field-collection-item" href={config.host_url + "/upload/twitter/" + this.props.type}>
                                                    <div className="uic-main-item-field-collection-item-icon">
                                                        <img src={icon_twitter} />
                                                    </div>
                                                    <p className="uic-main-item-field-collection-item-txt">{t('Twitter')}</p>
                                                </a>
                                                <a className="uic-main-item-field-collection-item" href={config.host_url + "/upload/youtube/" + this.props.type}>
                                                    <div className="uic-main-item-field-collection-item-icon">
                                                        <img src={icon_youtube} />
                                                    </div>
                                                    <p className="uic-main-item-field-collection-item-txt">{t('Youtube')}</p>
                                                </a>
                                                <a className="uic-main-item-field-collection-item" href={config.host_url + "/upload/tiktok/" + this.props.type}>
                                                    <div className="uic-main-item-field-collection-item-icon">
                                                        <img src={icon_tiktok} />
                                                    </div>
                                                    <p className="uic-main-item-field-collection-item-txt">{t('TikTok')}</p>
                                                </a>
                                                <a className="uic-main-item-field-collection-item" href={config.host_url + "/upload/instagram/" + this.props.type}>
                                                    <div className="uic-main-item-field-collection-item-icon">
                                                        <img src={icon_insta} />
                                                    </div>
                                                    <p className="uic-main-item-field-collection-item-txt">{t('Instagram')}</p>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ui-main-submit-row">
                                        <a id="btn-preview" className="btn btn-full btn-h48 mb-12" href="#">
                                            <span className="txt">{t("Preview")}</span>
                                        </a>
                                        <a id="btn-create-item" className="btn btn-blue btn-h48" onClick={() => this.handleCreateItem()}>
                                            <span className="txt">{t("Create item")}</span>
                                            <span className="ico"><i className="fas fa-long-arrow-alt-right"></i></span>
                                        </a>
                                        <div className="ui-main-submit-progress" style={{display: "none"}}>
                                            <span>Auto Saving</span>
                                            <i className="fas fa-spinner"></i>
                                        </div>
                                    </div>
                                </div>
                            </main>
                            <aside>
                                <div className="uic-preview-box">
                                    <div className="uic-preview-ttl-wrapper">
                                        <p className="uic-preview-ttl">{t('Preview')}</p>
                                        <div id="btn-uic-preview-close" className="uic-preview-close"><i className="fas fa-times"></i></div>
                                    </div>
                                    <div className="uic-preview-figure">
                                        <img id="preview_png" src={this.state.preview_png} alt="" />
                                    </div>
                                    <div className="uic-preview-infos info-block-tsb">
                                        <div className="ttl">
                                            <p className="name">{this.state.previewName}</p>
                                            <p className="ttl-mark eth-mark">0.27 ETH</p>
                                        </div>
                                        <div className="stock">
                                            <div className="stock-icons">
                                                {/* <div className="stock-icon">
                                                    <img src={icon_avatar_01} alt=""/>
                                                </div>
                                                <div className="stock-icon">
                                                    <img src={icon_avatar_01} alt=""/>
                                                </div>
                                                <div className="stock-icon">
                                                    <img src={icon_avatar_01} alt=""/>
                                                </div> */}
                                            </div>
                                            <p className="stock-txt">{t('in Stock', {count: 3})}</p>
                                        </div>
                                        <div className="bottom">
                                            <div className="bottom-l">
                                                <span className="icon"><i className="fas fa-sliders-h"></i></span>
                                                <span className="txt">{t('Highest bid')}</span>
                                                <span className="price">0.001 ETH</span>
                                            </div>
                                            {/* <div className="bottom-r">
                                                New Bid<span><img src={icon_fire}/></span>
                                            </div> */}
                                        </div>
                                    </div>
                                    <a className="uic-preview-close-all" onClick={() => window.location.reload()}>
                                        <span className="ico"><i className="far fa-times-circle"></i></span>
                                        <span className="txt">{t('Clear all')}</span>
                                    </a>
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>

                <div id="erc721_popup" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Flow Steps')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close" onClick={() => this.handleClosePopup()}>
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-file-upload"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Upload file')}</p>
                                        <p className="popup-item-info-txt">{t('Upload token image.')}</p>
                                    </div>
                                </div>
                                <a id="upload_token_img" className="btn btn-full btn-blue" onClick={this.uploadImg.bind(this)}><span className="txt">{t('Start now')}</span></a>
                            </div>

                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-pencil-alt"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Deploy')}</p>
                                        <p className="popup-item-info-txt">{t('Deploy NFT Token.')}</p>
                                    </div>
                                </div>
                                <a id="deploy_token" className="btn btn-blue btn-full btn-ready" onClick={this.deployToken.bind(this)}><span className="txt">{t('Start now')}</span></a>
                            </div>

                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-lock"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Mint')}</p>
                                        <p className="popup-item-info-txt">{t('Mint NFT Token.')}</p>
                                    </div>
                                </div>
                                <a id="mint_token" className="btn btn-blue btn-full btn-ready" onClick={this.mintAll.bind(this)}><span className="txt">{t('Start now')}</span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="erc1155_popup" className="popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Flow Steps')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close" onClick={() => this.handleClosePopup()}>
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-file-upload"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Upload file')}</p>
                                        <p className="popup-item-info-txt">{t('Upload token image.')}</p>
                                    </div>
                                </div>
                                <a id="upload_erc1155_token_img" className="btn btn-full btn-blue" onClick={this.uploadImg.bind(this)}><span className="txt">{t('Start now')}</span></a>
                            </div>

                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-pencil-alt"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Mint')}</p>
                                        <p className="popup-item-info-txt">{t('Mint NFT Token.')}</p>
                                    </div>
                                </div>
                                <a id="mint_erc1155_token" className="btn btn-blue btn-full btn-ready" onClick={this.deployERC1155Token.bind(this)}><span className="txt">{t('Start now')}</span></a>
                            </div>

                            <div className="popup-item">
                                <div className="popup-item-row">
                                    <div className="popup-item-icon"><i className="fas fa-lock"></i></div>
                                    <div className="popup-item-info">
                                        <p className="popup-item-info-ttl">{t('Fee Percentage')}</p>
                                        <p className="popup-item-info-txt">{t("Set token's fee percentage.")}</p>
                                    </div>
                                </div>
                                <a id="set_erc1155_fee" className="btn btn-blue btn-full btn-ready" onClick={this.setERC1155TokenFee.bind(this)}><span className="txt">{t('Start now')}</span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="loading-popup" className="popup">
                    <div className="popup-box">
                        <div className="loading-popup-head">
                            <div className="loader"></div>
                            <p className="loading-popup-head-ttl">{t('Please wait...')}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(UploadSNSDetail);