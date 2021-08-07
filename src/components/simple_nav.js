import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/style.css';
import { withTranslation } from 'react-i18next';
import config from '../globals/config';

class SimpleNav extends React.Component {
    render() {
        const { t } = this.props;

        return (
            <div className="breadcrumb">
                <div className="content">
                    <div className="breadcrumb-row">
                        <a className="btn btn-h40" href={config.host_url + "/"}>
                            <span className="ico ico-l"><i className="fas fa-long-arrow-alt-left"></i></span>
                            <span className="txt">{t('Back to home')}</span>
                        </a>
                        <div className="breadcrumb-nav">
                            <a href="#"><span>{t('Home')}</span></a>
                            <a><span><i className="fas fa-angle-right"></i></span></a>
                            <a className="current"><span>{t('Upload item')}</span></a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(SimpleNav);