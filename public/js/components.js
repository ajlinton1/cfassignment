class Title extends React.Component{
    render() {
        return React.createElement('span',null,this.props.text);
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
    handle(event) {
        console.log(this,event);
    }

    render() {
        var buttonProps = {};
        buttonProps.onClick = this.props.event;

        buttonProps.disabled = this.props.disabled;

        return React.createElement('button',buttonProps,this.props.text);
    }

    setDisabled(disabled) {
        this.setState({'disabled':disabled});
    }
}

class DeleteButton extends React.Component{
    render() {
        var buttonProps = {};
        buttonProps.onClick = this.props.event;
        return React.createElement('button',buttonProps,'Delete');
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
        this.props.onTaskChange();
    }

    render() {
        return React.createElement('input',{'value':this.state.value,'onChange':this.handleChange.bind(this)});
    }
}

class Task extends React.Component{
    render() {
        let deleteButton = React.createElement(DeleteButton,{'event':this.props.delete,'taskId':this.props.taskId});
        var text = React.createElement(Input,{'value':this.props.name,'onTaskChange':this.props.onTaskChange})
        return React.createElement('div',{'id':this.props.id},text,deleteButton);
    }
}

class TaskContainer extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            'tasks':[]
        }
        this.state.dirty = props.dirty;
        this.state.setDirty = props.setDirty;
    }

    componentDidMount() {
        let numTasks = 3;
        this.tasks = [];
        var self = this;

        for (var i=0;i<numTasks;i++) {
            var taskProperties = {};
            taskProperties.name = 'Task'+i;
            taskProperties.id = i;
            taskProperties.key = i;
            taskProperties.taskId = i;
            taskProperties.onTaskChange = this.onTaskChange.bind(this);

            (function(j){
                taskProperties.delete = function(event) {
                    console.log('Delete');
                    self.tasks = self.tasks.filter(
                        function(t) {
                            if (t.props.id != j) {
                                return true
                            } else {
                                return false;
                            }
                        });
                    self.setState({'tasks':self.tasks});
                };
            })(i);

            self.tasks[i] = React.createElement(Task, taskProperties);
        }
        this.setState({'tasks':self.tasks});
    }

    render() {
        return React.createElement('div',null,'Task List',this.state.tasks);
    }

    onTaskChange() {
        this.state.setDirty(true);
        this.state.saveRequired = true;
    }
}

class Container extends React.Component{

    constructor(props) {
        super(props);
        this.state = {};
        this.state.dirty = false;
    }

    addTask() {
        console.log('Add task');
        this.setState({'dirty':true});
    }

    saveTask() {
        console.log('Save task');
    }

    setDirty(dirty) {
        this.setState({'dirty':dirty});
    }

    render() {
        let title = React.createElement(Title,{'text':'Task List'});
        let buttonAdd = React.createElement(Button,{'text':'Add','event':this.addTask.bind(this)});
        var saveProps = {};
        saveProps.text = "Save";
        saveProps.event = this.saveTask.bind(this);
        if (!this.state.dirty){
            saveProps.disabled = true;
        } else {
            saveProps.disabled = false;
        }
        let buttonSave = React.createElement(Button,saveProps);
        let taskContainer = React.createElement(TaskContainer,{'dirty':this.state.dirty,'setDirty':this.setDirty.bind(this)});
        return React.createElement('div',null,'Container',title,buttonAdd,buttonSave,taskContainer);
    }
}