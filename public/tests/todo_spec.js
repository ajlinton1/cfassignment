describe("Repository",
  function() {

    it("When page is loaded reducer should be initialized", function() {
        expect(cfassignment.reducer).toBeDefined();
    });

    it("Verify new task can be added", function() {
      let state = {'tasks':[]}
      let task = {name:'task1',id:0};
      let action = {'type':'ADD',task:task};
      let result = cfassignment.reducer(state, action);
      expect(result.tasks.length).toEqual(1);
    });

      it("Verify task can be removed", function() {
          let state = {'tasks':[]}
          let task = {name:'task1',id:0};
          let action = {'type':'ADD',task:task};
          cfassignment.reducer(state, action);

          let actionDelete = {'type':'DELETE',task:task};
          let result = cfassignment.reducer(state, actionDelete);

          expect(result.tasks.length).toEqual(0);
      });

      it("Verify task can be updated", function() {
          let task = {name:'task1',id:0};
          let tasks = [task];
          let state = {tasks:tasks};

          let update = {id:0,name:'Updated'};
          let actionUpdate = {'type':'UPDATE',update:update};
          result = cfassignment.reducer(state, actionUpdate);

          expect(result.tasks[0].name).toEqual('Updated');
      });

  }
);
