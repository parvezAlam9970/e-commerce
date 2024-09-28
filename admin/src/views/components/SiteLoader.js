
import { Image } from 'antd'
import logom from '../components/Assets/tire.png'
import logo from '../components/Assets/ger-icon.png'

import classes from './siteloader.module.css'
import { TireIcon } from '../components/svgIcons';

export default function SiteLoader() {
    return (<div className={classes.siteloader}>

        <div className={classes.main}>
            <Image className={classes.top} src={logo} width={150} ></Image>
            <div
                style={{
                    zIndex: 1,
                    width: "70px",
                    height: "70px",
                    border: "16px solid transparent",
                    borderRadius: "50%",
                    borderTop: "16px solid white  ",
                    WebkitAnimation: "spin 2s linear infinite",
                    animation: "spin 2s linear infinite",
                    position: "absolute",
                    padding: "-11px",
                    margin: "24px",
                    marginTop: "42px"
                }}
            >
            </div>
            <div
                className='my-img'
                style={{
                    zIndex: 1,
                    width: "70px",
                    height: "70px",
                    border: "16px solid white",
                    borderRadius: "50%",
                    borderTop: "16px solid transparent",
                    position: "absolute",
                    padding: "-11px",
                    margin: "24px",
                    marginTop: "42px"
                }}
            >
            </div>
            <div className={classes.center} >
                <Image src={logom} width={50} className='my-img-two' />
                {/* <TireIcon /> */}
            </div>
        </div>
    </div>)
}