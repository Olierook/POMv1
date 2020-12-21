import React, {useContext, useRef, useEffect} from "react";

import { Context } from "../globalstate/store";
import Shadow from "../shadow";




const OptionDrawer = ({children}) => {
	const [{menubutton, options}, dispatch] = useContext(Context);
	const ref = useRef(null);
	useEffect(() => {

		function handleClickOutside(event) {
			if (ref.current && !ref.current.contains(event.target) &&
       menubutton.current && !menubutton.current.contains(event.target)) {
				dispatch({type: "EXPAND_OPTIONS", payload: false});
			}
		}

		if (options) {
			document.addEventListener("mouseup", handleClickOutside);
		} else {
			document.removeEventListener("mouseup", handleClickOutside);
		}

	}, [ref, options]);
	// const handleClick = () => {
	// 	state.options && dispatch({type: "EXPAND_OPTIONS", payload: false});
	// };
	return (

		<>
			<div className="drawer" ref={ref}>{children}</div>
			<Shadow zIndex={8} trigger={options}/>
			<style jsx>{`
        .drawer {
          z-index: 10;
          position: fixed;
          width: calc(120px + 30vw);
          left: calc(-140px - 30vw);
          height: 100vh;
          background-color: white;
          box-shadow: 10px 0px 10px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease-in-out;
          transform: translateX(${options ? "calc(140px + 30vw)": "0"});

        }
      `}
			</style>

		</>

	);
};

export default OptionDrawer;
