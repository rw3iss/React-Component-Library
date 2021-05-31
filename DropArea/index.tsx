import { h, Component } from 'preact';

export default class DropArea extends Component {

    state = {
    }

    dropHandler(e) {
        alert('DROP');
        e.preventDefault();
    }

    dragOverHandler(e) {
        e.preventDefault();
    }

    render() {
        return (
            <div class="drop-area">

                <div id="drop_zone" 
                    ondrop={this.dropHandler}
                    ondragover={this.dragOverHandler}
                    style="width: 200px; height: 200px; border: 1px solid red;">
                    <p>Drag one or more files to this Drop Zone ...</p>
                </div>

            </div>
        );
    }

}