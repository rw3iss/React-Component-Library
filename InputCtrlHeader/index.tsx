import * as React from 'react';
import { IJsonSchemaInputProps } from '../JsonSchemaDefinedInputControl';
import { IJsonSchemaBaseDef } from 'shared/models/IMachineMetadata';
import './style';

interface IProps {
    jsonSchemaDefinition: any;
    title?: string;
    required?: boolean;
    hasBeenSet?: boolean;
}

interface IState {
}

export default class InputCtrlHeader extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
        };
    }

    render() {
        const def = this.props.jsonSchemaDefinition;
        const optional = def.nullable || false; // || (def.required ? false : true) || (this.props.required ? false : true) || false;

        return (
            <label className="input-control-header">
                {this.props.title || def.title}
                { optional && <div className="optional">Optional</div> }
                { (this.props.hasBeenSet ? (null) : <div className="not-set">Not set</div>) }
            </label>
        );
    }
}
