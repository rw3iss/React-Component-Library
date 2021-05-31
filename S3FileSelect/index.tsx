import * as React from 'react';
import * as uuid from 'uuid';
import { IJsonSchemaStringDef,IJsonSchemaBaseDef } from 'shared/models/IMachineMetadata';
import { IJsonSchemaInputProps } from '../JsonSchemaDefinedInputControl';
import FileSelectModal from 'secure/components/shared/Files/FileSelectModal';
import S3DicomPreview from 'secure/components/shared/Machines/Evaluate/Controls/Input/S3DicomPreview';
import DicomFileOutput from 'secure/components/shared/Machines/Evaluate/Controls/Output/DicomFileOutput';
import InputCtrlHeader from '../InputCtrlHeader';
import './style';

const isImagePattern = /^.*\.(jpg|jpeg|png|gif|dcm|webp)(\?.*)?$/i;

function isDicom(fileName: string) {
    return (/^.*\.(dcm)(\?.*)?$/i).test(fileName);
}

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
        case "application/dicom":
        return { accept: ".dcm,.dicom" }
        default:
            return {};
    }
}

interface IProps extends IJsonSchemaInputProps {
    jsonSchemaDefinition: IJsonSchemaStringDef;
    onFileChangeStart?: () => any;
    onFileChanged?: (file) => any;
}

interface IState {
    hasFocus: boolean;
    selectedFile: any; // s3 managed file details
    uploadedFileName: string | undefined;
    uploadedFileType: string | undefined;
    uploadedFilePercent: number | undefined;
    uploadedFileError: string | undefined;
    fileData: string | undefined;
    uploadedFileComplete: boolean;
    choosingS3File: boolean;
    fileType: string;
    previewImage: string | undefined;
    hasBeenSet: boolean;
}

export class S3FileSelect extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            hasFocus: false,
            selectedFile: null,
            uploadedFileName: undefined,
            uploadedFileType: undefined,
            uploadedFilePercent: undefined,
            uploadedFileError: undefined,
            fileData: undefined,
            uploadedFileComplete: false,
            choosingS3File: false,
            fileType: '',
            previewImage: undefined,
            hasBeenSet: false
        };

    }

    unsupportedMimeType(def) {
        return (
            <div className="error">Mime-type unsupported or not provided in schema definition for type '{def.type}'.</div>
        )
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
            selectedFile: undefined,
            fileType: '',
            hasBeenSet: false
        });

        if (this.props.onFileChangeStart)
            this.props.onFileChangeStart();

        this.props.onInputInvalid('cleared');
    }

    chooseS3File() {
        this.setState({ choosingS3File: true });
    }

    onFileSelected(data) {
        let file = data[0];
        let url = file.key;
        this.props.onInputSetAndValid(url);
        let fileType = isDicom(url) ? 'dicom' : isImage(url) ? 'image' : '';
        this.setState({
            selectedFile: file,
            fileType:  fileType,
            hasBeenSet: true
        });
        if (this.props.onFileChanged) this.props.onFileChanged(file);
    }

    openImagePreview(url) {
        this.setState({
            previewImage: url
        })
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

        if (!mimeType) {
            if (def['dicom-type']) {
                mimeType = 'application/dicom';
            } else {
                return self.unsupportedMimeType(def);
            }
        }

        let restrictedFileExtAttrs = _getRestrictedFileExtensions(mimeType);

        if (this.state.selectedFile) {
            disabled = {disabled: 'disabled'};

            let preview;
            if (isDicom(this.state.selectedFile.link)) {
                preview = undefined;//<DicomFileOutput contentLocation={""} value={this.state.selectedFile.link} />;
            } else if (isImage(this.state.selectedFile.link)) {
                preview = (<img className="thumbnail" src={this.state.selectedFile.link} onClick={() => this.openImagePreview(this.state.selectedFile.link)} />);
            }

            visibleBody = (<label className={"s3-file-select upload-button complete" + (this.state.fileType == 'dicom' ? ' is-dicom' : '')} htmlFor={id}>
                <a className="clear" onClick={(e) => this.clearHandler(e)}>change</a>
                <div className="file-preview">
                    <span className="file-name">{this.state.selectedFile.name}</span>
                </div>
                {preview}
            </label>);

        } else {
            disabled = {};
            visibleBody = (<div className="file-chooser">
                <div className="s3-file-chooser button button-blue-md button-inline" onClick={() => { self.chooseS3File() }}>
                    Select a File
                </div>
                { this.state.choosingS3File &&
                    <FileSelectModal
                        selectMode="file"
                        selectMultiple={false}
                        onAddNewFile={()=>''}
                        onClose={() => self.setState({ choosingS3File: false })}
                        onSelectSubmit={(d) => { self.onFileSelected(d) }} />
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

        return (
            <div className={ 'json-input-field file-input' + (this.state.hasFocus ? ' focus' : '') }>
                <div className="inner">
                    <InputCtrlHeader jsonSchemaDefinition={def} required={this.props.required} hasBeenSet={this.state.hasBeenSet} />
                    <div className="input">
                        {visibleBody}
                        {invisibleBody}
                    </div>
                </div>

                { this.state.previewImage != undefined &&
                    <div className="image-preview" onClick={() => self.setState({ previewImage: undefined })}>
                        <div className="inner">
                            <img src={this.state.previewImage} />
                        </div>
                    </div>
                }
            </div>
        );
    }
}
