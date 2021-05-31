import { h, Component } from 'preact';
import { requestUtils } from 'lib/utils/index';

export default class BasicAsyncComponent extends Component {

    constructor(props: any) {
        super(props);
        this.state = {
            status: '',
            statusMessage: ''
        };
    }

    // UI Helper to execute any "fetch" operation to the backend. On success it will respond with data.
    // Todo: needs better error handling
    // async statusRequest(requestPromise, successCallback?, failureCallback?) {
    //     console.log('status request', requestPromise);
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             this.setLoading();
    //             let res = await requestPromise;
    //             if (res && res.error) {
    //                 this.setError(requestUtils.findError(res));
    //                 if (failureCallback) failureCallback(res);
    //                 console.log('Error response:');
    //                 return reject(res);
    //             } else {
    //                 console.log('r', res);
    //                 this.setSuccess(res.message ? res.message : undefined);
    //                 if (successCallback) successCallback(res);
    //                 return resolve(res);
    //             }
    //         } catch(e) {
    //             this.setError(requestUtils.findError(e));
    //             if (failureCallback) failureCallback(e);
    //             return reject(e);
    //         }
    //     });
    // }

    set(state, cb?) {
        this.setState(state, cb);
    }

    setError(error: string | Error | {} | string[], otherState = {}) {
        let errorMessage = error;

        if (Array.isArray(error)) {
            // We do this capitalization to capitalize input field names that might come back in Validation errors.
            error = error.map(e => { return e.charAt(0).toUpperCase() + e.slice(1) })
            errorMessage = (error as any).join('<br/>');
        } else if (error instanceof Error) {
            errorMessage = error.toString();
        } else if (typeof error === 'object') {
            errorMessage = error.error ? error.error : error.message ? error.message : JSON.stringify(error);
        } else if (typeof error === 'string') { 
            //errorMessage = errorMessage;
        } else {
            errorMessage = "An unknown error occurred.";
        }

        this.setState(Object.assign({
            status: 'error',
            statusMessage: errorMessage
        }, otherState));
    }

    setSuccess(msg: string | undefined = undefined, otherState = {}) {
        this.setState(Object.assign({
            status: 'success',
            statusMessage: msg
        }, otherState));
    }

    setLoading(msg: string | undefined = undefined, otherState = {}) {
        this.setState(Object.assign({
            status: 'loading',
            statusMessage: msg
        }, otherState));
    }

    clearStatus(otherState = {}) {
        this.setState(Object.assign({
            status: '',
            statusMessage: ''
        }, otherState));
    }

    render(): any {
        return undefined;
    }

}