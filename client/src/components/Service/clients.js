import React, { Component, useContext, useEffect, useState } from 'react';
import MainBlock from '../Common/main-block';
import ShowCase from '../Common/grid';
import { withFirebase } from '../Firebase';
import { connect } from 'react-redux';
import { compose } from 'redux';
import DeleteIcon from '@material-ui/icons/Delete';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
  Typography,
  Grid,
  Button,
  ButtonGroup,
  Select,
  FormLabel,
  FormControlLabel,
  OutlinedInput,
  FormControl,
  InputLabel,
  InputAdornment,
  Box,
  Input,
  Chip,
  MenuItem,
  IconButton,
  Modal,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import moment from 'moment';
import { SERVICE_TYPES } from '../../constants/constants';
import { W3Provider } from '../Web3';
import W3Context from '../Web3/context';
import { MerkleTree } from '../../util/MerkelUtil';
import { toBuffer } from 'ethereumjs-util';



class ServiceClientPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      clients: [],
    };

  }

  componentDidMount() {
    if (!this.state.clients.length) {
      this.setState({ loading: true });
    }
    this.onListenForClients();
  }

  onListenForClients = () => {
    this.props.firebase
      .clients()
      .orderByChild('service')
      .equalTo(this.props.authUser.uid)
      .on('value', snapshot => {
        const clients = snapshot.val()
        this.setState({ loading: false, clients: snapshot.val() });
      });
  };

  componentWillUnmount() {
    this.props.firebase.intermediaries().off();
  }

  render() {
    const {
      clients,
      loading,
    } = this.state;

    return (
      <MainBlock title="My Clients">
        {loading && <div>Loading ...</div>}

        {clients &&
          <TableContainer component={Paper}>
            <Table aria-label="spanning table">
              <TableHead>
                <TableRow>
                  <TableCell>Service</TableCell>
                  <TableCell>Intermediation</TableCell>
                  <TableCell>Mediator</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(clients).map(([k, row]) => (
                  <TableRow key={k}>
                    <TableCell>{row.serviceId}</TableCell>
                    <TableCell>{row.intermediation}</TableCell>
                    <TableCell>{row.intermediationId}</TableCell>
                  </TableRow>
                ))}

              </TableBody>
            </Table>
          </TableContainer>
        }
        {!clients && <div>There are no clients ...</div>}
      </MainBlock>
    );
  }
}


const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
  ),
)(ServiceClientPage);
