import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/style.css';

import bottom_cta from '../img/home/bottom-cta.jpg';
import { withTranslation } from 'react-i18next';
import config from '../globals/config';

class Earn extends React.Component {
    render() {
        const { t } = this.props;

        return <section id="bottom-cta" className="bottom-cta">
                    <div className="content">
                        <div className="bottom-cta-inner">
                            <div className="bottom-cta-infos">
                                <h3 className="bottom-cta-ttl">{t('Earn free crypto with Caribmars.finance NFT market place')}</h3>
                                <div className="bottom-cta-links">
                                    {/* <a className="btn btn-blue btn-mr16" href={"/connect"}><span className="txt">{t('Earn now')}</span></a> */}
                                    <a className="btn btn-mr16" href={config.host_url + "/search"}><span className="txt">{t('Discover more')}</span></a>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
    }
}
  
export default withTranslation()(Earn);