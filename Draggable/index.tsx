import { h, Component, createRef } from 'preact';
import './style.scss';

interface IProps {
    dragHandle: HTMLElement,
    dragTarget: HTMLElement
}

export default class Draggable extends Component<IProps, any> {

    componentDidMount() {
        this.bindEvents();
    }

    bindEvents() {
        let handle = this.props.dragHandle;
        let object = this.props.dragTarget;
        let initX, initY, firstX, firstY;

        if (handle == null || object == null) {
            return;
        }

        object.style.position = 'relative';

        console.log('TEST')
        handle.addEventListener('mousedown', function(e) {
            e.preventDefault();
            initX = object.offsetLeft;
            initY = object.offsetTop;
            firstX = e.pageX;
            firstY = e.pageY;

            window.addEventListener('mousemove', dragIt, false);

            window.addEventListener('mouseup', function() {
                window.removeEventListener('mousemove', dragIt, false);
            }, false);

        }, false);

        function dragIt(e) {
            object.style.left = initX+e.pageX-firstX + 'px';
            object.style.top = initY+e.pageY-firstY + 'px';
        }

        // object.addEventListener('touchstart', function(e) {

        //     e.preventDefault();
        //     initX = this.offsetLeft;
        //     initY = this.offsetTop;
        //     var touch = e.touches;
        //     firstX = touch[0].pageX;
        //     firstY = touch[0].pageY;

        //     this.addEventListener('touchmove', swipeIt, false);

        //     window.addEventListener('touchend', function(e) {
        //         e.preventDefault();
        //         object.removeEventListener('touchmove', swipeIt, false);
        //     }, false);

        // }, false);

        // function swipeIt(e) {
        //     var contact = e.touches;
        //     this.style.left = initX+contact[0].pageX-firstX + 'px';
        //     this.style.top = initY+contact[0].pageY-firstY + 'px';
        // }
    }

    componentDidUpdate = (oldProps) => {
        console.log('new props', this.props, oldProps)
        if (this.props.dragHandle != oldProps.dragHandle || this.props.dragTarget != oldProps.dragTarget) {
            this.bindEvents();
        }
    }

    render() {
        return (
            undefined
        );
    }

}