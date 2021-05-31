import { h, Component, createRef } from 'preact';
import { throttle, debounce } from '../utils/UiUtils';
import './style.scss';

export default class AutoComplete extends Component {

    input;

    state = {
        results: [],
        resultCount: 0,
        showResults: false
    }

    componentWillMount() {
        this.onSearchInput = throttle(this.onSearchInput.bind(this), this.props.throttle || 500);
        this.hideResults = debounce(this.hideResults.bind(this), this.props.debounce || 100);
        this.input = this.props.ref || createRef();
    }

    onSearchInput = () => {
        if (this.input.current.value != '') {
            this._doSearch();
        }
    }

    onKeyDown = (e) => {
        if (e.key == 'Escape' && this.input.current) {        
            this.hideResults();
            this.input.current.blur();
        } else if (e.key == 'Backspace' && this.input.current) {   
            if (this.input.current.value != '') {
                console.log('BACKSPACE');
                setTimeout(() => {
                    this._doSearch();
                });
            }
        }
    }

    clear = () => {
        this.results = null;
        this.input.current.value = '';
        this.hideResults();
    }

    hideResults() {
        this.setState({ showResults: false });
    }

    onInputBlur = () => {
        setTimeout(this.hideResults, 100);
    }

    _doSearch = async () => {
        console.log('_doSearch', this.input.current.value);
        let r = await this.props.changeHandler(this.input.current.value);
        console.log('SEE results', r)
        this.setState({
            results: r,
            resultCount: r.length,
            showResults: true
        })
    }

    onResultClick(r) {
        this.setState({ showResults: false });
    }

    render() {
        const { showResults, results } = this.state;
        return (
            <div class={'auto-complete flex ' + (showResults ? 'active' : '')}>

                <div class="input-wrapper flex">
                    <input class={this.props.inputClass || ''} type="text" placeholder="Search..." ref={this.input}
                        onFocus={this.onSearchInput}
                        onBlur={this.onInputBlur}
                        onKeyPress={this.onSearchInput}
                        onKeyDown={this.onKeyDown}
                    />
                    <div class={ 'button plain tiny cancel' + (showResults ? ' active' : '')} onClick={this.clear}><i class="fa fa-times">X</i></div>
                </div>

                { (showResults && results.length != 0) &&
                    <ul class="results">
                        { results.map(r => {
                            return (
                                this.props.renderItem ? this.props.renderItem(r) : (
                                    <li onClick={route(`/b/${r.id}`)}>
                                        <div class="content">{r.title}</div>
                                    </li>
                                )
                            )
                        })}
                    </ul> 
                }

            </div>
        )
    }
};


