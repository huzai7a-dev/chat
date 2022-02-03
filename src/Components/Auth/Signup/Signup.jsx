import React from "react";
import { Grid, Typography, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import * as yup from "yup";
import moment from "moment";

import {
  AUTHCOLOR,
  PRIMARYMAIN,
  WHITE,
} from "../../../Theme/colorConstant";
import { signUp } from "../../../api/auth";
import { useHistory } from "react-router";
import Utils from "../../../helper/util";

const useStyle = makeStyles({
  container: {
    height: "calc(100vh - 2.5rem)",
    width: "100vw",
    background: WHITE,
    padding: "10px 20px",
  },
  formContainer: {
    minHeight: "600px",
    height: "auto",
    padding: 20,
  },
});

const schema = yup.object().shape({
  name: yup.string().required(),
  fName: yup.string(),
  email: yup.string().required().email(),
  password: yup.string().required().min(8),
  dateOfBirth: yup.string(),
  contactNo: yup.string().min(11),
  cnicNo: yup.string().min(13),
  address: yup.string(),
});
function Signup() {
  const classes = useStyle();
  const [profile,setProfile] = React.useState({});
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <>
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
            dateOfBirth: moment().format("YYYY-MM-DD"),
            contactNo: "",
            cnicNo: "",
            address: "",
          }}
          validationSchema={schema}
          onSubmit= {async(values) => {
            const params = {
              data: {
                elsemployees_name: values.name || "-",
                elsemployees_fname: values.fName || "-",
                elsemployees_cnic: values.cnicNo || "-",
                elsemployees_cno: values.contactNo || "-",
                elsemployees_email: values.email || "-",
                elsemployees_password: values.password || "-",
                elsemployees_dofbirth:
                  values.dateOfBirth || null,
                elsemployees_address: values.address || "-",
                elsemployees_image: profile || null,
              },
            };
            params.data = Utils.getFormData(params.data)
            await dispatch(signUp(params));
            history.replace('/');
          }}
        >
          {({ values, errors, handleChange, handleSubmit, setFieldValue }) => (
            <Grid
              container
              justifyContent="space-between"
              spacing={2}
              style={{ padding: 20 }}
            >
              
              <Grid item xs={12}>
                <Typography variant="h5">
                  Sign Up to
                  <span style={{ color: PRIMARYMAIN }}> Cyberxify Chat</span>
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
                <TextField
                  id="date"
                  label="Birthday"
                  type="date"
                  defaultValue={values.dateOfBirth}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
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
                  component="label"
                  style={{ width: "100%", padding: "15px",display:"flex",justifyContent:"center", alignItems:"center"  }}
                >
                  {profile.name ? profile.name : "Upload File"}
                  <input
                    type="file"
                    name="profile"
                    onChange={(event) => {
                      setProfile(event.target.files[0]);
                    }}
                  />
                  <AddAPhotoIcon/>
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
                  style={{ width: "100%", backgroundColor: AUTHCOLOR, color: WHITE}}
                >
                  Sign Up
                </Button>
              </Grid>
            </Grid>
          )}
        </Formik>
      </Grid>
    </Grid>
    <footer className="footer">
    <h5>Powered by Bizz World Communications</h5>
  </footer>
  </>
  );
}

export default Signup;
