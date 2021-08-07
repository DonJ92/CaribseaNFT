import React, { useState } from 'react';
import '../styles/style.css';
import constants from '../globals/constants';
import ls from 'local-storage';
import { useWallet } from 'use-wallet'
import Web3 from 'web3';
import * as API from '../adapter/api';
import BalanceUtil from '../common/balance_util';
import TimeUtil from '../common/time_util';
import CONST from '../globals/constants';
import AssetUtil from '../common/asset_util';
import {AddClass, ChangeClass} from '../js/common';
import $ from 'jquery';
import WalletConnectProvider from "@walletconnect/web3-provider";
import provider_util from '../common/provider_util';

import logo from '../img/logo.png';
import icon_notice from '../img/icon-notice.svg';
import icon_ball from '../img/profile/ball.png';
import icon_bnb from '../img/common/icon-bnb.png';
import config from '../globals/config';
import img_metamask from '../img/connect-wallet/metamask.png';
import img_walletconnect from '../img/connect-wallet/walletconnect.png';
import { render } from '@testing-library/react';
import { withTranslation } from 'react-i18next';
import support_networks from '../globals/support_networks';

class Header extends React.Component {
    constructor(props) {
        super(props);

        AddClass('has-popup');

        this.state = {
            selected_address: null,
            balance: 0,
            chainId: 1,
            profile: null,
            activities: [],
        };

        // if (window.web3 !== undefined) {
        //     const web3 = new Web3(Web3.givenProvider);
        //     web3.eth.net.getId().then((res) => {
        //         this.setState({
        //             chainId: res
        //         });
        //     });
    
        //     this.getAccounts();
        // }console.log('constructor');

        this.getAccounts();
    }

    async getAccounts() {
        var provider = await provider_util.get_current_provider();

        if (provider == null) {
            return;
        }

        const web3 = new Web3(provider);
        web3.eth.net.getId().then((res) => {
            this.setState({
                chainId: res
            });
        });

        web3.eth.getAccounts((error,result) => {
            if (error) {
                console.log(error);
            } else {
                if (result.length < 1) {
                    this.setState({
                        selected_address: null
                    });
                } else {
                    this.setState({
                        selected_address: result[0]
                    });

                    web3.eth.getBalance(this.state.selected_address, (err, balance) => {
                        if (balance != null) {
                            this.setState({
                                balance: web3.utils.fromWei(balance, "ether")
                            });
                        }
                    });

                    API.get_profile(this.state.selected_address)
                    .then((res) => {
                        if (res.result == true) {
                            this.setState({
                                profile: JSON.parse(res.profile)
                            });
                        }
                    });

                    this.getMyActivity();
                }
            }
        });
    }

    getMyActivity() {
        API.get_my_activity(this.state.selected_address)
        .then((res) => {
            console.log(res);
            this.setState({
                activities: res.activities
            });
        })
    }

    async Disconnect() {
        if (ls.get(constants.local_storage_key.wallet_type) == constants.wallet_type.WALLETCONNECT) {
            var provider = provider_util.get_current_provider();
            await provider.disconnect();
        }
        ls.set(constants.local_storage_key.KEY_CONNECTED, 0);
        ls.set(constants.local_storage_key.KEY_WALLET_CONNECT, null);
        ls.set(constants.local_storage_key.KEY_WALLET_TYPE, 0);
        window.location.reload();
    }

