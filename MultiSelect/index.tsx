import { h, Component, createRef } from 'preact';

import './style.scss';

interface IProps {
    label: string;
    items: [];
    onChange: () => void;
    hideOnBlur?: boolean;
}

const HOVER_HIDE_DELAY = 250;

export default class MultiSelect extends Component<any, any> {

    element;

    mouseIsOver = false;

	constructor(props) {
        super(props);
        this.element = createRef();
        this.state = {
            isOpen: false,
            selectedItems: []
        }
    }
    
    clickListener = (e) => {
        if (!(e as any).path.includes(this.element.current)) {
            this.setState({
                isOpen: false
            })
        }
    };

	componentDidMount() {
        const self = this;
        document.addEventListener('click', this.clickListener);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.clickListener);
    }
    
    onSelect = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    renderSelectedItems() {
        // show default label if nothing selected
        if (this.state.selectedItems.length == 0) {
            return this.props.label;
        }
        return this.state.selectedItems.join(', ');
    }

    isSelected(item) {
        return this.state.selectedItems.find(o => o === item) != undefined;
    }

    select = (item) => {
    }

    toggleSelectOption = (item) => {
        if (this.isSelected(item)) {
            let idx = this.state.selectedItems.findIndex(o => o === item);
            this.state.selectedItems.splice(idx, 1);
            this.setState({
                selectedItems: this.state.selectedItems
            })
        } else {
            this.setState({
                selectedItems: [...this.state.selectedItems, item]
            })
        }

        setTimeout(() => this.props.onChange(this.state.selectedItems), 0);
    }

    deselectAll = () => {
        this.setState({
            selectedItems: []
        });
    }
    
    selectAll = () => {
        this.setState({
            selectedItems: this.props.items
        });
    }
    
    onHover = () => {
        this.mouseIsOver = true;
    }

    onBlur = () => {
        const self = this;
        this.mouseIsOver = false;
        console.log("blur");
        if (self.props.hideOnBlur) {
            setTimeout(() => {
                if (!self.mouseIsOver) {
                    self.setState({
                        isOpen: false
                    });
                }
            }, HOVER_HIDE_DELAY);
        }
    }

	render() {
		const self = this;
		const page = '';

		return (
			<div className="multi-select" ref={this.element} onMouseEnter={this.onHover} onMouseLeave={this.onBlur}>

                { JSON.stringify(this.state.seletedItems) }

               <div className="select" onClick={this.onSelect}>
                    <div className="label">{this.renderSelectedItems()}</div>
               </div>

               <div className={ 'items' + (this.state.isOpen ? ' open' : '') }>
                    <div className="actions">
                        <a className="action" onClick={this.deselectAll}>Deselect All</a>
                        <a className="action" onClick={this.selectAll}>Select All</a>
                    </div>
                    { this.props.items.map((o,i) => {
                        return (<div key={i} className={ 'item' + (self.isSelected(o) ? ' selected' : '') }>
                            <input id={`language-${o}`} type="checkbox" value={o} onChange={(e) => self.toggleSelectOption(o)} checked={this.isSelected(o)} />
                            <label htmlFor={`language-${o}`} className="item-label">{o}</label>
                        </div>);
                    })}
               </div>

			</div>
		);
	}
	
}
