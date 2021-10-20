import { Box, Grid, Typography, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import DateFnsUtils from '@date-io/date-fns';
import { alpha } from '@material-ui/core/styles'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import React from "react";
import {
  AUTHCOLOR,
  PRIMARYLIGHT,
  PRIMARYMAIN,
  SECONDARYMAIN,
  WHITE,    
} from "../../Theme/colorConstant";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { Formik } from "formik";
import * as yup from "yup";
import moment from "moment";
const useStyle = makeStyles({
  container: {
    height: "100vh",
    width: "100vw",
    background: WHITE,
    padding: "10px 20px",
  },
  formContainer: {
    background: SECONDARYMAIN,
    minHeight: "600px",
    height: "auto",
    padding: 20,
  },
});

const schema = yup.object().shape({
  name: yup.string().required(),
  fName: yup.string().required(),
  email: yup.string().required().email(),
  password: yup.string().required().min(8),
  dateOfBirth: yup.date(),
  contactNo: yup.string(),
  cnicNo: yup.string(),
  profile: yup.string(),
  address: yup.string(),
});
function Signup() {
  const classes = useStyle();
  return (
    <Grid
      className={classes.container}
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item xs={12} md={6} className={classes.formContainer}>
        <Formik
          initialValues={{
            name: "",
            fName: "",
            email: "",
            password: "",
            dateOfBirth: moment().format("MM/DD/YYYY"),
            contactNo: "",
            cnicNo: "",
            profile: "",
            address: "",
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
            <Grid
              container
              justifyContent="space-between"
              spacing={2}
              style={{ padding: 20 }}
            >
              <Grid item xs={12}>
                <Typography variant="h5">
                  Sign Up to
                  <span style={{ color: PRIMARYMAIN }}>Bizz Chat</span>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  placeholder="Name"
                  onChange={handleChange}
                  name="name"
                  value={values.name}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  placeholder="Father Name"
                  onChange={handleChange}
                  name="fName"
                  value={values.fName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="email"
                  placeholder="Email"
                  onChange={handleChange}
                  autoComplete="false"
                  name="email"
                  value={values.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                  autoComplete="false"
                  name="password"
                  value={values.password}
                />
              </Grid>
              <Grid item xs={6}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Date picker inline"
                    value={values.dateOfBirth}
                    onChange={() => handleChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  placeholder="Contact No."
                  onChange={handleChange}
                  name="contactNo"
                  value={values.contactNo}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  placeholder="CNIC No."
                  onChange={handleChange}
                  name="cnicNo"
                  value={values.cnicNo}
                />
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  component="placeholder"
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: 15,
                  }}
                >
                  Select Profile
                  <input
                    type="file"
                    hidden
                    name="profile"
                    onChange={handleChange}
                    value={values.profile}
                  />
                  <AddAPhotoIcon />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  placeholder="Address"
                  onChange={handleChange}
                  name="address"
                  value={values.address}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={handleSubmit}
                  style={{ width: "100%", backgroundColor: PRIMARYLIGHT }}
                >
                  Sign Up
                </Button>
              </Grid>
            </Grid>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
}

export default Signup;