    Profile() {
        API.get_profile(this.state.selected_address)
        .then((res) => {
            if (res.result == true) {
                window.location = config.host_url + '/profile/' + this.state.selected_address;
            } else {
                window.location = config.host_url + '/edit_profile';
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }

    handleUpload() {
        if (this.state.selected_address == null || !this.isConnected()) {
            const { t } = this.props;
            alert(t('Please connect the wallet'));
        } else {
            document.location=config.host_url + "/upload/type";
        }
    }

    onAvatarError(ev){
        ev.target.src = config.avatar_url + "default.png"
    }

    handleSearch() {
        var keyword = document.getElementById("keyword").value;

        if (keyword == "") return;

        window.location = config.host_url + "/search_keyword/" + keyword;
    }

    onAvatarError(ev){
        ev.target.src = config.avatar_url + "default.png"
    }

    handleConnectWallet() {
        $("#popup-connect-wallet").fadeIn(100);
    }

    Connect_metamask() {
        const { t } = this.props;
        
        if (window.ethereum == undefined) {
            alert(t("Please install metamask"));
            return;
        }

        if (parseInt(window.ethereum.chainId) != support_networks.ETHEREUM && parseInt(window.ethereum.chainId) != support_networks.BSC) {
            alert(t("Please select ethereum or bsc network on metamask"));
            return false;
        }

        window.ethereum.enable()
        .then((res) => {
            ls.set(constants.local_storage_key.KEY_CONNECTED, 1);
            ls.set(constants.local_storage_key.KEY_WALLET_TYPE, constants.wallet_type.METAMASK);
            window.location.reload();
        })
        .catch((err) => {
            ls.set(constants.local_storage_key.KEY_CONNECTED, 0);
            ls.set(constants.local_storage_key.KEY_WALLET_CONNECT, null);
            ls.set(constants.local_storage_key.KEY_WALLET_TYPE, 0);
        });
    }

    async WCConnect() {
        try {
            //  Create WalletConnect Provider
            const provider = new WalletConnectProvider({
                infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
                rpc: {
                    // 1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
                    3: "https://ropsten.mycustomnode.com",
                    97: "https://data-seed-prebsc-1-s1.binance.org:8545"
                    }
            });
    
            provider.onConnect(() => {
                ls.set(constants.local_storage_key.KEY_CONNECTED, 1);
                ls.set(constants.local_storage_key.KEY_WALLET_TYPE, constants.wallet_type.WALLETCONNECT);
                document.location.reload();

                // const web3 = new Web3(provider);
                // web3.eth.net.getId().then((res) => {
                //     this.setState({
                //         chainId: res
                //     });
                // });
                
                // this.getAccounts();
            });
    
            provider.onDisconnect(() => {
                ls.set(constants.local_storage_key.KEY_CONNECTED, 0);
                ls.set(constants.local_storage_key.KEY_WALLET_TYPE, constants.wallet_type.NONE);
                document.location.reload();
            })

            provider.on('error', (err) => {
                console.log(err);

                provider.disconnect();
            })
        
            //  Enable session (triggers QR Code modal)
            await provider.enable();
        } catch (err) {
            console.log(err);
        }
    }

    handleConnectWalletDesc() {
        $(".popup").fadeOut(100);
        $("#popup-connect-wallet-desc").fadeIn(100);
    }

    registerSearchEnterKeyEvent = (event) => {
        if (event.key === 'Enter') {
            this.handleSearch();
            return false;
        }
    }

    isConnected() {
        if (this.state.chainId == support_networks.ETHEREUM || this.state.chainId == support_networks.BSC) {
            return true;
        }
        return false;
    }

    render() {
        const { t } = this.props;

        var style_hidden = {display: 'none'};
        var style_none = {};

        var is_activity_mark = false;
        for (var i = 0; i < this.state.activities.length; i++) {
            if (this.state.activities[i].from_address == this.state.selected_address && this.state.activities[i].from_status == CONST.ACTIVITY_STATUS.NOT_READ) {
                is_activity_mark = true;
                break;
            } else if (this.state.activities[i].to_address == this.state.selected_address && this.state.activities[i].to_status == CONST.ACTIVITY_STATUS.NOT_READ){
                is_activity_mark = true;
                break;
            }
        }

        var sample_activities = this.state.activities.slice(0, 4);

        return (
            <header id="header">
                <div className="site-header">
                    <div className="site-header-l">
                        <h1 className="logo">
                            <a href={config.host_url + "/"}>
                                <img src={logo} alt="" />
                            </a>
                        </h1>
                        <div className="shl-links">
                            <a className="shl-link-item" href={config.host_url + "/search"}><span>{t('Discover')}</span></a>
                            <a className="shl-link-item" href="#"><span>{t('How it work')}</span></a>
                        </div>
                    </div>

                    <div className="site-header-r">
                        <div className="shr-search">
                            <div className="shr-search-wrapper">
                                <input type="text" name="keyword" id="keyword" placeholder={t('Search')} onKeyDown={this.registerSearchEnterKeyEvent}/>
                                <div className="btn-head-search" onClick={() => this.handleSearch()}><i className="fas fa-search"></i></div>
                            </div>
                        </div>
                        <div className="shr-notice-wrapper">
                            <div id="btn-show-notice-popup" className="shr-notice">
                                <img src={icon_notice} alt="" />
                                <span className="new" style={is_activity_mark? {}: style_hidden}></span>
                            </div>
                            <div id="shr-notice-popup" className="shr-notice-popup">
                                <div className="shr-notice-head">
                                    <p className="shr-notice-head-ttl">{t('Notification')}</p>
                                    <a className="btn btn-h40 btn-blue btn-fs-14" href={config.host_url + "/activity"}><span className="txt">{t('See all')}</span></a>
                                </div>

                                <div className="shr-notice-list" style={sample_activities.length != 0? {}: style_hidden}>
                                    {
                                        sample_activities.map((item, index) => {
                                            var title = "";
                                            var description = "";
                                            var img_src = "";
                                            if (item.metadata != null) {
                                                img_src = JSON.parse(item.metadata).url;
                                            }

                                            switch(item.activity_type) {
                                                case CONST.ACTIVITY_TYPE.MINT:
                                                    title = t("Mint");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t('Mint ERC721 Token', {token_name: item.token_name, token_id: item.token_id});
                                                    } else {
                                                        description = t('Mint ERC1155 Token', {token_name: item.token_name, token_cnt: item.token_cnt});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.TRANSFER:
                                                    title = t("Transfer");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        if (item.from_address == this.state.address) {
                                                            description = t('Transferred ERC721 Token to', {token_name: item.token_name, token_id: item.token_id, name: item.to_name});
                                                        } else {
                                                            description = t('Transferred ERC721 Token from', {token_name: item.token_name, token_id: item.token_id, name: item.from_name});
                                                        }
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        if (item.from_address == this.state.address) {
                                                            description = t('Transferred ERC1155 Token to', {token_name: item.token_name, token_cnt: item.token_cnt, name: item.to_name});
                                                        } else {
                                                            description = t('Transferred ERC1155 Token from', {token_name: item.token_name, token_cnt: item.token_cnt, name: item.from_name});
                                                        }
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.LIST_FIXED_SIZE:
                                                    title = t("List for sell");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        if (item.chain_id == support_networks.ETHEREUM) {
                                                            description = t('Listed ERC721 fixed price ETH', {token_name: item.token_name, token_id: item.token_id, amount: item.amount});
                                                        } else if (item.chain_id == support_networks.BSC) {
                                                            description = t('Listed ERC721 fixed price BNB', {token_name: item.token_name, token_id: item.token_id, amount: item.amount});
                                                        }
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        if (item.chain_id == support_networks.ETHEREUM) {
                                                            description = t('Listed ERC1155 fixed price ETH', {token_name: item.token_name, token_id: item.token_cnt, amount: item.amount});
                                                        } else if (item.chain_id == support_networks.BSC) {
                                                            description = t('Listed ERC1155 fixed price BNB', {token_name: item.token_name, token_id: item.token_cnt, amount: item.amount});
                                                        }
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.LIST_AUCTION:
                                                    title = t("List for sell");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t('Listed ERC721 auction', {token_name: item.token_name, token_id: item.token_id, amount: item.amount, asset: AssetUtil.get_asset_by_id(item.asset_id)});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t('Listed ERC1155 auction', {token_name: item.token_name, token_cnt: item.token_cnt, amount: item.amount, asset: AssetUtil.get_asset_by_id(item.asset_id)});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.UNLIST:
                                                    title = t("Remove from sell");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t('Removed ERC721 from sell', {token_name: item.token_name, token_id: item.token_id});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t('Removed ERC1155 from sell', {token_name: item.token_name, token_cnt: item.token_cnt});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.BID:
                                                    title = t("BID");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t('BID ERC721', {token_name: item.token_name, token_id: item.token_id, amount: item.amount, asset: AssetUtil.get_asset_by_id(item.asset_id)});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t('BID ERC1155', {token_name: item.token_name, token_cnt: item.token_cnt, amount: item.amount, asset: AssetUtil.get_asset_by_id(item.asset_id)});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.EXCHANGE:
                                                    title = t("Exchange");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t('Exchanged ERC721', {token_name: item.token_name, token_id: item.token_id, amount: item.amount, asset: AssetUtil.get_asset_by_id(item.asset_id)});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t('Exchanged ERC1155', {token_name: item.token_name, token_cnt: item.token_cnt, amount: item.amount, asset: AssetUtil.get_asset_by_id(item.asset_id)});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.BUY:
                                                    title = t("BUY");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        if (item.from_address == this.state.address) {
                                                            if (item.chain_id == support_networks.ETHEREUM) {
                                                                description = t('Sold ERC721 token', {token_name: item.token_name, token_id: item.token_id, opponent: item.to_name, amount: item.amount, asset: 'ETH'});
                                                            } else if (item.chain_id == support_networks.BSC) {
                                                                description = t('Sold ERC721 token', {token_name: item.token_name, token_id: item.token_id, opponent: item.to_name, amount: item.amount, asset: 'BNB'});
                                                            }
                                                        } else {
                                                            if (item.chain_id == support_networks.ETHEREUM) {
                                                                description = t('Bought ERC721 token', {token_name: item.token_name, token_id: item.token_id, opponent: item.from_name, amount: item.amount, asset: 'ETH'});
                                                            } else if (item.chain_id == support_networks.BSC) {
                                                                description = t('Bought ERC721 token', {token_name: item.token_name, token_id: item.token_id, opponent: item.from_name, amount: item.amount, asset: 'BNB'});
                                                            }
                                                        }
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        if (item.from_address == this.state.address) {
                                                            if (item.chain_id == support_networks.ETHEREUM) {
                                                                description = t('Sold ERC1155 token', {token_name: item.token_name, token_cnt: item.token_cnt, opponent: item.to_name, amount: item.amount, asset: 'ETH'});
                                                            } else if (item.chain_id == support_networks.BSC) {
                                                                description = t('Sold ERC1155 token', {token_name: item.token_name, token_cnt: item.token_cnt, opponent: item.to_name, amount: item.amount, asset: 'BNB'});
                                                            }
                                                        } else {
                                                            if (item.chain_id == support_networks.ETHEREUM) {
                                                                description = t('Bought ERC1155 token', {token_name: item.token_name, token_cnt: item.token_cnt, opponent: item.from_name, amount: item.amount, asset: 'ETH'});
                                                            } else if (item.chain_id == support_networks.BSC) {
                                                                description = t('Bought ERC1155 token', {token_name: item.token_name, token_cnt: item.token_cnt, opponent: item.from_name, amount: item.amount, asset: 'BNB'});
                                                            }
                                                        }
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.SELF_CANCEL:
                                                    title = t("Cancel bid");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t('Cancelled your bid of ERC721', {token_name: item.token_name, token_id: item.token_id});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t('Cancelled your bid of ERC1155', {token_name: item.token_name, token_cnt: item.token_cnt});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.CANCEL:
                                                    title = t("Auction end");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t("Auction ended ERC721", {token_name: item.token_name, token_id: item.token_id});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t("Auction ended ERC1155", {token_name: item.token_name, token_cnt: item.token_cnt});
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.FOLLOW:
                                                    title = t("Follow");
                                                    if (item.from_address == this.state.address) {
                                                        description = t("Started to follow", {name: item.to_name});
                                                        img_src = config.avatar_url + item.to_address + ".png";
                                                    } else {
                                                        description = t("Followed from", {name: item.from_name});
                                                        img_src = config.avatar_url + item.from_address + ".png";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.UNFOLLOW:
                                                    title = t("Unfollow");
                                                    if (item.from_address == this.state.address) {
                                                        description = t("Unfollowed from me", {name: item.to_name});
                                                        img_src = config.avatar_url + item.to_address + ".png";
                                                    } else {
                                                        description = t("Unfollowed to me", {name: item.from_name});
                                                        img_src = config.avatar_url + item.from_address + ".png";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.STAKE:
                                                    title = t("Stake");
                                                    description = t("Staked", {token_name: item.token_name, token_id: item.token_id});
                                                    break;
                                                case CONST.ACTIVITY_TYPE.REVOKE:
                                                    title = t("Revoke");
                                                    description = t("Revoked", {token_name: item.token_name, token_id: item.token_id});
                                                    break;
                                                case CONST.ACTIVITY_TYPE.BURN:
                                                    title = t("Burn");
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = t('Burned ERC721', {token_name: item.token_name, token_id: item.token_id});
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = t('Burned ERC1155', {token_name: item.token_name, token_cnt: item.token_cnt});
                                                    }
                                                    break;
                                            }

                                            return (
                                                <a className={item.from_status == CONST.ACTIVITY_STATUS.READ? "shr-notice-item": "shr-notice-item unread"} href="#">
                                                    <div className="shr-notice-item-icon">
                                                        <img src={img_src} onError={this.onAvatarError} alt="" />
                                                    </div>
                                                    <div className="shr-notice-item-infos">
                                                        <p className="shr-notice-infos-ttl">{title}</p>
                                                        <p className="shr-notice-infos-txt">{description}</p>
                                                        <p className="shr-notice-infos-date">{TimeUtil.format_datetime(item.created_at)}</p>
                                                    </div>
                                                </a>
                                            )
                                        })
                                    }
                                </div>
                                <div className="shr-notice-list" style={sample_activities.length == 0? {}: style_hidden}>
                                    There's no notification.
                                </div>
                            </div>
                        </div>
                        <div className="shr-links">
                            <a className="btn btn-blue btn-h48 btn-mr12 btn-upload" onClick={() => this.handleUpload()}><span>{t('Upload')}</span></a>
                            <div>
                                <a className="btn btn-h48" onClick={() => this.handleConnectWallet()} style={ls.get(constants.local_storage_key.KEY_CONNECTED) == null || ls.get(constants.local_storage_key.KEY_CONNECTED) == 0 || this.state.selected_address == null || !this.isConnected()? style_none: style_hidden}><span>{t('Connect Wallet')}</span></a>
                                <div className="btn-show-user-profile-popup-wrapper" style={ls.get(constants.local_storage_key.KEY_CONNECTED) == 1 && this.state.selected_address != null && this.isConnected()? style_none: style_hidden}>
                                    <div id="btn-show-user-profile-popup">
                                        <span className="ico"><img src={config.avatar_url + (this.state.profile == null || this.state.profile.has_avatar == 0? "default": this.state.profile.address) + ".png"} onError={this.onAvatarError} alt="" /></span>
                                        <span className="balance">{parseFloat(this.state.balance).toFixed(4)}</span>
                                        <span className="unit">{this.state.chainId == support_networks.ETHEREUM? "ETH": "BNB"}</span>
                                    </div>
                                    <div id="shr-user-profile-popup" className="shr-user-profile-popup">
                                        <p className="shr-upp-name">{this.state.profile == null? "XXX": this.state.profile.name}</p>
                                        <p className="shr-upp-token">
                                            {this.state.selected_address == null? 'XXX': this.state.selected_address.slice(0,14) + '...' + this.state.selected_address.slice(38,42)}
                                            <span><img src={icon_ball} alt="" onClick={() => navigator.clipboard.writeText(this.state.selected_address)}/></span>
                                        </p>
                                        <div className="shr-upp-balance">
                                            <div className="shr-upp-balance-info">
                                                <div className="shr-upp-balance-info-icon">
                                                    <img src={icon_bnb} alt="" />
                                                </div>
                                                <div className="shr-upp-balance-info-desc">
                                                    <p className="shr-upp-balance-info-ttl-sub">{t('Balance')}</p>
                                                    <p className="shr-upp-balance-info-ttl">{BalanceUtil.format_balance(this.state.balance, this.state.chainId == support_networks.ETHEREUM? "ETH": 'BNB')}</p>
                                                </div>
                                            </div>
                                            <a className="shr-upp-balance-link btn btn-h32 btn-full btn-fs-14" onClick={() => document.location = config.blockexplorer_url + "address/" + this.state.selected_address}><span className="txt">{t('See on')} {window.ethereum == undefined || window.ethereum.chainId == support_networks.ETHEREUM? "Ethereum": "BSC"}</span></a>
                                        </div>
                                        <a className="shr-upp-link-page" onClick={() => this.Profile()}>
                                            <span className="ico"><i className="far fa-user"></i></span>
                                            {t('My Profile')}
                                        </a>
                                        {/* <a className="shr-upp-link-page" href="#">
                                            <span className="ico"><i className="far fa-image"></i></span>
                                            My items
                                        </a> */}
                                        {/* <a className="shr-upp-link-page" href="#">
                                            <span className="ico"><i className="far fa-lightbulb"></i></span>
                                            Dark theme
                                        </a> */}
                                        <a onClick={ () => this.Disconnect() } className="shr-upp-link-page" >
                                            <span className="ico"><i className="fas fa-sign-out-alt"></i></span>
                                            {t('Disconnect')}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hamburger" id="hamburger">
                        <span></span>
                        <span></span>
                        <div id="shr-menu-popup" className="shr-menu-popup">
                            <a className="shr-upp-link-page" onClick={() => window.location = config.host_url + "/search"}>
                                {t('Discover')}
                            </a>
                            <a className="shr-upp-link-page shr-upp-link-upload" onClick={() => window.location = config.host_url + "#"}>
                                {t('How it work')}
                            </a>
                            <a className="shr-upp-link-page shr-upp-link-upload" onClick={() => this.handleUpload()}>
                                {t('Upload')}
                            </a>
                        </div>
                    </div>
                </div>

                <div id="popup-connect-wallet" className="popup connect-wallet-popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('Connect Wallet')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close" onClick={() => $(".popup").fadeOut(100)}>
                                <i className="fas fa-times"></i>
                            </div>
                            <div id="popup-question" className="icon icon-40 popup-question" onClick={() => this.handleConnectWalletDesc()}>
                                <i className="fas fa-question"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <p className="popup-lead">{t('You can connect wallet using below apps')}</p>
                            <div className="wallet-apps">
                                <a id="metamask"  className="btn btn-h40 btn-fs-14" onClick={() => this.Connect_metamask()}>
                                    <span className="ico ico-l">
                                        <img src={img_metamask} />
                                    </span>
                                    <span className="txt">{t('MetaMask')}</span>
                                </a>
                                <a id="walletconnect"  className="btn btn-h40 btn-fs-14" onClick={() => this.WCConnect()}>
                                    <span className="ico ico-l">
                                        <img src={img_walletconnect} />
                                    </span>
                                    <span className="txt">{t('WalletConnect')}</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="popup-connect-wallet-desc" className="popup connect-wallet-popup">
                    <div className="popup-box">
                        <div className="popup-head">
                            <p className="popup-head-ttl">{t('How to Connect Wallet')}</p>
                            <div id="popup-close" className="icon icon-40 popup-close" onClick={() => $(".popup").fadeOut(100)}>
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                        <div className="popup-body">
                            <p className="popup-lead">{t('Follow below instructions')}</p>
                            <p className="popup-lead"><a href="https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-custom-Network-RPC-and-or-Block-Explorer">{t('1. Add BSC network to Metamask.')}</a></p>
                            <p className="popup-lead">{t('2. Select BSC network on MetaMask.')}</p>
                            <p className="popup-lead">{t('3. Connect wallet using Metamask.')}</p>
                        </div>
                    </div>
                </div>
            </header>
        )
    }
}

export default withTranslation()(Header);