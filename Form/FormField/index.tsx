import { h, Component, createRef } from 'preact';

interface IProps {
    id: string;
    classname: string;
    label?: string;
    type?: string;
    value: any;
    disabled?: boolean;
    autoComplete?: string;
    error?: string;
    focus?: boolean;
    onChange: (id, value) => void
    onEnter: () => void
}

export default class FormField extends Component<IProps, any> {

    public field = createRef();

    getId() {
        return this.props.id;
    }

    getValue() {
        return this.field.current.value;
    }

    onChange = (e) => {
        if (this.props.onChange) 
            this.props.onChange(this.props.id, e.target.value);
    }

    componentDidMount() {
        this.test = { test: "test" }
        if (this.props.focus) {
            this.field.current.focus();
        }
    }

    render() {
        const { className, label, type, disabled, autoComplete, error, focus, onEnter } = this.props;
        return (
            <div class={'form-field ' + (className ? className : '')}>

                <label>{label}</label>

                <div class="input-row">
                    { type == 'select' ? (
                        <select onChange={(e) => {
                            this.onChange(e);
                        }} ref={this.field}>
                            {this.props.options ? this.props.options.map(o => {
                                return (<option value={o.value}>{o.label}</option>)
                            }) : undefined}
                        </select>
                    ) : (
                        <input
                            ref={this.field}
                            type={type}
                            /*value={value}*/
                            disabled={disabled}
                            autoComplete={autoComplete}
                            onKeyPress={(e) => { // onKeyUp and onKeyPress miss events
                                if (e.keyCode == 13 && onEnter) { onEnter() }
                                else { this.onChange(e) }}
                            }
                        />
                    )}

                    {error && <div class="field-error">{error.error}</div>}
                </div>

            </div>
        );
    }
}