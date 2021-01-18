import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import React, {useState, useEffect} from "react";

import { useTheme } from "../../../../lib/custom-hooks";
import RangeSlider from "./rangeslider";
import SearchField from "./searchfield";



const FilterBox = ({active, filtertype, filterName, valuetype, title, reference, close}) => {
	const {gray_light, gray_dark} = useTheme();
	const placeholder = () => <></>;
	const [Filter, setFilter] = useState(() => placeholder);
	useEffect(() => {
		switch (filtertype) {
    	case "searchField":
    		setFilter(() => SearchField);
    		break;
    	default:
    		switch (valuetype) {
      		case "number":
				    setFilter(() => RangeSlider);
      			break;
      		default:
      			setFilter(() => SearchField);
    		}
  	}
	}, [filtertype, valuetype]);

	return (
		<div className="filter-box">
			<div className="title">{title}</div>
			<div className="close-button" onClick={close}>
				<FontAwesomeIcon icon={faTimes}/>
			</div>
			{active &&
        <Filter
        	reference={reference}
        	filterName={filterName}
        	close={close}
        />}
			<style jsx>{`
        .filter-box {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          height: ${active ? "auto" : 0};
          min-height: ${active ? "150px" : 0};
          width: ${active ? "200px" : 0};
          line-height: ${active ? "inherit" : 0};
          overflow: ${active ? "auto" : "hidden"};
          transition: min-height 100ms ease-in, width 100ms ease-in;
          background-color: white;
          /* ${gray_light.color}; */
          box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
        }
        .title {
          background-color: ${gray_dark.color};
          color: ${gray_dark.text};
          padding: 2px 0;
        }
        .close-button {
          float: right;
          cursor: pointer;
          color: ${gray_dark.color};
          margin: 5px 7px 0 0;
          line-height: 1;
          font-size: 1.5em;
          transform: scale(1);
          transition: color 100ms, transform 100ms;
        }
        .close-button:hover {
          color: black;
          transform: scale(1.1);
        }
      `}
			</style>
		</div>
	);
};


export default FilterBox;