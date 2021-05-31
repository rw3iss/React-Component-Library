import * as React from 'react';
import { DateUtils } from 'shared/utils/DateUtils';
import { IJsonSchemaInputProps } from '../JsonSchemaDefinedInputControl';
import { IJsonSchemaStringDef } from 'shared/models/IMachineMetadata';
import InputCtrlHeader from '../InputCtrlHeader';

interface IProps extends IJsonSchemaInputProps {
    jsonSchemaDefinition: IJsonSchemaStringDef;
}

interface IState {
    hasFocus: boolean;
    inputValue: string;
    hasBeenSet: boolean;
}

export class DateTimeInput extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
        this.state = {
            hasFocus: false,
            inputValue: '',
            hasBeenSet: false
        };
    }

    private onChangeHandler(e: any) {
        const v = e.target.value;
        this.setState({inputValue: v, hasBeenSet: true});
        const dateValidation = DateUtils.validate(v);
        if (dateValidation) {
            this.props.onInputSetAndValid((DateUtils.dateToIsoString(v) as string));
        } else {
            this.setState({hasBeenSet: false});
            this.props.onInputInvalid(dateValidation as string);
        }
    }

    private onFocusHandler() {
        this.setState({hasFocus: true});
    }

    private onBlurHandler() {
        this.setState({hasFocus: false});
    }

    render(): JSX.Element | any {
        const self = this;
        const def = this.props.jsonSchemaDefinition;
        const inputAttributes = {
            onChange: (e: any) => self.onChangeHandler(e),
            onFocus: () => this.onFocusHandler(),
            onBlur: () => this.onBlurHandler(),
            value: this.state.inputValue,
            className: this.state.hasFocus ? 'focus' : ''
        };
        const body = (<input
            type="datetime-local"
            name={this.props.jsonSchemaDefinition.name}
            {...inputAttributes}
        />);

        return (
            <div className={ 'json-input-field date-time' + (this.state.hasFocus ? ' focus' : '')}>
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
