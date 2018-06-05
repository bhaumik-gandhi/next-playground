import { Component } from 'react';
import Head from 'next/head';

export default class PageHead extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <Head>
        <meta charSet="utf-8" />
        <title>
          Agreement Application
        </title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="Webflow" name="generator" />
        <link
          href="/static/css/react-datepicker.css"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="/static/css/main.css"
          rel="stylesheet"
          type="text/css"
        />
      </Head>
    );
  }
}
