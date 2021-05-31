import { h, render, Component } from 'preact';

interface IProps {
    click?: (e: any) => void;
}

export default class Button extends Component<IProps, any> {

    constructor(props) {
        super(props);
        this.state = {
            label: "A"
        }
    }

    render(props) {
        return <div class="button" onClick={props.click ? props.click : () => null}>{...props.children}</div>
    }
}