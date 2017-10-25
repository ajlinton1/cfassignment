// React components
// TODO: Move each component to a separate source file
// TODO: Utilize JSX
// TODO: Use React-Redux to reference store from components

class Title extends React.Component{
    render() {
        return React.createElement('span',{className:'title'},this.props.text);
    }
}

class Button extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
        if (this.props.disabled) {
            this.state.disabled = this.props.disabled;
        }
    }

    render() {
        let buttonProps = {};
        buttonProps.onClick = this.props.event;
        buttonProps.disabled = this.props.disabled;
        buttonProps.className = 'button';
        buttonProps.id = this.props.id;
        return React.createElement('button',buttonProps,this.props.text);
    }
}

class DeleteButton extends React.Component{
    render() {
        let buttonProps = {};
        buttonProps.onClick = this.props.event;
        let deleteItem = React.createElement('i',{className:'fa fa-trash'},'');
        return React.createElement('button',buttonProps,null,deleteItem);
    }
}

class DismissButton extends React.Component{
    render() {
        let buttonProps = {};
        buttonProps.onClick = this.props.onClick;
        let deleteItem = React.createElement('i',{className:'fa fa-window-close'},'');
        return React.createElement('button',buttonProps,null,deleteItem);
    }
}

class Input extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            'value':props.value
        }
    }

    handleChange(event) {
        this.setState({value: event.target.value});
        let update = {id:this.props.id, name:event.target.value};
        this.props.store.dispatch({ type: 'UPDATE',update });
    }

    render() {
        return React.createElement('input',{'value':this.state.value,'onChange':this.handleChange.bind(this)});
    }
}

class Task extends React.Component{
    render() {
        let deleteButton = React.createElement(DeleteButton,{'event':this.props.delete,'taskId':this.props.taskId});
        let text = React.createElement(Input,{'value':this.props.name,'onTaskChange':this.props.onTaskChange,'id':this.props.id,store:this.props.store});
        return React.createElement('div',{'id':this.props.id,className:'task'},text,deleteButton);
    }
}

class TaskContainer extends React.Component{

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount () {
        const stopRender = this.props.store.subscribe(()=>{
            this.setState(this.props.store.getState());
        })
    }

    render() {
        let taskComponents = null;
        let self = this;
        let tasks = this.state.tasks;

        if (tasks) {
            taskComponents = [];
            for (let i=0;i<tasks.length;i++) {
                let taskProperties = {};
                taskProperties.name = tasks[i].name;
                taskProperties.id = tasks[i].id;
                taskProperties.key = tasks[i].id;
                taskProperties.taskId = tasks[i].id;
                taskProperties.store = this.props.store;

                (function(taskToDelete){
                    taskProperties.delete = function() {
                        self.props.deleteTask(taskToDelete);
                    };
                })(tasks[i]);

                taskComponents[i] = React.createElement(Task, taskProperties);
            }
        }

        if (taskComponents) {
            taskComponents = taskComponents.sort(function(a,b){
                if (a.props.name > b.props.name) {
                    return 1;
                } else if (a.props.name < b.props.name) {
                    return -1;
                }
            });
        }

        return React.createElement('div',null,'',taskComponents);
    }
}

class Alert extends React.Component{

    render() {
        let props = {className: 'alert'};
        props.hidden = this.props.hidden;
        props.onClick = this.props.onClick;
        let dismissButton = React.createElement(DismissButton,null);
        return React.createElement('span',props,this.props.text, dismissButton);
    }
}

class Container extends React.Component{

    constructor(props) {
        super(props);
        this.state = {};
    }

    addTask() {
        console.log('Add task');
        let task = {};
        task.name = 'NewTask';
        this.props.store.dispatch({ type: 'ADD',task:task });
    }

    saveTask() {
        let self = this;
        let payload = {};
        payload.tasks = this.state.tasks;

        fetch('http://cfassignment.herokuapp.com/ajlinton/tasks', {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then( (response) => {
            if (response.error) {
                self.props.store.dispatch({ type: 'SHOW_ALERT',text:response.error});
            } else {
                self.props.store.dispatch({ type: 'SHOW_ALERT',text:'Tasks saved successfully'});
            }
            });
    }

    deleteTask(task) {
        this.props.store.dispatch({ type: 'DELETE',task:task });
    }

    render() {
        let self = this;
        let title = React.createElement(Title,{'text':'Tasks'});
        let buttonAdd = React.createElement(Button,{'text':'Add Task','event':this.addTask.bind(this)});
        let saveProps = {};
        saveProps.text = "Save";
        saveProps.id = 'saveButton';
        saveProps.event = this.saveTask.bind(this);
        saveProps.disabled = (!this.state.dirty);
        let buttonSave = React.createElement(Button,saveProps);
        let taskContainerProps = {};
        taskContainerProps.dirty = this.state.dirty;
        taskContainerProps.store = this.props.store;
        taskContainerProps.tasks = this.state.tasks;
        taskContainerProps.deleteTask = this.deleteTask.bind(this);
        let taskContainer = React.createElement(TaskContainer,taskContainerProps);

        let alertProps = {};
        if (this.state.alertRequired) {
            alertProps.text = this.state.alertText;
            alertProps.hidden = false;
            alertProps.onClick = (function() {
                self.props.store.dispatch({ type: 'HIDE_ALERT' });
            }).bind(this);
        } else {
            alertProps.hidden = true;
        }
        let alert = React.createElement(Alert,alertProps);

        return React.createElement('div',{className:'container'},'',title,buttonAdd,buttonSave,taskContainer,alert);
    }

    componentDidMount() {
        let self = this;

        const stopRender = this.props.store.subscribe(()=>{
            this.setState(this.props.store.getState());
        });

        fetch('http://cfassignment.herokuapp.com/ajlinton/tasks').then(function(response) {
            return response.json().then(function(json){
                if (json.tasks) {
                    self.props.store.dispatch({ type: 'ADD_BULK',tasks:json.tasks });
                } else if (json.error) {
                    console.error(json.error);
                    self.props.store.dispatch({ type: 'SHOW_ALERT',text:json.error });
                } else {
                    self.props.store.dispatch({ type: 'SHOW_ALERT',text:'Network error' });
                }
            })
        });
    }
}



