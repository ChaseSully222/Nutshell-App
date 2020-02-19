import {openTasksForm} from "./tasks/events.js"
import eventListenersEvents from "./events/eventListeners.js"
import messagesListeners from "./messages/messagesEventListeners.js";
import newArticleEventListener from "./articles/articleEvents.js";
import API from "./data.js";

/*
    Import all the tools into main.js that are needed to display
    the initial UI to the user. Either the login form should appear
    or the dashboard should be rendered.
*/

sessionStorage.setItem("id", 1)
const loggedInUserId = parseInt(sessionStorage.getItem("id"))

// adding dynamic tasks form to DOM when 'Tasks' button clicked - Tyler
openTasksForm(loggedInUserId)


eventListenersEvents.printEvents();
// const loggedInUserId = 2;
messagesListeners.logInListener(loggedInUserId);
