import Header from "../components/header/Header";
import Head from 'next/head';

const Layout = (props) => {
  return (
    <>
      <div className="flex">
          <Header />
      </div>
    </>
  );
};

export default Layout;
