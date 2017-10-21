class Title extends React.Component{
    render() {
        return React.createElement('span',null,this.props.text);
    }
}

class Button extends React.Component{
    render() {
        return React.createElement('button',null,this.props.text);
    }
}

class Task extends React.Component{
    render() {
        return React.createElement('div',null,this.props.name);
    }
}

class TaskContainer extends React.Component{
    render() {
        let numTasks = 3;
        var tasks = [];
        for (var i=0;i<numTasks;i++) {
            var taskProperties = {};
            taskProperties.name = 'Task'+i;
            tasks[i] = React.createElement(Task, taskProperties);
        }

        return React.createElement('div',null,'Task List',tasks);
    }
}

class Container extends React.Component{
    render() {
        let title = React.createElement(Title,{'text':'Task List'});
        let buttonAdd = React.createElement(Button,{'text':'Add'});
        let buttonSave = React.createElement(Button,{'text':'Save'});
        let taskContainer = React.createElement(TaskContainer,null);
        return React.createElement('div',null,'Container',title,buttonAdd,buttonSave,taskContainer);
    }
}