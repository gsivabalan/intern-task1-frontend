import React, { Component } from 'react';
import {
  Button, TextField, Dialog, DialogActions, LinearProgress,
  DialogTitle, DialogContent, 
} from '@material-ui/core';

import swal from 'sweetalert';
import { withRouter } from './utils';
const axios = require('axios');

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      openProfileModal: false,
      id: '',
      name: '',
      age: '',
      gender: '',
      dob: '',
      mobile: '',
      page: 1,
      search: '',
      products: [],
      pages: 0,
      loading: false
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.navigate("/login");
    } else {
      this.setState({ token: token }, () => {
        this.getUserProfile();
      });
    }
  }

  getUserProfile = () => {
    this.setState({ loading: true });
    axios.get(`http://localhost:8000/get-user-profile`, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      this.setState({ loading: false, name: res.data.name, age: res.data.age, gender: res.data.gender, dob: res.data.dob, mobile: res.data.mobile });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
      this.setState({ loading: false });
    });
  }

  updateProfile = () => {
    axios.post('http://localhost:8000/update-user-profile', {
      name: this.state.name,
      age: this.state.age,
      gender: this.state.gender,
      dob: this.state.dob,
      mobile: this.state.mobile
    }, {
      headers: {
        'Content-Type': 'application/json',
        'token': this.state.token
      }
    }).then((res) => {
      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
    });
  }

  logOut = () => {
    localStorage.setItem('token', null);
    this.props.navigate("/");
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleProfileOpen = () => {
    this.setState({
      openProfileModal: true
    });
  };

  handleProfileClose = () => {
    this.setState({ openProfileModal: false });
  };

  render() {
    return (
      <div>
        {this.state.loading && <LinearProgress size={40} />}
        <div>
          <h2>Profile</h2>
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={this.handleProfileOpen}
          >
            Update Profile
          </Button>
          <Button
            className="button_style"
            variant="contained"
            size="small"
            onClick={this.logOut}
          >
            Log Out
          </Button>
        </div>

        
        <Dialog
          open={this.state.openProfileModal}
          onClose={this.handleProfileClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Update Profile</DialogTitle>
          <DialogContent>
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
              placeholder="Name"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="age"
              value={this.state.age}
              onChange={this.onChange}
              placeholder="Age"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="gender"
              value={this.state.gender}
              onChange={this.onChange}
              placeholder="Gender"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="dob"
              value={this.state.dob}
              onChange={this.onChange}
              placeholder="Birth year"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="mobile"
              value={this.state.mobile}
              onChange={this.onChange}
              placeholder="Mobile"
              required
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleProfileClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.name === '' || this.state.age === '' || this.state.gender === '' || this.state.dob === '' || this.state.mobile === ''}
              onClick={this.updateProfile} color="primary" autoFocus>
              Update Profile
            </Button>
          </DialogActions>
        </Dialog>

        <br />

        {/* Display User Profile */}
        <div>
          <h3>User Profile:</h3>
          <p>Name: {this.state.name}</p>
          <p>Age: {this.state.age}</p>
          <p>Gender: {this.state.gender}</p>
          <p>Year of Birth: {this.state.dob}</p>
          <p>Mobile: {this.state.mobile}</p>
        </div>
      </div>
    );
  }
}

export default withRouter(Dashboard);
