import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/style.css';

import * as API from '../adapter/api';

import icon_avatar_01 from '../img/common/icon-avatar-01.png';
import config from '../globals/config';
import { withTranslation } from 'react-i18next';

var FILTER_TYPE = {
    DAILY: "0",
    WEEKLY: "1",
    MONTHLY: "2"
};

var MILISECONDS_DAY = 1000 * 3600 * 24;
var MILISECONDS_WEEK = MILISECONDS_DAY * 7;
var MILISECONDS_MONTH = MILISECONDS_DAY * 30;

class PopularSellers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: []
        };

        this.getSellers(this.getTimeStamp(FILTER_TYPE.MONTHLY));
    }

    getSellers(timestamp) {
        API.get_top_sellers(10, timestamp)
        .then((res) => {console.log(res);
            if (res.result) {
                this.setState({
                    users: res.users
                });
            }
        })
    }

    getTimeStamp(filter_type) {
        switch(filter_type) {
            case FILTER_TYPE.DAILY:
                return Date.now() - MILISECONDS_DAY;
            case FILTER_TYPE.WEEKLY:
                return Date.now() - MILISECONDS_WEEK;
            case FILTER_TYPE.MONTHLY:
                return Date.now() - MILISECONDS_MONTH;
        }
    }

    handleFilterChanged() {
        var filter = document.getElementById("sel_filter").value;

        this.getSellers(this.getTimeStamp(filter));
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
            <section id="popular-sellers">
                <div className="content">
                    <div className="ps-head">
                        <h3 className="ps-head-ttl">
                            {t('Popular')}
                            <span>{t('Sellers')}<i className="fas fa-angle-down"></i></span>
                        </h3>
                        <div className="ps-head-select select-wrapper">
                            <select id="sel_filter" defaultValue={FILTER_TYPE.MONTHLY} onChange={() => this.handleFilterChanged()}>
                                <option value={FILTER_TYPE.DAILY}>{t('Daily')}</option>
                                <option value={FILTER_TYPE.WEEKLY}>{t('Weekly')}</option>
                                <option value={FILTER_TYPE.MONTHLY}>{t('Monthly')}</option>
                            </select>
                            <div className="arrow"><i className="fas fa-angle-down"></i></div>
                        </div>
                    </div>

                    <div id="ps-body" className="ps-body">
                        <div id="ps-slide" className="swiper-container">
                            <div className="swiper-wrapper" id="ps-slide-wrapper">
                                {
                                    this.state.users.map((item, index) => {
                                        return (
                                            <div className="swiper-slide">
                                                <div className="ps-item" onClick={() => window.location = config.host_url + "/profile/" + item.address}>
                                                    <div className="ps-item-head">
                                                        <a className="ps-item-head-tag tag-01" href="#">
                                                            <i className="fas fa-trophy"></i>
                                                            <span>#{index + 1}</span>
                                                        </a>
                                                        <div className="ps-item-head-links">
                                                            <div className="ps-item-head-icon"><i className="far fa-plus-square"></i></div>
                                                            <div className="ps-item-head-icon"><i className="fas fa-external-link-alt"></i></div>
                                                        </div>
                                                    </div>
                
                                                    <div className="ps-item-body">
                                                        <div className="ps-item-avatar-row">
                                                            <div className="ps-item-avatar icon icon-64">
                                                                <img src={config.avatar_url + item.address + ".png"} onError={this.onAvatarError} alt=""/>
                                                            </div>
                                                        </div>
                                                        <div className="ps-item-infos">
                                                            <p className="ps-item-infos-txt-main">{item.name}</p>
                                                            <p className="ps-item-infos-txt-sub"><span>{item.count + " " + t("tokens")}</span></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="swiper-button-prev"><i className="fas fa-long-arrow-alt-left"></i></div>
                        <div className="swiper-button-next"><i className="fas fa-long-arrow-alt-right"></i></div>
                    </div>
                </div>
            </section>
        );
    }
}

export default withTranslation()(PopularSellers);