class Title extends React.Component{
    render() {
        return React.createElement('span',null,this.props.text);
    }
}

class Button extends React.Component{
    handle(event) {
        console.log(this,event);
    }
    render() {
        var buttonProps = {};
        buttonProps.onClick = this.props.event;
        return React.createElement('button',buttonProps,this.props.text);
    }
}

class AddButton extends Button {

    constructor(props) {
        super(props);
    }
    handle(event) {
        console.log(this,event);
    }
    render() {
        var buttonProps = {};
        buttonProps.onClick = this.handle
        return React.createElement('button',buttonProps,"Add");
    }
}

class DeleteButton extends React.Component{
    render() {
        var buttonProps = {};
        buttonProps.onClick = this.props.event;
        return React.createElement('button',buttonProps,'Delete');
    }
}

class Task extends React.Component{
    render() {
        let deleteButton = React.createElement(DeleteButton,{'event':this.props.delete,'taskId':this.props.taskId});
        var props = {};
        props.id = this.props.id;
        return React.createElement('div',props,this.props.name,deleteButton);
    }
}

class TaskContainer extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            'tasks':[]
        }
    }

    componentDidMount() {
        let numTasks = 3;
        this.tasks = [];
        var self = this;

        for (var i=0;i<numTasks;i++) {
            var taskProperties = {};
            taskProperties.name = 'Task'+i;
            taskProperties.id = i;
            taskProperties.taskId = i;

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

}

class Container extends React.Component{

    addTask() {
        console.log('Add task')
    }

    saveTask() {
        console.log('Save task');
    }

    render() {
        let title = React.createElement(Title,{'text':'Task List'});
        let buttonAdd = React.createElement(Button,{'text':'Add','event':this.addTask});
        let buttonSave = React.createElement(Button,{'text':'Save','event':this.saveTask});
        let taskContainer = React.createElement(TaskContainer,null);
        return React.createElement('div',null,'Container',title,buttonAdd,buttonSave,taskContainer);
    }
}