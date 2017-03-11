require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ToDoItem from './toDoItem.js'

const ENTER_KEY = 13;

class AppComponent extends React.Component {
  constructor(props) {
    super(props);

    this.data = [{
        id: 1,
        title: 'Taste JavaScript',
        completed: true
      },
      {
        id: 2,
        title: 'Buy a unicorn',
        completed: false
      }
    ];
    this.nextId = 3;

    this.state = {
      isDataChange: false
    };
  }

  newTodo(e) {
    if (e.keyCode == ENTER_KEY) {
      let {inputForNewToDo} = this.refs;

      let toDoLabel = inputForNewToDo.value.trim();

      if (toDoLabel.length > 0) {
        this.data.push({
          title: toDoLabel,
          completed: false,
          id: this.nextId++
        });

        this.setState({
          isDataChange: true
        }, () => {
          inputForNewToDo.value = null;
        });
      }
    }
  }

  renderHeader() {
    return (
      <header className="header">
        <h1>todos</h1>
        <input
          ref="inputForNewToDo"
          className="new-todo"
          placeholder="What needs to be done?"
          autoFocus
          onKeyDown={this.newTodo.bind(this)}
        />
      </header>
    );
  }

  toDoDel(id) {
    let aimIndex = this.data.findIndex(i => i.id === id);
    this.data.splice(aimIndex, 1);

    this.setState({
      isDataChange: true
    });
  }

  toDoEdit(id, value) {
    // let currentToDo = this.data.filter(i => i.id === id);
    // currentToDo.title = value;
    // Object.assign(currentToDo, {title: value});
    this.data.map((item) => {
      if(item.id === id) {
        item.title = value;
        return;
      }
    });

    this.setState({isDataChange: true});
  }

  toDoStatusChange(id, status) {
    let index = this.data.findIndex(i => i.id === id);

    this.data[index].completed = status;

    this.setState({
      isDataChange: true
    });
  }

  renderMain() {
    let datas = this.data;

    return (
      <section className="main">
        <input className="toggle-all" type="checkbox" />
        {/*<label for="toggle-all">Mark all as complete</label>*/}
        <ul className="todo-list">
          {
            datas.map((item, key) => {
              return (
                <ToDoItem
                  item={item}
                  key={key}
                  onChange={this.toDoStatusChange.bind(this, item.id)}
                  onDelete={this.toDoDel.bind(this)}
                  onEdit={this.toDoEdit.bind(this, item.id)}
                />
              );
            })
          }
        </ul>
      </section>
    );
  }

  clearCompleted() {}

  renderFooter() {
    return (
      <footer className="footer">
        <span className="todo-count">
          <strong>
            {this.data.filter(i => i.completed === false).length}
          </strong>
          item left
        </span>
        <ul className="filters">
          <li>
            <a className="selected" href="#/" onClick={this.filterAll.bind(this)}>All</a>
          </li>
          <li>
            <a href="#/active" onClick={() => {}}>Active</a>
          </li>
          <li>
            <a href="#/completed" onClick={() => {}}>Completed</a>
          </li>
        </ul>
        <button className="clear-completed" onClick={this.clearCompleted.bind(this)}>Clear completed</button>
      </footer>
    );
  }

  render() {
    return (
      <div>
        <section className="todoapp">
          {this.renderHeader()}

          {this.renderMain()}

          {this.renderFooter()}
        </section>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
