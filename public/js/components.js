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
        this.state.tasks = props.tasks;
    }

    render() {
        var taskComponents = null;
        var self = this;
       if (this.props.tasks) {
            taskComponents = [];
            for (var i=0;i<this.props.tasks.length;i++) {
                var taskProperties = {};
                taskProperties.name = this.props.tasks[i].name;
                taskProperties.id = this.props.tasks[i].id;
                taskProperties.key = this.props.tasks[i].id;;
                taskProperties.taskId = this.props.tasks[i].id;;
                taskProperties.onTaskChange =  this.onTaskChange.bind(this);

                (function(taskToDelete){
                    taskProperties.delete = function(event) {
                        console.log('Delete');
                        self.props.deleteTask(taskToDelete);
                    };
                })(this.props.tasks[i]);

                taskComponents[i] = React.createElement(Task, taskProperties);
            }
        }

        return React.createElement('div',null,'Task List',taskComponents);
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
        var task = {};
        task.name = 'NewTask';
        task.id = 5;
        this.state.tasks.push(task);
        this.setState({'tasks':this.state.tasks});
    }

    saveTask() {
        console.log('Save task');
        this.setState({'dirty':false});
    }

    setDirty(dirty) {
        this.setState({'dirty':dirty});
    }

    deleteTask(taskToDelete) {
        console.log(taskToDelete);
        var tasks = this.state.tasks.filter(function(task){
            return (task!=taskToDelete);
        });
        this.setState({'tasks':tasks,'dirty':true});
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
        var taskContainerProps = {};
        taskContainerProps.dirty = this.state.dirty;
        taskContainerProps.setDirty = this.setDirty.bind(this);
        taskContainerProps.tasks = this.state.tasks;
        taskContainerProps.deleteTask = this.deleteTask.bind(this);
        let taskContainer = React.createElement(TaskContainer,taskContainerProps);
        return React.createElement('div',null,'Container',title,buttonAdd,buttonSave,taskContainer);
    }

    componentDidMount() {
        let numTasks = 3;
        var tasks = [];

        for (var i=0;i<numTasks;i++) {
            var task = {};
            task.name = 'Task' + i;
            task.id = i;
            tasks[i] = task;
        }
        this.setState({'tasks':tasks});
    }

}