import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import UploadSNSDetail from '../components/upload_sns_detail';

class UploadSNSDetailPage extends React.Component {
    constructor(props) {
        super(props);

        const { params } = this.props.match;

        this.state = {
            type: params.type,
            sns_type: params.sns_type,
            id: params.id,
            token: params.token,
        }
    }

    render() {
        return (
            <div>
                <Header/>
                <UploadSNSDetail type={this.state.type} sns_type={this.state.sns_type} id={this.state.id} token={this.state.token}/>
                <Footer/>
            </div>
        );
    }
}

export default UploadSNSDetailPage;