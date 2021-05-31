import { h, Component, createRef } from 'preact';

const DEFAULT_MAX_LENGTH = 255;

interface IProps {
    value?: string
}

export default class EditableLabel extends Component {

    input = createRef();

    state = {
        value: "",
        label: "",
        isEditing: false
    }

    componentDidMount() {
        this.setState({
            value: this.props.value,
            label: this.props.value
        });
    }

    onLabelClick = (e) => {
        this.setState({
            isEditing: true
        })

        setTimeout(() => {
            this.input.current.focus()
        }, 0);
    }

    onBlur = (e) => {
        this.setState({
            label: e.target.value,
            value: e.target.value,
            isEditing: false
        })

        if (this.props.onChange) {
            this.props.onChange(e.target.value);
        }
    }

    onKeyPress = (e) => {
        if (e.keyCode == 13) {
            this.setState({
                label: e.target.value,
                value: e.target.value,
                isEditing: false
            })
        }
    }
    
    componentDidUpdate = (oldProps) => {
        if (this.props.value != oldProps.value) {
            this.setState({
                value: this.props.value,
                label: this.props.value
            });
        }
    }

    render() {
        const { isEditing, label } = this.state;

        return (
            <div class={ 'editable-label ' + (this.props.class ? this.props.class : '') }>

                { !isEditing && 
                    <span class="label" onClick={this.onLabelClick}>{label}</span>
                }

                { isEditing && 
                    <input type="text" ref={this.input}
                        class="input-sm"
                        placeholder=""
                        value={label}
                        maxlength="255"
                        onKeyPress={this.onKeyPress}
                        onBlur={this.onBlur}
                    />
                }

            </div>
        );
    }

}
