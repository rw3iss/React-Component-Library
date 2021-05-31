import { h, Component, createRef, isValidElement, cloneElement } from 'preact';
import { forwardRef } from "preact/compat";
import FormField from './FormField';

interface IProps {
    onSubmit: (data: any) => void
}

function recursiveMap(children, fn) {
    return React.Children.map(children, child => {
      if (!isValidElement(child)) {
        return child;
      }
  
      if (child.props.children) {
        child = cloneElement(child, {
          children: recursiveMap(child.props.children, fn)
        });
      }
  
      return fn(child);
    });
  }

export default class Form extends Component<IProps, any> {

    public fieldRefs: []

    state = {
        fields: {}
    }

    public getFields = () => {
        let data = {};

        for(let r of this.fieldRefs) {
            let f = r.ref.current;
            data[f.props.id] = f.field.current.value;
        }

        return data;
    }

    // make refs to FormField children for getting values from Parent later.
    componentWillMount = () => {
        this.fieldRefs = [];
        for(let f of this.props.children) {
            if (f && f.type.name == 'FormField') {
                f.ref = createRef();
                this.fieldRefs.push(f);
                //data[f.getId()] = f.getValue();
            }
        }
    }

    // onFieldChange = (id, value) => {
    //     console.log('field change', id, value);
    //     let fields = this.state.fields;
    //     fields[id] = value;
    //     this.setState({fields});
    // }

    submit = (e) => {
        e.preventDefault();
        this.props.onSubmit();
    }

    render() {
        const self = this;
        return (
            <form class={'form ' + (this.props.class ? this.props.class : '')}>

                {/* 
                { this.props.fields ?

                    this.props.fields.map(f => {
                        return (
                            <FormField onChange={self.onFieldChange} />
                        );
                    })z`z
                    : undefined
                } 
                */}

                {this.props.children}

            </form>
        );
    }
}