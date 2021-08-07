import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/style.css';
import * as API from '../adapter/api';
import config from '../globals/config';
import CONST from '../globals/constants';
import BalanceUtil from '../common/balance_util';
import AssetUtil from '../common/asset_util';

import icon_avatar_01 from '../img/common/icon-avatar-01.png';
import pickup_01 from '../img/home/pickup-01.jpg';
import icon_fire from '../img/common/icon-fire.png';
import { withTranslation } from 'react-i18next';

class PickUp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tokens: [],
            users: []
        };
    }

    componentDidMount() {
        this.getLastTokens();
        this.getLastUsers();
    }

    getLastTokens() {
        API.get_last_tokens(4)
        .then((res) => {
            if (res.result) {
                this.setState({
                    tokens: res.tokens
                });
            }
        })
    }

    getLastUsers() {
        API.get_last_creators(4)
        .then((res) => {
            if (res.result) {
                this.setState({
                    users: res.users
                });
            }
        })
    }

    onAvatarError(ev){
        ev.target.src = config.avatar_url + "default.png"
    }

    render() {
        const { t } = this.props;

        var style_hidden = {display: 'none'};

        var pick_01 = (<div></div>);

        if (this.state.tokens.length != 0) {
            var pick_01_price_txt = t("Highest Bid");
            var pick_01_price = "0 BNB";
            var pick_01_stock = t("Not sell");

            if (this.state.tokens[0].status == CONST.token_status.FIXED_PRICE) {
                pick_01_price_txt = t("Fixed Price");
                pick_01_price = BalanceUtil.format_balance(this.state.tokens[0].price, "BNB", 2);
                pick_01_stock = t("No auction");
            } else if (this.state.tokens[0].status == CONST.token_status.AUCTION) {
                if (this.state.tokens[0].bids.length == 0) {
                    pick_01_price_txt = t("Minimum Price");
                    pick_01_price = BalanceUtil.format_balance(
                        this.state.tokens[0].price, 
                        AssetUtil.get_asset_by_id(this.state.tokens[0].auction_asset_id), 
                        2
                    );
                } else {
                    pick_01_price = BalanceUtil.format_balance(
                        this.state.tokens[0].bids[0].amount, 
                        AssetUtil.get_asset_by_id(this.state.tokens[0].auction_asset_id), 
                        2
                    );
                }

                pick_01_stock = t("in stock", {count: this.state.tokens[0].bids.length});
            } else {
                pick_01_stock = t("Not sell");
            }

            pick_01 = (
                <div className="pickup-01-inner" onClick={() => window.location = config.host_url + "/item/" + this.state.tokens[0].id}>
                    <div className="pickup-01-figure">
                        <img src={JSON.parse(this.state.tokens[0].metadata).url} alt="" />
                    </div>
                    <div className="pickup-01-infos">
                        <div className="pickup-01-infos-l">
                            <div className="pickup-01-infos-l-icon">
                                <img src={config.avatar_url + this.state.tokens[0].owner + ".png"} onError={this.onAvatarError} alt="" />
                            </div>
                            <div className="pickup-01-infos-l-desc">
                                <p className="pickup-01-infos-l-desc-ttl">{this.state.tokens[0].token_name}</p>
                                <p className="pickup-01-infos-l-desc-txt">{pick_01_stock}</p>
                            </div>
                        </div>
                        <div className="pickup-01-infos-r" style={this.state.tokens[0].status == CONST.token_status.FIXED_PRICE || this.state.tokens[0].status == CONST.token_status.AUCTION? {}: style_hidden}>
                            <p className="pickup-01-infos-r-txt">{pick_01_price_txt}</p>
                            <p className="pickup-01-infos-r-mark">{pick_01_price}</p>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <section id="pickup">
                <div className="content">
                    <div className="pickup-inner">
                        <div className="pickup-01">
                            {pick_01}
                        </div>
    
                        <div className="pickup-02">
                            <div className="pickup-02-list">
                                {
                                    this.state.tokens.slice(1, 4).map((item, index) => {
                                        var price_txt = t("Not sell");
                                        var stock_txt = t("Minimum");

                                        if (item.status == CONST.token_status.FIXED_PRICE) {
                                            price_txt = BalanceUtil.format_balance(item.price, "BNB", 2);
                                            stock_txt = t("Fixed");
                                        } else if (item.status == CONST.token_status.AUCTION) {
                                            if (item.bids.length != 0) {
                                                price_txt = BalanceUtil.format_balance(
                                                    item.bids[0].amount,
                                                    AssetUtil.get_asset_by_id(item.auction_asset_id),
                                                    2
                                                );

                                                stock_txt = "1 of " + item.bids.length;
                                            } else {
                                                price_txt = BalanceUtil.format_balance(
                                                    item.price,
                                                    AssetUtil.get_asset_by_id(item.auction_asset_id),
                                                    2
                                                );
                                            }
                                        }

                                        return (
                                            <div className="pickup-02-item">
                                                <div className="pickup-02-figure">
                                                    <img src={JSON.parse(item.metadata).url} alt="" />
                                                    <a onClick={() => window.location = config.host_url + "/item/" + item.id}><i className="fas fa-long-arrow-alt-right"></i></a>
                                                </div>
                                                <div className="pickup-02-infos">
                                                    <p className="pickup-02-infos-ttl">{item.token_name} {item.type == CONST.protocol_type.ERC721? "#" + item.token_id: item.owned_cnt + " / " + item.total_supply}</p>
                                                    <div className="pickup-02-infos-metas">
                                                        <div className="pickup-02-infos-metas-icon icon icon-24">
                                                            <img src={config.avatar_url + item.owner + ".png"} onError={this.onAvatarError} alt="" />
                                                        </div>
                                                        <p className="pickup-02-infos-metas-mark eth-mark">{price_txt}</p>
                                                        <p className="pickup-02-infos-metas-txt" style={item.status == CONST.token_status.FIXED_PRICE || item.status == CONST.token_status.AUCTION? {}: style_hidden}>{stock_txt}</p>
                                                    </div>
                                                    {/* <a className="pickup-02-infos-link" href="#">Place a bid</a> */}
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
    
                        <div className="pickup-03">
                            <p className="pickup-03-ttl" style={this.state.users.length == 0? style_hidden: {}}>{t('Latest upload from creators')}<span><img src={icon_fire} alt="" /></span></p>
                            <div className="pickup-03-list-wrapper">
                                <div className="pickup-03-list">
                                    {
                                        this.state.users.map((item, index) => {
                                            return (
                                                <div className="pickup-03-item" onClick={() => window.location = config.host_url + "/profile/" + item.address}>
                                                    <div className="pickup-03-item-icon-wrapper">
                                                        <div className="pickup-03-item-icon icon icon-56">
                                                            <img src={config.avatar_url + item.address + ".png"} onError={this.onAvatarError} alt="" />
                                                            {/* <span className="pickup-notice">6</span> */}
                                                        </div>
                                                    </div>
                                                    <div className="pickup-03-item-infos">
                                                        <p className="pickup-03-item-infos-name">{item.name}</p>
                                                        {/* <p className="pickup-03-item-infos-price">2,456<span>ETH</span></p> */}
                                                        <p className="pickup-03-item-infos-price">{item.address.slice(0,14) + '...' + item.address.slice(38,42)}</p>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            {/* <a className="pickup-03-link" href="#">Discover more<i className="fas fa-long-arrow-alt-right"></i></a> */}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default withTranslation()(PickUp);