import React, { useState, useEffect } from "react";

// MATERIAL UI
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import DeleteIcon from "@material-ui/icons/DeleteSharp";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

// APP STYLE
import "./App.css";

// THEME

const theme = createMuiTheme({
  typography: {
    fontFamily: ["monospace"].join(","),
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: "#e8e8e8",
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

const App = () => {
  const classes = useStyles();
  // DEFINING STATES
  const [todoText, setTodoText] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    getTodo();
  }, []);

  const getTodo = () => {
    if (localStorage.todo !== undefined) {
      setTodoList(
        JSON.parse(localStorage.todo).sort((a, b) =>
          a.active < b.active ? 1 : -1
        )
      );
    }
    return localStorage.todo !== undefined ? JSON.parse(localStorage.todo) : [];
  };

  const onChecked = (i) => (e) => {
    todoList[i].active = !e.target.checked;
    setTodoList(todoList);
    let arrayString = JSON.stringify(todoList);
    localStorage.setItem("todo", arrayString);
    getTodo();
    setChecked(!checked);
  };

  const removeTask = (index) => (e) => {
    todoList.splice(index, 1);
    let arrayString = JSON.stringify(todoList);
    localStorage.setItem("todo", arrayString);
    setChecked(!checked);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (todoText === "") return;
    const newTodo = {
      todo: todoText,
      active: true,
    };
    todoList.push(newTodo);
    let arrayString = JSON.stringify(todoList);
    localStorage.setItem("todo", arrayString);
    setTodoText("");
    setChecked(!checked);
  };

  const Actions = (
    <Grid item xs={12} md={12} style={{ marginTop: "10px" }}>
      <ButtonGroup
        color="primary"
        size="small"
        aria-label="small contained button group"
      >
        <Button
          size="small"
          variant="contained"
          onClick={() => {
            setTodoList(
              getTodo().sort((a, b) => (a.active < b.active ? 1 : -1))
            );
            setChecked(!checked);
          }}
          color="primary"
        >
          Show All
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={() => {
            setTodoList(getTodo().filter((item) => item.active === false));
            setChecked(!checked);
          }}
          color="primary"
          startIcon={<DoneAllIcon />}
        >
          Completed
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={() => {
            setTodoList(getTodo().filter((item) => item.active === true));
            setChecked(!checked);
          }}
          color="secondary"
          startIcon={<ErrorOutlineIcon />}
        >
          Pending
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={() => {
            localStorage.removeItem("todo");
            setTodoList(getTodo().filter((item) => item.active === false));
            setChecked(!checked);
          }}
          color="secondary"
          startIcon={<ClearAllIcon />}
        >
          Clear All
        </Button>
      </ButtonGroup>
    </Grid>
  );

  const Lists = (
    <List style={{ maxHeight: "300px", overflow: "auto" }} dense={false}>
      {todoList.map((item, i) => {
        const labelId = `checkbox-list-label-${item.active}`;
        return (
          <div key={i}>
            <ListItem>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={!item.active}
                  tabIndex={-1}
                  disableRipple
                  onChange={onChecked(i).bind(this)}
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText
                style={!item.active ? { textDecoration: "line-through" } : {}}
                primary={item.todo}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={removeTask(i).bind(this)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </div>
        );
      })}
    </List>
  );

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        {console.log("render")}
        <Container maxWidth="md">
          <div className="wrapper">
            <form
              onSubmit={onSubmit.bind(this)}
              style={{ backgroundColor: "white" }}
              noValidate
              autoComplete="off"
            >
              <FormControl fullWidth>
                <TextField
                  id="filled-basic"
                  label="What to do ?"
                  variant="filled"
                  color="secondary"
                  value={todoText}
                  onChange={(e) => {
                    setTodoText(e.target.value);
                  }}
                />
              </FormControl>
            </form>
            <div>
              {Actions}
              <Grid
                item
                xs={12}
                md={12}
                className={classes.demo}
                style={{ marginTop: "40px" }}
              >
                <div className={classes.demo}>
                  {todoList.length > 0 ? Lists : ""}
                </div>
              </Grid>
            </div>
          </div>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default App;
