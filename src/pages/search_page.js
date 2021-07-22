import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import Search from '../components/search';

class SearchPage extends React.Component {
    constructor(props) {
        super(props);

        const { keyword } = this.props.match.params;

        this.state = {
            keyword: keyword
        }
    }

    render() {
        return (
            <div>
                <Header/>
                <Search keyword={this.state.keyword}/>
                <Footer/>
            </div>
        );
    }
}

export default SearchPage;