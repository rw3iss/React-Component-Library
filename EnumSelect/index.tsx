import * as React from 'react';
import { IJsonSchemaInputProps } from '../JsonSchemaDefinedInputControl';
import { IJsonSchemaEnumDef } from 'shared/models/IMachineMetadata';
import InputCtrlHeader from '../InputCtrlHeader';

interface IProps extends IJsonSchemaInputProps {
    jsonSchemaDefinition: IJsonSchemaEnumDef;
}

interface IState {
    inputValue: string;
    hasFocus: boolean;
    hasBeenSet: boolean;
}

export class EnumSelect extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            inputValue: '',
            hasFocus: false,
            hasBeenSet: false
        };
    }

    onChangeHandler(e: any) {
        const v = e.target.value;
        this.setState({inputValue: v, hasBeenSet: true});
        this.props.onInputSetAndValid(v);
    }

    onFocusHandler() {
        this.setState({hasFocus: true});
    }

    onBlurHandler() {
        this.setState({hasFocus: false});
    }

    render() {
        const def = this.props.jsonSchemaDefinition;
        const inputAttributes = {
            onChange: (e: any) => this.onChangeHandler(e),
            onFocus: () => this.onFocusHandler(),
            onBlur: () => this.onBlurHandler(),
            value: this.state.inputValue || '',
            className: this.state.hasFocus ? 'focus' : ''
        };
        const body = (<select {...inputAttributes}>
            {
                def.enum.map((o: any) => <option key={o} value={o}>{o}</option>)
            }
        </select>);

        return (
            <div className={ 'json-input-field enum-select' + (this.state.hasFocus ? ' focus' : '')}>
                <div className="inner">
                    <InputCtrlHeader jsonSchemaDefinition={def} required={this.props.required} hasBeenSet={this.state.hasBeenSet} />
                    <div className="input">
                        {body}
                    </div>
                </div>
            </div>
        );
    }
}
