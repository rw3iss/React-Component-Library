import * as React from 'react';
import * as uuid from 'uuid';
import { IJsonSchemaArrayDef } from 'shared/models/IMachineMetadata';
import { IJsonSchemaInputProps } from '../JsonSchemaDefinedInputControl';
import FileSelectModal from 'secure/components/shared/Files/FileSelectModal';
import InputCtrlHeader from '../InputCtrlHeader';
import './style';

const isImagePattern = /^.*\.(jpg|jpeg|png|gif|dcm|webp)(\?.*)?$/i;

function isImage(fileName: string) {
    return isImagePattern.test(fileName);
}

function getMimeType(fileName: string) {
    const f = fileName.toLowerCase();
    const few = (ending: string) => f.endsWith(ending);
    if (few('.png')) {
        return 'image/png';
    }
    if (few('.jpg') || few('.jpeg')) {
        return 'image/jpeg';
    }
    if (few('.gif')) {
        return 'image/gif';
    }
    if (few('.dcm')) {
        return 'image/jpeg';
    }
    return 'application/octet-stream';
}

function _getRestrictedFileExtensions(mimeType: string) {
    switch(mimeType) {
        case "image/pdf":
        case "application/pdf":
            return { accept: ".pdf" }
        case "image/jpg":
                return { accept: ".jpg,.jpeg" }
        default:
            return {};
    }
}

interface IProps extends IJsonSchemaInputProps {
    jsonSchemaDefinition: IJsonSchemaArrayDef;
    domain: string | undefined;
    onFileChangeStart?: () => void;
}

interface IState {
    hasFocus: boolean;
    selectedFiles: Array<any>; // s3 managed file details
    uploadedFileName: string | undefined;
    uploadedFileType: string | undefined;
    uploadedFilePercent: number | undefined;
    uploadedFileError: string | undefined;
    fileData: string | undefined;
    uploadedFileComplete: boolean;
    choosingS3File: boolean;
    hasBeenSet: boolean;
}

export class S3FolderSelect extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            hasFocus: false,
            selectedFiles: [],
            uploadedFileName: undefined,
            uploadedFileType: undefined,
            uploadedFilePercent: undefined,
            uploadedFileError: undefined,
            fileData: undefined,
            uploadedFileComplete: false,
            choosingS3File: false,
            hasBeenSet: false
        };
    }

    onFocusHandler() {
        this.setState({ hasFocus: true });
    }

    onBlurHandler() {
        this.setState({ hasFocus: false });
    }

    clearHandler(e: any) {
        e.stopPropagation();
        this.setState({
            selectedFiles: [],
            hasBeenSet: false
        });
        
        if (this.props.onFileChangeStart)
            this.props.onFileChangeStart();

        this.props.onInputInvalid('cleared');
    }

    chooseS3File() {
        this.setState({ choosingS3File: true });
    }

    onSelectSubmit(data) {
        this.setState({ selectedFiles: data, hasBeenSet: true });

        let allData: any = [];
        data.map(f => { 
            let url = f.key;
            allData.push(url);
        });
        
        this.props.onInputSetAndValid(allData);
    }

    render() {
        const self = this;
        const id = uuid.v1();
        const def = this.props.jsonSchemaDefinition;
        const inputAttributes = {
            className: this.state.hasFocus ? 'focus' : ''
        };
        let visibleBody;
        let disabled;
        let mimeType = def["mime-type"] || def["_mime-type"];

        let restrictedFileExtAttrs = _getRestrictedFileExtensions(mimeType);

        if (this.state.selectedFiles.length) {
            visibleBody = (<label className="s3-folder-select upload-button complete" htmlFor={id}>
                    <a className="clear" onClick={(e) => this.clearHandler(e)}>change</a>
                    <div className="file-previews">
                    { this.state.selectedFiles.map((sf,i) => {
                        disabled = {disabled: 'disabled'};
                        const preview = isImage(sf.link) && (<img className="thumbnail" src={sf.link} />);
                        return (<div className="file" key={i}>
                            <span className="file-name">{sf.name}</span>
                            {preview}
                        </div>);
                    }) }
                    </div>
                </label>);
        } else {
            disabled = {};
            visibleBody = (<div className="file-chooser">
                <div className="s3-file-chooser button button-blue-md button-inline" onClick={() => { self.chooseS3File() }}>
                    Select a Folder
                </div>
                { this.state.choosingS3File &&
                    <FileSelectModal
                        selectMultiple={true}
                        onAddNewFile={()=>''}
                        selectMode="folder"
                        onClose={() => self.setState({ choosingS3File: false })}
                        onSelectSubmit={(f) => { self.onSelectSubmit(f) }} />
                }
            </div>);
        }

        const invisibleBody = (<input
            type="file"
            id={id}
            className={this.state.hasFocus ? 'focus' : ''}
            {...inputAttributes}
            {...disabled}
            {...restrictedFileExtAttrs}
        />);
        
        const title = def.items ? def.items.title : '' || def.title;
        const showLabel = true;// title.length || this.props.required;
        return (
            <div className={ 'json-input-field file-input' + (this.state.hasFocus ? ' focus' : '')}>
                <div className="inner">
                    { showLabel && <InputCtrlHeader 
                        jsonSchemaDefinition={def} 
                        title={(def.items ? def.items.title : '') || def.title} 
                        required={this.props.required}
                        hasBeenSet={this.state.hasBeenSet} /> 
                    }

                    { showLabel && <label><span className="optional">{this.props.required ? '*' : ''}</span></label> }
                    <div className="input">
                        {visibleBody}
                        {invisibleBody}
                    </div>
                </div>
            </div>
        );
    }
}
