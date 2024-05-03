import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
const root = createRoot(document.getElementById("root")!);

const Popup = () => {


	return (
		<>
		<h1>Hiiiii!!! :P</h1>
		</>
	);
};


root.render(
	<React.StrictMode>
		<Popup />
	</React.StrictMode>
);
