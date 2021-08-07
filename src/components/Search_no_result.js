import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/style.css';
import {ChangeClass, AddClass} from '../js/common';

import mv from '../img/search/mv.jpg';
import icon_artwork from '../img/search/icon-artwork.png'
import icon_photo from '../img/search/icon-photo.png';
import icon_game from '../img/search/icon-game.png';
import icon_music from '../img/search/icon-music.png';
import { withTranslation } from 'react-i18next';

class SearchNoResult extends React.Component {
    constructor(props) {
        super(props);

        // var script = document.createElement('script');
        // script.src = './js/page/search.js';
        // script.async = true;
        // document.body.appendChild(script);

        ChangeClass('search');
    }

    render() {
        const { t } = this.props;

        return (
            <section id="search-02" className="search-02">
                <div className="content">
                    <div className="main-visual" className="main-visual">
                        <img src={mv} alt="" />
                    </div>

                    <div className="search-body">
                        <p className="warning-ttl">
                            {t("Sorry, we couldn't find any results for this search.")}
                        </p>
                        <p className="warning-ttl-sub">Maybe give one of these a try?</p>
                        <form>
                            <div className="search-form">
                                <input type="text" placeholder="Enter your seach&#8230;"/>
                                <div className="btn-submit"><i className="fas fa-long-arrow-alt-right"></i></div>
                            </div>
                        </form>
                    </div>

                    <div className="explore-more">
                        <p className="explore-more-ttl">Explore more</p>
                        <div className="em-list-wrapper">
                            <div className="em-list">
                                <a className="em-item" href="#">
                                    <div className="em-item-icon">
                                        <img src={icon_artwork} alt="" />
                                    </div>
                                    <div className="em-item-infos">
                                        <p className="em-item-infos-ttl">Artwork</p>
                                        <p className="em-item-infos-txt">138 items</p>
                                    </div>
                                </a>

                                <a className="em-item" href="#">
                                    <div className="em-item-icon">
                                        <img src={icon_photo} alt="" />
                                    </div>
                                    <div className="em-item-infos">
                                        <p className="em-item-infos-ttl">Photography</p>
                                        <p className="em-item-infos-txt">138 items</p>
                                    </div>
                                </a>

                                <a className="em-item" href="#">
                                    <div className="em-item-icon">
                                        <img src={icon_game} alt="" />
                                    </div>
                                    <div className="em-item-infos">
                                        <p className="em-item-infos-ttl">Game</p>
                                        <p className="em-item-infos-txt">138 items</p>
                                    </div>
                                </a>

                                <a className="em-item" href="#">
                                    <div className="em-item-icon">
                                        <img src={icon_music} alt="" />
                                    </div>
                                    <div className="em-item-infos">
                                        <p className="em-item-infos-ttl">Music</p>
                                        <p className="em-item-infos-txt">138 items</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default withTranslation()(SearchNoResult);