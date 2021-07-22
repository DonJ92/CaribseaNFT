import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/style.css';
import { withTranslation } from 'react-i18next';

class WelCome extends React.Component {
    render() {
        const { t } = this.props;

        return (
            <section id="top-cta">
                <div className="content">
                    <h2 className="top-cta-ttl">
                        <span>{t('CREATE, EXPLORE, & COLLECT DIGITAL ASSET IN CARIBMARS,FINANCE NFT MARKETPLACE')}</span>
                        {t('DEGITIZE EVERYTHING TO CREATE NEW WORLD')}
                    </h2>
                    {/* <a className="top-cta-link btn" href="/search">Start your search</a> */}
                </div>
            </section>
        );
    }
}

export default withTranslation()(WelCome);