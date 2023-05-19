export default function App({
    Component,
    pageProps: { session, ...pageProps },
  }) {
    return (
        <div>
            <div>It appears you are offline and this page hasn't been cached.</div>
            <div>Check back again...</div>
        </div>
      
    )
  }