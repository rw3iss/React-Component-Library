import { h, Component, createRef } from 'preact';
import { throttle, debounce } from 'utils/UiUtils';
import { Blob } from 'models/Blob';

export default class Search extends Component {

    input = createRef();

    state = {
        input: '',
        results: [],
        resultCount: 0,
        showResults: false
    }

    componentWillMount() {
        this.onSearchInput = throttle(this.onSearchInput.bind(this), 200);
        this.hideResults = debounce(this.hideResults.bind(this), 50);
    }

    onSearchInput = () => {
        if (this.input.current.value != '') {
            this._doSearch();
        }

        /* BlobStore.searchBlobs(this._input.value)
            .then((results) => {
                cl('results', results);
                self.setState({ results: results, showResults: true });
            }) */
    }

    onKeyDown = (e) => {
        if (e.key == 'Escape' && this.input.current) {
            this.setState({
                showResults: false
            })
            this.input.current.blur();
        }
    }

    clear = () => {
        this.results = null;
        this.hideResults();
    }

    hideResults() {
        this.showResults = false;
    }

    onInputBlur = () => {
        setTimeout(() => {
            this.hideResults();
        }, 150);
    }

    _doSearch = async () => {
        const self = this;

        // BlobService.searchBlobs(this.input.current.value)
        //     .then(r => {
        //         this.setState({
        //             results: d,
        //             resultCount: d.size,
        //             showResults: true
        //         })
        //     });
    }

    onResultClick(r) {
        this.setState({ showResults: false });
    }

    render() {
        const { input, showResults, results } = this.state;

        return (
            <div id="search" ng-class="{'active': showResults}" flex="row">

                <div class="input-wrapper" flex="row">
                    <input type="text" placeholder="Search..." ref={this.input}
                        onFocus={this.onSearchInput}
                        onBlur={this.onInputBlur}
                        onKeyPress={this.onSearchInput}
                        onKeyDown={this.onKeyDown}
                    />
                    <div class={ 'cancel' + showResults ? ' active' : ''} onClick={this.clear}><i class="fa fa-times">X</i></div>
                </div>

                { showResults && results.length }
                <ul class="results">
                    { results.map(r => {
                        return (
                            <li onClick={route(`/b/${r.id}`)}>
                                <div class="content">{r.title}</div>
                            </li>
                        )
                    })}
                </ul> 

            </div>
        )
    }
};


