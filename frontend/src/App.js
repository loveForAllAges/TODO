import React, { Component } from "react";
import Modal from './components/Modal';
import axios from "axios";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false,
      todoList: [],
      modal: false,
      activeItem: {
        title: '',
        description: '',
        is_complete: false,
      },
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
      .get("/api/todos/")
      .then((res) => this.setState({ todoList: res.data}))
      .catch((err) => console.log(err));
  };

  toggle = () => {
    this.setState({modal: !this.state.modal})
  };

  handleSubmit = ((item) => {
    this.toggle();

    if (item.id) {
      axios
        .put(`/api/todos/${item.id}/`, item)
        .then((res) => this.refreshList());
      return;
    }
    axios
      .post("/api/todos/", item)
      .then((res) => this.refreshList());
  });

  handleDelete = ((item) => {
    axios
      .delete(`/api/todos/${item.id}/`)
      .then((res) => this.refreshList());
  });

  createItem = () => {
    const item = {title: '', description: '', complete: false};
    this.setState({activeItem: item, modal: !this.state.modal});
  };

  editItem = (item) => {
    this.setState({activeItem: item, modal: !this.state.modal});
  };

  displayCompleted = (status) => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }

    return this.setState({ viewCompleted: false });
  };

  renderTabList = () => {
    return (
      <div className="nav nav-tabs">
        <span
          className={this.state.viewCompleted ? "nav-link active" : "nav-link"}
          onClick={() => this.displayCompleted(true)}
        >
          Завершенные
        </span>
        <span
          className={this.state.viewCompleted ? "nav-link" : "nav-link active"}
          onClick={() => this.displayCompleted(false)}
        >
          В процессе
        </span>
      </div>
    );
  };

  renderItems = () => {
    console.log(this.state.todoList);
    const { viewCompleted } = this.state;
    const newItems = this.state.todoList.filter(
      (item) => item.is_complete == viewCompleted
    );

    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${
            this.state.viewCompleted ? "completed-todo" : ""
          }`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button className="btn btn-secondary mr-2" onClick={() => this.editItem(item)}>
            Изменить
          </button>
          <button className="btn btn-danger" onClick={() => this.handleDelete(item)}>
            Удалить
          </button>
        </span>
      </li>
    ));
  };

  render() {
    return (
      <main className="container">
        <h1 className="text-white text-uppercase text-center my-4">TODO</h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="mb-4">
                <button className="btn btn-icon rounded-circle btn-primary" onClick={this.createItem}>
                  +
                </button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush border-top-0">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal activeItem={this.state.activeItem} toggle={this.toggle} onSave={this.handleSubmit}/>
        ) : null}
      </main>
    );
  }
}

export default App;