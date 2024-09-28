import { Menu } from 'antd';
import React from 'react';
import routes from './route';
import { Link, useLocation } from 'react-router-dom';

const items = [...routes];
function convertMultiToSingle(arr, prevBaseUrl = '') {
    arr.forEach((v, i) => {
        if (v.children?.length) {
            arr[i] = {
                ...arr[i],
                key: prevBaseUrl + v.url,
                icon: <v.icon />,
                label: <Link className="text-d-none text-lg" to={(prevBaseUrl + v.url)}>{v.title}</Link>
            }
            convertMultiToSingle(v.children, prevBaseUrl + v.url);
        } else {
            arr[i] = {
                ...v,
                key: prevBaseUrl + v.url,
                icon: <v.icon />,
                label: <Link className="text-d-none" to={(prevBaseUrl + v.url)} >{v.title}</Link>,
            }
        }
    })
}
convertMultiToSingle(items);

console.log(items)

const customStyles = {
    menu: {
        height: 'calc(100vh - 64px)',
        overflowX: 'hidden',
        overflowY: 'auto',
        backgroundColor: 'white',
        fontWeight: 700,
        color: 'black',
        paddingTop: "30px"
    },
    menuItemGroupTitle: {
        color: 'blue', // Change to the desired color for menu title
    },
};

const App = () => {
    const location = useLocation();

    const paths = [];
    useLocation().pathname.split('/')?.reduce((prev, cur) => {
        return prev + '/' + cur;
    });
    const selectedKey = location.pathname.split('/').pop();
console.log(selectedKey , "keyss")
    return (
        <Menu
            defaultSelectedKeys={[selectedKey]}
            defaultOpenKeys={[...paths]}
            mode="inline"
            // theme="dark"
            items={items}
            style={customStyles.menu}
            className="custom-menu"
        />
    );
};

export default App;
