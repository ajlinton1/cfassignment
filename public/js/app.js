// Redux store for maintaining app state

this.cfassignment = (
    function(cfassignment){

        cfassignment.reducer = function(state = {'tasks':[]}, action) {
            switch (action.type) {
                case 'ADD':
                    state.tasks.push(action.task);
                    action.task.id = state.tasks.length - 1;
                    state.dirty = true;
                    return state;
                case 'ADD_BULK':
                    state.tasks = action.tasks;
                    return state;
                case 'DELETE':
                    state.tasks = state.tasks.filter(function(task){
                        return (task!=action.task);
                    });
                    state.dirty = true;
                    return state;
                case 'UPDATE':
                    state.tasks[action.update.id].name = action.update.name;
                    state.dirty = true;
                    return state;
                case 'SHOW_ALERT':
                    state.alertRequired = true;
                    state.alertText = action.text;
                    return state;
                case 'HIDE_ALERT':
                    state.alertRequired = false;
                    return state;
                default:
                    return state
            }
        };

        let store = Redux.createStore(cfassignment.reducer);
        let provider = ReactRedux.createProvider(store);
        let container = React.createElement(Container,{'store':store});

        cfassignment.init = function() {
            ReactDOM.render(
                React.createElement(provider,{'store':store,'children':container}),
                document.getElementById("content")
            );
        };

        return cfassignment;

    }(this.cfassignment || {})
);
