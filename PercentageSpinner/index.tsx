import * as React from 'react';
import { IJsonSchemaInputProps } from '../JsonSchemaDefinedInputControl';
import { IJsonSchemaNumberDef } from 'shared/models/IMachineMetadata';
import InputCtrlHeader from '../InputCtrlHeader';

interface IProps extends IJsonSchemaInputProps {
    jsonSchemaDefinition: IJsonSchemaNumberDef;
}

interface IState {
    inputValue: number;
    hasFocus: boolean;
    hasBeenSet: boolean;
}

export class PercentageSpinner extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            inputValue: this.props.jsonSchemaDefinition.default || this.props.jsonSchemaDefinition.minimum || 0.0,
            hasFocus: false,
            hasBeenSet: false
        };
    }

    onChangeHandler(e: any) {
/*         const def = this.props.jsonSchemaDefinition;
        const v = parseFloat(e.target.value) / 100;

        this.setState({inputValue: v});
        if (isNaN(v) ||
            (def.maximum !== undefined && v > def.maximum) ||
            (def.minimum !== undefined && v < def.minimum)) {
            this.props.onInputInvalid(`invalid ${v}`);
        } else {
            this.props.onInputSetAndValid(v);
        } */

        this.setState({inputValue: e.target.value, hasBeenSet: true});
        this.props.onInputSetAndValid(e.target.value);
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
            value: this.state.inputValue,
            className: this.state.hasFocus ? 'focus' : ''
        };
        const numInputAttributes: any = {
            step: '1',
            placeholder: '0',
            min: '0',
            max: '100'
        };
        const body = (<input
            type="number"
            {...inputAttributes}
            {...numInputAttributes}
        />);

        return (
            <div className={ 'json-input-field percentage-spinner' + (this.state.hasFocus ? ' focus' : '')}>
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
