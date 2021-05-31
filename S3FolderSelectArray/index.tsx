import * as React from 'react';
import * as uuid from 'uuid';
import { IJsonSchemaArrayDef } from 'shared/models/IMachineMetadata';
import { IJsonSchemaInputProps } from '../JsonSchemaDefinedInputControl';
import { S3FolderSelect } from '../S3FolderSelect';
import * as S3 from 'aws-sdk/clients/s3';
import Auth from 'secure/lib/Auth';
import UserUtils from 'shared/utils/UserUtils';
import S3Utils from 'secure/lib/utils/S3Utils';
import './style';


interface IProps extends IJsonSchemaInputProps {
    jsonSchemaDefinition: IJsonSchemaArrayDef;
    domain: string | undefined;
    onFileChangeStart?: () => void;
}

interface IState {
    noFiles: boolean;
    fileCount: number | undefined;
}

export class S3FolderSelectArray extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            noFiles: false,
            fileCount: undefined
        };
    }

    async getS3FolderArray(folderData) {
        const self = this;
        const currentUser = Auth.getCurrentUser();
        const domains = UserUtils.getUsersDomains(currentUser);
        const awsCredentials = UserUtils.getAWSCredentials(currentUser);
        const s3Conn = new S3({
            apiVersion: '2015-09-21',
            region: 'us-east-1',
            credentials: awsCredentials
        });

        const folderPath = this.props.domain + '/' + folderData[0];
        let folderFiles = await S3Utils.getFilesInFolder(awsCredentials, folderPath, undefined, s3Conn);
        if (folderFiles.files.length == 0) {
            //show warning that no files were selected ?
            return this.setState({
                noFiles: true,
                fileCount: undefined
            })
        }

        this.setState({
            noFiles: false,
            fileCount: folderFiles.files.length
        });

        let files = folderFiles.files.map(f => {
            return self.props.domain ? f.Key.substring(self.props.domain.length+1, f.Key.length)
                : f.Key.substring(f.Key.indexOf('/')+1, f.Key.length);
        });

        this.props.onInputSetAndValid(files);
    }

    render() {
        const self = this;
        const props = self.props;
        return (
            <div className="s3-folder-select-array">
                <S3FolderSelect {...props}
                    onInputSetAndValid={d => self.getS3FolderArray(d)}
                    onFileChangeStart={() => self.setState({fileCount: 0})} /> 
                { self.state.noFiles ? (<div className="warning"><label>&nbsp;</label><span>Warning: Selected folder contains no files</span></div>) : (undefined)}
                { self.state.fileCount ? (<div className="file-count"><label>&nbsp;</label><span>Number of files: {this.state.fileCount}</span></div>) : (undefined)}
            </div>
        );
    }
}
