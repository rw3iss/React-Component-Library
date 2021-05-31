import { h, Component } from 'preact';
import FPS from './fps';
import './style.scss';

export default class FPSCounter extends Component{

    componentDidMount() {
        const self = this;
        var fps = new FPS("#fps-container", 250);
        fps.start();
    }

    render() {
        return (
            <div id="fps-counter">
                <div id="fps-container"></div>
            </div>
        );
    }

}