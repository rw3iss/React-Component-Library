import * as React from 'react';
import { IJsonSchemaNumberDef } from 'shared/models/IMachineMetadata';
import { IJsonSchemaInputProps } from '../JsonSchemaDefinedInputControl';
import InputCtrlHeader from '../InputCtrlHeader';

interface IProps extends IJsonSchemaInputProps {
    jsonSchemaDefinition: IJsonSchemaNumberDef;
};

interface IState {
    inputValue: number;
    hasFocus: boolean;
    hasBeenSet: boolean;
};

export class NumberSpinner extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            inputValue: this.props.jsonSchemaDefinition.default || this.props.jsonSchemaDefinition.minimum || 0.0,
            hasFocus: false,
            hasBeenSet: false
        };
    }

    onChangeHandler(e: any) {
        const def = this.props.jsonSchemaDefinition;
        const v = parseFloat(e.target.value);

        this.setState({inputValue: v, hasBeenSet: true});
        if (isNaN(v) ||
            (def.maximum !== undefined && v > def.maximum) ||
            (def.minimum !== undefined && v < def.minimum)) {
            this.props.onInputInvalid(`invalid ${v}`);
        } else {
            this.props.onInputSetAndValid(v);
        }
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
            step: '.01',
            placeholder: '0.00'
        };

        if (def.minimum) {
            numInputAttributes.min = def.minimum;
            if (def.minimum > 0) {
                numInputAttributes.placeholder = def.minimum;
            }
            
        }
        if (def.maximum) {
            numInputAttributes.max = def.maximum;
            if (def.minimum !== undefined && def.minimum < 0) {
                numInputAttributes.placeholder = def.maximum;
            }
        }

        const body = (<input
            type="number"
            {...inputAttributes}
            {...numInputAttributes}
        />);

        return (
            <div className={ 'json-input-field number-spinner' + (this.state.hasFocus ? ' focus' : '')}>
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
