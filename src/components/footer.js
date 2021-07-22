import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/style.css';

import logo from '../img/logo.png';
import i18n from 'i18next';
import { withTranslation } from 'react-i18next';

class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    mailTo() {
        var mail = document.getElementById("email").value;
        window.location.href = "mailto:" + mail;
    }

    render() {
        const { t } = this.props;

        return <footer id="footer">
                <div className="content">
                    <div className="footer-content">
                        <div className="footer-head">
                            <h2 className="footer-logo">
                                <img src={logo} alt="" />
                            </h2>
                            <p className="footer-lead">{t('Degitize your asset at caribmars.finance NFT market.')}</p>
                        </div>

                        <div className="footer-body">
                            <div className="footer-nav-block">
                                <p className="footer-nav-ttl">{t('Caribsea NFT market')}</p>
                                <ul className="footer-nav-list">
                                    <li className="footer-nav-item"><a href="/search"><span>{t('Discover')}</span></a></li>
                                    <li className="footer-nav-item"><a href="/connect"><span>{t('Connect Wallet')}</span></a></li>
                                    <li className="footer-nav-item"><a href="/upload/type"><span>{t('Create item')}</span></a></li>
                                </ul>
                                <p className="footer-nav-ttl mt-40">{t('Language')}</p>
                                <ul className="footer-nav-list">
                                    <li className="footer-nav-item"><a onClick={() => i18n.changeLanguage('en')}><span>{t('English')}</span></a></li>
                                    <li className="footer-nav-item"><a onClick={() => i18n.changeLanguage('ja')}><span>{t('Japanese')}</span></a></li>
                                    <li className="footer-nav-item"><a onClick={() => i18n.changeLanguage('cn')}><span>{t('Chinese')}</span></a></li>
                                </ul>
                            </div>
                            <div className="footer-nav-block">
                                <p className="footer-nav-ttl">{t('Info')}</p>
                                <ul className="footer-nav-list">
                                    <li className="footer-nav-item"><a href="https://caribmars.finance/"><span>{t('Offical')}</span></a></li>
                                    {/* <li className="footer-nav-item"><a href="#"><span>Demos</span></a></li> */}
                                    <li className="footer-nav-item"><a href="/faq"><span>{t('FAQ')}</span></a></li>
                                    <li className="footer-nav-item"><a href="#"><span>{t('Support')}</span></a></li>
                                </ul>
                            </div>
                            <div className="footer-cta-block">
                                <p className="footer-cta-ttl">{t('Join Newsletter')}</p>
                                <p className="footer-cta-txt">
                                    {t('Subscribe our newsletter to get more free design course and resource')}
                                </p>
                                <form>
                                    <div className="footer-cta-form">
                                        <input id="email" type="email" placeholder={t('Enter your email')} />
                                        <div className="btn-submit" onClick={() => this.mailTo()}><i className="fas fa-long-arrow-alt-right"></i></div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p className="footer-copyright">Copyright &copy; 2021 caribmars.finance. All right reserved</p>
                        {/* <p className="footer-cookie">We use cookies for better service. <a href="#">Accept</a></p> */}
                    </div>
                </div>
            </footer>
    }
}

export default withTranslation()(Footer);