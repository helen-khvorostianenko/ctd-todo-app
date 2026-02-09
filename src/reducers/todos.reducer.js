const initialState = {
  todoList: [],
  isLoading: false,
  errorMessage: '',
  isSaving: false,
};

const actions = {
  //actions in useEffect that loads todos
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',
  //found in useEffect and addTodo, completeTodo, updateTodo to handle failed requests
  setLoadError: 'setLoadError',
  //actions found in addTodo
  startRequest: 'startRequest',
  addTodo: 'addTodo',
  endRequest: 'endRequest',
  //found in helper functions
  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',
  //reverts todos when requests fail
  revertTodo: 'revertTodo',
  //action on Dismiss Error button
  clearError: 'clearError',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.fetchTodos:
      return {
        ...state,
        isLoading: true,
      };
    case actions.loadTodos: {
      const fetchedRows = action.records.map((record) => {
        const row = {
          id: record.id,
          ...record.fields,
        };
        row.isCompleted = row.isCompleted ?? false;
        return row;
      });
      return {
        ...state,
        todoList: fetchedRows,
        isLoading: false,
      };
    }
    case actions.setLoadError: 
      return {
        ...state,
        errorMessage: action.error.message,
        isLoading: false,
      };
    case actions.startRequest:
      return {
        ...state,
        isSaving: true,
      };
    case actions.addTodo: {
      const records = action.records;
      if (!records?.[0]) {
        return {
          ...state,
          errorMessage: 'No records returned from Airtable API',
          isSaving: false,
        };
      }

      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };
      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }

      return {
        ...state,
        todoList: [...state.todoList, savedTodo],
        isSaving: false,
      };
    }
    case actions.endRequest:
      return {
        ...state,
        isLoading: false,
        isSaving: false,
      };

    case actions.revertTodo:
    case actions.updateTodo: {
      const editedTodo = action.editedTodo;

      const originalTodo = state.todoList.find(
        (todo) => todo.id === editedTodo.id
      );
      if (!originalTodo) return state;

      const updatedTodos = state.todoList.map((item) => {
        item.id === editedTodo.id ? 
          (action.error? {...originalTodo} : { ...editedTodo }) : 
          item
      });
      const updatedState = {
        ...state,
        todoList: updatedTodos,
      };

      if (action.error) {
        updatedState.errorMessage = action.error.message;
      }

      return updatedState;
    }
    case actions.completeTodo: {
      const updatedTodos = state.todoList.map((item) =>
        item.id === action.id ? { ...item, isCompleted: true } : item
      );

      const completedTodo = updatedTodos.find((item) => item.id === action.id);
      if (!completedTodo) return state;

      return {
        ...state,
        todoList: updatedTodos,
      };
    }
    case actions.clearError:
      return {
        ...state,
        errorMessage: '',
      };
    default:
      return state;
  }

}

export { initialState, actions, reducer};