import React from 'react'
import ReactDom from 'react-dom'
import {render} from 'react-dom'
import {BrowserRouter as Router, Route, browserHistory, Link, Switch} from 'react-router-dom'
import {IntlProvider, FormattedMessage} from 'react-intl'

//-------- Importacion de componentes ----------//

import LoginForm from './componentes/Login.jsx';
import Tienda from './componentes/tienda/Tienda.jsx';
import Carrito from './componentes/tienda/Carrito.jsx';
import Producto from './componentes/tienda/Producto.jsx';
//import NotFound from './componentes/NotFound.jsx';

ReactDom.render(
    <IntlProvider locale="en">
        <Router history={browserHistory}>
            <div>
                <Switch>
                    <Route exact path="/" component={LoginForm}/>
                    <Route exact path='/tienda' activeClassName="active" component={Tienda}/>
                    <Route exact path='/carrito' activeClassName="active" component={Carrito}/>
                    <Route exact path='/producto/:idProducto' activeClassName="active" component={Producto}/>
                </Switch>    
            </div>
        </Router>
    </IntlProvider>, document.getElementById('app')
)

