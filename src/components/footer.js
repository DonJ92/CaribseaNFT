import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/style.css';
import * as API from '../adapter/api';

import logo from '../img/logo.png';
import i18n from 'i18next';
import { withTranslation } from 'react-i18next';
import config from '../globals/config';

class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    mailTo() {
        const { t } = this.props;
        var mail_address = document.getElementById("email").value;
        const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        if (mail_address == "") {
            alert(t('Please input the email address.'));
            return;
        }

        if (emailRegexp.test(mail_address)) {
            API.subscribe(mail_address)
            .then((res) => {
                if (res.result) alert(t('Subscribed successfully!'));
                else alert(t('Subscribed failed.'));
            })
            .catch((err) => {
                alert(t('Subscribed failed.'));
            })
        } else {
            alert(t('Please input correct email address.'));
        }
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
                            <p className="footer-lead">{t('Digitize your asset, talent, social media at caribsea.io NFT market place supported by caribmars.finance.')}</p>
                        </div>

                        <div className="footer-body">
                            <div className="footer-nav-block">
                                <p className="footer-nav-ttl">{t('Caribsea NFT market')}</p>
                                <ul className="footer-nav-list">
                                    <li className="footer-nav-item"><a href={config.host_url + "/search"}><span>{t('Discover')}</span></a></li>
                                    {/* <li className="footer-nav-item"><a href="/connect"><span>{t('Connect Wallet')}</span></a></li> */}
                                    <li className="footer-nav-item"><a href={config.host_url + "/upload/type"}><span>{t('Create item')}</span></a></li>
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
                                    <li className="footer-nav-item"><a href={config.host_url + "/faq"}><span>{t('FAQ')}</span></a></li>
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