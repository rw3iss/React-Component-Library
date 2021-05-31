import { h, Component } from 'preact';

export default class Icon extends Component {

    render() {
        return (
            <i class={'icon ' + (this.props.class ? this.props.class : '')}>
                {...this.props.children}
            </i>
        );
    }
}
