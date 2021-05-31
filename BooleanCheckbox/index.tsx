import * as React from 'react';
import { IJsonSchemaBooleanDef } from 'shared/models/IMachineMetadata';
import { IJsonSchemaInputProps } from '../JsonSchemaDefinedInputControl';
import InputCtrlHeader from '../InputCtrlHeader';

interface IProps extends IJsonSchemaInputProps {
    jsonSchemaDefinition: IJsonSchemaBooleanDef;
}

interface IState {
    inputValue: boolean;
    hasFocus: boolean;
    hasBeenSet: boolean;
}
export class BooleanCheckbox extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            inputValue: !!this.props.jsonSchemaDefinition.default,
            hasFocus: false,
            hasBeenSet: false
        };
    }

    onChangeHandler(e: any) {
        const v = e.target.checked;
        this.setState({inputValue: v, hasBeenSet: true});
        this.props.onInputSetAndValid(v);
    }

    render() {
        const def = this.props.jsonSchemaDefinition;
        const inputAttributes = {
            onChange: (e: any) => this.onChangeHandler(e),
            checked: this.state.inputValue
        };
        const body = (<input
            type="checkbox"
            {...inputAttributes}
        />);

        return (
            <div className={ 'json-input-field boolean-checkbox' + (this.state.hasFocus ? ' focus' : '')}>
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
