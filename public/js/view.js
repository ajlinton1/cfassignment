this.cfassignment = (
    function(cfassignment){
        var self = this;
        let title = React.createElement('span',null,"Tasks");
        let addButton = React.createElement('button',null,'Add');
        let saveButton = React.createElement('button',null,'Save');

        let numTasks = 3;
        var tasks = [];
        for (var i=0;i<numTasks;i++) {
            var taskTitle = 'Task'+i;
            tasks[i] = React.createElement('div',null,taskTitle);
        }

        let taskList = React.createElement('div',null,'Task List',tasks);

        ReactDOM.render(
            React.createElement(Container,null),
            document.getElementById("content")
        );

        self.taskAdd = function(text) {
            debugger;
        }


    }(this.cfassignment || {})
);


