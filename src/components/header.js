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

        if (window.web3 !== undefined) {
            const web3 = new Web3(Web3.givenProvider);
            web3.eth.net.getId().then((res) => {
                this.setState({
                    chainId: res
                });
            });
    
            this.getAccounts();
        }console.log('constructor');
    }

    getAccounts() {
        const web3 = new Web3(Web3.givenProvider);

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
                        this.setState({
                            balance: web3.utils.fromWei(balance, "ether")
                        });
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

    Disconnect() {
        ls.set(constants.local_storage_key.KEY_CONNECTED, 0);
        window.location.reload();
    }

    Profile() {
        API.get_profile(this.state.selected_address)
        .then((res) => {
            if (res.result == true) {
                window.location = '/profile/' + this.state.selected_address;
            } else {
                window.location = '/edit_profile';
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }

    handleUpload() {
        if (this.state.selected_address == null || !this.isConnected()) {
            const { t } = this.props;
            alert(t('Please connect the wallet.'));
        } else {
            document.location="/upload/type";
        }
    }

    onAvatarError(ev){
        ev.target.src = config.avatar_url + "default.png"
    }

    handleSearch() {
        var keyword = document.getElementById("keyword").value;

        if (keyword == "") return;

        document.location = "/search_keyword/" + keyword;
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
            alert(t("Please install metamask."));
            return;
        }

        if (parseInt(window.ethereum.chainId) != support_networks.ETHEREUM && parseInt(window.ethereum.chainId) != support_networks.BSC) {
            alert(t("Please select ethereum or bsc network on metamask."));
            return false;
        }

        window.ethereum.enable()
        .then((res) => {
            ls.set(constants.local_storage_key.KEY_CONNECTED, 1);
            ls.set(constants.local_storage_key.KEY_WALLET_TYPE, constants.wallet_type.METAMASK);
            window.location.reload();
        })
        .catch((err) => {
            ls.clear();
        });
    }

    async WCConnect() {
        //  Create WalletConnect Provider
        const provider = new WalletConnectProvider({
          rpc: {
            3: "https://ropsten.mycustomnode.com",
            97: "https://data-seed-prebsc-1-s1.binance.org:8545"
          }
        });

        provider.onConnect(() => {
            ls.set(constants.local_storage_key.KEY_CONNECTED, 1);
            ls.set(constants.local_storage_key.KEY_WALLET_TYPE, constants.wallet_type.WALLETCONNECT);
            document.location.reload();
        });
    
        //  Enable session (triggers QR Code modal)
        await provider.enable();
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
                            <a href="/">
                                <img src={logo} alt="" />
                            </a>
                        </h1>
                        <div className="shl-links">
                            <a className="shl-link-item" href="/search"><span>{t('Discover')}</span></a>
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
                        <div class="shr-notice-wrapper">
                            <div id="btn-show-notice-popup" class="shr-notice">
                                <img src={icon_notice} alt="" />
                                <span className="new" style={is_activity_mark? {}: style_hidden}></span>
                            </div>
                            <div id="shr-notice-popup" class="shr-notice-popup">
                                <div class="shr-notice-head">
                                    <p class="shr-notice-head-ttl">{t('Notification')}</p>
                                    <a class="btn btn-h40 btn-blue btn-fs-14" href="/activity"><span class="txt">{t('See all')}</span></a>
                                </div>

                                <div class="shr-notice-list" style={sample_activities.length != 0? {}: style_hidden}>
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
                                                    title = "Mint";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "Mint " + item.token_name + " #" + item.token_id + " token.";
                                                    } else {
                                                        description = "Mint " + item.token_name + " " + item.token_cnt + " token(s).";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.TRANSFER:
                                                    title = "Transfer";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        if (item.from_address == this.state.address) {
                                                            description = "Transferred " + item.token_name + " #" + item.token_id + " token to " + item.to_name;
                                                        } else {
                                                            description = "Transferred " + item.token_name + " #" + item.token_id + " token from " + item.from_name;
                                                        }
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        if (item.from_address == this.state.address) {
                                                            description = "Transferred " + item.token_name + " " + item.token_cnt + " token(s) to " + item.to_name;
                                                        } else {
                                                            description = "Transferred " + item.token_name + " " + item.token_cnt + " token(s) from " + item.from_name;
                                                        }
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.LIST_FIXED_SIZE:
                                                    title = "List for sale";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "Listed " + item.token_name + " #" + item.token_id + " token for sale as " + item.amount + " BNB."
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = "Listed " + item.token_name + " " + item.token_cnt + " token(s) for sale as " + item.amount + " BNB."
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.LIST_AUCTION:
                                                    title = "List for sale";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "Listed " + item.token_name + " #" + item.token_id + " token for sale with minimum price as " + item.amount + " " + AssetUtil.get_asset_by_id(item.asset_id) + ".";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = "Listed " + item.token_name + " " + item.token_cnt + " token(s) for sale with minimum price as " + item.amount + " " + AssetUtil.get_asset_by_id(item.asset_id) + ".";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.UNLIST:
                                                    title = "Remove from sale";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "Removed " + item.token_name + " #" + item.token_id + " token from sale.";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = "Removed " + item.token_name + " " + item.token_cnt + " token(s) from sale.";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.BID:
                                                    title = "BID";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "BID " + item.token_name + " #" + item.token_id + " token with " + item.amount + " " + AssetUtil.get_asset_by_id(item.asset_id) + ".";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = "BID " + item.token_name + " " + item.token_cnt + " token(s) with " + item.amount + " " + AssetUtil.get_asset_by_id(item.asset_id) + ".";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.EXCHANGE:
                                                    title = "Exchange";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "Exchanged " + item.token_name + " #" + item.token_id + " token from the auction with " + item.amount + " " + AssetUtil.get_asset_by_id(item.asset_id) + ".";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = "Exchanged " + item.token_name + " " + item.token_id + " token(s) from the auction with " + item.amount + " " + AssetUtil.get_asset_by_id(item.asset_id) + ".";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.BUY:
                                                    title = "BUY";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = item.to_name + " bought " + item.token_name + " #" + item.token_id + " token with " + item.amount + " BNB.";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = item.to_name + " bought " + item.token_name + " " + item.token_cnt + " token(s) with " + item.amount + " BNB.";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.SELF_CANCEL:
                                                    title = "Cancel bid";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "Cancelled your bid of " + item.token_name + " #" + item.token_id + " token.";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = "Cancelled your bid of " + item.token_name + " " + item.token_cnt + " token(s).";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.CANCEL:
                                                    title = "Acution end";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description = "The auction of " + item.token_name + " #" + item.token_id + " token ended";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description = "The auction of " + item.token_name + " " + item.token_cnt + " token(s) ended";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.FOLLOW:
                                                    title = "Follow";
                                                    if (item.from_address == this.state.address) {
                                                        description = "Started to folllow " + item.to_name;
                                                        img_src = config.avatar_url + item.to_address + ".png";
                                                    } else {
                                                        description = "Following from " + item.from_name;
                                                        img_src = config.avatar_url + item.from_address + ".png";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.UNFOLLOW:
                                                    title = "Unfollow";
                                                    if (item.from_address == this.state.address) {
                                                        description = "Unfollowed " + item.to_name;
                                                        img_src = config.avatar_url + item.to_address + ".png";
                                                    } else {
                                                        description = item.from_name + " unfollowed " + item.from_name;
                                                        img_src = config.avatar_url + item.from_address + ".png";
                                                    }
                                                    break;
                                                case CONST.ACTIVITY_TYPE.STAKE:
                                                    title = "Stake";
                                                    description = "Staked " + item.token_name + " #" + item.token_id + " token.";
                                                    break;
                                                case CONST.ACTIVITY_TYPE.REVOKE:
                                                    title = "Revoke";
                                                    description = "Revoked " + item.token_name + " #" + item.token_id + " token.";
                                                    break;
                                                case CONST.ACTIVITY_TYPE.BURN:
                                                    title = "Burn";
                                                    if (item.token_type == CONST.protocol_type.ERC721) {
                                                        description  = "Burned " + item.token_name + " #" + item.token_id + " token.";
                                                    } else if (item.token_type == CONST.protocol_type.ERC1155) {
                                                        description  = "Burned " + item.token_name + " " + item.token_cnt + " token(s).";
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
                                <div class="shr-notice-list" style={sample_activities.length == 0? {}: style_hidden}>
                                    There's no notification.
                                </div>
                            </div>
                        </div>
                        <div className="shr-links">
                            <a className="btn btn-blue btn-h48 btn-mr12 btn-upload" onClick={() => this.handleUpload()}><span>{t('Upload')}</span></a>
                            <div>
                                <a className="btn btn-h48" onClick={() => this.handleConnectWallet()} style={ls.get(constants.local_storage_key.KEY_CONNECTED) == null || ls.get(constants.local_storage_key.KEY_CONNECTED) == 0 || this.state.selected_address == null || !this.isConnected()? style_none: style_hidden}><span>{t('Connect Wallet')}</span></a>
                                <div class="btn-show-user-profile-popup-wrapper" style={ls.get(constants.local_storage_key.KEY_CONNECTED) == 1 && this.state.selected_address != null && this.isConnected()? style_none: style_hidden}>
                                    <div id="btn-show-user-profile-popup">
                                        <span class="ico"><img src={config.avatar_url + (this.state.profile == null || this.state.profile.has_avatar == 0? "default": this.state.profile.address) + ".png"} onError={this.onAvatarError} alt="" /></span>
                                        <span class="balance">{parseFloat(this.state.balance).toFixed(4)}</span>
                                        <span class="unit">{this.state.chainId == support_networks.ETHEREUM? "ETH": "BNB"}</span>
                                    </div>
                                    <div id="shr-user-profile-popup" class="shr-user-profile-popup">
                                        <p class="shr-upp-name">{this.state.profile == null? "XXX": this.state.profile.name}</p>
                                        <p class="shr-upp-token">
                                            {window.ethereum == null || window.ethereum.selectedAddress == null? 'XXX': window.ethereum.selectedAddress.slice(0,14) + '...' + window.ethereum.selectedAddress.slice(38,42)}
                                            <span><img src={icon_ball} alt="" onClick={() => navigator.clipboard.writeText(window.ethereum.selectedAddress)}/></span>
                                        </p>
                                        <div class="shr-upp-balance">
                                            <div class="shr-upp-balance-info">
                                                <div class="shr-upp-balance-info-icon">
                                                    <img src={icon_bnb} alt="" />
                                                </div>
                                                <div class="shr-upp-balance-info-desc">
                                                    <p class="shr-upp-balance-info-ttl-sub">{t('Balance')}</p>
                                                    <p class="shr-upp-balance-info-ttl">{BalanceUtil.format_balance(this.state.balance, this.state.chainId == support_networks.ETHEREUM? "ETH": 'BNB')}</p>
                                                </div>
                                            </div>
                                            <a class="shr-upp-balance-link btn btn-h32 btn-full btn-fs-14" onClick={() => document.location = config.blockexplorer_url + "address/" + (window.ethereum == null || window.ethereum.selectedAddress == null? 'XXX': window.ethereum.selectedAddress)}><span class="txt">{t('See on')} {window.ethereum == undefined || window.ethereum.chainId == support_networks.ETHEREUM? "Ethereum": "BSC"}</span></a>
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
                    <div class="hamburger" id="hamburger">
                        <span></span>
                        <span></span>
                        <div id="shr-menu-popup" class="shr-menu-popup">
                            <a className="shr-upp-link-page" onClick={() => document.location = "/search"}>
                                {t('Discover')}
                            </a>
                            <a className="shr-upp-link-page shr-upp-link-upload" onClick={() => document.location = "#"}>
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