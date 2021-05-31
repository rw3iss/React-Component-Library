import * as React from 'react';
import * as uuid from 'uuid';
import { IJsonSchemaArrayDef } from 'shared/models/IMachineMetadata';
import { IJsonSchemaInputProps } from '../JsonSchemaDefinedInputControl';

/* interface IProps extends IJsonSchemaInputProps {
    //jsonSchemaDefinition: IJsonSchemaArrayDef;
}
 */

interface IProps {
    onFileLoaded: (file: any, data: any) => any;
    isEnabled: boolean;
}

interface IState {
    hasFocus: boolean;
    fileData: {} | undefined;
    uploadedFileError: string | undefined;
    uploadedFileComplete: boolean;
    inputValue: string;
}

export default class InputFile extends React.Component<IProps, IState> {
    private _input: HTMLInputElement;

    constructor(props: IProps) {
        super(props);
        this.state = {
            hasFocus: false,
            fileData: undefined,
            uploadedFileError: undefined,
            uploadedFileComplete: false,
            inputValue: ''
        };
    }

    async onChangeHandler(e: any) {
        if (e.target.files.length > 0) {
            let file = e.target.files[0];

            this.setState({
                fileData: {},
                uploadedFileError: undefined,
                uploadedFileComplete: false,
                inputValue: ''
            });
            
            let fileData = await new Promise((resolve, reject) => {
                try {
                    const r = new FileReader();

                    this.setState((prev: IState) => {
                        let data = {
                            complete: false,
                            fileType: file.type,
                            percent: 0,
                            data: undefined,
                            name: file.name
                        };
                        return {fileData: data};
                    });

                    r.addEventListener('progress', (e) => {
                        if (e.lengthComputable) {
                            this.setState((prev: IState) => {
                                let data: any = Object.assign(prev.fileData, {percent: Math.floor((e.total / e.loaded) * 100) / 100});
                                return {fileData: data};
                            });
                        }
                    });

                    r.addEventListener('load', (e) => {
                        const fileData = r.result;
                        //let data = e.target;
                        this.setState((prev: IState) => {
                            let d: any = Object.assign(prev.fileData, {complete: true, data: fileData});
                            return {fileData: d};
                        });
                        resolve(fileData);
                        this.props.onFileLoaded(file, this.state.fileData);//, data: this.state.fileData });
                    }, false);

                    r.addEventListener('error', (err) => {
                        console.log(`err in promise: ${err}`);
                        reject(err);
                    }, false);

                    r.readAsDataURL(file);
                } catch (err) {
                    console.log(`err in promise: ${err}`);
                    reject(err);
                }
            });
        } else {
            this.setState({uploadedFileError: 'no files'});
            // this.props.onInputInvalid('no files');
        }
    }

    getTotalDownloadPercent(): number {
        //const percentage = this.state.fileData.percent / keys.length), 0);
        let percentage = 1;
        return Math.round(percentage * 100);
    }

    onFocusHandler() {
        this.setState({hasFocus: true});
    }

    onBlurHandler() {
        this.setState({hasFocus: false});
    }

    clearHandler(e: any) {
        e.stopPropagation();
        this.setState({
            fileData: undefined,
            uploadedFileError: undefined,
            uploadedFileComplete: false,
            inputValue: ''
        });
    }

    render(): JSX.Element {
        const id = uuid.v1();
        const inputAttributes = {
            onChange: (e: any) => this.onChangeHandler(e),
            onFocus: () => this.onFocusHandler(),
            onBlur: () => this.onBlurHandler()
        };
        let visibleBody;
        let disabled;

        if (this.state.fileData) {
            disabled = {disabled: 'disabled'};

            if (this.state.uploadedFileError) {
                visibleBody = (<label className="upload-button error" htmlFor={id}>
                    { this.props.isEnabled && <a className="clear" onClick={(e) => this.clearHandler(e)}>change</a> }
                    <span className="hint">err: {this.state.uploadedFileError}</span>
                </label>);
            } else {
                const percent = this.getTotalDownloadPercent();
                visibleBody = (<label className="upload-button complete" htmlFor={id}>
                    { this.props.isEnabled && <a className="clear" onClick={(e) => this.clearHandler(e)}>change</a> }
                    <span className="file-name">{(this.state.fileData as any).name}</span>
                    <span className="hint">{this.state.uploadedFileComplete ? 'done' : percent}</span>
                </label>);
            }
        } else {
            disabled = {};
            visibleBody = (<label className="upload-button empty" htmlFor={id}>
                <span className="plus">+</span>
                <span className="hint">select a file</span>
            </label>);
        }

        const invisibleBody = (<input
            type="file"
            value={this.state.inputValue}
            id={id}
            className={this.state.hasFocus ? 'focus' : ''}
            {...inputAttributes}
            {...disabled}
            ref={(input) => {if (input !== null) {this._input = input; }}}
        />);
        return (
            <div className={ 'json-input-field file-input' + (this.state.hasFocus ? ' focus' : '')}>
                <div className="inner">
                    <div className="input">
                        {visibleBody}
                        {invisibleBody}
                    </div>
                </div>
            </div>
        );
    }
}
