import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/style.css';

import hc_01_01 from '../img/home/hc-01-01.jpg';
import hc_01_02 from '../img/home/hc-01-02.jpg';
import hc_01_03 from '../img/home/hc-01-03.jpg';
import hc_01_04 from '../img/home/hc-01-04.jpg';
import hc_02_01 from '../img/home/hc-02-01.jpg';
import hc_02_02 from '../img/home/hc-02-02.jpg';
import hc_02_03 from '../img/home/hc-02-03.jpg';
import hc_02_04 from '../img/home/hc-02-04.jpg';
import hc_03_01 from '../img/home/hc-02-01.jpg';
import hc_03_02 from '../img/home/hc-02-02.jpg';
import hc_03_03 from '../img/home/hc-02-03.jpg';
import hc_03_04 from '../img/home/hc-02-04.jpg';
import icon_avatar_01 from '../img/common/icon-avatar-01.png';

class HotCollection extends React.Component {
    render() {
        return (
            <section id="hot-collections" className="hot-collections">
                <div className="content">
                    <div className="hc-head">
                        <h3 className="hc-head-ttl">Hot collections</h3>
                    </div>
    
                    <div className="hc-body">
                        <div id="hc-slide" className="swiper-container">
                            <div className="swiper-wrapper">
                                <div className="swiper-slide">
                                    <div className="hc-item">
                                        <div className="hc-item-figure-main">
                                            <img src={hc_01_01} alt="" />
                                        </div>
                                        <div className="hc-item-figure-sub-row">
                                            <div className="hc-item-figure-sub">
                                                <img src={hc_01_02} alt="" />
                                            </div>
                                            <div className="hc-item-figure-sub">
                                                <img src={hc_01_03} alt="" />
                                            </div>
                                            <div className="hc-item-figure-sub">
                                                <img src={hc_01_04} alt="" />
                                            </div>
                                        </div>
                                        <h4 className="hc-item-ttl">Awesome collection</h4>
                                        <div className="hc-item-infos">
                                            <div className="hc-item-infos-user">
                                                <div className="hc-item-infos-user-icon">
                                                    <img src={icon_avatar_01} alt="" />
                                                </div>
                                                <p className="hc-item-infos-user-name">By Kennith Olson</p>
                                            </div>
                                            <p className="hc-item-infos-count">28 ITEMS</p>
                                        </div>
                                    </div>
                                </div>
    
                                <div className="swiper-slide">
                                    <div className="hc-item">
                                        <div className="hc-item-figure-main">
                                            <img src={hc_02_01} alt="" />
                                        </div>
                                        <div className="hc-item-figure-sub-row">
                                            <div className="hc-item-figure-sub">
                                                <img src={hc_02_02} alt="" />
                                            </div>
                                            <div className="hc-item-figure-sub">
                                                <img src={hc_02_03} alt="" />
                                            </div>
                                            <div className="hc-item-figure-sub">
                                                <img src={hc_02_04} alt="" />
                                            </div>
                                        </div>
                                        <h4 className="hc-item-ttl">Awesome collection</h4>
                                        <div className="hc-item-infos">
                                            <div className="hc-item-infos-user">
                                                <div className="hc-item-infos-user-icon">
                                                    <img src={icon_avatar_01} alt="" />
                                                </div>
                                                <p className="hc-item-infos-user-name">By Kennith Olson</p>
                                            </div>
                                            <p className="hc-item-infos-count">28 ITEMS</p>
                                        </div>
                                    </div>
                                </div>
    
                                <div className="swiper-slide">
                                    <div className="hc-item">
                                        <div className="hc-item-figure-main">
                                            <img src={hc_03_01} alt="" />
                                        </div>
                                        <div className="hc-item-figure-sub-row">
                                            <div className="hc-item-figure-sub">
                                                <img src={hc_03_02} alt="" />
                                            </div>
                                            <div className="hc-item-figure-sub">
                                                <img src={hc_03_03} alt="" />
                                            </div>
                                            <div className="hc-item-figure-sub">
                                                <img src={hc_03_04} alt="" />
                                            </div>
                                        </div>
                                        <h4 className="hc-item-ttl">Awesome collection</h4>
                                        <div className="hc-item-infos">
                                            <div className="hc-item-infos-user">
                                                <div className="hc-item-infos-user-icon">
                                                    <img src={icon_avatar_01} alt="" />
                                                </div>
                                                <p className="hc-item-infos-user-name">By Kennith Olson</p>
                                            </div>
                                            <p className="hc-item-infos-count">28 ITEMS</p>
                                        </div>
                                    </div>
                                </div>
                            </div>                 
                        </div>
                        <div className="hb-body-nav">
                            <div className="swiper-button-prev"><i className="fas fa-long-arrow-alt-left"></i></div>
                            <div className="swiper-button-next"><i className="fas fa-long-arrow-alt-right"></i></div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default HotCollection;