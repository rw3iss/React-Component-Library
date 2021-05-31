import * as React from 'react';
import * as uuid from 'uuid';
import { IJsonSchemaArrayDef } from 'shared/models/IMachineMetadata';
import { IJsonSchemaInputProps } from '../JsonSchemaDefinedInputControl';

/* interface IProps extends IJsonSchemaInputProps {
    //jsonSchemaDefinition: IJsonSchemaArrayDef;
}
 */

interface IProps {
    onFileLoadStarted: (files: any) => any;
    onFolderLoaded: (files: any, directoryName: string, fileData:{ [index: string]: any }) => any;
    isEnabled: boolean;
}

interface IState {
    hasFocus: boolean;
    directoryData: {
        [index: string]: {
            fileType: string | undefined,
            percent: number;
            complete: boolean | undefined;
            data: string | undefined;
        }
    };
    directoryName: string | undefined;
    directoryFileCount: number | undefined;
    uploadedFileError: string | undefined;
    uploadedFilesComplete: boolean;
    inputValue: string;
}

let mounted = false;
export default class InputFolder extends React.Component<IProps, IState> {
    private _input: HTMLInputElement;

    constructor(props: IProps) {
        super(props);
        this.state = {
            hasFocus: false,
            directoryData: {},
            directoryName: undefined,
            directoryFileCount: 0,
            uploadedFileError: undefined,
            uploadedFilesComplete: false,
            inputValue: ''
        };
    }

    componentDidMount(): void {
        this.setInputAttributes();
        mounted = true;
    }

    componentWillUnmount() {
        mounted = false;
    }

    setInputAttributes() {
        this._input.setAttribute('directory', '');
        this._input.setAttribute('webkitdirectory', '');
        this._input.setAttribute('mozdirectory', '');
    }

    async onChangeHandler(e: any) {
        if (mounted)
            this.setState({
                directoryData: {},
                directoryName: undefined,
                directoryFileCount: undefined,
                uploadedFileError: undefined,
                uploadedFilesComplete: false, 
                inputValue: ''//e.target.value
            });

        const filesData: Array<string> = [];
        let directoryName = '';
        let files: any = [];

        if (e.target.files.length > 0) {
            try {
                this.props.onFileLoadStarted(e.target.files);

                const promises = Array.from(e.target.files).map((f: any) => new Promise((resolve, reject) => {
                    try {
                        files.push(f);
                        directoryName = f.webkitRelativePath.split('/')[0];
                        if (mounted)
                            this.setState({
                                directoryName: directoryName
                            })

                        const r = new FileReader();

                        if (mounted)
                            this.setState((prev: IState) => {
                                const dd = prev.directoryData;
                                dd[f.name] = {
                                    complete: false,
                                    fileType: f.type,
                                    percent: 0,
                                    data: undefined
                                };
                                return {directoryData: dd};
                            });

                        r.addEventListener('progress', (e) => {
                            if (e.lengthComputable) {
                                if (mounted)
                                    this.setState((prev: IState) => {
                                        const dd = prev.directoryData;
                                        dd[f.name] = Object.assign({}, dd[f.name], {percent: Math.floor((e.loaded / e.total)*100)});
                                        return {directoryData: dd};
                                    });
                            }
                        });

                        // Done upoading all...
                        r.addEventListener('load', (e) => {
                            const fileData = r.result;
                            filesData.push(fileData);
                            if (mounted)
                                this.setState((prev: IState) => {
                                    const dd = prev.directoryData;
                                    dd[f.name] = Object.assign({}, dd[f.name], {percent: 100, complete: true, data: fileData});
                                    return {directoryData: dd};
                                });
                            resolve();
                        }, false);

                        r.addEventListener('error', (err) => {
                            console.log(`err in promise: ${err}`);
                            reject(err);
                        }, false);

                        r.readAsDataURL(f);
                    } catch (err) {
                        console.log(`err in promise: ${err}`);
                        reject(err);
                    }
                }));

                await Promise.all(promises);

                if (mounted)
                    this.setState({
                        uploadedFilesComplete: true, 
                        uploadedFileError: undefined,
                        directoryName: directoryName,
                        directoryFileCount: files.length
                    });

                this.props.onFolderLoaded(files, directoryName, this.state.directoryData);
                //this.props.onInputSetAndValid(filesData);
            } catch (err) {
                console.log(`err: ${err}`);
                //this.props.onInputInvalid(err);
                if (mounted)
                    this.setState({uploadedFileError: err.message});
            }
        } else {
            if (mounted)
                this.setState({uploadedFileError: 'no files'});
           // this.props.onInputInvalid('no files');
        }

    }

    getTotalDownloadPercent(): number {
        const keys = Object.keys(this.state.directoryData);
        const percentage = keys.reduce((acc, fileName) => acc + (this.state.directoryData[fileName].percent / keys.length), 0);
        return Math.round(percentage);
    }

    onFocusHandler() {
        if (mounted)
            this.setState({hasFocus: true});
    }

    onBlurHandler() {
        if (mounted)
            this.setState({hasFocus: false});
    }

    clearHandler(e: any) {
        e.stopPropagation();
        if (mounted)
            this.setState({
                directoryData: {},
                directoryName: undefined,
                directoryFileCount: undefined,
                uploadedFileError: undefined,
                uploadedFilesComplete: false,
                inputValue: ''
            });
    }

    render(): JSX.Element {
        const id = uuid.v1();
        //const def = this.props.jsonSchemaDefinition;
        const inputAttributes = {
            onChange: (e: any) => this.onChangeHandler(e),
            onFocus: () => this.onFocusHandler(),
            onBlur: () => this.onBlurHandler()
            // TODO fix in React 16
            // these currently cause a warning so we add them in component did mount
            // directory: true,
            // webkitdirectory: true,
            // mozdirectory: true
        };
        let visibleBody;
        let disabled;
        if (Object.keys(this.state.directoryData).length > 0) {
            disabled = {disabled: 'disabled'};
            if (this.state.uploadedFileError) {
                visibleBody = (<label className="upload-button error" htmlFor={id}>
                    { this.props.isEnabled && <a className="clear" onClick={(e) => this.clearHandler(e)}>change</a> }
                    <span className="hint">err: {this.state.uploadedFileError}</span>
                </label>);
            } else {
                const percent = this.getTotalDownloadPercent();
                visibleBody = (<label className="upload-button complete" htmlFor={id}>
                    { this.props.isEnabled && <a className="clear" onClick={(e) => this.clearHandler(e)}>change</a>}
                        <div className="info">
                            { this.state.directoryName && <label>Folder: {this.state.directoryName}</label> }
                            <div>Total files: 
                                { this.state.directoryFileCount == undefined && <span> (counting...)</span> }
                                { this.state.directoryFileCount != undefined && <span> {this.state.directoryFileCount}</span> }
                            </div>
                        </div>
                        { /* Object.keys(this.state.directoryData).map((key) =>
                            (<span className="file-name" key={key}>{key}</span>)) */
                        }
                    <span className="hint">{this.state.uploadedFilesComplete ? 'done' : (percent + '%')}</span>
                </label>);
            }
        } else {
            disabled = {};
            visibleBody = (<label className="upload-button empty" htmlFor={id}>
                <span className="plus">+</span>
                <span className="hint">select a folder</span>
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
