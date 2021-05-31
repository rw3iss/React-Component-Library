import { h, Component } from 'preact';
import dateFormat from 'dateformat';
import './style.scss';

interface IProps {
    item: any
}

export default class Item extends Component{

    handleClick() {
        /*
        if(this.props.item.isOpen == true)
            this.props.item.isOpen = false;
        else 
            this.props.item.isOpen = true;
        this.forceUpdate();
        */

        if (this.props.item.demo) {
            window.open(this.props.item.demo);
        } else {
            window.open(this.props.item.url);
        }

        //this.props.history.push('/entry/' + this.props.item.key);
    }

    render() {
        var self = this;
        var item = this.props.item;

        if(item.date_added) {
            var date = Date.parse(item.date_added);
            var dateString = dateFormat(date, 'mmmm dS, yyyy');
        } else if (item.date_from) {
            var dateFrom = Date.parse(item.date_from);
            var dateTo = Date.parse(item.date_to);
            var dateString = dateFormat(dateFrom, 'mmmm yyyy') + ' to ' + dateFormat(dateTo, 'mmmm yyyy');
        }

        return (
            <div class={"item " + (item.isOpen == true ? 'open' : '')}>
                <div class="inner clear" onClick={this.handleClick}>
                    <div class="thumb">{item.thumb && <img src={item.thumb}/>}</div>
                    <div class="text-top">
                        <div class="date">{dateString}</div>
                        <div class="title">{item.title}</div>
                        {item.url && <div class="link"><a href={item.url} target="_blank">{item.url}</a></div>}
                        {item.tags && <div class="tags"><span className="label">Tags:</span> {item.tags}</div>}
                    </div>
                    <div class="text-bottom">
                        <div class="content" dangerouslySetInnerHTML={{__html: item.description}}></div>
                    </div>
                    { item.demo && <div class="demo-link">
                        <a href={item.demo} target="_blank">Demo</a>
                    </div>
                    }
                </div>
            </div>
        );
    }

}