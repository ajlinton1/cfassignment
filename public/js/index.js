function reducer(state = {'tasks':[]}, action) {
    switch (action.type) {
        case 'ADD':
            state.tasks.push(action.task);
            return state
        default:
            return state
    }
}

this.cfassignment = (
    function(cfassignment){
        var self = this;

        var store = Redux.createStore(reducer);
//        var task = {name:'Initial'};
//        store.dispatch({type:'ADD',task:task});
        var provider = ReactRedux.createProvider(store);
        var container = React.createElement(Container,{'store':store});

        ReactDOM.render(
            React.createElement(provider,{'store':store,'children':container}),
            document.getElementById("content")
        );

    }(this.cfassignment || {})
);


