import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/style.css';

import bottom_cta from '../img/home/bottom-cta.jpg';
import { withTranslation } from 'react-i18next';

class Earn extends React.Component {
    render() {
        const { t } = this.props;

        return <section id="bottom-cta" class="bottom-cta">
                    <div class="content">
                        <div class="bottom-cta-inner">
                            <div class="bottom-cta-infos">
                                <h3 class="bottom-cta-ttl">{t('Earn free crypto with Caribmars.finance NFT market place')}</h3>
                                <div class="bottom-cta-links">
                                    <a class="btn btn-blue btn-mr16" href="/connect"><span class="txt">{t('Earn now')}</span></a>
                                    <a class="btn btn-mr16" href="/search"><span class="txt">{t('Discover more')}</span></a>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
    }
}
  
export default withTranslation()(Earn);