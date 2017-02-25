import React from 'react';
import { Link } from 'react-router';

import Input from './Input.js';
import InputCheckBox from './InputCheckBox.js';
import { isActiveMode, isCompletedMode } from './utils/AppUtil.js';

class Todo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false
    };

    this.editInput = null;
  }

  render() {
    return (
      <li className={this.state.editing ? 'editing' : (this.props.completed ? 'completed' : 'view')}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={this.props.completed}
            onChange={(e) => this.props.onEdit({completed: e.target.checked})}
          />
          <label
            onDoubleClick={() => {
              this.setState({editing: true}, () => this.editInput.focus());
            }}
          >{this.props.text}</label>
          <button className="destroy" onClick={this.props.onRemove} />
        </div>
        <Input
          ref={i => this.editInput = i}
          className="edit"
          value={this.props.text}
          onValueChange={(text) => {
            this.props.onEdit({text});
            this.setState({editing: false});
          }}
          onBlur={() => this.setState({editing: false})}
        />
      </li>
    );
  }
}

class TodoApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: this.getCurrentModeTodos(props)
    }
  }

  componentWillReceiveProps(nextProps) {
    let todos = this.getCurrentModeTodos(nextProps);

    this.setState({todos});
  }

  getCurrentModeTodos(props) {
    let todos = props.todos || [];

    if (isActiveMode()) {
      todos = todos.filter(todo => !todo.completed);
    } else if (isCompletedMode()) {
      todos = todos.filter(todo => todo.completed);
    }

    return todos;
  }

  toggleToCompleteAll(completeAllChecked) {
    let todos = this.state.todos;

    todos.forEach(todo => {
      todo.completed = completeAllChecked;
    });

    this.setState({todos});

    this.props.onChangeTodos(todos);
  }

  renderHeader() {
    return (
      <header className="header">
        <h1>todos</h1>
        <Input
          className="new-todo"
          placeholder="What needs to be done?"
          onValueChange={this.props.onAddTodo}
          autoFocus />
      </header>
    );
  }

  renderTodoListMain() {
    return (
      <section className="main">
        <InputCheckBox ref="completeAll" onChange={this.toggleToCompleteAll.bind(this)} />
        {/*<label for="toggle-all">Mark all as complete</label>*/}
        <ul className="todo-list">
          {/*These are here just to show the structure of the list items*/}
          {/*List items should get the class `editing` when editing and `completed` when marked as completed*/}
          {this.state.todos.map(todo =>
            <Todo
              key={todo.id}
              {...todo}
              onEdit={(changes) => this.props.onEditTodo(todo.id, Object.assign({}, todo, {...changes}))}
              onRemove={() => this.props.onRemoveTodo(todo.id)}
            />
          )}
        </ul>
      </section>
    );
  }

  renderTodoListFooter() {
    return (
      <footer className="footer">
        {/*This should be `0 items left` by default*/}
        <span className="todo-count"><strong>{this.props.todos.filter(i => !i.completed).length}</strong> item left</span>
        {/*Remove this if you don't implement routing*/}
        <ul className="filters">
          <li>
            <Link to="/" activeClassName="selected">All</Link>
          </li>
          <li>
            <Link to="/active" activeClassName="selected">Active</Link>
          </li>
          <li>
            <Link to="/completed" activeClassName="selected">Completed</Link>
          </li>
        </ul>
        {/*Hidden if no completed items are left ↓*/}
        <button className="clear-completed">Clear completed</button>
      </footer>
    );
  }

  renderFooter() {
    return (
      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
      </footer>
    );
  }

  render() {
    return (
      <div>
        <section className="todoapp">
          {this.renderHeader()}

          {/*This section should be hidden by default and shown when there are todos*/}
          {this.renderTodoListMain()}

          {/*This footer should hidden by default and shown when there are todos*/}
          {this.renderTodoListFooter()}
        </section>

        {this.renderFooter()}
      </div>
    );
  }
}

TodoApp.propsType = {
};

TodoApp.defaultProps = {
};

export default TodoApp;
