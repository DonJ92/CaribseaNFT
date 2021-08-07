import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/style.css';
import {AddClass, ChangeClass} from '../js/common';
import CONST from '../globals/constants';
import config from '../globals/config';

import upload_single from '../img/upload/upload-single.jpg'
import upload_multiple from '../img/upload/upload-multiple.jpg';
import { withTranslation } from 'react-i18next';

class UploadType extends React.Component {
    constructor(props) {
        super(props);

        ChangeClass('upload');
        AddClass('has-popup');
    }

    render() {
        const { t } = this.props;

        return (
            <section id="upload-lead" className="upload-lead">
                <div className="content content-768">
                    <div className="upload-lead-head">
                        <h2 className="upload-lead-head-ttl">{t('Upload item')}</h2>
                        <p className="upload-lead-head-txt">
                            {t('Choose "Single" if you want your collectible to be one of a kind or "Multiple" if you want to sell one collectible multiple times')}
                        </p>
                    </div>

                    <div className="upload-lead-row">
                        <div className="upload-lead-col">
                            <div className="upload-lead-figure">
                                <img src={upload_single} alt="" />
                            </div>
                            <a className="btn btn-center" href={config.host_url + "/upload/detail/" + CONST.token_type.SINGLE}><span className="txt">{t('Create Single')}</span></a>
                        </div>
                        <div className="upload-lead-col">
                            <div className="upload-lead-figure">
                                <img src={upload_multiple} alt="" />
                            </div>
                            <a className="btn btn-center btn-blue" href={config.host_url + "/upload/detail/" + CONST.token_type.MULTIPLE}><span className="txt">{t('Create Multiple')}</span></a>
                        </div>
                    </div>

                    <p className="upload-lead-tail">
                        {t('we do not own your private keys and cannot access your funds without your confirmation.')}
                    </p>
                </div>
            </section>
        );
    }
}

export default withTranslation()(UploadType);