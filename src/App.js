import { useEffect, useState } from "react";
import ListHeader from "./components/ListHeader";
import Auth from "./components/Auth";
import ListItem from "./components/ListItem";
import { useCookies } from "react-cookie";

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["AuthToken", "Email"]);
  const authToken = cookies.AuthToken;
  const userEmail = cookies.Email;
  const [tasks, setTasks] = useState(null);

  const getData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/todos/${userEmail}`
      );
      const json = await response.json();

      setTasks(json);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (authToken && userEmail) {
      // Check if both authToken and userEmail are defined
      getData();
    }
  }, [authToken, userEmail]); // Add userEmail as a dependency

  console.log(tasks);

  // Sort by date
  const sortedTasks = tasks?.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <div className="app">
      {!authToken && <Auth />}

      {authToken && (
        <>
          <ListHeader listName={"  TaskBuddy "} getData={getData} />
          <p className="user-email"> Welcome back, {userEmail} </p>
          {sortedTasks?.map((task) => (
            <ListItem key={task.id} task={task} getData={getData} />
          ))}
        </>
      )}
      <p className="copyright"> &copy;2023 | AMP Studios</p>
    </div>
  );
};

export default App;
