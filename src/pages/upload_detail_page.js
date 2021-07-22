import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import UploadDetail from '../components/upload_detail';

class UploadDetailPage extends React.Component {
    constructor(props) {
        super(props);

        const { type } = this.props.match.params;

        this.state = {
            type: type
        }
    }

    render() {
        return (
            <div>
                <Header/>
                <UploadDetail type={this.state.type}/>
                <Footer/>
            </div>
        );
    }
}

export default UploadDetailPage;