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
        var buttonProps = {};
        buttonProps.onClick = this.props.event;
        buttonProps.disabled = this.props.disabled;
        buttonProps.className = 'button';
        buttonProps.id = this.props.id;
        return React.createElement('button',buttonProps,this.props.text);
    }
}

class DeleteButton extends React.Component{
    render() {
        var buttonProps = {};
        buttonProps.onClick = this.props.event;
        var deleteItem = React.createElement('i',{className:'fa fa-trash'},'');
        return React.createElement('button',buttonProps,null,deleteItem);
    }
}

class DismissButton extends React.Component{
    render() {
        var buttonProps = {};
        buttonProps.onClick = this.props.onClick;
        var deleteItem = React.createElement('i',{className:'fa fa-window-close'},'');
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

 /*   componentDidMount () {
        const stopRender = this.props.store.subscribe(()=>{
            this.setState(this.props.store.getState());
        })
    } */

    handleChange(event) {
        this.setState({value: event.target.value});
        var update = {id:this.props.id, name:event.target.value};
        this.props.store.dispatch({ type: 'UPDATE',update });
    }

    render() {
        return React.createElement('input',{'value':this.state.value,'onChange':this.handleChange.bind(this)});
    }
}

class Task extends React.Component{
    render() {
        let deleteButton = React.createElement(DeleteButton,{'event':this.props.delete,'taskId':this.props.taskId});
        var text = React.createElement(Input,{'value':this.props.name,'onTaskChange':this.props.onTaskChange,'id':this.props.id,store:this.props.store})
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
        var taskComponents = null;
        var self = this;
        var tasks = this.state.tasks;

        if (tasks) {
            taskComponents = [];
            for (var i=0;i<tasks.length;i++) {
                var taskProperties = {};
                taskProperties.name = tasks[i].name;
                taskProperties.id = tasks[i].id;
                taskProperties.key = tasks[i].id;;
                taskProperties.taskId = tasks[i].id;
                taskProperties.store = this.props.store;

                (function(taskToDelete){
                    taskProperties.delete = function(event) {
                        self.props.deleteTask(taskToDelete);
                    };
                })(tasks[i]);

 /*               var taskPropertiesSorted = taskProperties.sort(function(a,b){
                    if (a.name > b.name) {
                        return 1;
                    } else if (a.name < b.name) {
                        return -1;
                    }
                }); */

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
        var props = {className: 'alert'};
        props.hidden = this.props.hidden;
        props.onClick = this.props.onClick;
        var dismissButton = React.createElement(DismissButton,null);
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
        var task = {};
        task.name = 'NewTask';
        this.props.store.dispatch({ type: 'ADD',task:task });
    }

    saveTask() {
        var self = this;
        var payload = {};
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
        var self = this;
        let title = React.createElement(Title,{'text':'Tasks'});
        let buttonAdd = React.createElement(Button,{'text':'Add Task','event':this.addTask.bind(this)});
        var saveProps = {};
        saveProps.text = "Save";
        saveProps.id = 'saveButton';
        saveProps.event = this.saveTask.bind(this);
        if (!this.state.dirty){
            saveProps.disabled = true;
        } else {
            saveProps.disabled = false;
        }
        let buttonSave = React.createElement(Button,saveProps);
        var taskContainerProps = {};
        taskContainerProps.dirty = this.state.dirty;
        taskContainerProps.store = this.props.store;
        taskContainerProps.tasks = this.state.tasks;
        taskContainerProps.deleteTask = this.deleteTask.bind(this);
        let taskContainer = React.createElement(TaskContainer,taskContainerProps);

        var alertProps = {};
        if (this.state.alertRequired) {
            alertProps.text = this.state.alertText;
            alertProps.hidden = false;
            alertProps.onClick = (function(event) {
                self.props.store.dispatch({ type: 'HIDE_ALERT' });
            }).bind(this);
        } else {
            alertProps.hidden = true;
        }
        let alert = React.createElement(Alert,alertProps);

        return React.createElement('div',{className:'container'},'',title,buttonAdd,buttonSave,taskContainer,alert);
    }

    componentDidMount() {
        var self = this;

        const stopRender = this.props.store.subscribe(()=>{
            this.setState(this.props.store.getState());
        })

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



