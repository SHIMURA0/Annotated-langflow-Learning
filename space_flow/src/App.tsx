import "reactflow/dist/style.css";
import { useState, useEffect, useContext } from "react";
import "./App.css";
import { useLocation } from "react-router-dom";
import ErrorAlert from "./alerts/error";
import NoticeAlert from "./alerts/notice";
import SuccessAlert from "./alerts/success";
import ExtraSidebar from "./components/ExtraSidebarComponent";
import { alertContext } from "./contexts/alertContext";
import { locationContext } from "./contexts/locationContext";
import Sidebar from "./components/SidebarComponent";
import Header from "./components/HeaderComponent";
import TabsManagerComponent from "./pages/FlowPage/components/tabsManagerComponent";
import { darkContext } from "./contexts/darkContext";

export default function App() {
	var _ = require("lodash");

	let { setCurrent, setShowSideBar, setIsStackedOpen } =
		useContext(locationContext);
	let location = useLocation();
	useEffect(() => {
		setCurrent(location.pathname.replace(/\/$/g, "").split("/"));
		setShowSideBar(true);
		setIsStackedOpen(true);
	}, [location.pathname, setCurrent, setIsStackedOpen, setShowSideBar]);

	const {dark} = useContext(darkContext);

	const {
		errorData,
		errorOpen,
		setErrorOpen,
		noticeData,
		noticeOpen,
		setNoticeOpen,
		successData,
		successOpen,
		setSuccessOpen,
	} = useContext(alertContext);

	const [alertsList, setAlertsList] = useState([]);

	useEffect(() => {
		if (errorOpen && errorData) {
			setErrorOpen(false);
			setAlertsList((old) => {
				let newAlertsList = [
					...old,
					{ type: "error", data: _.cloneDeep(errorData), id: _.uniqueId() },
				];
				return newAlertsList;
			});
		} else if (noticeOpen && noticeData) {
			setNoticeOpen(false);
			setAlertsList((old) => {
				let newAlertsList = [
					...old,
					{ type: "notice", data: _.cloneDeep(noticeData), id: _.uniqueId() },
				];
				return newAlertsList;
			});
		} else if (successOpen && successData) {
			setSuccessOpen(false);
			setAlertsList((old) => {
				let newAlertsList = [
					...old,
					{ type: "success", data: _.cloneDeep(successData), id: _.uniqueId() },
				];
				return newAlertsList;
			});
		}
	}, [errorData, errorOpen, noticeData, noticeOpen, successData, successOpen]);

	const removeAlert = (id: number) => {
		setAlertsList((prevAlertsList) =>
			prevAlertsList.filter((alert) => alert.id !== id)
		);
	};

	const user = {
		name: "Whitney Francis",
		email: "whitney.francis@example.com",
		imageUrl:
			"https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
	};

	const userNavigation = [
		{ name: "Your Projects", href: "/" },
		// {
		//   name: "Account settings",
		//   href: "http://localhost:4455/.ory/kratos/public/self-service/settings/browser",
		// },
		{ name: "Sign out", href: "/" },
	];

	return (
		//need parent component with width and height
		<div className="h-full flex flex-col">
			<div className="flex grow-0 shrink basis-auto">
				<Header userNavigation={userNavigation} user={user}></Header>
			</div>
			<div className="flex grow shrink basis-auto min-h-0 flex-1 overflow-hidden">
				<Sidebar />
				<ExtraSidebar />

				{/* Main area */}
				<main className="min-w-0 flex-1 border-t border-gray-200 dark:border-gray-700 flex">
					{/* Primary column */}
					<div className="w-full h-full">
						<TabsManagerComponent></TabsManagerComponent>
					</div>
				</main>
			</div>
			<div className="flex z-50 flex-col-reverse fixed bottom-5 left-5">
				{alertsList.map((alert) => (
					<div key={alert.id}>
						{alert.type === "error" ? (
							<ErrorAlert
								key={alert.id}
								title={alert.data.title}
								list={alert.data.list}
								id={alert.id}
								removeAlert={removeAlert}
							/>
						) : alert.type === "notice" ? (
							<NoticeAlert
								key={alert.id}
								title={alert.data.title}
								link={alert.data.link}
								id={alert.id}
								removeAlert={removeAlert}
							/>
						) : (
							<SuccessAlert
								key={alert.id}
								title={alert.data.title}
								id={alert.id}
								removeAlert={removeAlert}
							/>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
