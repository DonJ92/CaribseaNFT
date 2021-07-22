import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/style.css';
import * as API from '../adapter/api';
import config from '../globals/config';
import CONST from '../globals/constants';
import BalanceUtil from '../common/balance_util';
import AssetUtil from '../common/asset_util'

import mv_video from '../img/home/mv-video.jpg';
import icon_avatar_01 from '../img/common/icon-avatar-01.png';
import icon_bnb from '../img/common/icon-bnb.png';
import icon_mv from '../img/item/mv.png';
import { withTranslation } from 'react-i18next';

class TopNFT extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tokens: [],
            selected_index: 0,
            tick_bid_asset_price: [0, 0]
        };

        API.get_most_like_tokens(2)
        .then((res) => {console.log(res);
            if (res.result) {
                this.setState({
                    tokens: res.tokens
                });
            }
        })

        this.tickPrice();
        setInterval(this.tickPrice.bind(this), 3000);
    }

    tickPriceByIndex(index) {
        if (this.state.tokens == null || this.state.tokens.length <= index) return;

        var symbol = AssetUtil.get_tick_symbol_by_id(this.state.tokens[index].auction_asset_id, this.state.tokens[index].chain_id);
        if (symbol != null) {
            API.get_tick(symbol)
            .then((res) => {
                var tick = parseFloat(res.price);

                var tickArr = this.state.tick_bid_asset_price;
                tickArr[index] = tick;

                this.setState({
                    tick_bid_asset_price: tickArr
                });
            });
        }
    }

    tickPrice() {
        this.tickPriceByIndex(0);
        this.tickPriceByIndex(1);
    }

    onAvatarError(ev){
        ev.target.src = config.avatar_url + "default.png"
    }

    handleSelectedIndex(index) {
        this.setState({
            selected_index: index
        });
    }

    render() {
        const { t } = this.props;

        var style_hidden = {display: 'none'};

        var img_src = icon_mv;
        if (this.state.tokens.length != 0) {
            img_src = JSON.parse(this.state.tokens[this.state.selected_index].metadata).url;
        }

        return (
            <section id="main-visual">
                <div className="content">
                    <div className="mv-inner">
                        <div className="mv-video">
                            <div className="mv-video-wrapper">
                                <img src={img_src} alt="" />
                            </div>
                        </div>
                        <div className="mv-infos">
                            <div className="mv-infos-panel-container">
                                {
                                    this.state.tokens.map((item, index) => {
                                        var bid_price = item.price + " " + AssetUtil.get_asset_by_id(item.auction_asset_id);
                                        var bid_text = t("Highest Bid");
                                        var usd_price = "$0";
                                        if (item.status == CONST.token_status.AUCTION) {
                                            if (item.bids.length == 0) {
                                                bid_text = t("Minimum Bid");
                                                usd_price = BalanceUtil.format_usd_amount(item.price * this.state.tick_bid_asset_price[index]);
                                            } else {
                                                bid_price = item.bids[0].amount + " " + AssetUtil.get_asset_by_id(item.auction_asset_id);
                                                usd_price = BalanceUtil.format_usd_amount(item.bids[0].amount * this.state.tick_bid_asset_price[index]);
                                            }
                                        } else {
                                            bid_price = t("No auction");
                                        }
                                        console.log(this.state.selected_index + " " + index);
                                        return (
                                            <div id="mv-infos-panel-01" className="mv-infos-panel" style={this.state.selected_index == index? {}: style_hidden}>
                                                <div className="mv-infos-ttl">{item.token_name} {item.type == CONST.protocol_type.ERC721? "#" + item.token_id: item.owned_cnt + " / " + item.total_supply}</div>
                                                <div className="mv-infos-head">
                                                    <div className="mv-infos-head-item">
                                                        <div className="mv-infos-head-icon">
                                                            <img src={config.avatar_url + item.owner + ".png"} onError={this.onAvatarError} alt="" />
                                                        </div>
                                                        <div className="mv-infos-head-item-infos">
                                                            <p className="mv-infos-head-item-infos-txt-01">{t('Creator')}</p>
                                                            <p className="mv-infos-head-item-infos-txt-02">{item.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="mv-infos-head-item" style={item.status == CONST.token_status.FIXED_PRICE? {}: style_hidden}>
                                                        <div className="mv-infos-head-icon">
                                                            <img src={icon_bnb} alt="" />
                                                        </div>
                                                        <div className="mv-infos-head-item-infos" >
                                                            <p className="mv-infos-head-item-infos-txt-01">{t('Instant price')}</p>
                                                            <p className="mv-infos-head-item-infos-txt-02">{BalanceUtil.format_balance(item.price, "BNB", 2)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mv-infos-body">
                                                    <p className="mv-infos-body-txt">
                                                        <span className="top">{bid_text}</span>
                                                        <span className="mid">{bid_price}</span>
                                                        <span className="bot" style={item.status == CONST.token_status.AUCTION? {}: style_hidden}>{usd_price}</span>
                                                    </p>
                                                    {/* <div className="mv-infos-body-timer">
                                                        <p className="mv-infos-body-timer-ttl">Auction ending in</p>
                                                        <div className="mv-infos-body-timer-row">
                                                            <div className="mv-infos-body-timer-col">
                                                                <p className="mv-infos-body-timer-txt">19</p>
                                                                <p className="mv-infos-body-timer-unit">Hrs</p>
                                                            </div>
                                                            <div className="mv-infos-body-timer-col">
                                                                <p className="mv-infos-body-timer-txt">24</p>
                                                                <p className="mv-infos-body-timer-unit">mins</p>
                                                            </div>
                                                            <div className="mv-infos-body-timer-col">
                                                                <p className="mv-infos-body-timer-txt">19</p>
                                                                <p className="mv-infos-body-timer-unit">secs</p>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                </div>
                                                {/* <a className="mv-infos-link blue" href="#"><span>Place a bid</span></a> */}
                                                <a className="mv-infos-link" href={"/item/" + item.id}><span>{t('View item')}</span></a>
                                            </div>
                                        )
                                    })
                                }
                            </div>
    
                            <div id="mv-infos-tabs" className="mv-infos-tabs" style={this.state.tokens.length == 0? style_hidden: {}}>
                                <a onClick={() => this.handleSelectedIndex(0)}><span><i className="fas fa-long-arrow-alt-left"></i></span></a>
                                <a onClick={() => this.handleSelectedIndex(1)}><span><i className="fas fa-long-arrow-alt-right"></i></span></a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default withTranslation()(TopNFT);