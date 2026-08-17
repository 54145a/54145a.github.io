import { LocationProvider, Router, Route } from "preact-iso";
import { Nav, Footer } from "./shared";
import { IndexPage } from "./IndexPage";
import { EncodePage } from "./Encode";
import { DecodePage } from "./Decode";

export function App() {
	return <LocationProvider>
		<Nav />
		<Router>
			<Route path="/" component={IndexPage} />
			<Route path="/index.html" component={IndexPage} />
			<Route path="/encode.html" component={EncodePage} />
			<Route path="/d.htm" component={DecodePage} />
		</Router>
		<Footer />
	</LocationProvider>;
}
