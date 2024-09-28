import './App.css';
import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SiteLoader from './views/components/SiteLoader';
import { message } from 'antd';
import './notification';
import commonObj from './commonObj';
import service from './services/user';
import { Spin } from 'antd';
import Loader from './views/components/loader';
Spin.setDefaultIndicator(<div><Loader /></div>,);
const LayoutAdmin = React.lazy(() => import('./views/layout/Layout'));
const Login = React.lazy(() => import('./views/pages/Login'));

function App() {
	const [isLoggedin, setIsLoggedin] = useState(false);
	const [ajxRequesting, setAjxRequesting] = useState(false);

	

	useEffect(() => {
		setAjxRequesting(true);
		service.validateToken().then(res => {
			setIsLoggedin(true);
			commonObj.userType = res.data.type;
			commonObj.adminRights = res.data.adminRights || [];
			commonObj.name = res.data.name;
			commonObj.avatar = res.data.avatar;
			message.success(res.message);
		}).catch(err => {
			setIsLoggedin(false);
			window.localStorage.clear();
			message.error('Unauthorized. Login Again!!');
		}).finally(() => {
			setAjxRequesting(false);
		});
	}, []);


	return (
		<>
			<BrowserRouter basename="/">
				{
					!ajxRequesting
						? isLoggedin
							? <Suspense fallback={<SiteLoader />}><LayoutAdmin /></Suspense>
							: <Suspense fallback={<SiteLoader />}><Login /></Suspense>
						: <SiteLoader />
				}
			</BrowserRouter >
		</>
	);
}

export default App;
