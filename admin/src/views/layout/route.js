import { ArrowRightOutlined, CalendarOutlined, DashboardOutlined,  FileDoneOutlined, SettingOutlined, SolutionOutlined, UsergroupAddOutlined, UserOutlined, GiftOutlined, GoldOutlined } from '@ant-design/icons';
import util from '../../utils/util';
import Dashboard from '../pages/Dashboard';



import User from '../pages/userManagement/User';

import { MdDashboard } from "react-icons/md";
import Category from '../pages/category/category';
import ModelAndBrand from '../pages/model&Brand/ModelAndBrand';
import Product from '../pages/product/Product';
import Orders from '../pages/order/Orders';
// import CodeSnippets from '../pages/CodeSnippets/CodeSnippets';



const routes = [
    { title: 'Dashboard', icon: MdDashboard, url: '/', component: Dashboard },
    { title: 'User', icon: UsergroupAddOutlined, url: '/user', component: User, hidden: !util.checkRightAccess('user-list') },






    {
        title: 'Category', icon: CalendarOutlined, url: '/category',  children: [
            { title: 'Category', icon: UsergroupAddOutlined, url: '/category', component: Category },

            { title: 'Brand & Models', icon: SolutionOutlined, url: '/brad_model', component: ModelAndBrand },
            
        ]
    },
    

    {
        title: 'Product', icon: CalendarOutlined, url: '/product', component : Product
    },


    
    {
        title: 'Orders', icon: CalendarOutlined, url: '/order', component : Orders
    },
 
 
    

   

    // {
    //     title: 'Super Admin', icon: CalendarOutlined, url: '/rights', children: [
    //         { title: 'Rights', icon: FileDoneOutlined, url: '/', component: Right, hidden: !util.checkRightAccess('super-admin') },
    //         { title: 'Rights Group', icon: UserOutlined, url: '/rights-group', component: RoleGroup, hidden: !util.checkRightAccess('super-admin') },
    //         { title: 'Roles', icon: UserOutlined, url: '/roles', component: Role, hidden: !util.checkRightAccess('super-admin') },
    //         { title: 'Sub Admin', icon: UsergroupAddOutlined, url: '/sub-admin', component: SubAdmin, hidden: !util.checkRightAccess('super-admin') },
    //     ].filter(v => (!v.hidden) || v.children?.length), hidden: !util.checkRightAccess('super-admin')
    // },

    // { title: 'Coupon', icon: GiftOutlined, url: '/coupon', component: Coupon, hidden: !util.checkRightAccess('user-list') },
    // { title: 'Profile', icon: SolutionOutlined, url: '/profile', component: AdminProfile, hidden: !util.checkRightAccess('view-profile-sub-admin') },
    // { title: 'Menu Customization', icon: GoldOutlined, url: '/menu', component: Menu, hidden: !util.checkRightAccess('view-master') },

    // {
    //     title: 'All About Product', icon: CalendarOutlined, url: '/category', children: [
    //         { title: 'Category & Sub-Category', icon: ArrowRightOutlined, url: '/', component: Category, hidden: !util.checkRightAccess('view-master') },
    //         { title: 'Brands', icon: ArrowRightOutlined, url: '/brand', component: Brand, hidden: !util.checkRightAccess('view-master') },
    //         { title: 'Attributes', icon: ArrowRightOutlined, url: '/attribute', component: Attributes, hidden: !util.checkRightAccess('view-master') },
    //         { title: 'Product', icon: ArrowRightOutlined, url: '/product', component: Product, hidden: !util.checkRightAccess('view-master') },
    //     ],
    //     hidden: !util.checkRightAccess('view-master')
    // },
    // {
    //     title: 'Customization', icon: CalendarOutlined, url: '/customization', children: [
    //         { title: 'Header', icon: ArrowRightOutlined, url: '/', component: Header, hidden: !util.checkRightAccess('view-master') },
    //         { title: 'Homepage', icon: ArrowRightOutlined, url: '/homepage', component: Homepage, hidden: !util.checkRightAccess('view-master') },
    //     ],
    //     hidden: !util.checkRightAccess('view-master')
    // },
            // { title: 'Size', icon: ArrowRightOutlined, url: '/size', component: Size, hidden: !util.checkRightAccess('view-master') },

    // { title: 'Home Banner', icon: SolutionOutlined, url: '/banner', component: BannerMaster, hidden: !util.checkRightAccess('') },
    // { title: 'Offers', icon: SolutionOutlined, url: '/offer', component: Offer, hidden: !util.checkRightAccess('') },
    // { title: 'Orders', icon: SolutionOutlined, url: '/order', component: Order, hidden: !util.checkRightAccess('') },

    // {
    //     title: 'Blog', icon: CalendarOutlined, url: '/blog', children: [
    //         { title: 'Blog', icon: SolutionOutlined, url: '/', component: Blog, hidden: !util.checkRightAccess('blog-list') },
    //         { title: 'Author', icon: SolutionOutlined, url: '/author', component: Author, hidden: !util.checkRightAccess('blog-list') },
    //     ]
    // },
    // { title: 'Profile', icon: UserOutlined, url: '/profile', component: Profile, hidden: !util.checkRightAccess('profile') },

    // {
    //     title: 'Settings', icon: CalendarOutlined, url: '/setting', children: [
    //         // { title: 'Contact Us', icon: SolutionOutlined, url: '/', component: Contactus, hidden: !util.checkRightAccess('') },
    //         // { title: 'Application', icon: SettingOutlined, url: '/application', component: Application },
    //         // { title: 'Delivery Areas', icon: SettingOutlined, url: '/delivery-areas', component: DeliveryArea },
    //     ]
    // },
].filter(v => (!v.hidden) || v.children?.length);

export default routes;





// static async generateNextOrderNumber() {
//     const latestOrder = await Order.findOne({}, {}, { sort: { orderId: -1 } });

//     let startingNumber = 10000;
//     if (latestOrder?._id || !latestOrder?.orderId) {
//         if (latestOrder?.orderId) {
//             const latestCRZNumber = parseInt(latestOrder.orderId);
//             startingNumber = latestCRZNumber + 1;
//         }
//     }
//     return startingNumber;
// }