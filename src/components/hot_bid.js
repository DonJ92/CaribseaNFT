import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/style.css';
import * as API from '../adapter/api';
import BalanceUtil from '../common/balance_util';
import AssetUtil from '../common/asset_util';
import CONST from '../globals/constants';
import config from '../globals/config';
import { withTranslation } from 'react-i18next';

class HotBid extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tokens: []
        };

        this.getHotBidTokens();
    }

    getHotBidTokens() {
        API.get_hot_bid(10)
        .then((res) => {
            if (res.result) {
                this.setState({
                    tokens: res.tokens
                });
            }
        })
    }

    onAvatarError(ev){
        ev.target.src = config.avatar_url + "default.png"
    }

    componentDidUpdate() {
        var script = document.createElement('script');
        script.src = './js/page/home.js';
        script.async = true;
        document.body.appendChild(script);
    }

    render() {
        const { t } = this.props;

        return (
            <section id="hot-bid" className="hot-bid">
                <div className="content">
                    <div className="hb-head">
                        <h3 className="hb-head-ttl">{t('Hot bid')}</h3>
                        <div className="hb-head-nav">
                            <div className="swiper-button-prev"><i className="fas fa-long-arrow-alt-left"></i></div>
                            <div className="swiper-button-next"><i className="fas fa-long-arrow-alt-right"></i></div>
                        </div>
                    </div>
    
                    <div className="hb-body">
                        <div id="hb-slide" className="swiper-container">
                            <div className="swiper-wrapper" id="hb-swiper-wrapper">
                                {
                                    this.state.tokens.map((item, index) => {
                                        var bid_price = "";
                                        if (item.bids.length == 0) {
                                            bid_price = BalanceUtil.format_balance(
                                                item.price, 
                                                AssetUtil.get_asset_by_id(item.auction_asset_id),
                                                2);
                                        } else {
                                            bid_price = BalanceUtil.format_balance(
                                                item.bids[0].amount, 
                                                AssetUtil.get_asset_by_id(item.auction_asset_id),
                                                2);
                                        }

                                        return (
                                            <div className="swiper-slide">
                                                <div className="hb-item" onClick={() => window.location = config.host_url + "/item/" + item.id}>
                                                    <div className="hb-item-figure">
                                                        <img src={JSON.parse(item.metadata).url} alt="" />
                                                        <div className="hb-item-figure-overlay">
                                                            <p className="hb-item-figure-overlay">{t("PURCHASING!")}</p>
                                                            {/* <div className="hb-item-figure-like"><i className="far fa-heart"></i></div> */}
                                                            {/* <a className="hb-item-figure-link" href="#">
                                                                <span className="txt">Place a bid</span>
                                                                <span className="icon"><i className="fas fa-sliders-h"></i></span>
                                                            </a> */}
                                                        </div>
                                                    </div>
                                                    <div className="ht-item-infos info-block-tsb">
                                                        <div className="ttl">
                                                            <p className="name">{item.token_name}</p>
                                                            <p className="ttl-mark eth-mark">{item.type == CONST.protocol_type.ERC721? "#" + item.token_id: item.owned_cnt + " / " + item.total_supply}</p>
                                                        </div>
                                                        <div className="stock">
                                                            <div className="stock-icons">
                                                                {
                                                                    item.bids.map((bid, index) => {
                                                                        return (
                                                                            <div className="stock-icon">
                                                                                <img src={config.avatar_url + bid.address + ".png"} onError={this.onAvatarError} alt="" />
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                            <p className="stock-txt">{t('in Stock', {count: item.bids.length})}</p>
                                                        </div>
                                                        <div className="bottom">
                                                            <div className="bottom-l">
                                                                <span className="icon"><i className="fas fa-sliders-h"></i></span>
                                                                <span className="txt">{item.bids.length == 0? t("Minimum bid"): t("Highest bid")}</span>
                                                                <span className="price">{bid_price}</span>
                                                            </div>
                                                            {/* <div className="bottom-r">
                                                                New Bid<span><img src={icon_fire}/></span>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default withTranslation()(HotBid);