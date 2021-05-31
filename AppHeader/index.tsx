import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import Search from './Search';
import Icon from 'components/shared/Icon';
import AuthService from 'services/AuthService';
import './style.scss';

export default class AppHeader extends Component {

    state = {
        isLoggedIn: false
    }

    componentWillMount() {

        // todo: subscribe to app events

        this.setState({
            isLoggedIn: AuthService.isAuthenticated()
        })
    }

    render() {
        const { isLoggedIn } = this.state;

        return (
            <div id="app-header" class="flex-full">

                <div class="logo col-left">
                    <Link href="/">Learn Source</Link>
                </div>

                <div class="search col-center flex-fill">
                    <Search />
                </div>

                <nav class="nav col-right flex-center">
                    {isLoggedIn &&
                        <Link href="/dash">
                            <Icon><i class="fa fa-xs fa-chalkboard"></i></Icon>
                        </Link>
                    }

                    {isLoggedIn &&
                        <Link href="/profile">
                            <Icon><i class="fa fa-xs fa-user"></i></Icon>
                        </Link>
                    }

                    {isLoggedIn == false &&
                        <Link href="/login">Login
                            <Icon><i class="fa fa-xs fa-login"></i></Icon>
                        </Link>
                    }

                    {isLoggedIn == false &&
                        <Link href="/register">Register
                            <Icon><i class="fa fa-xs fa-sign-in"></i></Icon>
                        </Link>
                    }
                    <Link href="/help">
                        <Icon><i class="fa fa-xs fa-question"></i></Icon>
                    </Link>
                </nav>

            </div >
        )
    }

}