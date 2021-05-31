import { h, Component } from 'preact';

export default class Loader extends Component {

    render() {
        const size = this.props.size || 'small';

        return (
            <i class={'icon-loader ' + size} aria-hidden="true"></i>
        );
    }

}