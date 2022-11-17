import '../styles/globals.css';
import 'antd/dist/antd.css';
import ProgressBar from "@badrap/bar-of-progress";
import Router from "next/router";
import { Provider } from "react-redux";
import store from "../components/store";

const progress = new ProgressBar({
  size: 4,
  color: "#F6C49F",
  className: "z-50",
  delay: 100,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp;
